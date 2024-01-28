import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CartProduct } from '../../interfaces/product.interface';

interface State {
    cart: CartProduct[];
    addProductToCart: (product: CartProduct) => void;
    getTotalItems: () => number;
    getSummaryInformation: () => {
        subTotal: number;
        tax: number;
        total: number;
        itemsInCart: number;
    };
    updateProductQuantity: (product: CartProduct, quantity: number) => void;
    removeProduct: (product: CartProduct) => void;
}

export const useCartStore = create<State>()(
    persist(
        (set, get) => ({
            cart: [],
            addProductToCart: (product: CartProduct) => {
                const { cart } = get();

                // Revisar si el producto existe con la talla seleccionada.
                const productInCart = cart.some((item) => item.id === product.id && item.size === product.size);

                if (!productInCart) {
                    set({
                        cart: [...cart, product]
                    });
                    return;
                }

                // El producto ya existe por la talla, tengo que incrementar
                const updatedCartProducts = cart.map((item) => {
                    if (item.id === product.id && item.size === product.size) {
                        return { ...item, quantity: item.quantity + product.quantity }
                    }

                    return item;
                });

                set({ cart: updatedCartProducts });
            },
            getTotalItems: () => {
                const { cart } = get();

                return cart.reduce((total, item) => total + item.quantity, 0);
            },
            getSummaryInformation() {
                const { cart } = get();

                const subTotal = cart.reduce((subTotal, product) => (product.quantity * product.price) + subTotal, 0);

                const tax = subTotal * 0.15;

                const total = subTotal + tax;

                const itemsInCart = cart.reduce((total, item) => total + item.quantity, 0);

                return {
                    subTotal,
                    tax,
                    total,
                    itemsInCart
                }
            },
            updateProductQuantity: (product: CartProduct, quantity: number) => {
                const { cart } = get();

                const updatedCartProducts = cart.map((item) => {
                    if (item.id === product.id && item.size === product.size) {
                        return { ...item, quantity }
                    } 0

                    return item;
                });

                set({ cart: updatedCartProducts });
            },
            removeProduct(product) {
                const { cart } = get();

                const removeProductsInCart = cart.filter((item) => {
                    if (item.id !== product.id || item.size !== product.size) {
                        return item;
                    }
                });

                set({ cart: removeProductsInCart });
            },
        }),
        {
            name: 'shopping-cart'
        }
    )
)