
import { Header } from "@/components/layout/header"
import { auth } from "@/lib/auth"
import { Shield, Mail, Clock } from "lucide-react"
import { ActionButton } from "@/components/home/action-button"
import { FeatureCard } from "@/components/home/feature-card"

export const runtime = "edge"

export default async function Home() {
  const session = await auth()

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Navigation */}
      <nav className="bg-blue-700 text-white p-4">
        <div className="container mx-auto flex justify-between items-center max-w-[1600px]">
          <h1 className="text-2xl font-bold">CrackOne</h1>
          <div className="space-x-4">
            <a href="/" className="hover:underline">Home</a>
            <a href="/send" className="hover:underline">Send Email</a>
            <a href="/login" className="hover:underline">Login</a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-16 text-center">
        <div className="container mx-auto max-w-[1600px] px-4 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold tracking-wide mb-4">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
              CrackOne - Temporary Email Service
            </span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
            A cute and secure way to manage temporary emails with instant delivery and auto-expiry.
          </p>
          <div className="flex justify-center">
            <ActionButton isLoggedIn={!!session} />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto max-w-[1600px] px-4 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard
              icon={<Shield className="w-6 h-6 text-blue-600" />}
              title="Privacy Protection"
              description="Safeguard your real email with temporary addresses."
            />
            <FeatureCard
              icon={<Mail className="w-6 h-6 text-blue-600" />}
              title="Instant Inbox"
              description="Get real-time email notifications."
            />
            <FeatureCard
              icon={<Clock className="w-6 h-6 text-blue-600" />}
              title="Auto Expiry"
              description="Emails expire automatically for security."
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-blue-700 text-white py-4 text-center">
        <p>© 2025 CrackOne. All rights reserved.</p>
      </footer>
    </div>
  )
}
