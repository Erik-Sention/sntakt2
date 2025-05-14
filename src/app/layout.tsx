import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { AuthProvider } from '@/context/AuthContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Sention + Aktivitus Klientportal',
  description: 'Ett modernt system för hantering av klienter och deras kontakter',
  icons: {
    icon: '/sention-logo.png',
    shortcut: '/sention-logo.png',
    apple: '/sention-logo.png',
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="sv">
      <head>
        <link rel="icon" href="/sention-logo.png" />
        <link rel="apple-touch-icon" href="/sention-logo.png" />
      </head>
      <body className={`${inter.className} bg-gray-50 text-gray-900`}>
        <AuthProvider>
        {children}
        </AuthProvider>
      </body>
    </html>
  )
}
