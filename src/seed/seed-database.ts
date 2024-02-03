import prisma from '../lib/prisma';
import { initialData } from './seed';
import { countries } from './seed-countries';

async function main() {
    // 1. Borrar registros previos
    // await Promise.all([
        await prisma.userAddress.deleteMany();
        await prisma.user.deleteMany();
        await prisma.country.deleteMany();
        await prisma.productImage.deleteMany();
        await prisma.product.deleteMany();
        await prisma.category.deleteMany();
    // ]);

    // Categorias
    const categoriesData = initialData.categories.map((name) => ({ name }));

    await prisma.category.createMany({
        data: categoriesData as any
    });

    const categoriesDB = await prisma.category.findMany();

    const categoriesMap = categoriesDB.reduce((map, category) => {
        map[category.name.toLowerCase()] = category.id;
        return map;
    }, {} as Record<string, string>);

    // Productos
    const { images, type, ...product1 } = initialData.products[0];

    // await prisma.product.create({
    //     data: {
    //         ...product1,
    //         categoryId: categoriesMap['shirts']
    //     }
    // });

    initialData.products.forEach(async (product) => {
        const { type, images, ...rest } = product;

        const dbProduct = await prisma.product.create({
            data: {
                ...rest,
                categoryId: categoriesMap[type]
            }
        })

        // Imagenes
        const imagesData = images.map(image => ({
            url: image,
            productId: dbProduct.id
        }));

        await prisma.productImage.createMany({
            data: imagesData
        });
    });

    await prisma.user.createMany({
        data: initialData.user
    });

    // Countries
    await prisma.country.createMany({
        data: countries
    })
}

(() => {
    main();
})();