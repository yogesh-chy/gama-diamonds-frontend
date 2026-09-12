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
  metadataBase: new URL("https://www.gamajewels.com"),
  title: {
    default: "Gama Jewels | Bespoke Diamond Engagement Rings & Fine Jewellery",
    template: "%s | Gama Jewels",
  },
  description:
    "Discover exquisite bespoke diamond engagement rings, wedding bands, eternity rings, earrings, necklaces & bracelets. GIA certified diamonds, handcrafted by master goldsmiths in Mumbai. Shop at gamajewels.com.",
  keywords: [
    "diamond engagement rings",
    "bespoke engagement rings",
    "fine jewellery",
    "GIA certified diamonds",
    "lab grown diamond rings",
    "wedding rings",
    "eternity rings",
    "diamond earrings",
    "diamond necklace",
    "diamond bracelet",
    "handcrafted jewellery",
    "Mumbai jeweller",
    "Gama Jewels",
    "custom engagement ring",
    "solitaire ring",
    "halo engagement ring",
    "platinum engagement ring",
    "18ct gold ring",
  ],
  authors: [{ name: "Gama Jewels", url: "https://www.gamajewels.com" }],
  creator: "Gama Jewels",
  publisher: "Gama Jewels",
  alternates: {
    canonical: "https://www.gamajewels.com",
  },
  openGraph: {
    type: "website",
    locale: "en_GB",
    url: "https://www.gamajewels.com",
    siteName: "Gama Jewels",
    title: "Gama Jewels | Bespoke Diamond Engagement Rings & Fine Jewellery",
    description:
      "Discover exquisite bespoke diamond engagement rings, wedding bands, earrings, necklaces & bracelets. GIA certified diamonds, handcrafted by master goldsmiths. Shop at gamajewels.com.",
    images: [
      {
        url: "/heritage.png",
        width: 1200,
        height: 630,
        alt: "Gama Jewels – Bespoke Diamond Fine Jewellery",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@GamaDiamond",
    creator: "@GamaDiamond",
    title: "Gama Jewels | Bespoke Diamond Engagement Rings & Fine Jewellery",
    description:
      "Discover exquisite bespoke diamond engagement rings, wedding bands, earrings & necklaces. GIA certified, handcrafted by master goldsmiths.",
    images: ["/heritage.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  // Uncomment and replace with your actual Google Search Console verification code:
  // verification: {
  //   google: "YOUR_GOOGLE_SEARCH_CONSOLE_VERIFICATION_CODE",
  // },
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
