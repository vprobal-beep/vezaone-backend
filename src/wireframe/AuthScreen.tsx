import * as React from "react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface AuthScreenProps {
  appName?: string
  onAuthenticate?: (payload: {
    mode: "signin" | "signup" | "reset"
    email: string
  }) => void
}

export function AuthScreen({
  appName = "Application Portal",
  onAuthenticate,
}: AuthScreenProps) {
  const [mode, setMode] = React.useState<"signin" | "signup" | "reset">("signin")
  const [email, setEmail] = React.useState("admin@company.example")
  const [password, setPassword] = React.useState("••••••••••••")
  const [fullName, setFullName] = React.useState("")
  const [remember, setRemember] = React.useState(true)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email.trim()) return
    if (onAuthenticate) {
      onAuthenticate({ mode, email })
    } else {
      toast.success(
        mode === "signin"
          ? `Signed in as ${email}`
          : mode === "signup"
            ? `Account created for ${email}`
            : `Password reset link sent to ${email}`
      )
    }
  }

  return (
    <Card className="w-full max-w-md shadow-none">
      <CardHeader>
        <CardTitle className="font-heading text-lg font-semibold">
          {appName}
        </CardTitle>
        <CardDescription>
          Reusable authentication flow wireframe supporting sign-in, registration, and recovery.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs
          value={mode}
          onValueChange={(v) => setMode(v as "signin" | "signup" | "reset")}
        >
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="signin">Sign In</TabsTrigger>
            <TabsTrigger value="signup">Create</TabsTrigger>
            <TabsTrigger value="reset">Reset</TabsTrigger>
          </TabsList>

          <TabsContent value="signin" className="mt-4">
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="auth-email">Work Email</Label>
                <Input
                  id="auth-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="auth-pass">Password</Label>
                <Input
                  id="auth-pass"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <label className="flex items-center gap-2 text-xs text-muted-foreground cursor-pointer">
                <Checkbox
                  checked={remember}
                  onCheckedChange={(c) => setRemember(Boolean(c))}
                />
                <span>Keep session active for 14 days</span>
              </label>
              <Button type="submit" className="w-full">
                Continue to Workspace
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="signup" className="mt-4">
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="reg-name">Full Name</Label>
                <Input
                  id="reg-name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Jordan Alvarez"
                  required
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="reg-email">Work Email</Label>
                <Input
                  id="reg-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="reg-pass">Password</Label>
                <Input
                  id="reg-pass"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                Create Account
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="reset" className="mt-4">
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="reset-email">Account Email</Label>
                <Input
                  id="reset-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                Send Recovery Link
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
