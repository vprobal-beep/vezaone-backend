import * as React from "react"
import {
  MoreHorizontalIcon,
  PlusIcon,
  SearchIcon,
  SlidersHorizontalIcon,
  XIcon,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type {
  ColumnConfig,
  FieldOption,
  RowActionConfig,
  ViewStateMode,
} from "@/src/wireframe/types"

interface ResourceTableProps<T extends { id: string }> {
  rows: T[]
  columns: ColumnConfig<T>[]
  searchPlaceholder?: string
  filterLabel?: string
  filterOptions?: FieldOption[]
  getFilterValue?: (row: T) => string
  getSearchText?: (row: T) => string
  rowActions?: RowActionConfig<T>[]
  onRowClick?: (row: T) => void
  onCreateClick?: () => void
  createLabel?: string
  stateMode?: ViewStateMode
  selectable?: boolean
  bulkActionLabel?: string
  onBulkAction?: (selectedIds: string[]) => void
  emptyTitle?: string
  emptyDescription?: string
  toolbarExtras?: React.ReactNode
  hasExtraFilters?: boolean
  onResetExtraFilters?: () => void
}

export function ResourceTable<T extends { id: string }>({
  rows,
  columns,
  searchPlaceholder = "Search records...",
  filterLabel = "Status",
  filterOptions,
  getFilterValue,
  getSearchText,
  rowActions,
  onRowClick,
  onCreateClick,
  createLabel = "New Record",
  stateMode = "populated",
  selectable = true,
  bulkActionLabel = "Apply Bulk Action",
  onBulkAction,
  emptyTitle = "No records match the current filter",
  emptyDescription = "Reset active filters or create a new record to populate this resource table.",
  toolbarExtras,
  hasExtraFilters = false,
  onResetExtraFilters,
}: ResourceTableProps<T>) {
  const [search, setSearch] = React.useState("")
  const [filterVal, setFilterVal] = React.useState("all")
  const [selectedIds, setSelectedIds] = React.useState<string[]>([])

  const effectiveRows = React.useMemo(() => {
    if (stateMode === "empty") return []
    return rows.filter((row) => {
      const q = search.trim().toLowerCase()
      const searchMatch =
        !q ||
        (getSearchText
          ? getSearchText(row).toLowerCase().includes(q)
          : JSON.stringify(row).toLowerCase().includes(q))
      const filterMatch =
        filterVal === "all" ||
        !getFilterValue ||
        getFilterValue(row) === filterVal
      return searchMatch && filterMatch
    })
  }, [rows, stateMode, search, filterVal, getSearchText, getFilterValue])

  const allSelected =
    effectiveRows.length > 0 &&
    effectiveRows.every((r) => selectedIds.includes(r.id))

  function toggleAll(checked: boolean) {
    setSelectedIds(checked ? effectiveRows.map((r) => r.id) : [])
  }

  function toggleOne(id: string, checked: boolean) {
    setSelectedIds((prev) =>
      checked ? [...prev, id] : prev.filter((item) => item !== id)
    )
  }

  function resetFilters() {
    setSearch("")
    setFilterVal("all")
    onResetExtraFilters?.()
  }

  const anyFilterActive = Boolean(search) || filterVal !== "all" || hasExtraFilters

  return (
    <div className="flex flex-col gap-3">
      {/* Toolbar */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-1 flex-col gap-2 sm:flex-row sm:items-center">
          <div className="relative flex-1 max-w-sm">
            <SearchIcon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={searchPlaceholder}
              className="pl-9"
              aria-label={searchPlaceholder}
            />
          </div>

          {filterOptions && filterOptions.length > 0 && (
            <Select value={filterVal} onValueChange={setFilterVal}>
              <SelectTrigger className="w-full sm:w-44">
                <SlidersHorizontalIcon className="size-3.5 text-muted-foreground" />
                <SelectValue placeholder={filterLabel} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All {filterLabel}</SelectItem>
                {filterOptions.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          {toolbarExtras}

          {anyFilterActive && (
            <Button
              variant="ghost"
              size="sm"
              onClick={resetFilters}
              className="whitespace-nowrap shrink-0"
            >
              <XIcon className="size-3.5" />
              Reset
            </Button>
          )}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {selectable && selectedIds.length > 0 && onBulkAction && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                onBulkAction(selectedIds)
                setSelectedIds([])
              }}
              className="whitespace-nowrap shrink-0"
            >
              {bulkActionLabel} ({selectedIds.length})
            </Button>
          )}

          {onCreateClick && (
            <Button
              size="sm"
              onClick={onCreateClick}
              className="whitespace-nowrap shrink-0"
            >
              <PlusIcon className="size-4" />
              {createLabel}
            </Button>
          )}
        </div>
      </div>

      {/* Table Surface */}
      <Card className="shadow-none overflow-hidden">
        {stateMode === "loading" ? (
          <div className="p-4 flex flex-col gap-3">
            {Array.from({ length: 4 }).map((_, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between gap-4 py-2 border-b last:border-b-0 border-border"
              >
                <div className="flex items-center gap-3 flex-1">
                  <Skeleton className="size-4 rounded-sm" />
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-56" />
                </div>
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-20" />
              </div>
            ))}
          </div>
        ) : effectiveRows.length === 0 ? (
          <CardContent className="flex flex-col items-center justify-center py-14 text-center">
            <p className="font-heading text-base font-medium">{emptyTitle}</p>
            <p className="text-sm text-muted-foreground mt-1 max-w-md">
              {emptyDescription}
            </p>
            <div className="flex items-center gap-3 mt-5">
              {anyFilterActive && (
                <Button variant="outline" onClick={resetFilters}>
                  Reset Filters
                </Button>
              )}
              {onCreateClick && (
                <Button onClick={onCreateClick}>{createLabel}</Button>
              )}
            </div>
          </CardContent>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                {selectable && (
                  <TableHead className="w-10">
                    <Checkbox
                      checked={allSelected}
                      onCheckedChange={(checked) => toggleAll(Boolean(checked))}
                      aria-label="Select all rows"
                    />
                  </TableHead>
                )}
                {columns.map((col) => (
                  <TableHead
                    key={String(col.key)}
                    className={`${col.align === "right" ? "text-right" : ""} ${col.className ?? ""}`}
                  >
                    {col.header}
                  </TableHead>
                ))}
                {rowActions && rowActions.length > 0 && (
                  <TableHead className="w-12 text-right">Actions</TableHead>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {effectiveRows.map((row) => {
                const isSelected = selectedIds.includes(row.id)
                return (
                  <TableRow
                    key={row.id}
                    data-state={isSelected ? "selected" : undefined}
                    className={onRowClick ? "cursor-pointer" : undefined}
                    onClick={() => onRowClick?.(row)}
                  >
                    {selectable && (
                      <TableCell onClick={(e) => e.stopPropagation()}>
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={(checked) =>
                            toggleOne(row.id, Boolean(checked))
                          }
                          aria-label={`Select row ${row.id}`}
                        />
                      </TableCell>
                    )}
                    {columns.map((col) => (
                      <TableCell
                        key={String(col.key)}
                        className={`${col.align === "right" ? "text-right" : ""} ${col.className ?? ""}`}
                      >
                        {col.render(row)}
                      </TableCell>
                    ))}
                    {rowActions && rowActions.length > 0 && (
                      <TableCell
                        className="text-right"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="size-8"
                              aria-label={`Row actions for ${row.id}`}
                            >
                              <MoreHorizontalIcon className="size-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            {rowActions.map((act, idx) => (
                              <React.Fragment key={act.label}>
                                {act.destructive && idx > 0 && (
                                  <DropdownMenuSeparator />
                                )}
                                <DropdownMenuItem
                                  className={
                                    act.destructive
                                      ? "text-destructive focus:text-destructive"
                                      : undefined
                                  }
                                  onClick={() => act.onClick(row)}
                                >
                                  {act.label}
                                </DropdownMenuItem>
                              </React.Fragment>
                            ))}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    )}
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        )}
      </Card>
    </div>
  )
}
