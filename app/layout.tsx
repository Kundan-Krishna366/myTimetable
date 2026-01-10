import type { Metadata } from "next";
import { Bebas_Neue, Oswald, Anton, Teko } from "next/font/google";
import "./globals.css";

const bebas = Bebas_Neue({
  weight: "400",
  variable: "--font-bebas",
  subsets: ["latin"],
});

// Secondary bold font for emphasis
const oswald = Oswald({
  weight: ["400", "500", "600", "700"],
  variable: "--font-oswald",
  subsets: ["latin"],
});

// Ultra-bold display font
const anton = Anton({
  weight: "400",
  variable: "--font-anton",
  subsets: ["latin"],
});

// Technical details font
const teko = Teko({
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-teko",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "24A12 • Class Schedule",
  description: "semester 4 class schedule for section 24A12",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${bebas.variable} ${oswald.variable} ${anton.variable} ${teko.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
