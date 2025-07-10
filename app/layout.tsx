import { ThemeProvider } from "@/components/theme/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { cn } from "@/lib/utils"
import type { Metadata, Viewport } from "next"
import { zpix } from "./fonts"
import "./globals.css"
import { Providers } from "./providers"
import { FloatMenu } from "@/components/float-menu"

export const metadata: Metadata = {
  title: "CrackOne. - Free Email",
  description: "Secure, fast, and disposable temporary email. Protect your privacy, block spam, and receive emails instantly—automatically expires when done",
  keywords: [
    "临时邮箱",
    "一次性邮箱",
    "匿名邮箱",
    "隐私保护",
    "垃圾邮件过滤",
    "即时收件",
    "自动过期",
    "安全邮箱",
    "注册验证",
    "临时账号",
    "萌系邮箱",
    "电子邮件",
    "隐私安全",
    "邮件服务",
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
    locale: "zh_CN",
    url: "https://mail.crackone.org/",
    title: "CrackOne - Free Email",
    description: "Secure, fast, and disposable temporary email address to protect your privacy and keep spam away. Supports instant receiving and automatically expires after use",
    siteName: "CrackOne",
  },
  twitter: {
    card: "summary_large_image",
    title: "CrackOne Free Email",
    description: "Secure, fast, and disposable temporary email address to protect your privacy and keep spam away. Supports instant receiving and automatically expires after use",
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
    <html lang="zh" suppressHydrationWarning>
      <head>
        <meta name="application-name" content="CrackOne" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="crackOne" />
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