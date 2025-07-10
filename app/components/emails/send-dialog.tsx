"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Send } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface SendDialogProps {
  emailId: string
  fromAddress: string
  onSendSuccess?: () => void
}

export function SendDialog({ emailId, fromAddress, onSendSuccess }: SendDialogProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [to, setTo] = useState("")
  const [subject, setSubject] = useState("")
  const [content, setContent] = useState("")
  const { toast } = useToast()

  const handleSend = async () => {
    if (!to.trim() || !subject.trim() || !content.trim()) {
      toast({
        title: "Error",
        description: "Recipient, subject, and content are all required fields",
        variant: "destructive"
      })
      return
    }

    setLoading(true)
    try {
      const response = await fetch(`/api/emails/${emailId}/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ to, subject, content })
      })

      if (!response.ok) {
        const data = await response.json()
        toast({
          title: "Error",
          description: (data as { error: string }).error,
          variant: "destructive"
        })
        return
      }

      toast({
        title: "Success",
        description: "Email has been sent"
      })
      setOpen(false)
      setTo("")
      setSubject("")
      setContent("")
      
      onSendSuccess?.()
    
    } catch {
      toast({
        title: "Error",
        description: "Failed to send email",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <TooltipProvider>
        <Tooltip>
          <DialogTrigger asChild>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm"
                className="h-8 gap-2 hover:bg-primary/10 hover:text-primary transition-colors"
              >
                <Send className="h-4 w-4" />
                <span className="hidden sm:inline">Send Email</span>
              </Button>
            </TooltipTrigger>
          </DialogTrigger>
          <TooltipContent className="sm:hidden">
            <p>Send a new email using this mailbox</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Send New Email</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="text-sm text-muted-foreground">
            Sender: {fromAddress}
          </div>
          <Input
            value={to}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTo(e.target.value)}
            placeholder="Recipient's email address"
          />
          <Input
            value={subject}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSubject(e.target.value)}
            placeholder="Email subject"
          />
          <Textarea
            value={content}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setContent(e.target.value)}
            placeholder="Email content"
            rows={6}
          />
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setOpen(false)} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleSend} disabled={loading}>
            {loading ? "Sending..." : "Send"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
} 