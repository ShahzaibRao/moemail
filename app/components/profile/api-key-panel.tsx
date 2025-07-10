"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Key, Plus, Loader2, Copy, Trash2, ChevronDown, ChevronUp } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { useCopy } from "@/hooks/use-copy"
import { useRolePermission } from "@/hooks/use-role-permission"
import { PERMISSIONS } from "@/lib/permissions"
import { useConfig } from "@/hooks/use-config"

type ApiKey = {
  id: string
  name: string
  key: string
  createdAt: string
  expiresAt: string | null
  enabled: boolean
}

export function ApiKeyPanel() {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([])
  const [loading, setLoading] = useState(false)
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [newKeyName, setNewKeyName] = useState("")
  const [newKey, setNewKey] = useState<string | null>(null)
  const { toast } = useToast()
  const { copyToClipboard } = useCopy()
  const [showExamples, setShowExamples] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const { checkPermission } = useRolePermission()
  const canManageApiKey = checkPermission(PERMISSIONS.MANAGE_API_KEY)

  const fetchApiKeys = async () => {
    try {
      const res = await fetch("/api/api-keys")
      if (!res.ok) throw new Error("Failed to get API keys")
      const data = await res.json() as { apiKeys: ApiKey[] }
      setApiKeys(data.apiKeys)
    } catch (error) {
      console.error(error)
      toast({
        title: "Fetch Failed",
        description: "Failed to fetch API Keys list",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (canManageApiKey) {
      fetchApiKeys()
    }
  }, [canManageApiKey])

  const { config } = useConfig()

  const createApiKey = async () => {
    if (!newKeyName.trim()) return

    setLoading(true)
    try {
      const res = await fetch("/api/api-keys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newKeyName })
      })

      if (!res.ok) throw new Error("Failed to create API Key")

      const data = await res.json() as { key: string }
      setNewKey(data.key)
      fetchApiKeys()
    } catch (error) {
      toast({
        title: "Creation Failed",
        description: error instanceof Error ? error.message : "Please try again later",
        variant: "destructive"
      })
      setCreateDialogOpen(false)
    } finally {
      setLoading(false)
    }
  }

  const handleDialogClose = () => {
    setCreateDialogOpen(false)
    setNewKeyName("")
    setNewKey(null)
  }

  const toggleApiKey = async (id: string, enabled: boolean) => {
    try {
      const res = await fetch(`/api/api-keys/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ enabled })
      })

      if (!res.ok) throw new Error("Update failed")

      setApiKeys(keys =>
        keys.map(key =>
          key.id === id ? { ...key, enabled } : key
        )
      )
    } catch (error) {
      console.error(error)
      toast({
        title: "Update Failed",
        description: "Failed to update API Key status",
        variant: "destructive"
      })
    }
  }

  const deleteApiKey = async (id: string) => {
    try {
      const res = await fetch(`/api/api-keys/${id}`, {
        method: "DELETE"
      })

      if (!res.ok) throw new Error("Deletion failed")

      setApiKeys(keys => keys.filter(key => key.id !== id))
      toast({
        title: "Deletion successful",
        description: "API Key has been deleted"
      })
    } catch (error) {
      console.error(error)
      toast({
        title: "Deletion failed",
        description: "Failed to delete API Key",
        variant: "destructive"
      })
    }
  }

  return (
    <div className="bg-background rounded-lg border-2 border-primary/20 p-6 space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Key className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-semibold">API Keys</h2>
        </div>
        {
          canManageApiKey && (
            <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2" onClick={() => setCreateDialogOpen(true)}>
                  <Plus className="w-4 h-4" />
                  Create API Key
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    {newKey ? "API Key 创建成功" : "创建新的 API Key"}
                  </DialogTitle>
                  {newKey && (
                    <DialogDescription className="text-destructive">
                      Please save this key now. It will only be shown once and cannot be recovered
                    </DialogDescription>
                  )}
                </DialogHeader>

                {!newKey ? (
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label>Name</Label>
                      <Input
                        value={newKeyName}
                        onChange={(e) => setNewKeyName(e.target.value)}
                        placeholder="Give your API Key a name"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label>API Key</Label>
                      <div className="flex gap-2">
                        <Input
                          value={newKey}
                          readOnly
                          className="font-mono text-sm"
                        />
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => copyToClipboard(newKey)}
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                <DialogFooter>
                  <DialogClose asChild>
                    <Button
                      variant="outline"
                      onClick={handleDialogClose}
                      disabled={loading}
                    >
                      {newKey ? "Done" : "Cancel"}
                    </Button>
                  </DialogClose>
                  {!newKey && (
                    <Button
                      onClick={createApiKey}
                      disabled={loading || !newKeyName.trim()}
                    >
                      {loading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        "Create"
                      )}
                    </Button>
                  )}
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )
        }
      </div>

      {
        !canManageApiKey ? (
          <div className="text-center text-muted-foreground py-8">
            <p>Duke or higher permissions are required to manage API Keys</p>
            <p className="mt-2">Please contact the site administrator to upgrade your role</p>
            {
              config?.adminContact && (
                <p className="mt-2">admin contact：{config.adminContact}</p>
              )
            }
          </div>
        ) : (
          <div className="space-y-4">
            {isLoading ? (
              <div className="text-center py-8 space-y-3">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                  <Loader2 className="w-6 h-6 text-primary animate-spin" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Loading...</p>
                </div>
              </div>
            ) : apiKeys.length === 0 ? (
              <div className="text-center py-8 space-y-3">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                  <Key className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-medium">没有 API Keys</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Click the Create button above &quot;API Key&quot; Create button above to create your first  API Key
                  </p>
                </div>
              </div>
            ) : (
              <>
                {apiKeys.map((key) => (
                  <div
                    key={key.id}
                    className="flex items-center justify-between p-4 rounded-lg border bg-card"
                  >
                    <div className="space-y-1">
                      <div className="font-medium">{key.name}</div>
                      <div className="text-sm text-muted-foreground">
                        Created on {new Date(key.createdAt).toLocaleString()}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={key.enabled}
                        onCheckedChange={(checked) => toggleApiKey(key.id, checked)}
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteApiKey(key.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}

                <div className="mt-8 space-y-4">
                  <button
                    type="button"
                    className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
                    onClick={() => setShowExamples(!showExamples)}
                  >
                    {showExamples ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    View usage documentation
                  </button>

                  {showExamples && (
                    <div className="rounded-lg border bg-card p-4 space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="text-sm font-medium">Fetch system settings</div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => copyToClipboard(
                              `curl ${window.location.protocol}//${window.location.host}/api/config \\
  -H "X-API-Key: YOUR_API_KEY"`
                            )}
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                        </div>
                        <pre className="text-xs bg-muted/50 rounded-lg p-4 overflow-x-auto">
                          {`curl ${window.location.protocol}//${window.location.host}/api/config \\
  -H "X-API-Key: YOUR_API_KEY"`}
                        </pre>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="text-sm font-medium">Generate temporary email</div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => copyToClipboard(
                              `curl -X POST ${window.location.protocol}//${window.location.host}/api/emails/generate \\
  -H "X-API-Key: YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "name": "test",
    "expiryTime": 3600000,
    "domain": "moemail.app"
  }'`
                            )}
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                        </div>
                        <pre className="text-xs bg-muted/50 rounded-lg p-4 overflow-x-auto">
                          {`curl -X POST ${window.location.protocol}//${window.location.host}/api/emails/generate \\
  -H "X-API-Key: YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "name": "test",
    "expiryTime": 3600000,
    "domain": "moemail.app"
  }'`}
                        </pre>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="text-sm font-medium">Get email list</div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => copyToClipboard(
                              `curl ${window.location.protocol}//${window.location.host}/api/emails?cursor=CURSOR \\
  -H "X-API-Key: YOUR_API_KEY"`
                            )}
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                        </div>
                        <pre className="text-xs bg-muted/50 rounded-lg p-4 overflow-x-auto">
                          {`curl ${window.location.protocol}//${window.location.host}/api/emails?cursor=CURSOR \\
  -H "X-API-Key: YOUR_API_KEY"`}
                        </pre>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="text-sm font-medium">Fetch email list</div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => copyToClipboard(
                              `curl ${window.location.protocol}//${window.location.host}/api/emails/{emailId}?cursor=CURSOR \\
  -H "X-API-Key: YOUR_API_KEY"`
                            )}
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                        </div>
                        <pre className="text-xs bg-muted/50 rounded-lg p-4 overflow-x-auto">
                          {`curl ${window.location.protocol}//${window.location.host}/api/emails/{emailId}?cursor=CURSOR \\
  -H "X-API-Key: YOUR_API_KEY"`}
                        </pre>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="text-sm font-medium">Get a single email</div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => copyToClipboard(
                              `curl ${window.location.protocol}//${window.location.host}/api/emails/{emailId}/{messageId} \\
  -H "X-API-Key: YOUR_API_KEY"`
                            )}
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                        </div>
                        <pre className="text-xs bg-muted/50 rounded-lg p-4 overflow-x-auto">
                          {`curl ${window.location.protocol}//${window.location.host}/api/emails/{emailId}/{messageId} \\
  -H "X-API-Key: YOUR_API_KEY"`}
                        </pre>
                      </div>

                      <div className="text-xs text-muted-foreground mt-4">
                        <p>注意：</p>
                        <ul className="list-disc list-inside space-y-1 mt-2">
                          <li>Replace YOUR_API_KEY with your actual API Key.</li>
                          <li>The /api/config endpoint provides system configuration, including the list of available email domains.</li>
                          <li>emailId is the unique identifier for the email address.</li>
                          <li>messageId is the unique identifier for the email message.</li>
                          <li>expiryTime is the validity period of the email address (in milliseconds). Optional values: 3600000 (1 hour), 86400000 (1 day), 604800000 (7 days), 0 (permanent).</li>
                          <li>domain is the email domain. Available domains can be retrieved via the /api/config endpoint.</li>
                          <li>cursor is used for pagination; obtain nextCursor from the previous response.</li>
                          <li>All requests must include the X-API-Key header.</li>
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        )
      }
    </div>
  )
} 