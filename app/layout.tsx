import type { Metadata } from "next";
import localFont from "next/font/local";
import Script from "next/script";
import "./globals.css";

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;


const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://spcmdc.com';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'StatSPC — Free SPC Chart Builder',
    template: '%s | StatSPC',
  },
  description:
    'Free statistical process control chart builder following Making Data Count methodology. Build XmR, run, P, C and U charts online — no login required.',
  openGraph: {
    siteName: 'StatSPC',
    type: 'website',
    locale: 'en_GB',
  },
  twitter: {
    card: 'summary',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950 min-h-screen`}
      >
        {children}
        {GA_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_ID}');
              `}
            </Script>
          </>
        )}
      </body>
    </html>
  );
}
