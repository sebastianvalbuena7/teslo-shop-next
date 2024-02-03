'use server';

import { Address } from "@/interfaces";

export const setUserAddress = async (address: Address, userId: string) => {
    try {
        const newAddress = await createOrReplaceAddress(address, userId);

        return {
            ok: true,
            address: newAddress
        }
    } catch (error) {
        return {
            ok: false,
            message: 'No se pudo guardar la direccion'
        }
    }
}

const createOrReplaceAddress = async (address: Address, userId: string) => {
    try {
        const storeAddress = await prisma?.userAddress.findUnique({
            where: { userId }
        });

        const addressToSave = {
            userId,
            address: address.address,
            address2: address.address2,
            countryId: address.country,
            firstName: address.firstName,
            lastName: address.lastName,
            phone: address.phone,
            postalCode: address.postalCode
        };

        if (!storeAddress) {
            const newAddress = await prisma?.userAddress.create({
                data: addressToSave
            });

            return newAddress;
        }

        const updatedAddress = await prisma?.userAddress.update({
            where: { userId },
            data: addressToSave
        })

        return updatedAddress;

    } catch (error) {
        throw new Error('No se puede guardar la direccion')
    }
}