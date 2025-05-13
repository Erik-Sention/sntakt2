import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { AuthProvider } from '@/context/AuthContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Sntakt - Klienthanteringssystem',
  description: 'Ett modernt system för hantering av klienter och deras kontakter',
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
