import * as React from "react"
import {
  AlertTriangleIcon,
  CheckCircle2Icon,
  ClockIcon,
  CopyIcon,
  EyeIcon,
  EyeOffIcon,
  KeyRoundIcon,
  PlusIcon,
  RefreshCwIcon,
  Trash2Icon,
} from "lucide-react"
import { toast } from "sonner"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type {
  ApiKeyRecord,
  AuditLogRecord,
  JobRecord,
  WebhookRecord,
} from "@/src/wireframe/types"

interface ApiKeysWebhooksBlockProps {
  apiKeys: ApiKeyRecord[]
  webhooks: WebhookRecord[]
  onCreateKey: (name: string, scope: ApiKeyRecord["scope"]) => void
  onRevokeKey: (id: string) => void
  onToggleWebhook: (id: string) => void
}

export function ApiKeysWebhooksBlock({
  apiKeys,
  webhooks,
  onCreateKey,
  onRevokeKey,
  onToggleWebhook,
}: ApiKeysWebhooksBlockProps) {
  const [revealedIds, setRevealedIds] = React.useState<string[]>([])
  const [createOpen, setCreateOpen] = React.useState(false)
  const [pendingRevoke, setPendingRevoke] = React.useState<ApiKeyRecord | null>(
    null
  )
  const [newKeyName, setNewKeyName] = React.useState("")
  const [newKeyScope, setNewKeyScope] =
    React.useState<ApiKeyRecord["scope"]>("Read & Write")

  function toggleReveal(id: string) {
    setRevealedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    )
  }

  function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    if (!newKeyName.trim()) return
    onCreateKey(newKeyName.trim(), newKeyScope)
    setNewKeyName("")
    setCreateOpen(false)
  }

  return (
    <Tabs defaultValue="keys" className="w-full">
      <div className="flex items-center justify-between gap-4">
        <TabsList>
          <TabsTrigger value="keys">API Keys</TabsTrigger>
          <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
        </TabsList>
        <Button
          size="sm"
          onClick={() => setCreateOpen(true)}
          className="whitespace-nowrap shrink-0"
        >
          <PlusIcon className="size-4" />
          Generate Key
        </Button>
      </div>

      <TabsContent value="keys" className="mt-4">
        <Card className="shadow-none overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Key Name</TableHead>
                <TableHead>Token</TableHead>
                <TableHead>Scope</TableHead>
                <TableHead className="text-right">Last Used</TableHead>
                <TableHead className="w-28 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {apiKeys.map((key) => {
                const isRevealed = revealedIds.includes(key.id)
                return (
                  <TableRow key={key.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <KeyRoundIcon className="size-3.5 text-muted-foreground shrink-0" />
                        <span className="text-sm font-medium">{key.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground tabular-nums">
                      {isRevealed ? key.secretPreview : `${key.prefix}••••••••••••`}
                    </TableCell>
                    <TableCell className="text-xs font-medium">
                      {key.scope}
                    </TableCell>
                    <TableCell className="text-right text-xs text-muted-foreground tabular-nums">
                      {key.lastUsed}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-8"
                          onClick={() => toggleReveal(key.id)}
                          aria-label={isRevealed ? "Hide secret" : "Reveal secret"}
                        >
                          {isRevealed ? (
                            <EyeOffIcon className="size-3.5" />
                          ) : (
                            <EyeIcon className="size-3.5" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-8"
                          onClick={() => {
                            navigator.clipboard?.writeText(key.secretPreview)
                            toast.success(`Copied ${key.name}`)
                          }}
                          aria-label="Copy token"
                        >
                          <CopyIcon className="size-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-8 text-destructive hover:text-destructive"
                          onClick={() => setPendingRevoke(key)}
                          aria-label={`Revoke ${key.name}`}
                        >
                          <Trash2Icon className="size-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </Card>
      </TabsContent>

      <TabsContent value="webhooks" className="mt-4">
        <Card className="shadow-none overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Endpoint URL</TableHead>
                <TableHead>Subscribed Events</TableHead>
                <TableHead>State</TableHead>
                <TableHead className="text-right">Delivery Rate</TableHead>
                <TableHead className="w-28 text-right">Control</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {webhooks.map((hook) => (
                <TableRow key={hook.id}>
                  <TableCell className="font-mono text-xs">
                    {hook.url}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {hook.events.join(" · ")}
                  </TableCell>
                  <TableCell className="text-xs font-medium">
                    {hook.status}
                  </TableCell>
                  <TableCell className="text-right font-mono text-xs tabular-nums">
                    {hook.deliveryRate}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onToggleWebhook(hook.id)}
                      className="whitespace-nowrap"
                    >
                      {hook.status === "Active" ? "Pause" : "Enable"}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </TabsContent>

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-heading">Generate API Key</DialogTitle>
            <DialogDescription>
              Create a scoped service credential for backend integrations.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreate} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="key-name">Key Label</Label>
              <Input
                id="key-name"
                value={newKeyName}
                onChange={(e) => setNewKeyName(e.target.value)}
                placeholder="e.g., Billing Worker Service"
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label>Permission Scope</Label>
              <Select
                value={newKeyScope}
                onValueChange={(v) => setNewKeyScope(v as ApiKeyRecord["scope"])}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Read-Only">Read-Only</SelectItem>
                  <SelectItem value="Read & Write">Read & Write</SelectItem>
                  <SelectItem value="Admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setCreateOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Create Key</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={Boolean(pendingRevoke)}
        onOpenChange={(open) => !open && setPendingRevoke(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Revoke API key?</AlertDialogTitle>
            <AlertDialogDescription>
              Any backend service using &ldquo;{pendingRevoke?.name}&rdquo; will immediately fail authentication.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (pendingRevoke) {
                  onRevokeKey(pendingRevoke.id)
                  setPendingRevoke(null)
                }
              }}
            >
              Revoke Key
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Tabs>
  )
}

export function JobQueueTable({
  jobs,
  onRetryJob,
}: {
  jobs: JobRecord[]
  onRetryJob: (id: string) => void
}) {
  return (
    <Card className="shadow-none overflow-hidden">
      <CardHeader>
        <CardTitle className="font-heading text-base font-semibold">
          Background Job Queue
        </CardTitle>
        <CardDescription>
          Asynchronous worker queue wireframe with retry triggers and attempt counters.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-28">Job ID</TableHead>
              <TableHead>Queue & Payload</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Attempts</TableHead>
              <TableHead className="text-right">Duration</TableHead>
              <TableHead className="w-28 text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {jobs.map((job) => (
              <TableRow key={job.id}>
                <TableCell className="font-mono text-xs text-muted-foreground tabular-nums">
                  {job.id}
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">{job.queue}</span>
                    <span className="text-xs text-muted-foreground">
                      {job.payloadSummary} · {job.updatedAt}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="inline-flex items-center gap-1.5 text-xs font-medium whitespace-nowrap">
                    {job.status === "Succeeded" ? (
                      <CheckCircle2Icon className="size-3.5 text-emerald-600 dark:text-emerald-400" />
                    ) : job.status === "Failed" ? (
                      <AlertTriangleIcon className="size-3.5 text-amber-600 dark:text-amber-400" />
                    ) : (
                      <ClockIcon className="size-3.5 text-muted-foreground" />
                    )}
                    <span>{job.status}</span>
                  </span>
                </TableCell>
                <TableCell className="text-right font-mono text-xs tabular-nums">
                  {job.attempts}
                </TableCell>
                <TableCell className="text-right font-mono text-xs text-muted-foreground tabular-nums">
                  {job.durationMs} ms
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onRetryJob(job.id)}
                    className="whitespace-nowrap"
                  >
                    <RefreshCwIcon className="size-3.5" />
                    Retry
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

export function AuditLogList({ entries }: { entries: AuditLogRecord[] }) {
  const [query, setQuery] = React.useState("")

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return entries
    return entries.filter(
      (e) =>
        e.actor.toLowerCase().includes(q) ||
        e.action.toLowerCase().includes(q) ||
        e.resource.toLowerCase().includes(q)
    )
  }, [entries, query])

  return (
    <Card className="shadow-none">
      <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <CardTitle className="font-heading text-base font-semibold">
            Audit Log
          </CardTitle>
          <CardDescription>
            Immutable trail of actor mutations, source IPs, and timestamps.
          </CardDescription>
        </div>
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Filter audit events..."
          className="w-full sm:w-64"
          aria-label="Filter audit events"
        />
      </CardHeader>
      <CardContent className="flex flex-col">
        {filtered.map((entry, idx) => (
          <React.Fragment key={entry.id}>
            <div className="flex flex-col gap-1 py-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="text-sm">
                <span className="font-medium">{entry.actor}</span>{" "}
                <span className="text-muted-foreground">{entry.action}</span>{" "}
                <span className="font-mono text-xs">{entry.resource}</span>
              </div>
              <div className="text-xs font-mono text-muted-foreground tabular-nums whitespace-nowrap shrink-0">
                {entry.sourceIp} · {entry.timestamp}
              </div>
            </div>
            {idx < filtered.length - 1 && <Separator />}
          </React.Fragment>
        ))}
      </CardContent>
    </Card>
  )
}
