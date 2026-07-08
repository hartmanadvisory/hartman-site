import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

// Inter — a modern neutral grotesk (Söhne / SF Pro / Neue Haas Grotesk class),
// the industry-standard free stand-in for the display sans used by Blackstone
// and Apple. Variable-weight, self-hosted by next/font. Exposed as
// --font-display and consumed via CSS var chain.
const display = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  fallback: ["system-ui", "-apple-system", "Segoe UI", "sans-serif"],
});

export const metadata: Metadata = {
  title: "Precision Counsel for Venture's Defining Deals — Hartman Venture Advisors",
  description:
    "A boutique New York practice for late-stage venture transactions — financings, fund formation, secondaries, and exits.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${display.variable} h-full`}
    >
      <body className="flex min-h-full flex-col">
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <Nav />
        <main id="main" tabIndex={-1} className="flex-1 focus:outline-none">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
