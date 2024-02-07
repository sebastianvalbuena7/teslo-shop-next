import { auth } from "@/auth.config";
import { getCountries, getUserAddress } from "@/actions";
import { Title } from "@/components";
import { AddressForm } from "./ui/AddressForm";

export default async function AddressPage() {
    const countries = await getCountries();

    const session = await auth();

    if (!session?.user)
        return (
            <h3 className="text-5xl">500 - No hay sesion de usuario</h3>
        )

    const userAddress = await getUserAddress(session.user.email!) ?? undefined;

    return (
        <div className="flex flex-col sm:justify-center sm:items-center mb-72 px-10 sm:px-0">

            <div className="w-full xl:w-[1000px] flex flex-col justify-center text-left">
                <Title title="Dirección" subTitle="Dirección de entrega" />
                <AddressForm countries={countries} userStoreAddress={userAddress}/>
            </div>
        </div>
    )
}