import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { GeistSans } from "geist/font/sans";
import "./globals.css";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

// Geist Sans — Vercel's variable geometric sans. Purpose-built for
// technical UI, still refined enough for a boutique NY firm. Drives
// the display chain (--font-display) via --font-geist-sans (the
// variable name geist/font/sans hard-codes).
// Inter stays as the humanist body-copy fallback, aliased as
// --font-inter and consumed inside globals.css.
const body = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  fallback: ["system-ui", "-apple-system", "Segoe UI", "sans-serif"],
});

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://hartman-site.vercel.app";
const SITE_TITLE =
  "Precision legal Counsel for Venture Capital's Defining Deals — Hartman Venture Advisors";
const SITE_DESCRIPTION =
  "A boutique New York practice for late-stage venture transactions.";

export const viewport: Viewport = {
  // width=device-width, initial-scale=1 is the Next 16 default; adding
  // viewportFit: 'cover' opts iPhone-with-notch pages into the safe-area
  // model so env(safe-area-inset-*) resolves properly on standalone /
  // Home-Screen-installed instances.
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  // Mobile audit MEDIUM: iOS Safari address bar tint follows this;
  // navy-deep matches the site's darkest brand surface.
  themeColor: "#0f1626",
  // Mobile audit MEDIUM: prevents iOS from tinting form <select> and
  // date-picker chrome under system dark mode. Site is light-only.
  colorScheme: "light",
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  openGraph: {
    // Image is served from app/opengraph-image.tsx via file convention.
    // Fields below become <meta property="og:*">.
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    siteName: "Hartman Venture Advisors",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${body.variable} ${GeistSans.variable} h-full`}
    >
      <body className="flex min-h-full flex-col" suppressHydrationWarning>
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
