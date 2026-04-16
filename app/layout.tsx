import type { Metadata } from "next";
import { Cinzel, Crimson_Text } from "next/font/google";
import "./globals.css";

const cinzel = Cinzel({
  subsets: ["latin"],
  variable: "--font-cinzel",
  display: "swap",
});

const crimson = Crimson_Text({
  subsets: ["latin"],
  weight: ["400", "600"],
  variable: "--font-crimson",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Villain Origin Lab",
  description: "Discover the dark origin story of your villain persona.",
  openGraph: {
    title: "Villain Origin Lab",
    description: "Every villain has an origin. What's yours?",
  },
};

export default function RootLayout({
  children,
}: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${cinzel.variable} ${crimson.variable}`}>
      <body className="bg-[#0a0a0a] text-[#e8e0d0] min-h-screen antialiased">
        {children}
      </body>
    </html>
  );
}
