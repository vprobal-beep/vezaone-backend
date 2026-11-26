import type {
  ApiKeyRecord,
  AuditLogRecord,
  FieldConfig,
  JobRecord,
  MetricItem,
  PermissionCapability,
  RoleDefinition,
  SettingsSectionConfig,
  WebhookRecord,
} from "@/src/wireframe"

export interface SampleEntity extends Record<string, unknown> {
  id: string
  name: string
  environment: string
  owner: string
  status: "Healthy" | "Pending" | "Degraded"
  latencyMs: number
  dueDate: string
  notes: string
}

export const SAMPLE_METRICS: MetricItem[] = [
  {
    id: "m-services",
    label: "Configured Entities",
    value: 24,
    helper: "18 active · 6 staged",
  },
  {
    id: "m-throughput",
    label: "Schema Coverage",
    value: "92%",
    progress: 92,
    helper: "Target threshold: 90%",
  },
  {
    id: "m-jobs",
    label: "Queued Background Jobs",
    value: 7,
    helper: "2 retries scheduled",
  },
  {
    id: "m-keys",
    label: "Scoped API Keys",
    value: 5,
    helper: "All tokens within rotation window",
  },
]

export const SAMPLE_ENTITIES: SampleEntity[] = [
  {
    id: "ENT-101",
    name: "tenant-billing-ledger",
    environment: "Production",
    owner: "Elena Rostova",
    status: "Healthy",
    latencyMs: 42,
    dueDate: "2026-12-01",
    notes: "Primary idempotent billing record table with webhook reconciliation.",
  },
  {
    id: "ENT-102",
    name: "oauth-session-store",
    environment: "Production",
    owner: "Marcus Chen",
    status: "Pending",
    latencyMs: 88,
    dueDate: "2026-12-04",
    notes: "Token refresh rotation policy awaiting final security review.",
  },
  {
    id: "ENT-103",
    name: "webhook-dispatch-worker",
    environment: "Staging",
    owner: "Nadia Patel",
    status: "Degraded",
    latencyMs: 310,
    dueDate: "2026-12-02",
    notes: "Dead-letter retry backoff needs exponential cap validation.",
  },
  {
    id: "ENT-104",
    name: "audit-event-stream",
    environment: "Production",
    owner: "Tomasz Nowak",
    status: "Healthy",
    latencyMs: 29,
    dueDate: "2026-12-10",
    notes: "Append-only mutation feed indexed by actor and resource ID.",
  },
]

export const ENTITY_FIELDS: FieldConfig[] = [
  {
    name: "name",
    label: "Resource Identifier",
    type: "text",
    placeholder: "e.g., invoice-settlement-queue",
    required: true,
  },
  {
    name: "environment",
    label: "Environment",
    type: "select",
    options: [
      { label: "Production", value: "Production" },
      { label: "Staging", value: "Staging" },
      { label: "Development", value: "Development" },
    ],
  },
  {
    name: "status",
    label: "Operational Status",
    type: "select",
    options: [
      { label: "Healthy", value: "Healthy" },
      { label: "Pending", value: "Pending" },
      { label: "Degraded", value: "Degraded" },
    ],
  },
  {
    name: "owner",
    label: "Responsible Owner",
    type: "text",
    placeholder: "Owner name",
  },
  {
    name: "dueDate",
    label: "Review Date",
    type: "date",
  },
  {
    name: "latencyMs",
    label: "Target Latency Budget",
    type: "slider",
    min: 10,
    max: 500,
    step: 10,
    unit: " ms",
  },
  {
    name: "notes",
    label: "Backend Specification Notes",
    type: "textarea",
    placeholder: "Describe schema constraints, validation, or retry behavior...",
  },
]

export const SAMPLE_CAPABILITIES: PermissionCapability[] = [
  {
    id: "cap-read",
    area: "Resources",
    label: "Read Entities & Metrics",
    description: "Inspect records, schemas, and dashboard summaries",
  },
  {
    id: "cap-write",
    area: "Resources",
    label: "Create & Mutate Records",
    description: "Run create, edit, and bulk status transitions",
  },
  {
    id: "cap-keys",
    area: "Security",
    label: "Manage API Keys & Webhooks",
    description: "Generate, reveal, or revoke service credentials",
  },
  {
    id: "cap-rbac",
    area: "Governance",
    label: "Modify Role Policies",
    description: "Edit team permissions and workspace defaults",
  },
]

export const SAMPLE_ROLES: RoleDefinition[] = [
  {
    id: "role-admin",
    name: "Admin",
    description: "Full operational control",
    capabilities: {
      "cap-read": true,
      "cap-write": true,
      "cap-keys": true,
      "cap-rbac": true,
    },
  },
  {
    id: "role-eng",
    name: "Engineer",
    description: "Read/write records and keys",
    capabilities: {
      "cap-read": true,
      "cap-write": true,
      "cap-keys": true,
      "cap-rbac": false,
    },
  },
  {
    id: "role-auditor",
    name: "Auditor",
    description: "Read-only inspection",
    capabilities: {
      "cap-read": true,
      "cap-write": false,
      "cap-keys": false,
      "cap-rbac": false,
    },
  },
]

export const SAMPLE_API_KEYS: ApiKeyRecord[] = [
  {
    id: "key-1",
    name: "Primary Ingestion Worker",
    prefix: "mk_live_94a1",
    secretPreview: "mk_live_94a1_88f2c0b9e14a7d31",
    scope: "Read & Write",
    createdAt: "Nov 10, 2026",
    lastUsed: "4 mins ago",
  },
  {
    id: "key-2",
    name: "BI Analytics Read Replica",
    prefix: "mk_live_31c8",
    secretPreview: "mk_live_31c8_40a7d91e22bc6f09",
    scope: "Read-Only",
    createdAt: "Oct 22, 2026",
    lastUsed: "2 hours ago",
  },
]

export const SAMPLE_WEBHOOKS: WebhookRecord[] = [
  {
    id: "wh-1",
    url: "https://api.partner-ops.example/webhooks/events",
    events: ["record.created", "record.updated"],
    status: "Active",
    deliveryRate: "99.4%",
  },
  {
    id: "wh-2",
    url: "https://billing-sync.internal.example/hooks/settlement",
    events: ["invoice.settled", "job.failed"],
    status: "Failing",
    deliveryRate: "81.2%",
  },
]

export const SAMPLE_JOBS: JobRecord[] = [
  {
    id: "JOB-4901",
    queue: "webhooks.dispatch",
    payloadSummary: "POST /hooks/settlement (tenant #44)",
    status: "Failed",
    attempts: 3,
    durationMs: 420,
    updatedAt: "3 mins ago",
  },
  {
    id: "JOB-4902",
    queue: "ledger.reconcile",
    payloadSummary: "Daily settlement batch (142 rows)",
    status: "Succeeded",
    attempts: 1,
    durationMs: 185,
    updatedAt: "18 mins ago",
  },
  {
    id: "JOB-4903",
    queue: "search.reindex",
    payloadSummary: "Incremental resource index sync",
    status: "Running",
    attempts: 1,
    durationMs: 95,
    updatedAt: "Just now",
  },
]

export const SAMPLE_AUDIT_LOGS: AuditLogRecord[] = [
  {
    id: "aud-1",
    actor: "Elena Rostova",
    action: "updated policy matrix on",
    resource: "role-eng (Engineers)",
    sourceIp: "10.24.18.4",
    timestamp: "11 mins ago",
  },
  {
    id: "aud-2",
    actor: "Marcus Chen",
    action: "generated service key",
    resource: "Primary Ingestion Worker",
    sourceIp: "10.24.19.12",
    timestamp: "1 hour ago",
  },
  {
    id: "aud-3",
    actor: "Nadia Patel",
    action: "retried failed job",
    resource: "JOB-4901 (webhooks.dispatch)",
    sourceIp: "10.24.14.9",
    timestamp: "3 hours ago",
  },
]

export const SAMPLE_SETTINGS_SECTIONS: SettingsSectionConfig[] = [
  {
    id: "general",
    label: "General",
    title: "Service Defaults",
    description: "Core workspace identifiers and default routing settings.",
    fields: [
      {
        name: "serviceName",
        label: "Application Name",
        type: "text",
      },
      {
        name: "region",
        label: "Primary Region",
        type: "select",
        options: [
          { label: "us-west-1 (Oregon)", value: "us-west-1" },
          { label: "us-east-1 (Virginia)", value: "us-east-1" },
          { label: "eu-central-1 (Frankfurt)", value: "eu-central-1" },
        ],
      },
      {
        name: "notes",
        label: "Architecture Summary",
        type: "textarea",
      },
    ],
  },
  {
    id: "policies",
    label: "Policies",
    title: "Runtime & Retention Policies",
    description: "Toggle safety checks and configure retention windows.",
    fields: [
      {
        name: "strictIdempotency",
        label: "Enforce Idempotency Keys",
        type: "switch",
        description: "Require Idempotency-Key header on all mutating POST requests.",
      },
      {
        name: "auditRetentionDays",
        label: "Audit Log Retention",
        type: "slider",
        min: 30,
        max: 365,
        step: 15,
        unit: " days",
      },
      {
        name: "failoverMode",
        label: "Queue Failover Mode",
        type: "radio",
        options: [
          {
            label: "Automatic Exponential Backoff",
            value: "auto",
            description: "Retry failed jobs up to 5 times before dead-lettering.",
          },
          {
            label: "Manual Operator Retry",
            value: "manual",
            description: "Hold failed jobs in queue until manually retried.",
          },
        ],
      },
    ],
  },
]

export const SHADCN_PRIMITIVES_INVENTORY = [
  "Accordion",
  "AlertDialog",
  "Avatar",
  "Breadcrumb",
  "Button",
  "Calendar",
  "Card",
  "Checkbox",
  "Command",
  "Dialog",
  "DropdownMenu",
  "Input",
  "Label",
  "Popover",
  "Progress",
  "RadioGroup",
  "ScrollArea",
  "Select",
  "Separator",
  "Sheet",
  "Sidebar",
  "Skeleton",
  "Slider",
  "Sonner",
  "Switch",
  "Table",
  "Tabs",
  "Textarea",
  "Tooltip",
]

export const WIREFRAME_BLOCKS_INVENTORY = [
  {
    name: "WireframeShell",
    role: "App shell with collapsible sidebar, workspace switcher, breadcrumbs, command palette, theme toggle, and primary CTA.",
  },
  {
    name: "MetricStrip",
    role: "Responsive 2–4 column KPI card row with tabular numerals, progress bars, and skeleton loading support.",
  },
  {
    name: "ResourceTable",
    role: "Schema-driven CRUD table with search, status filtering, bulk selection, row actions, skeleton state, and empty state.",
  },
  {
    name: "RecordSheet & RecordDialog",
    role: "Auto-generated slide-over inspector drawer and creation modal driven by FieldConfig[] schemas.",
  },
  {
    name: "AuthScreen",
    role: "Tabbed sign-in, account creation, and password reset wireframe card.",
  },
  {
    name: "PermissionsMatrix",
    role: "Interactive RBAC roles-by-capabilities checkbox grid.",
  },
  {
    name: "ApiKeysWebhooksBlock",
    role: "Tabbed API credential reveal/copy/revoke flow and webhook endpoint controls.",
  },
  {
    name: "JobQueueTable & AuditLogList",
    role: "Worker queue status monitor with retry actions and filterable actor audit trail.",
  },
  {
    name: "WizardFlow & TabbedSettings",
    role: "Multi-step provisioning flow and schema-driven tabbed settings forms.",
  },
]
