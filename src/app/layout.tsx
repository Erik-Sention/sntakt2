import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { AuthProvider } from '@/context/AuthContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Sention + Aktivitus Klientportal',
  description: 'Ett modernt system för hantering av klienter och deras kontakter',
  icons: {
    icon: '/sa-logo.svg',
    shortcut: '/sa-logo.svg',
    apple: '/sa-logo.svg',
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="sv">
      <body className={`${inter.className} bg-gray-50 text-gray-900`}>
        <AuthProvider>
        {children}
        </AuthProvider>
      </body>
    </html>
  )
}
