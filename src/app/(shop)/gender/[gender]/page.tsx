export const revalidate = 60;

import { notFound, redirect } from "next/navigation";
import { Gender } from "@prisma/client";
import { getPaginatedProductsWithImages } from "@/actions";
import { Pagination, ProductGrid, Title } from "@/components";
import { Category } from "@/interfaces";

interface Props {
    // url/params
    params: {
        gender: string;
    },
    /// url/url?searchParams
    searchParams: {
        page?: string;
    }
}

export default async function CategoryPage({ params, searchParams }: Props) {
    const { gender } = params;
    const { page } = searchParams;

    const pageCurrent = page ? parseInt(page) : 1;

    const { products, currentPage, totalPages } = await getPaginatedProductsWithImages({
        page: pageCurrent,
        gender: gender as Gender
    });

    if (products.length === 0) {
        redirect(`/gender/${gender}`);
    }

    const labels: Record<Category, string> = {
        'men': 'para hombres',
        'women': 'para mujeres',
        'kid': 'para niños',
        'unisex': 'para todos'
    }

    if (gender !== 'kid' && gender !== 'men' && gender !== 'women') {
        notFound();
    }

    return (
        <>
            <Title title={`Articulos ${labels[gender]}`} subTitle="Todos los productos" className="mb-2" />
            <ProductGrid products={products} />
            <Pagination totalPages={totalPages} />
        </>
    );
}