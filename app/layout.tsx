import type React from "react"
import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "andre",
  description:
    "Andre Henriques - Aspiring software engineer passionate about AI, machine learning, and building innovative solutions.",
  keywords: [
    "Andre Henriques",
    "Software Engineer",
    "AI",
    "Machine Learning",
    "Computer Science",
    "Texas State University",
    "Portfolio",
  ],
  authors: [{ name: "Andre Henriques" }],
  creator: "Andre Henriques",
  openGraph: {
    title: "andre",
    description: "Andre Henriques - Personal portfolio showcasing software engineering projects.",
    url: "https://andre-h.dev",
    siteName: "Andre Henriques - Personal Website",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "andre",
    description: "Andre Henriques - Personal portfolio showcasing AI and software engineering projects.",
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/icon.png",
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
