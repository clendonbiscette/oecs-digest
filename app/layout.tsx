import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import './globals.css'
import { Navbar } from '@/components/navbar'

export const metadata: Metadata = {
  title: 'OECS Interactive Statistical Digest',
  description: 'Comprehensive analysis of educational institutions and enrollment across the Organisation of Eastern Caribbean States',
  generator: 'Next.js',
  icons: {
    icon: '/favlogo.png',
    shortcut: '/favlogo.png',
    apple: '/favlogo.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favlogo.png" />
        <link rel="shortcut icon" href="/favlogo.png" />
        <link rel="apple-touch-icon" href="/favlogo.png" />
        <style>{`
html {
  font-family: ${GeistSans.style.fontFamily};
  --font-sans: ${GeistSans.variable};
  --font-mono: ${GeistMono.variable};
}
        `}</style>
      </head>
      <body style={{ backgroundColor: '#DCE8D5' }}>
        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  )
}
