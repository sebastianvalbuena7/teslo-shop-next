'use server';

export const getCountries = async () => {
    try {
        const countries = await prisma?.country.findMany({
            orderBy: {
                name: 'asc'
            }
        })

        return countries;
    } catch(error) {
        throw new Error('Ha ocurrido un error');
    }
}