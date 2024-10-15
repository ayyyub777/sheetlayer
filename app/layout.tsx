import { Inter as FontSans } from "next/font/google"

import "./globals.css"
import { cn } from "@/lib/utils"
import { Toaster } from "@/components/ui/toaster"
import { Analytics } from "@/components/analytics"
import { ThemeProvider } from "@/components/theme-provider"
import { ModalProvider } from "@/components/modal-provider"

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
      <head />
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
