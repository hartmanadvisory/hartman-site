import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import StructuredData from "@/components/StructuredData";
import { SITE_DESCRIPTION, SITE_NAME, SITE_TITLE, SITE_URL } from "@/lib/site";

// Inter — humanist neutral grotesk, body copy. Aliased as --font-inter
// and consumed inside globals.css.
const body = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  fallback: ["system-ui", "-apple-system", "Segoe UI", "sans-serif"],
});

// Geist Sans — Vercel's variable geometric sans, display headings.
// Imported directly via next/font/local (rather than the shared
// `geist` package) so we can set `display: "optional"`: cold-cache
// visitors see the Inter fallback for their first paint and the
// browser swaps to Geist on the next navigation. Prevents the
// mid-paint size jump that caused the hero h1 to render "small" on
// hard-refresh — the swap ships without a FOUT reflow.
const display = localFont({
  src: "../node_modules/geist/dist/fonts/geist-sans/Geist-Variable.woff2",
  weight: "100 900",
  style: "normal",
  variable: "--font-geist-sans",
  display: "optional",
  adjustFontFallback: "Arial",
});

// SITE_URL / SITE_TITLE / SITE_DESCRIPTION now live in @/lib/site so the
// sitemap, robots.txt, and the JSON-LD structured data all agree with the
// page metadata. SITE_URL drives metadataBase — the absolute URLs in og:url,
// og:image, and canonical tags.

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
  // `default` is required alongside `template` — without it the homepage,
  // which sets no title of its own, would resolve to no title at all.
  // `template` applies only to CHILD segments, so pages supply just their
  // own name ("About") and the site name is appended here once.
  title: { default: SITE_TITLE, template: `%s — ${SITE_NAME}` },
  description: SITE_DESCRIPTION,
  openGraph: {
    // Image is served from app/opengraph-image.tsx via file convention.
    // Fields below become <meta property="og:*">.
    //
    // Deliberately NO title/description/url here. Setting them at the root
    // pinned every page's share preview to the homepage's text — pasting
    // /about into LinkedIn showed the homepage title and blurb. Left unset,
    // each route's own resolved title and description are used instead.
    // (og/twitter titles do NOT inherit the template above; they inherit the
    // already-resolved per-route title, which is what we want.)
    siteName: SITE_NAME,
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
  },
  // Lets Search Console verify the site with an HTML tag instead of a DNS
  // record — the domain's DNS isn't accessible to us. Unset env var emits no
  // tag at all (the framework skips falsy values), so this is inert until a
  // token is added in Vercel.
  verification: { google: process.env.GOOGLE_SITE_VERIFICATION },
  // Stop iOS Safari from auto-linking phone numbers, email addresses,
  // and street addresses in decorative body text. Real <a href="tel:…">
  // and <a href="mailto:…">  anchors remain interactive; only the
  // implicit auto-styling of raw text is suppressed. Fixes the
  // "Mordechai Hartman" caption reading as a blue underlined entity.
  formatDetection: { telephone: false, email: false, address: false },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${body.variable} ${display.variable} h-full`}
    >
      <body className="flex min-h-full flex-col" suppressHydrationWarning>
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <ScrollToTop />
        <Nav />
        <main id="main" tabIndex={-1} className="flex-1 focus:outline-none">
          {children}
        </main>
        <Footer />
        {/* Machine-readable identity for search engines. Renders nothing and
            sits outside <main>, so it can't affect the skip-link target or
            reading order. */}
        <StructuredData />
      </body>
    </html>
  );
}
