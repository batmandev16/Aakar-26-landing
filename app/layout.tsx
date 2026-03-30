import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://aakar.live"),

  title: {
    default: "AAKAR 2026 | AJIET Techno-Cultural Fest",
    template: "%s | AAKAR 2026",
  },

  description:
    "Aakar 2026 is the official techno-cultural fest of A J Institute of Engineering & Technology, Mangaluru. Enter the Aakar Universe and experience innovation, creativity, and culture.",

  keywords: [
    "Aakar 2026",
    "AJIET fest",
    "Mangalore college fest",
    "Tech fest Karnataka",
    "Cultural fest AJIET",
    "Anime themed fest",
    "Aakar AJ Institute",
  ],

  authors: [{ name: "AJIET" }],
  creator: "AJIET",
  publisher: "AJIET",

  openGraph: {
    title: "AAKAR 2026 | Enter the Aakar Universe",
    description:
      "The official techno-cultural fest of AJIET. A new era begins. Experience Aakar 2026.",
    url: "https://aakar.live",
    siteName: "AAKAR 2026",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "AAKAR 2026",
      },
    ],
    locale: "en_IN",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "AAKAR 2026",
    description: "Enter the Aakar Universe. A new era begins.",
    images: ["/og-image.png"],
  },

  icons: {
    icon: "/favicon.ico",
  },

  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
