import "@/app/globals.css"

import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Sidebar } from "@/components/sidebar"

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
        <div className="flex min-h-screen">
          <div className="w-64 border-r">
            <Sidebar />
          </div>
          <div className="flex-1 p-6">
            {children}
          </div>
        </div>
      </body>
    </html>
  )
}
