"use client"

import { Button } from "@/components/ui/button"
import { Gem, Sword, User2, Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { useToast } from "@/components/ui/use-toast"
import { ROLES, Role } from "@/lib/permissions"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const roleIcons = {
  [ROLES.DUKE]: Gem,
  [ROLES.KNIGHT]: Sword,
  [ROLES.CIVILIAN]: User2,
} as const

const roleNames = {
  [ROLES.DUKE]: "Duke (公爵)",
  [ROLES.KNIGHT]: "Knight (骑士)",
  [ROLES.CIVILIAN]: "Civilian (平民)",
} as const

type RoleWithoutEmperor = Exclude<Role, typeof ROLES.EMPEROR>

export function PromotePanel() {
  const [searchText, setSearchText] = useState("")
  const [loading, setLoading] = useState(false)
  const [targetRole, setTargetRole] = useState<RoleWithoutEmperor>(ROLES.KNIGHT)
  const { toast } = useToast()

  const handleAction = async () => {
    if (!searchText) return

    setLoading(true)
    try {
      const res = await fetch("/api/roles/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ searchText })
      })
      const data = await res.json() as {
        user?: {
          id: string
          name?: string
          username?: string
          email: string
          role?: string
        }
        error?: string
      }

      if (!res.ok) throw new Error(data.error || "Unknown error")

      if (!data.user) {
        toast({
          title: "Login failed",
          description: "User information not found",
          variant: "destructive"
        })
        return
      }

      if (data.user.role === targetRole) {
        toast({
          title: `User is already has the${roleNames[targetRole]}`,
          description: "No need to assign it again",
        })
        return
      }

      const promoteRes = await fetch("/api/roles/promote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: data.user.id,
          roleName: targetRole
        })
      })

      if (!promoteRes.ok) {
        const error = await promoteRes.json() as { error: string }
        throw new Error(error.error || "Setting failed")
      }

      toast({
        title: "Success",
        description: `User  ${data.user.username || data.user.email} has been promoted to ${roleNames[targetRole]}`,
      })
      setSearchText("")
    } catch (error) {
      toast({
        title: "Failed to set role",
        description: error instanceof Error ? error.message : "Please try again later",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const Icon = roleIcons[targetRole]

  return (
    <div className="bg-background rounded-lg border-2 border-primary/20 p-6">
      <div className="flex items-center gap-2 mb-6">
        <Icon className="w-5 h-5 text-primary" />
        <h2 className="text-lg font-semibold">Role Management</h2>
      </div>

      <div className="space-y-4">
        <div className="flex gap-4">
          <div className="flex-1">
            <Input
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="Enter username or email"
            />
          </div>
          <Select value={targetRole} onValueChange={(value) => setTargetRole(value as RoleWithoutEmperor)}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ROLES.DUKE}>
                <div className="flex items-center gap-2">
                  <Gem className="w-4 h-4" />
                  Duke
                </div>
              </SelectItem>
              <SelectItem value={ROLES.KNIGHT}>
                <div className="flex items-center gap-2">
                  <Sword className="w-4 h-4" />
                  Knight
                </div>
              </SelectItem>
              <SelectItem value={ROLES.CIVILIAN}>
                <div className="flex items-center gap-2">
                  <User2 className="w-4 h-4" />
                  Civilian
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button
          onClick={handleAction}
          disabled={loading || !searchText.trim()}
          className="w-full"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            `Set as ${roleNames[targetRole]}`
          )}
        </Button>
      </div>
    </div>
  )
} 