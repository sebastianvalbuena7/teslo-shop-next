'use server';

import prisma from '@/lib/prisma';
import type { Address, Size } from '@/interfaces';
import { auth } from '@/auth.config';

interface ProductToOrder {
    productId: string;
    quantity: number;
    size: Size;
}

export const placeOrder = async (productIds: ProductToOrder[], address: Address) => {
    try {
        const session = await auth();

        const userId = session?.user?.email;

        if (!userId) {
            return {
                ok: false,
                message: 'No hay sesion de usuario'
            }
        }

        const products = await prisma.product.findMany({
            where: {
                id: {
                    in: productIds.map(p => p.productId)
                }
            }
        });

        const itemsInOrder = productIds.reduce((count, p) => count + p.quantity, 0);

        const { subTotal, tax, total } = productIds.reduce((totals, item) => {
            const productQuantity = item.quantity;
            const product = products.find(p => p.id === item.productId);

            if (!product) throw new Error('Item no existe');

            const subTotal = product.price * productQuantity;

            totals.subTotal += subTotal;
            totals.tax += subTotal * 0.15;
            totals.total += subTotal * 1.15;

            return totals;
        }, { subTotal: 0, tax: 0, total: 0 });

        const prismaTx = await prisma.$transaction(async (tx) => {
            // 1. Actualizar el stock de los productos.
            const updatedProductsPromises = products.map((product) => {
                const productQuantity = productIds.filter(
                    p => p.productId === product.id
                ).reduce((acc, item) => item.quantity + acc, 0);

                if (productQuantity === 0) {
                    throw new Error('No tiene cantidad');
                }

                return tx.product.update({
                    where: {
                        id: product.id
                    },
                    data: {
                        inStock: {
                            decrement: productQuantity
                        }
                    }
                });
            });

            const updatedProducts = await Promise.all(updatedProductsPromises);

            updatedProducts.forEach(product => {
                if (product.inStock < 0) {
                    throw new Error('El producto tiene un valor de stcok negativo');
                }
            })

            // 2. Crear la orden, encabezado, detalle.
            const order = await tx.order.create({
                data: {
                    userId: userId,
                    itemsInOrder: itemsInOrder,
                    subTotal: subTotal,
                    tax: tax,
                    total: total,
                    OrderItem: {
                        createMany: {
                            data: productIds.map(p => ({
                                quantity: p.quantity,
                                size: p.size,
                                productId: p.productId,
                                price: products.find(product => product.id === p.productId)?.price ?? 0
                            }))
                        }
                    }
                }
            });

            // 3. Crear la direccion de la orden,
            const { country, ...restAddress } = address;

            const orderAddress = await tx.orderAddress.create({
                data: {
                    address: restAddress.address,
                    city: restAddress.city,
                    firstName: restAddress.firstName,
                    lastName: restAddress.lastName,
                    postalCode: restAddress.postalCode,
                    phone: restAddress.phone,
                    country: '',
                    countryId: country,
                    orderId: order.id
                }
            });

            return {
                order: order,
                updatedProducts,
                orderAddress
            }
        });

        return {
            ok: true,
            order: prismaTx.order
        }

    } catch (error: any) {
        return {
            ok: false,
            message: error?.message
        }
    }
}