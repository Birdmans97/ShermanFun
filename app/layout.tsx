import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'ShermanFun',
  description: 'A Next.js website built with TypeScript',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}

