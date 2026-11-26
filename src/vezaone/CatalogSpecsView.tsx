import * as React from "react"
import { PlusIcon } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  MetricStrip,
  RecordDialog,
  ResourceTable,
  type ColumnConfig,
  type MetricItem,
} from "@/src/wireframe"
import { ProductDetailEditor } from "@/src/vezaone/ProductDetailEditor"
import {
  createDefaultProductDetail,
  formatLifecycleLabel,
  INITIAL_VEZAONE_PRODUCTS,
  NEW_PRODUCT_FIELDS,
  VEZAONE_CATEGORIES,
  VEZAONE_LIFECYCLE_OPTIONS,
  VEZAONE_STANDARDS,
  type VezaOneProduct,
} from "@/src/vezaone/catalog-data"

type StewardshipTab = "all" | "oem" | "vezaone"

export function CatalogSpecsView() {
  const [products, setProducts] = React.useState<VezaOneProduct[]>(
    INITIAL_VEZAONE_PRODUCTS
  )
  const [editingProductId, setEditingProductId] = React.useState<string | null>(
    null
  )
  const [activeTab, setActiveTab] = React.useState<StewardshipTab>("all")
  const [categoryFilter, setCategoryFilter] = React.useState<string>("all")
  const [standardFilter, setStandardFilter] = React.useState<string>("all")
  const [createOpen, setCreateOpen] = React.useState(false)

  const editingProduct = React.useMemo(
    () => products.find((p) => p.id === editingProductId) ?? null,
    [products, editingProductId]
  )

  const totalCount = products.length
  const oemCount = products.filter((p) => p.stewardship === "OEM Managed").length
  const vezaCount = products.filter(
    (p) => p.stewardship === "VezaOne Managed"
  ).length
  const activeCount = products.filter((p) => p.lifecycle === "Active").length

  const metrics: MetricItem[] = [
    {
      id: "cat-total",
      label: "Listed Products",
      value: totalCount,
      helper: `${activeCount} active · ${totalCount - activeCount} workflow or retired`,
    },
    {
      id: "cat-oem",
      label: "OEM Managed",
      value: oemCount,
      helper: `${totalCount > 0 ? Math.round((oemCount / totalCount) * 100) : 0}% of catalog`,
    },
    {
      id: "cat-veza",
      label: "VezaOne Managed",
      value: vezaCount,
      helper: `${totalCount > 0 ? Math.round((vezaCount / totalCount) * 100) : 0}% of catalog`,
    },
  ]

  const filteredProducts = React.useMemo(() => {
    return products.filter((p) => {
      if (activeTab === "oem" && p.stewardship !== "OEM Managed") return false
      if (activeTab === "vezaone" && p.stewardship !== "VezaOne Managed")
        return false
      if (categoryFilter !== "all" && p.category !== categoryFilter)
        return false
      if (standardFilter !== "all" && !p.standards.includes(standardFilter))
        return false
      return true
    })
  }, [products, activeTab, categoryFilter, standardFilter])

  const columns: ColumnConfig<VezaOneProduct>[] = [
    {
      key: "sku",
      header: "SKU / Part #",
      className: "w-32 font-mono text-xs text-muted-foreground tabular-nums",
      render: (row) => row.sku,
    },
    {
      key: "name",
      header: "Product & Model",
      render: (row) => (
        <div className="flex flex-col">
          <span className="text-sm font-medium text-foreground">
            {row.manufacturer} · {row.name}
          </span>
          <span className="text-xs text-muted-foreground">
            Model: {row.model} · Updated {row.updatedAt}
          </span>
        </div>
      ),
    },
    {
      key: "category",
      header: "Category & Type",
      render: (row) => (
        <div className="flex flex-col">
          <span className="text-sm text-foreground">{row.category}</span>
          <span className="text-xs text-muted-foreground">
            {row.productType}
          </span>
        </div>
      ),
    },
    {
      key: "standards",
      header: "Standards",
      className: "font-mono text-xs text-muted-foreground",
      render: (row) =>
        row.standards.length > 0 ? row.standards.join(" · ") : "—",
    },
    {
      key: "stewardship",
      header: "Stewardship",
      className: "text-xs font-medium whitespace-nowrap",
      render: (row) => row.stewardship,
    },
    {
      key: "lifecycle",
      header: "Lifecycle (Internal)",
      className: "text-xs text-muted-foreground whitespace-nowrap",
      render: (row) => formatLifecycleLabel(row.lifecycle),
    },
    {
      key: "viewDetails",
      header: "",
      align: "right",
      className: "w-32",
      render: (row) => (
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="whitespace-nowrap"
          onClick={(e) => {
            e.stopPropagation()
            setEditingProductId(row.id)
          }}
        >
          View Details
        </Button>
      ),
    },
  ]

  if (editingProduct) {
    return (
      <ProductDetailEditor
        product={editingProduct}
        allProducts={products}
        onBack={() => setEditingProductId(null)}
        onSave={(updated) => {
          setProducts((prev) =>
            prev.map((p) => (p.id === updated.id ? updated : p))
          )
          setEditingProductId(null)
          toast.success(`Saved changes to ${updated.manufacturer} ${updated.name}`)
        }}
        onDelete={(id) => {
          const target = products.find((p) => p.id === id)
          setProducts((prev) => prev.filter((p) => p.id !== id))
          setEditingProductId(null)
          if (target) {
            toast.success(`Removed ${target.name} (${target.sku})`)
          }
        }}
      />
    )
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Section Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-heading text-2xl font-semibold tracking-tight text-balance">
            Catalog & Specs
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Master product and SKU registry powering search results, product detail pages, comparisons, and configurators.
          </p>
        </div>

        <Button
          onClick={() => setCreateOpen(true)}
          className="whitespace-nowrap shrink-0"
        >
          <PlusIcon className="size-4" />
          New Product
        </Button>
      </div>

      {/* Catalog Summary Strip */}
      <MetricStrip metrics={metrics} />

      {/* Stewardship Tabs */}
      <Tabs
        value={activeTab}
        onValueChange={(v) => setActiveTab(v as StewardshipTab)}
        className="w-full"
      >
        <TabsList className="flex-wrap h-auto">
          <TabsTrigger value="all" className="whitespace-nowrap shrink-0">
            All Products ({totalCount})
          </TabsTrigger>
          <TabsTrigger value="oem" className="whitespace-nowrap shrink-0">
            OEM Managed ({oemCount})
          </TabsTrigger>
          <TabsTrigger value="vezaone" className="whitespace-nowrap shrink-0">
            VezaOne Managed ({vezaCount})
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Master Product Table */}
      <ResourceTable
        rows={filteredProducts}
        columns={columns}
        searchPlaceholder="Search product, model, SKU, or manufacturer..."
        filterLabel="Lifecycle (Internal)"
        filterOptions={VEZAONE_LIFECYCLE_OPTIONS}
        getFilterValue={(row) => row.lifecycle}
        getSearchText={(row) =>
          `${row.sku} ${row.manufacturer} ${row.name} ${row.model} ${row.category} ${row.productType}`
        }
        toolbarExtras={
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {VEZAONE_CATEGORIES.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={standardFilter} onValueChange={setStandardFilter}>
              <SelectTrigger className="w-full sm:w-36">
                <SelectValue placeholder="All Standards" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Standards</SelectItem>
                {VEZAONE_STANDARDS.map((std) => (
                  <SelectItem key={std} value={std}>
                    {std}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        }
        hasExtraFilters={categoryFilter !== "all" || standardFilter !== "all"}
        onResetExtraFilters={() => {
          setCategoryFilter("all")
          setStandardFilter("all")
        }}
        onRowClick={(row) => setEditingProductId(row.id)}
        bulkActionLabel="Delete Selected"
        onBulkAction={(ids) => {
          setProducts((prev) => prev.filter((p) => !ids.includes(p.id)))
          toast.success(`Removed ${ids.length} product(s) from catalog`)
        }}
        emptyTitle="No products match the selected filters"
        emptyDescription="Clear the category, standard, or stewardship filter—or add a new product to the VezaOne catalog."
      />

      {/* Create New Product Dialog */}
      <RecordDialog<VezaOneProduct>
        open={createOpen}
        onOpenChange={setCreateOpen}
        title="New Catalog Product"
        description="Register a product, model, and SKU for specification curation."
        fields={NEW_PRODUCT_FIELDS}
        initialValues={{
          id: "",
          sku: "",
          manufacturer: "3M",
          name: "",
          model: "",
          category: "Head Protection",
          productType: "Safety Helmet",
          standards: ["ANSI"],
          stewardship: "VezaOne Managed",
          lifecycle: "Draft",
          updatedAt: "Just now",
          ...createDefaultProductDetail("Head Protection", "Safety Helmet", [
            "ANSI",
          ]),
        }}
        submitLabel="Add to Catalog"
        onSubmit={(values) => {
          const nextId = `PRD-${String(products.length + 1).padStart(3, "0")}`
          const defaults = createDefaultProductDetail(
            values.category,
            values.productType,
            ["ANSI"]
          )
          const created: VezaOneProduct = {
            ...values,
            ...defaults,
            id: nextId,
            standards: ["ANSI"],
            updatedAt: "Just now",
          }
          setProducts((prev) => [created, ...prev])
          setActiveTab("all")
          setEditingProductId(nextId)
          toast.success(
            `Added ${created.manufacturer} ${created.name} (${created.sku})`
          )
        }}
      />
    </div>
  )
}
