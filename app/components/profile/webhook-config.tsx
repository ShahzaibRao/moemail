/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/components/ui/use-toast"
import { Loader2, Send, ChevronDown, ChevronUp } from "lucide-react"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export function WebhookConfig() {
  const [enabled, setEnabled] = useState(false)
  const [url, setUrl] = useState("")
  const [loading, setLoading] = useState(false)
  const [testing, setTesting] = useState(false)
  const [showDocs, setShowDocs] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    fetch("/api/webhook")
      .then(res => res.json() as Promise<{ enabled: boolean; url: string }>)
      .then(data => {
        setEnabled(data.enabled)
        setUrl(data.url)
      })
      .catch(console.error)
      .finally(() => setInitialLoading(false))
  }, [])

  if (initialLoading) {
    return (
      <div className="text-center">
        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
          <Loader2 className="w-6 h-6 text-primary animate-spin" />
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!url) return

    setLoading(true)
    try {
      const res = await fetch("/api/webhook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, enabled })
      })

      if (!res.ok) throw new Error("Failed to save")

      toast({
        title: "Save Successful",
        description: "Webhook configuration has been updated"
      })
    } catch (_error) {
      toast({
        title: "Save Failed",
        description: "Please try again later",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleTest = async () => {
    if (!url) return

    setTesting(true)
    try {
      const res = await fetch("/api/webhook/test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url })
      })

      if (!res.ok) throw new Error("测试失败")

      toast({
        title: "Test Successful",
        description: "Webhook call succeeded. Please check if the target server received the request"
      })
    } catch (_error) {
      toast({
        title: "Test Failed",
        description: "Please check if the URL is correct and accessible",
        variant: "destructive"
      })
    } finally {
      setTesting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label>启用 Webhook</Label>
          <div className="text-sm text-muted-foreground">
            Notify the specified URL when a new email is received
          </div>
        </div>
        <Switch
          checked={enabled}
          onCheckedChange={setEnabled}
        />
      </div>

      {enabled && (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="webhook-url">Webhook URL</Label>
            <div className="flex gap-2">
              <Input
                id="webhook-url"
                placeholder="https://example.com/webhook"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                type="url"
                required
              />
              <Button type="submit" disabled={loading} className="flex-shrink-0">
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  "Save"
                )}
              </Button>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleTest}
                      disabled={testing || !url}
                    >
                      {testing ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Send className="w-4 h-4" />
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Send a test message to this Webhook</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <p className="text-xs text-muted-foreground">
              We will send a POST request to this URL containing details about the new email
            </p>
          </div>

          <div className="space-y-2">
            <button
              type="button"
              className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
              onClick={() => setShowDocs(!showDocs)}
            >
              {showDocs ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              View Data Format Description
            </button>

            {showDocs && (
              <div className="rounded-md bg-muted p-4 text-sm space-y-3">
                <p>When a new email is received, a POST request will be sent to the configured URL with the following headers:</p>
                <pre className="bg-background p-2 rounded text-xs">
                  Content-Type: application/json{'\n'}
                  X-Webhook-Event: new_message
                </pre>

                <p>Example request body:</p>
                <pre className="bg-background p-2 rounded text-xs overflow-auto">
                  {`{
  "emailId": "email-uuid",
  "messageId": "message-uuid",
  "fromAddress": "sender@example.com",
  "subject": "Email Subject",
  "content": "Plain text email content",
  "html": "HTML email content",
  "receivedAt": "2024-01-01T12:00:00.000Z",
  "toAddress": "your-email@${window.location.host}"
}`}
                </pre>
              </div>
            )}
          </div>
        </div>
      )}
    </form>
  )
} 