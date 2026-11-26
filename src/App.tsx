import * as React from "react"
import {
  BellIcon,
  Building2Icon,
  FileTextIcon,
  FolderTreeIcon,
  KeyRoundIcon,
  LayoutDashboardIcon,
  LockIcon,
  LogOutIcon,
  PackageIcon,
  ShieldCheckIcon,
} from "lucide-react"
import { toast } from "sonner"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { CatalogSpecsView } from "@/src/vezaone/CatalogSpecsView"
import { SkeletonPlaceholder } from "@/src/vezaone/SkeletonPlaceholder"
import {
  AuthScreen,
  WireframeShell,
  type NavItemConfig,
  type WireframeTheme,
} from "@/src/wireframe"

type BackendSectionId =
  | "dashboard"
  | "catalog"
  | "taxonomy"
  | "manufacturers"
  | "documents"
  | "enterprise"
  | "governance"

interface HeaderAlert {
  id: string
  title: string
  detail: string
  time: string
  targetSection: BackendSectionId
  unread: boolean
}

const INITIAL_ALERTS: HeaderAlert[] = [
  {
    id: "al-1",
    title: "New OEM profile claim submitted",
    detail: "Scott Safety requested ownership transfer for 148 SKUs.",
    time: "12m ago",
    targetSection: "manufacturers",
    unread: true,
  },
  {
    id: "al-2",
    title: "Certification awaiting verification",
    detail: "3M SecureFit X5000 ANSI Z89.1 Rev C uploaded.",
    time: "45m ago",
    targetSection: "documents",
    unread: true,
  },
  {
    id: "al-3",
    title: "Procurement sync retry needed",
    detail: "Apex Construction ERP delta export failed (attempt 3).",
    time: "2h ago",
    targetSection: "enterprise",
    unread: false,
  },
]

const SECTION_META: Record<
  BackendSectionId,
  { title: string; scope: string }
> = {
  dashboard: {
    title: "Dashboard",
    scope:
      "Placeholder — to be built once all core backend modules are completed.",
  },
  catalog: {
    title: "Catalog & Specs",
    scope:
      "Products, SKUs, Variants/Configurations, Spare Parts & Compatibility, VezaOne Managed vs. OEM Managed.",
  },
  taxonomy: {
    title: "Taxonomy",
    scope: "18 Categories, Subcategories, and 11 Industries.",
  },
  manufacturers: {
    title: "Manufacturers & Claims",
    scope: "OEM Directory, Profile Claims Queue, and Verification Standards.",
  },
  documents: {
    title: "Documents & Training",
    scope: "Datasheets, Manuals, Certifications, and Safety Courses.",
  },
  enterprise: {
    title: "Enterprise & API",
    scope: "Business Accounts, API Keys, Procurement Sync & Bulk Export Jobs.",
  },
  governance: {
    title: "Access & Governance",
    scope:
      "Admin/Curator/OEM Users, Role Permissions Matrix, Audit Log, and Settings.",
  },
}

const NAV_ITEMS: NavItemConfig[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    group: "Overview",
    icon: LayoutDashboardIcon,
  },
  {
    id: "catalog",
    label: "Catalog & Specs",
    group: "Platform Data",
    icon: PackageIcon,
  },
  {
    id: "taxonomy",
    label: "Taxonomy",
    group: "Platform Data",
    icon: FolderTreeIcon,
  },
  {
    id: "manufacturers",
    label: "Manufacturers & Claims",
    group: "Platform Data",
    icon: Building2Icon,
  },
  {
    id: "documents",
    label: "Documents & Training",
    group: "Platform Data",
    icon: FileTextIcon,
  },
  {
    id: "enterprise",
    label: "Enterprise & API",
    group: "Operations",
    icon: KeyRoundIcon,
  },
  {
    id: "governance",
    label: "Access & Governance",
    group: "Administration",
    icon: ShieldCheckIcon,
  },
]

export default function App() {
  const [theme] = React.useState<WireframeTheme>("light")
  const [activeSection, setActiveSection] =
    React.useState<BackendSectionId>("catalog")
  const [signedOutGate, setSignedOutGate] = React.useState(false)
  const [alerts, setAlerts] = React.useState<HeaderAlert[]>(INITIAL_ALERTS)
  const [alertsOpen, setAlertsOpen] = React.useState(false)

  React.useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark")
  }, [theme])

  const unreadCount = alerts.filter((a) => a.unread).length

  if (signedOutGate) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-6 gap-6">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <ShieldCheckIcon className="size-4" />
          <span>VezaOne Superadmin Portal · Sign-In Gate</span>
        </div>
        <AuthScreen
          appName="VezaOne Superadmin Sign-In"
          onAuthenticate={({ email }) => {
            setSignedOutGate(false)
            toast.success(`Signed in as ${email}`)
          }}
        />
        <Button
          variant="outline"
          size="sm"
          onClick={() => setSignedOutGate(false)}
        >
          Preview Logged-In State
        </Button>
      </div>
    )
  }

  const currentMeta = SECTION_META[activeSection]

  return (
    <WireframeShell
      brandTitle="VezaOne Admin"
      brandSubtitle="Superadmin Backend"
      navItems={NAV_ITEMS}
      activeNavId={activeSection}
      onSelectNav={(id) => setActiveSection(id as BackendSectionId)}
      showCommandButton={false}
      showThemeToggle={false}
      headerExtras={
        <div className="flex items-center gap-3">
          {/* Alerts Popover */}
          <Popover open={alertsOpen} onOpenChange={setAlertsOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="gap-2 whitespace-nowrap shrink-0"
                aria-label="Open system alerts"
              >
                <BellIcon className="size-4" />
                <span className="font-mono text-xs tabular-nums">
                  {unreadCount}
                </span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0" align="end">
              <div className="flex items-center justify-between px-4 py-3 border-b">
                <span className="font-heading text-sm font-semibold">
                  Alerts
                </span>
                {unreadCount > 0 && (
                  <button
                    type="button"
                    onClick={() =>
                      setAlerts((prev) =>
                        prev.map((a) => ({ ...a, unread: false }))
                      )
                    }
                    className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Mark all read
                  </button>
                )}
              </div>
              <div className="flex flex-col">
                {alerts.map((alert, idx) => (
                  <React.Fragment key={alert.id}>
                    <button
                      type="button"
                      onClick={() => {
                        setAlerts((prev) =>
                          prev.map((a) =>
                            a.id === alert.id ? { ...a, unread: false } : a
                          )
                        )
                        setActiveSection(alert.targetSection)
                        setAlertsOpen(false)
                      }}
                      className="flex flex-col gap-1 px-4 py-3 text-left hover:bg-muted/60 transition-colors"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span
                          className={`text-xs font-medium ${
                            alert.unread
                              ? "text-foreground"
                              : "text-muted-foreground"
                          }`}
                        >
                          {alert.title}
                        </span>
                        <span className="text-[11px] text-muted-foreground tabular-nums shrink-0">
                          {alert.time}
                        </span>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {alert.detail}
                      </span>
                    </button>
                    {idx < alerts.length - 1 && <Separator />}
                  </React.Fragment>
                ))}
              </div>
            </PopoverContent>
          </Popover>

          {/* Logged-in User Info + Sign Out Icon */}
          <div className="flex items-center gap-2.5 pl-1">
            <Avatar className="size-7">
              <AvatarFallback className="text-xs font-medium">
                SA
              </AvatarFallback>
            </Avatar>
            <div className="hidden sm:flex flex-col items-start text-left leading-none">
              <span className="text-xs font-medium text-foreground">
                Superadmin
              </span>
              <span className="text-[11px] text-muted-foreground">
                superadmin@vezaone.example
              </span>
            </div>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-8 shrink-0 text-muted-foreground hover:text-foreground"
                  onClick={() => setSignedOutGate(true)}
                  aria-label="Sign out"
                >
                  <LogOutIcon className="size-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Sign Out</TooltipContent>
            </Tooltip>
          </div>
        </div>
      }
      theme={theme}
      onToggleTheme={() => {}}
      commandActions={[
        {
          id: "cmd-signin-gate",
          label: "Preview Superadmin Sign-In Gate",
          icon: LockIcon,
          onSelect: () => setSignedOutGate(true),
        },
      ]}
    >
      {activeSection === "catalog" ? (
        <CatalogSpecsView />
      ) : (
        <SkeletonPlaceholder
          sectionTitle={currentMeta.title}
          sectionScope={currentMeta.scope}
        />
      )}
    </WireframeShell>
  )
}
