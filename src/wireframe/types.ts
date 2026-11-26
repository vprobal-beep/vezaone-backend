import type * as React from "react"

export type WireframeTheme = "light" | "dark"
export type ViewStateMode = "populated" | "loading" | "empty"

export interface NavItemConfig {
  id: string
  label: string
  group?: string
  icon: React.ComponentType<{ className?: string }>
}

export interface WorkspaceOption {
  id: string
  name: string
  subtitle: string
}

export interface MetricItem {
  id: string
  label: string
  value: string | number
  helper?: string
  progress?: number
}

export type FieldType =
  | "text"
  | "textarea"
  | "select"
  | "date"
  | "slider"
  | "switch"
  | "radio"

export interface FieldOption {
  label: string
  value: string
  description?: string
}

export interface FieldConfig {
  name: string
  label: string
  type: FieldType
  placeholder?: string
  description?: string
  required?: boolean
  options?: FieldOption[]
  min?: number
  max?: number
  step?: number
  unit?: string
}

export interface ColumnConfig<T> {
  key: keyof T | string
  header: string
  align?: "left" | "right"
  className?: string
  render: (row: T) => React.ReactNode
}

export interface RowActionConfig<T> {
  label: string
  destructive?: boolean
  onClick: (row: T) => void
}

export interface ApiKeyRecord {
  id: string
  name: string
  prefix: string
  secretPreview: string
  scope: "Read-Only" | "Read & Write" | "Admin"
  createdAt: string
  lastUsed: string
}

export interface WebhookRecord {
  id: string
  url: string
  events: string[]
  status: "Active" | "Paused" | "Failing"
  deliveryRate: string
}

export interface AuditLogRecord {
  id: string
  actor: string
  action: string
  resource: string
  sourceIp: string
  timestamp: string
}

export interface JobRecord {
  id: string
  queue: string
  payloadSummary: string
  status: "Succeeded" | "Running" | "Queued" | "Failed"
  attempts: number
  durationMs: number
  updatedAt: string
}

export interface PermissionCapability {
  id: string
  area: string
  label: string
  description: string
}

export interface RoleDefinition {
  id: string
  name: string
  description: string
  capabilities: Record<string, boolean>
}

export interface WizardStepConfig {
  id: string
  title: string
  description: string
  content: React.ReactNode
}

export interface SettingsSectionConfig {
  id: string
  label: string
  title: string
  description: string
  fields: FieldConfig[]
}
