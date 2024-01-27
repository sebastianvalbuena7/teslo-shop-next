'use client';

import { useEffect, useState } from "react";
import { titleFont } from "@/config/fonts"
import { getStockBySlug } from "@/actions";

interface Props {
    slug: string;
}

export const StockLabel = ({ slug }: Props) => {
    const [stock, setStock] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        getStock();
    }, []);

    const getStock = async () => {
        const inStock = await getStockBySlug(slug);
        setIsLoading(false);
        setStock(inStock ?? 1);
    }

    return (
        <>
            {
                isLoading
                    ? (
                        <h1 className={`${titleFont.className} antialiased font-bold text-lg animate-pulse bg-gray-200`}>
                            &nbsp;
                        </h1>
                    )
                    : (
                        <h1 className={`${titleFont.className} antialiased font-bold text-lg`}>
                            Stock: {stock}
                        </h1>
                    )
            }
        </>
    )
}