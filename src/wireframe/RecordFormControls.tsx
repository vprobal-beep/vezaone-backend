import * as React from "react"
import { CalendarIcon, Trash2Icon } from "lucide-react"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import type { FieldConfig } from "@/src/wireframe/types"

function parseIsoDate(iso: string): Date | undefined {
  const [y, m, d] = iso.split("-").map(Number)
  if (!y || !m || !d) return undefined
  return new Date(y, m - 1, d)
}

function formatIsoDate(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, "0")
  const d = String(date.getDate()).padStart(2, "0")
  return `${y}-${m}-${d}`
}

export function SchemaFieldRenderer({
  field,
  value,
  onChange,
}: {
  field: FieldConfig
  value: unknown
  onChange: (nextValue: unknown) => void
}) {
  switch (field.type) {
    case "textarea":
      return (
        <div className="flex flex-col gap-2">
          <Label htmlFor={`field-${field.name}`}>{field.label}</Label>
          <Textarea
            id={`field-${field.name}`}
            rows={3}
            value={String(value ?? "")}
            placeholder={field.placeholder}
            required={field.required}
            onChange={(e) => onChange(e.target.value)}
          />
          {field.description && (
            <p className="text-xs text-muted-foreground">{field.description}</p>
          )}
        </div>
      )

    case "select":
      return (
        <div className="flex flex-col gap-2">
          <Label>{field.label}</Label>
          <Select
            value={String(value ?? "")}
            onValueChange={(next) => onChange(next)}
          >
            <SelectTrigger>
              <SelectValue placeholder={field.placeholder ?? "Select..."} />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )

    case "date": {
      const iso = String(value ?? formatIsoDate(new Date()))
      return (
        <div className="flex flex-col gap-2">
          <Label>{field.label}</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                type="button"
                variant="outline"
                className="justify-start text-left font-normal font-mono text-xs tabular-nums"
              >
                <CalendarIcon className="size-3.5 text-muted-foreground" />
                {iso}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={parseIsoDate(iso)}
                onSelect={(date) => {
                  if (date) onChange(formatIsoDate(date))
                }}
              />
            </PopoverContent>
          </Popover>
        </div>
      )
    }

    case "slider": {
      const numVal = Number(value ?? field.min ?? 0)
      return (
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <Label>{field.label}</Label>
            <span className="font-mono text-xs text-muted-foreground tabular-nums">
              {numVal}
              {field.unit ?? ""}
            </span>
          </div>
          <Slider
            value={[numVal]}
            min={field.min ?? 0}
            max={field.max ?? 100}
            step={field.step ?? 1}
            onValueChange={([v]) => onChange(v)}
          />
          {field.description && (
            <p className="text-xs text-muted-foreground">{field.description}</p>
          )}
        </div>
      )
    }

    case "switch":
      return (
        <div className="flex items-center justify-between gap-4">
          <div className="flex flex-col gap-0.5">
            <Label htmlFor={`field-${field.name}`} className="text-sm font-medium">
              {field.label}
            </Label>
            {field.description && (
              <span className="text-xs text-muted-foreground">
                {field.description}
              </span>
            )}
          </div>
          <Switch
            id={`field-${field.name}`}
            checked={Boolean(value)}
            onCheckedChange={(checked) => onChange(checked)}
          />
        </div>
      )

    case "radio":
      return (
        <div className="flex flex-col gap-2">
          <Label>{field.label}</Label>
          <RadioGroup
            value={String(value ?? "")}
            onValueChange={(next) => onChange(next)}
            className="grid grid-cols-1 gap-2 sm:grid-cols-2"
          >
            {field.options?.map((opt) => (
              <label
                key={opt.value}
                className="flex items-start gap-3 rounded-md border p-3 cursor-pointer"
              >
                <RadioGroupItem value={opt.value} className="mt-0.5" />
                <div className="flex flex-col">
                  <span className="text-sm font-medium">{opt.label}</span>
                  {opt.description && (
                    <span className="text-xs text-muted-foreground">
                      {opt.description}
                    </span>
                  )}
                </div>
              </label>
            ))}
          </RadioGroup>
        </div>
      )

    default:
      return (
        <div className="flex flex-col gap-2">
          <Label htmlFor={`field-${field.name}`}>{field.label}</Label>
          <Input
            id={`field-${field.name}`}
            value={String(value ?? "")}
            placeholder={field.placeholder}
            required={field.required}
            onChange={(e) => onChange(e.target.value)}
          />
          {field.description && (
            <p className="text-xs text-muted-foreground">{field.description}</p>
          )}
        </div>
      )
  }
}

interface RecordSheetProps<T extends Record<string, unknown>> {
  record: T | null
  title: string
  subtitle?: string
  fields: FieldConfig[]
  onClose: () => void
  onSave: (updated: T) => void
  onDelete?: (record: T) => void
}

export function RecordSheet<T extends Record<string, unknown>>({
  record,
  title,
  subtitle,
  fields,
  onClose,
  onSave,
  onDelete,
}: RecordSheetProps<T>) {
  const [draft, setDraft] = React.useState<T | null>(record)

  React.useEffect(() => {
    setDraft(record)
  }, [record])

  if (!draft) {
    return (
      <Sheet open={false} onOpenChange={(open) => !open && onClose()}>
        <SheetContent />
      </Sheet>
    )
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!draft) return
    onSave(draft)
  }

  return (
    <Sheet open={Boolean(record)} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="sm:max-w-lg flex flex-col p-0">
        <SheetHeader className="px-6 pt-6 pb-4 border-b">
          {subtitle && (
            <div className="text-xs font-mono text-muted-foreground tabular-nums">
              {subtitle}
            </div>
          )}
          <SheetTitle className="font-heading text-lg font-semibold">
            {title}
          </SheetTitle>
          <SheetDescription>
            Schema-driven slide-over inspector generated from field definitions.
          </SheetDescription>
        </SheetHeader>

        <ScrollArea className="flex-1 px-6 py-5">
          <form id="record-sheet-form" onSubmit={handleSubmit} className="flex flex-col gap-5">
            {fields.map((field) => (
              <SchemaFieldRenderer
                key={field.name}
                field={field}
                value={draft[field.name]}
                onChange={(nextVal) =>
                  setDraft((prev) =>
                    prev ? { ...prev, [field.name]: nextVal } : prev
                  )
                }
              />
            ))}
          </form>
        </ScrollArea>

        <SheetFooter className="px-6 py-4 border-t flex-row items-center justify-between sm:justify-between gap-2">
          {onDelete ? (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2Icon className="size-4" />
                  Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Confirm deletion</AlertDialogTitle>
                  <AlertDialogDescription>
                    This record will be removed from the active wireframe dataset.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => {
                      onDelete(draft)
                      onClose()
                    }}
                  >
                    Delete Record
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          ) : (
            <span />
          )}

          <div className="flex items-center gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" form="record-sheet-form">
              Save Changes
            </Button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

interface RecordDialogProps<T extends Record<string, unknown>> {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description: string
  fields: FieldConfig[]
  initialValues: T
  submitLabel?: string
  onSubmit: (values: T) => void
}

export function RecordDialog<T extends Record<string, unknown>>({
  open,
  onOpenChange,
  title,
  description,
  fields,
  initialValues,
  submitLabel = "Create Record",
  onSubmit,
}: RecordDialogProps<T>) {
  const [values, setValues] = React.useState<T>(initialValues)

  React.useEffect(() => {
    if (open) setValues(initialValues)
  }, [open, initialValues])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    onSubmit(values)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-heading">{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {fields.map((field) => (
            <SchemaFieldRenderer
              key={field.name}
              field={field}
              value={values[field.name]}
              onChange={(nextVal) =>
                setValues((prev) => ({ ...prev, [field.name]: nextVal }))
              }
            />
          ))}
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit">{submitLabel}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
