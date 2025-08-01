"use client"

import { Button } from "@/components/ui/button"
import { Settings } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { useState, useEffect } from "react"
import { Role, ROLES } from "@/lib/permissions"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { EMAIL_CONFIG } from "@/config"

export function WebsiteConfigPanel() {
  const [defaultRole, setDefaultRole] = useState<string>("")
  const [emailDomains, setEmailDomains] = useState<string>("")
  const [adminContact, setAdminContact] = useState<string>("")
  const [maxEmails, setMaxEmails] = useState<string>(EMAIL_CONFIG.MAX_ACTIVE_EMAILS.toString())
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()


  useEffect(() => {
    fetchConfig()
  }, [])

  const fetchConfig = async () => {
    const res = await fetch("/api/config")
    if (res.ok) {
      const data = await res.json() as { 
        defaultRole: Exclude<Role, typeof ROLES.EMPEROR>,
        emailDomains: string,
        adminContact: string,
        maxEmails: string
      }
      setDefaultRole(data.defaultRole)
      setEmailDomains(data.emailDomains)
      setAdminContact(data.adminContact)
      setMaxEmails(data.maxEmails || EMAIL_CONFIG.MAX_ACTIVE_EMAILS.toString())
    }
  }

  const handleSave = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          defaultRole, 
          emailDomains,
          adminContact,
          maxEmails: maxEmails || EMAIL_CONFIG.MAX_ACTIVE_EMAILS.toString()
        }),
      })

      if (!res.ok) throw new Error("保存失败")

      toast({
        title: "Save Successful",
        description: "Website settings have been updated",
      })
    } catch (error) {
      toast({
        title: "Save Failed",
        description: error instanceof Error ? error.message : "Please try again later",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-background rounded-lg border-2 border-primary/20 p-6">
      <div className="flex items-center gap-2 mb-6">
        <Settings className="w-5 h-5 text-primary" />
        <h2 className="text-lg font-semibold">Website Settings</h2>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <span className="text-sm">Default role for new users:</span>
          <Select value={defaultRole} onValueChange={setDefaultRole}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ROLES.DUKE}>Duke </SelectItem>
              <SelectItem value={ROLES.KNIGHT}>Knight</SelectItem>
              <SelectItem value={ROLES.CIVILIAN}>Civilian</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-sm">Email Domains:</span>
          <div className="flex-1">
            <Input 
              value={emailDomains}
              onChange={(e) => setEmailDomains(e.target.value)}
              placeholder="Separate multiple domains with commas, e.g.: moemail.app, bitibiti.com"
            />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-sm">Admin Contact:</span>
          <div className="flex-1">
            <Input 
              value={adminContact}
              onChange={(e) => setAdminContact(e.target.value)}
              placeholder="e.g. WeChat ID, email, etc."
            />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-sm">Maximum Email Count:</span>
          <div className="flex-1">
            <Input 
              type="number"
              min="1"
              max="100"
              value={maxEmails}
              onChange={(e) => setMaxEmails(e.target.value)}
              placeholder={`Default is ${EMAIL_CONFIG.MAX_ACTIVE_EMAILS}`}
            />
          </div>
        </div>

        <Button 
          onClick={handleSave}
          disabled={loading}
          className="w-full"
        >
          Save
        </Button>
      </div>
    </div>
  )
} 