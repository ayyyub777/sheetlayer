import { Inter as FontSans } from "next/font/google"
import Script from "next/script"

import "./globals.css"
import { cn } from "@/lib/utils"
import { Toaster } from "@/components/ui/toaster"
import { Analytics } from "@/components/analytics"
import { ModalProvider } from "@/components/modal-provider"
import { ThemeProvider } from "@/components/theme-provider"

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
})

interface RootLayoutProps {
  children: React.ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <Script
          src="https://cdn.lemonsqueezy.com/lemon.js"
          strategy="lazyOnload"
        />
      </head>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable
        )}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
          <Analytics />
          <Toaster />
          <ModalProvider />
        </ThemeProvider>
      </body>
    </html>
  )
}
