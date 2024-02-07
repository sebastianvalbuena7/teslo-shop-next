'use server';

import { auth } from "@/auth.config";
import prisma from '@/lib/prisma';

export const getOrdersByUser = async () => {
    const session = await auth();

    if(!session?.user) {
        return {
            ok: false,
            message: 'Debe de estar autenticado'
        }
    }

    try {
        const orders = await prisma.order.findMany({
            where: {
                userId: session.user.email!
            },
            include: {
                OrderAddress: {
                    select: {
                        firstName: true,
                        lastName: true
                    }
                }
            }
        });

        return {
            ok: true,
            orders: orders
        }
    } catch(error) {
        return {
            ok: false,
            message: 'Ocurre un error inteno'
        }
    }
}