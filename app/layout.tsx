import { ThemeProvider } from "@/components/theme/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { cn } from "@/lib/utils"
import type { Metadata, Viewport } from "next"
import { zpix } from "./fonts"
import "./globals.css"
import { Providers } from "./providers"
import { FloatMenu } from "@/components/float-menu"

export const metadata: Metadata = {
  title: "CrackOne - Free email Service",
  description: "A secure, fast, and disposable temporary email address to protect your privacy and keep spam away. Supports instant inbox and automatic expiration",
  keywords: [
   "Temporary Email",
  "One-Time Email",
  "Anonymous Email",
  "Privacy Protection",
  "Spam Filtering",
  "Instant Inbox",
  "Auto Expiry",
  "Secure Email",
  "Signup Verification",
  "Temporary Account",
  "Cute Email",
  "Email Service",
  "Privacy and Security",
  "Disposable Email",
  "CrackOne"
  ].join(", "),
  authors: [{ name: "SoftMoe Studio" }],
  creator: "SoftMoe Studio",
  publisher: "SoftMoe Studio",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://mail.crackone.org",
    title: "CrackOne - Free email Service",
    description: "A secure, fast, and disposable temporary email address to protect your privacy and keep spam away. Supports instant inbox and automatic expiration",
    siteName: "CrackOne",
  },
  twitter: {
    card: "summary_large_image",
    title: "CrackOne - Free email Service",
    description: "A secure, fast, and disposable temporary email address to protect your privacy and keep spam away. Supports instant inbox and automatic expiration",
  },
  manifest: '/manifest.json',
  icons: [
    { rel: 'apple-touch-icon', url: '/icons/icon-192x192.png' },
  ],
}

export const viewport: Viewport = {
  themeColor: '#826DD9',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="application-name" content="CrackOne" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="CrackOne" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body 
        className={cn(
          zpix.variable,
          "font-zpix min-h-screen antialiased",
          "bg-background text-foreground",
          "transition-colors duration-300"
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange={false}
          storageKey="temp-mail-theme"
        >
          <Providers>
            {children}
          </Providers>
          <Toaster />
          <FloatMenu />
        </ThemeProvider>
      </body>
    </html>
  )
}
