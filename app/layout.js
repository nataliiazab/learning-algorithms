import { Baloo_2, Nunito } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const baloo = Baloo_2({
  subsets: ["latin"],
  variable: "--font-heading",
  weight: ["600", "700", "800"],
});
const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "600", "700"],
});

export const metadata = {
  title: "AlgoGarden - Learn Algorithms the Friendly Way",
  description:
    "An interactive, beginner-friendly place to learn algorithms through plain language, animation, and hands-on exercises.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${baloo.variable} ${nunito.variable}`}>
      <body className="min-h-screen bg-cream-50 font-body text-ink-900 antialiased">
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
