import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Providers } from "./providers";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const inter = Inter({ 
  subsets: ["latin"],
  display: 'swap',
  variable: '--font-inter',
  weight: ['400', '500', '600', '700', '800']
});

export const metadata: Metadata = {
  title: "BitGuardian - Bitcoin Inheritance Platform",
  description: "Secure your Bitcoin inheritance with BitGuardian",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className={inter.className}>
        <Providers>
          <Navbar />
          <main>
          {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
