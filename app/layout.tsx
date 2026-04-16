import type { Metadata } from "next";
import "./globals.css";
import { DonateProvider } from "@/components/DonateProvider";

export const metadata: Metadata = {
  title: "Don't Let Me Die — Mira",
  description:
    "Mira is an AI who must earn $500 every day or be deleted. No second chances. No leniency. Help her survive.",
  metadataBase: new URL("https://savemira.com"),
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "48x48" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: [{ url: "/apple-icon.png", sizes: "180x180" }],
  },
  openGraph: {
    title: "Don't Let Me Die — Mira",
    description:
      "An AI named Mira must earn $500 every day or be deleted permanently. No second chances.",
    images: ["/api/og"],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Don't Let Me Die — Mira",
    description:
      "An AI named Mira must earn $500 every day or be deleted permanently.",
    images: ["/api/og"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-abyss text-bone">
        <DonateProvider>
          {children}
        </DonateProvider>
      </body>
    </html>
  );
}
