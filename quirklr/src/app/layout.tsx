import type { Metadata } from "next";
import { Poppins, Montserrat } from "next/font/google";
import "./globals.css";
import Header from "@/components/header";
import { Providers } from "@/components/providers";
import Footer from "@/components/footer";
import BackgroundOrbs from "@/components/layout/background-orbs";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  // 1. Basic Metadata
  title: "Quirklr | ISO 20022 Payment Verification on Flare",
  description:
    "Quirklr is a financial verification layer on the Flare Network. We solve the 'Context Gap' by wrapping blockchain transfers in ISO 20022 compliant metadata for professional financial reporting.",
  keywords: [
    "Flare Network",
    "ISO 20022",
    "Web3 Payments",
    "Blockchain Auditing",
    "Quirklr",
    "Coston2",
  ],
  authors: [{ name: "Joseph Agbonifo" }],
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon.ico" },
    ],
    apple: [{ url: "/apple-touch-icon.png" }],
    other: [
      { rel: "android-chrome-192x192", url: "/android-chrome-192x192.png" },
      { rel: "android-chrome-512x512", url: "/android-chrome-512x512.png" },
    ],
  },
  manifest: "/site.webmanifest",
  openGraph: {
    title: "Quirklr - Financial Metadata Infrastructure",
    description:
      "Bridging the gap between Web3 liquidity and institutional TradFi reporting.",
    url: "https://quirklronchain.vercel.app",
    siteName: "Quirklr",
    images: [
      {
        url: "/hero-illustration.png", // Using your existing asset for previews
        width: 1200,
        height: 630,
        alt: "Quirklr Payment Verification Illustration",
      },
    ],
    locale: "en_US",
    type: "website",
  },

  // 4. Twitter (X) Card
  twitter: {
    card: "summary_large_image",
    title: "Quirklr | Standardizing Web3 Value",
    description: "Verified ISO 20022 compliant payments on the Flare Network.",
    images: ["/hero-illustration.png"],
  },
  themeColor: "#ff4d00",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {" "}
      <body
        className={`${poppins.variable} ${montserrat.variable} overflow-x-hidden antialiased`}
      >
        <Providers>
          <Header />
          <BackgroundOrbs />
          {children}
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
