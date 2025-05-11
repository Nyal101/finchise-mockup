import "@/app/globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import React from "react"
import { ClientLayout } from "./ClientLayout"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "FranchiseAI",
  description: "A modern, professional FranchiseAI web app for franchise owners",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  )
}