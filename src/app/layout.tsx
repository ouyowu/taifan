import type { Metadata } from "next";
import { Lora, Noto_Sans_SC, Plus_Jakarta_Sans } from "next/font/google";
import { Toaster } from "sonner";

import { siteConfig } from "@/lib/constants";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
  variable: "--font-sans",
});

const lora = Lora({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-serif",
});

const notoSansSc = Noto_Sans_SC({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700", "900"],
  display: "swap",
  variable: "--font-cn",
});

export const metadata: Metadata = {
  ...(siteConfig.hasPublicSiteUrl
    ? {
        metadataBase: new URL(siteConfig.siteUrl),
      }
    : {}),
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.shortName}`,
  },
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  applicationName: siteConfig.siteName,
  openGraph: {
    type: "website",
    locale: "zh_CN",
    siteName: siteConfig.siteName,
    title: siteConfig.name,
    description: siteConfig.description,
    ...(siteConfig.hasPublicSiteUrl ? { url: siteConfig.siteUrl } : {}),
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className={`h-full antialiased ${plusJakartaSans.variable} ${lora.variable} ${notoSansSc.variable}`}>
      <body className="min-h-full flex flex-col">
        {children}
        <Toaster richColors />
      </body>
    </html>
  );
}
