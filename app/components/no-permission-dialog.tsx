"use client"

import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { useConfig } from "@/hooks/use-config"
export function NoPermissionDialog() {
  const router = useRouter()
  const { config } = useConfig()

  return (
    <div className="fixed inset-0 bg-background/50 backdrop-blur-sm z-50">
      <div className="fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] w-[90%] max-w-md">
        <div className="bg-background border-2 border-primary/20 rounded-lg p-6 md:p-12 shadow-lg">
          <div className="text-center space-y-4">
            <h1 className="text-xl md:text-2xl font-bold">Access denied</h1>
            <p className="text-sm md:text-base text-muted-foreground">You do not have permission to access this page. Please contact the site administrator</p>
            {
              config?.adminContact && (
                <p className="text-sm md:text-base text-muted-foreground">Administrator contact：{config.adminContact}</p>
              )
            }
            <Button 
              onClick={() => router.push("/")}
              className="mt-4 w-full md:w-auto"
            >
              Back to home
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
} 