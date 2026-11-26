import * as React from "react"
import {
  ChevronsUpDownIcon,
  LayersIcon,
  MoonIcon,
  PlusIcon,
  SearchIcon,
  SunIcon,
} from "lucide-react"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Separator } from "@/components/ui/separator"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Toaster } from "@/components/ui/sonner"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import type {
  NavItemConfig,
  WireframeTheme,
  WorkspaceOption,
} from "@/src/wireframe/types"

export interface CommandActionItem {
  id: string
  label: string
  group?: string
  icon?: React.ComponentType<{ className?: string }>
  onSelect: () => void
}

interface WireframeShellProps {
  brandTitle: string
  brandSubtitle?: string
  workspaces?: WorkspaceOption[]
  activeWorkspaceId?: string
  onSelectWorkspace?: (id: string) => void
  navItems: NavItemConfig[]
  activeNavId: string
  onSelectNav: (id: string) => void
  user?: {
    name: string
    email: string
    initials: string
  } | null
  userMenuActions?: {
    label: string
    onClick: () => void
  }[]
  theme: WireframeTheme
  onToggleTheme: () => void
  primaryAction?: {
    label: string
    onClick: () => void
  }
  commandActions?: CommandActionItem[]
  showCommandButton?: boolean
  showThemeToggle?: boolean
  headerExtras?: React.ReactNode
  children: React.ReactNode
}

export function WireframeShell({
  brandTitle,
  brandSubtitle = "Wireframe Kit",
  workspaces = [],
  activeWorkspaceId,
  onSelectWorkspace,
  navItems,
  activeNavId,
  onSelectNav,
  user = null,
  userMenuActions = [],
  theme,
  onToggleTheme,
  primaryAction,
  commandActions = [],
  showCommandButton = true,
  showThemeToggle = true,
  headerExtras,
  children,
}: WireframeShellProps) {
  const [commandOpen, setCommandOpen] = React.useState(false)

  React.useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault()
        setCommandOpen((prev) => !prev)
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  const hasSwitcher = workspaces.length > 1 && Boolean(onSelectWorkspace)
  const activeWorkspace =
    workspaces.find((w) => w.id === activeWorkspaceId) ?? workspaces[0]
  const activeNav = navItems.find((item) => item.id === activeNavId)

  const groupedNav = React.useMemo(() => {
    const groups = new Map<string, NavItemConfig[]>()
    for (const item of navItems) {
      const groupName = item.group ?? "Navigation"
      const list = groups.get(groupName) ?? []
      list.push(item)
      groups.set(groupName, list)
    }
    return Array.from(groups.entries())
  }, [navItems])

  return (
    <TooltipProvider>
      <SidebarProvider>
        <Sidebar collapsible="icon">
          <SidebarHeader>
            <SidebarMenu>
              <SidebarMenuItem>
                {hasSwitcher ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <SidebarMenuButton size="lg">
                        <div className="flex aspect-square size-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
                          <LayersIcon className="size-4" />
                        </div>
                        <div className="grid flex-1 text-left text-sm leading-tight">
                          <span className="truncate font-heading font-semibold">
                            {activeWorkspace?.name ?? brandTitle}
                          </span>
                          <span className="truncate text-xs text-muted-foreground">
                            {activeWorkspace?.subtitle ?? brandSubtitle}
                          </span>
                        </div>
                        <ChevronsUpDownIcon className="ml-auto size-4" />
                      </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="start" sideOffset={4}>
                      <DropdownMenuLabel className="text-xs text-muted-foreground">
                        Workspaces
                      </DropdownMenuLabel>
                      {workspaces.map((ws) => (
                        <DropdownMenuItem
                          key={ws.id}
                          onClick={() => onSelectWorkspace?.(ws.id)}
                        >
                          <div className="flex flex-col">
                            <span className="text-sm font-medium">{ws.name}</span>
                            <span className="text-xs text-muted-foreground">
                              {ws.subtitle}
                            </span>
                          </div>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <SidebarMenuButton
                    size="lg"
                    onClick={() => {
                      if (navItems[0]) onSelectNav(navItems[0].id)
                    }}
                  >
                    <div className="flex aspect-square size-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
                      <LayersIcon className="size-4" />
                    </div>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-heading font-semibold">
                        {brandTitle}
                      </span>
                      <span className="truncate text-xs text-muted-foreground">
                        {brandSubtitle}
                      </span>
                    </div>
                  </SidebarMenuButton>
                )}
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarHeader>

          <SidebarContent>
            {groupedNav.map(([groupName, items]) => (
              <SidebarGroup key={groupName}>
                <SidebarGroupLabel>{groupName}</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {items.map((item) => (
                      <SidebarMenuItem key={item.id}>
                        <SidebarMenuButton
                          isActive={activeNavId === item.id}
                          tooltip={item.label}
                          onClick={() => onSelectNav(item.id)}
                        >
                          <item.icon />
                          <span>{item.label}</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            ))}
          </SidebarContent>

          {user && (
            <SidebarFooter>
              <SidebarMenu>
                <SidebarMenuItem>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <SidebarMenuButton size="lg">
                        <Avatar className="size-8 rounded-md">
                          <AvatarFallback className="rounded-md text-xs font-medium">
                            {user.initials}
                          </AvatarFallback>
                        </Avatar>
                        <div className="grid flex-1 text-left text-sm leading-tight">
                          <span className="truncate font-medium">{user.name}</span>
                          <span className="truncate text-xs text-muted-foreground">
                            {user.email}
                          </span>
                        </div>
                        <ChevronsUpDownIcon className="ml-auto size-4" />
                      </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="end" sideOffset={4}>
                      {userMenuActions.length > 0 && (
                        <>
                          <DropdownMenuLabel className="text-xs text-muted-foreground">
                            Session
                          </DropdownMenuLabel>
                          {userMenuActions.map((act) => (
                            <DropdownMenuItem key={act.label} onClick={act.onClick}>
                              {act.label}
                            </DropdownMenuItem>
                          ))}
                          <DropdownMenuSeparator />
                        </>
                      )}
                      <DropdownMenuLabel className="text-xs text-muted-foreground">
                        Appearance
                      </DropdownMenuLabel>
                      <DropdownMenuItem onClick={onToggleTheme}>
                        Switch to {theme === "light" ? "Dark" : "Light"} Theme
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => setCommandOpen(true)}>
                        Open Command Palette
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarFooter>
          )}
          <SidebarRail />
        </Sidebar>

        <SidebarInset>
          <header className="flex h-14 shrink-0 items-center justify-between gap-4 border-b px-4 sm:px-6">
            <div className="flex items-center gap-2 min-w-0">
              <SidebarTrigger className="-ml-1 shrink-0" />
              <Separator orientation="vertical" className="mr-2 h-4" />
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem className="hidden sm:inline-flex">
                    <BreadcrumbLink
                      href="#home"
                      onClick={(e) => {
                        e.preventDefault()
                        if (navItems[0]) onSelectNav(navItems[0].id)
                      }}
                      className="whitespace-nowrap"
                    >
                      {brandTitle}
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator className="hidden sm:inline-flex" />
                  <BreadcrumbItem>
                    <BreadcrumbPage className="whitespace-nowrap">
                      {activeNav?.label ?? "Workspace"}
                    </BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {headerExtras}

              {showCommandButton && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCommandOpen(true)}
                  className="hidden md:inline-flex items-center gap-2 text-muted-foreground whitespace-nowrap shrink-0"
                >
                  <SearchIcon className="size-3.5" />
                  <span>Jump to</span>
                  <kbd className="pointer-events-none ml-1 inline-flex h-5 items-center rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
                    ⌘K
                  </kbd>
                </Button>
              )}

              {showThemeToggle && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      className="size-8 shrink-0"
                      onClick={onToggleTheme}
                      aria-label="Toggle color theme"
                    >
                      {theme === "light" ? (
                        <MoonIcon className="size-4" />
                      ) : (
                        <SunIcon className="size-4" />
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    Switch to {theme === "light" ? "Dark" : "Light"} Theme
                  </TooltipContent>
                </Tooltip>
              )}

              {primaryAction && (
                <Button
                  size="sm"
                  onClick={primaryAction.onClick}
                  className="whitespace-nowrap shrink-0"
                >
                  <PlusIcon className="size-4" />
                  <span>{primaryAction.label}</span>
                </Button>
              )}
            </div>
          </header>

          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1440px] w-full mx-auto">
            {children}
          </main>
        </SidebarInset>

        <CommandDialog open={commandOpen} onOpenChange={setCommandOpen}>
          <Command>
            <CommandInput placeholder="Search screens or actions..." />
            <CommandList>
              <CommandEmpty>No matching screen or action.</CommandEmpty>
              <CommandGroup heading="Screens">
                {navItems.map((item) => (
                  <CommandItem
                    key={item.id}
                    onSelect={() => {
                      onSelectNav(item.id)
                      setCommandOpen(false)
                    }}
                  >
                    <item.icon />
                    <span>{item.label}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
              {commandActions.length > 0 && (
                <>
                  <CommandSeparator />
                  <CommandGroup heading="Actions">
                    {commandActions.map((act) => (
                      <CommandItem
                        key={act.id}
                        onSelect={() => {
                          act.onSelect()
                          setCommandOpen(false)
                        }}
                      >
                        {act.icon && <act.icon />}
                        <span>{act.label}</span>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </>
              )}
            </CommandList>
          </Command>
        </CommandDialog>

        <Toaster theme={theme} />
      </SidebarProvider>
    </TooltipProvider>
  )
}
