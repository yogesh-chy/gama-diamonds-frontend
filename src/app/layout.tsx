import type { Metadata } from "next";
import { Playfair_Display, Poppins } from "next/font/google";
import { Toaster } from "sonner";
import { CurrencyProvider } from "@/context/CurrencyContext";
import { AuthProvider } from "@/context/AuthContext";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

const poppins = Poppins({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "Gama Diamond | Fine Jewellery – gamadiamond.net",
  description:
    "Discover exquisite engagement rings, wedding bands, earrings, necklaces & bracelets. Handcrafted fine jewellery — shop at gamadiamond.net.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${poppins.variable}`}>
      <body className="bg-black text-white min-h-screen flex flex-col font-sans antialiased">
        <AuthProvider>
          <CurrencyProvider>
            {children}
          </CurrencyProvider>
        </AuthProvider>
        <Toaster
          position="top-right"
          richColors
          toastOptions={{
            style: {
              background: "#141414",
              border: "1px solid rgba(198,164,95,0.3)",
              color: "#ffffff",
            },
          }}
        />
      </body>
    </html>
  );
}
