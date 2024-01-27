'use server';

import prisma from '@/lib/prisma';
import { sleep } from '@/utils';

export const getStockBySlug = async (slug: string) => {
    try {
        // await sleep();
        const product = await prisma.product.findFirst({
            where: {
                slug
            }
        })

        if(!product) return null;

        return product.inStock;
    } catch (error) {
        console.log(error);
        throw new Error('Hubo un error al traer el stock por slug.')
    }
}