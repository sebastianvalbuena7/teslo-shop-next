import type { Metadata } from "next";
import { inter } from "@/config/fonts";
import "./globals.css";
import { Providers } from "@/components";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";

export const metadata: Metadata = {
  title: "Teslo | Shop",
  description: "A Shop Virtual of Products",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <PayPalScriptProvider
          options={{
            clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID ?? '',
            intent: 'capture',
            currency: 'USD'
          }}
        >
          <Providers>
            {children}
          </Providers>
        </PayPalScriptProvider>
      </body>
    </html>
  );
}