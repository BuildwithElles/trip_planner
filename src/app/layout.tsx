import type { Metadata } from "next";
import { Inter } from 'next/font/google'
import "./globals.css";
import { AuthProvider } from '@/contexts/AuthContext'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: "Trip Planner - Plan Amazing Adventures Together",
  description: "Collaborate with friends and family to plan unforgettable trips. Manage itineraries, budgets, packing lists, and more in one beautiful app.",
  keywords: "trip planning, travel, itinerary, budget, packing list, group travel",
  authors: [{ name: "Trip Planner Team" }],
  creator: "Trip Planner",
  publisher: "Trip Planner",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    title: 'Trip Planner - Plan Amazing Adventures Together',
    description: 'Collaborate with friends and family to plan unforgettable trips. Manage itineraries, budgets, packing lists, and more.',
    siteName: 'Trip Planner',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Trip Planner - Plan Amazing Adventures Together',
    description: 'Collaborate with friends and family to plan unforgettable trips.',
    creator: '@tripplanner',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#14b8a6' },
    { media: '(prefers-color-scheme: dark)', color: '#0d9488' },
  ],
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} scroll-smooth`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className={`${inter.className} antialiased bg-gradient-soft text-soft-gray-900 selection:bg-turquoise-200 selection:text-turquoise-900`}>
        <AuthProvider>
          <div className="min-h-screen flex flex-col">
            <main className="flex-1">
              {children}
            </main>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
