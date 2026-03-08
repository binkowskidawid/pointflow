import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const viewport: Viewport = {
  themeColor: '#0f172a', // Slate 950
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

export const metadata: Metadata = {
  metadataBase: new URL('https://pointflow.io'),
  title: {
    default: 'PointFlow | Advanced Loyalty Platform',
    template: '%s | PointFlow',
  },
  description: 'Enterprise-grade, open-source loyalty platform.',
  keywords: ['loyalty platform', 'open-source', 'customer retention', 'rewards system'],
  authors: [{ name: 'PointFlow Team' }],
  creator: 'Dawid Bińkowski',
  publisher: 'PointFlow',
  openGraph: {
    type: 'website',
    url: 'https://pointflow.io',
    title: 'PointFlow | Advanced Loyalty Platform',
    description: 'The open-source loyalty platform you can self-host in 5 minutes.',
    siteName: 'PointFlow',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PointFlow | Advanced Loyalty Platform',
    description: 'The open-source loyalty platform you can self-host in 5 minutes.',
  },
  icons: {
    icon: '/icon.png',
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased selection:bg-blue-100 selection:text-blue-900`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
