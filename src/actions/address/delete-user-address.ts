'use server';

export const deleteUserAddress = async (userId: string) => {
    try {
        const userAddressFind = await prisma?.userAddress.findUnique({
            where: {
                userId
            }
        });
    
        if (!userAddressFind) return;
    
        await prisma?.userAddress.delete({
            where: {
                userId
            }
        });

        return {
            ok: true
        }
    } catch(error) {
        return {
            ok: false,
            message: 'No se puede eliminar'
        }
    }
}