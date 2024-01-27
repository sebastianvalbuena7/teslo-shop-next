'use server';

import prisma from '@/lib/prisma';

export const getProductBySlug = async (slug: string) => {
    try {
        const product = await prisma?.product.findFirst({
            include: {
                ProductImage: {
                    select: {
                        url: true
                    }
                }
            },
            where: {
                slug
            }
        });

        if (!product) return null;

        // Excluir las imagenes
        // const { ProductImage, ...rest } = product;

        return {
            ...product,
            images: product.ProductImage.map(image => image.url)
        };
    } catch (error) {
        console.log(error);
        throw new Error('Error el obtener producto por slug');
    }
}