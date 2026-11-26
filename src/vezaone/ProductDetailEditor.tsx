import * as React from "react"
import {
  ArrowLeftIcon,
  ImageIcon,
  PlusIcon,
  SaveIcon,
  StarIcon,
  Trash2Icon,
  XIcon,
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
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import {
  CONFIG_COLOR_PRESETS,
  CONFIG_SIZE_PRESETS,
  CONFIG_SUSPENSION_PRESETS,
  formatLifecycleLabel,
  VEZAONE_CATEGORIES,
  VEZAONE_INDUSTRIES,
  VEZAONE_LIFECYCLE_OPTIONS,
  VEZAONE_MANUFACTURERS,
  VEZAONE_STANDARDS,
  type ProductDocumentLink,
  type ProductLifecycleStatus,
  type ProductPhoto,
  type SpecGroup,
  type StewardshipType,
  type VezaOneProduct,
} from "@/src/vezaone/catalog-data"

interface ProductDetailEditorProps {
  product: VezaOneProduct
  allProducts: VezaOneProduct[]
  onBack: () => void
  onSave: (updated: VezaOneProduct) => void
  onDelete: (id: string) => void
}

export function ProductDetailEditor({
  product,
  allProducts,
  onBack,
  onSave,
  onDelete,
}: ProductDetailEditorProps) {
  const [draft, setDraft] = React.useState<VezaOneProduct>(product)

  // Quick-add input states
  const [newFeature, setNewFeature] = React.useState("")
  const [newColor, setNewColor] = React.useState("")
  const [newSize, setNewSize] = React.useState("")
  const [newPartNumber, setNewPartNumber] = React.useState("")
  const [newPartName, setNewPartName] = React.useState("")
  const [newPartRole, setNewPartRole] = React.useState("")
  const [newPartCompat, setNewPartCompat] = React.useState("")
  const [compatProductId, setCompatProductId] = React.useState<string>("")
  const [newDocTitle, setNewDocTitle] = React.useState("")
  const [newDocType, setNewDocType] =
    React.useState<ProductDocumentLink["docType"]>("Technical Datasheet")
  const [newDocFormat, setNewDocFormat] =
    React.useState<ProductDocumentLink["format"]>("PDF")
  const [newPhotoTitle, setNewPhotoTitle] = React.useState("")
  const [newPhotoDims, setNewPhotoDims] = React.useState("2000 × 2000 px")
  const [newPhotoFormat, setNewPhotoFormat] =
    React.useState<ProductPhoto["format"]>("PNG")
  const [newPhotoUrl, setNewPhotoUrl] = React.useState("")
  const [newApplication, setNewApplication] = React.useState("")
  const [newCourse, setNewCourse] = React.useState("")

  React.useEffect(() => {
    setDraft(product)
  }, [product])

  const compatibleCandidates = React.useMemo(() => {
    const linkedModels = new Set(draft.compatibleProducts.map((c) => c.model))
    return allProducts.filter(
      (p) => p.id !== draft.id && !linkedModels.has(p.model)
    )
  }, [allProducts, draft.id, draft.compatibleProducts])

  function handleSave(e: React.FormEvent) {
    e.preventDefault()
    onSave({
      ...draft,
      updatedAt: "Just now",
    })
  }

  function updateSpecEntry(
    groupName: SpecGroup["group"],
    entryId: string,
    field: "label" | "value",
    val: string
  ) {
    setDraft((prev) => ({
      ...prev,
      specGroups: prev.specGroups.map((g) =>
        g.group === groupName
          ? {
              ...g,
              items: g.items.map((item) =>
                item.id === entryId ? { ...item, [field]: val } : item
              ),
            }
          : g
      ),
    }))
  }

  function addSpecEntry(groupName: SpecGroup["group"]) {
    setDraft((prev) => ({
      ...prev,
      specGroups: prev.specGroups.map((g) =>
        g.group === groupName
          ? {
              ...g,
              items: [
                ...g.items,
                {
                  id: `spec-${Date.now()}`,
                  label: "New attribute",
                  value: "",
                },
              ],
            }
          : g
      ),
    }))
  }

  function removeSpecEntry(groupName: SpecGroup["group"], entryId: string) {
    setDraft((prev) => ({
      ...prev,
      specGroups: prev.specGroups.map((g) =>
        g.group === groupName
          ? { ...g, items: g.items.filter((item) => item.id !== entryId) }
          : g
      ),
    }))
  }

  function toggleStandard(std: string) {
    setDraft((prev) => {
      const exists = prev.standards.includes(std)
      return {
        ...prev,
        standards: exists
          ? prev.standards.filter((s) => s !== std)
          : [...prev.standards, std],
      }
    })
  }

  function toggleIndustry(industry: string) {
    setDraft((prev) => {
      const exists = prev.industries.includes(industry)
      return {
        ...prev,
        industries: exists
          ? prev.industries.filter((i) => i !== industry)
          : [...prev.industries, industry],
      }
    })
  }

  function toggleColor(color: string) {
    setDraft((prev) => {
      const exists = prev.configOptions.colors.includes(color)
      return {
        ...prev,
        configOptions: {
          ...prev.configOptions,
          colors: exists
            ? prev.configOptions.colors.filter((c) => c !== color)
            : [...prev.configOptions.colors, color],
        },
      }
    })
  }

  function toggleSize(size: string) {
    setDraft((prev) => {
      const exists = prev.configOptions.sizes.includes(size)
      return {
        ...prev,
        configOptions: {
          ...prev.configOptions,
          sizes: exists
            ? prev.configOptions.sizes.filter((s) => s !== size)
            : [...prev.configOptions.sizes, size],
        },
      }
    })
  }

  function toggleSuspension(opt: string) {
    setDraft((prev) => {
      const exists = prev.configOptions.suspensionOptions.includes(opt)
      return {
        ...prev,
        configOptions: {
          ...prev.configOptions,
          suspensionOptions: exists
            ? prev.configOptions.suspensionOptions.filter((s) => s !== opt)
            : [...prev.configOptions.suspensionOptions, opt],
        },
      }
    })
  }

  function handleAddSparePart() {
    if (!newPartNumber.trim() || !newPartName.trim()) {
      toast.error("Enter both a Part Number and Part Name")
      return
    }
    setDraft((prev) => ({
      ...prev,
      spareParts: [
        ...prev.spareParts,
        {
          id: `sp-${Date.now()}`,
          partNumber: newPartNumber.trim(),
          name: newPartName.trim(),
          role: newPartRole.trim() || "Replacement part",
          compatibility: newPartCompat.trim() || draft.model,
          available: true,
        },
      ],
    }))
    setNewPartNumber("")
    setNewPartName("")
    setNewPartRole("")
    setNewPartCompat("")
    toast.success("Added spare part link")
  }

  function handleAddCompatibleProduct() {
    const chosen = allProducts.find((p) => p.id === compatProductId)
    if (!chosen) return
    setDraft((prev) => ({
      ...prev,
      compatibleProducts: [
        ...prev.compatibleProducts,
        {
          id: `cp-${Date.now()}`,
          manufacturer: chosen.manufacturer,
          model: chosen.model,
          name: chosen.name,
          category: chosen.category,
        },
      ],
    }))
    setCompatProductId("")
    toast.success(`Linked ${chosen.manufacturer} ${chosen.model}`)
  }

  function handleAddDocument() {
    if (!newDocTitle.trim()) {
      toast.error("Enter a document title")
      return
    }
    setDraft((prev) => ({
      ...prev,
      documents: [
        {
          id: `doc-${Date.now()}`,
          title: newDocTitle.trim(),
          docType: newDocType,
          format: newDocFormat,
          size: "1.0 MB",
          updatedAt: "Nov 2026",
        },
        ...prev.documents,
      ],
    }))
    setNewDocTitle("")
    toast.success("Attached document to product")
  }

  function handleAddPhoto() {
    if (!newPhotoTitle.trim()) {
      toast.error("Enter a photo title")
      return
    }
    setDraft((prev) => ({
      ...prev,
      photos: [
        ...prev.photos,
        {
          id: `ph-${Date.now()}`,
          title: newPhotoTitle.trim(),
          dimensions: newPhotoDims.trim() || "2000 × 2000 px",
          format: newPhotoFormat,
          url: newPhotoUrl.trim(),
          isPrimary: prev.photos.length === 0,
        },
      ],
    }))
    setNewPhotoTitle("")
    setNewPhotoUrl("")
    toast.success("Added photo to Product Photo Gallery")
  }

  return (
    <form onSubmit={handleSave} className="flex flex-col gap-6">
      {/* Top Drill-Down Header */}
      <div className="flex flex-col gap-4 border-b pb-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="w-fit -ml-2 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeftIcon className="size-4" />
            <span>Back to Catalog & Specs</span>
          </Button>
          <div>
            <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground font-mono tabular-nums">
              <span>{draft.id}</span>
              <span aria-hidden="true">·</span>
              <span>SKU: {draft.sku}</span>
              <span aria-hidden="true">·</span>
              <span>{draft.stewardship}</span>
              <span aria-hidden="true">·</span>
              <span>{formatLifecycleLabel(draft.lifecycle)}</span>
            </div>
            <h1 className="font-heading text-2xl font-semibold tracking-tight mt-1 text-balance">
              {draft.manufacturer} {draft.name} ({draft.model})
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="text-destructive hover:text-destructive whitespace-nowrap"
              >
                <Trash2Icon className="size-4" />
                <span>Delete</span>
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete {draft.name}?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will remove SKU {draft.sku} and its linked specifications from the catalog.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => onDelete(draft.id)}>
                  Delete Product
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <Button type="button" variant="outline" size="sm" onClick={onBack}>
            Discard
          </Button>

          <Button type="submit" size="sm" className="whitespace-nowrap">
            <SaveIcon className="size-4" />
            <span>Save Changes</span>
          </Button>
        </div>
      </div>

      {/* 5-Tab Frontend-Aligned Editor */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="flex-wrap h-auto">
          <TabsTrigger value="overview" className="whitespace-nowrap shrink-0">
            Overview & Identity
          </TabsTrigger>
          <TabsTrigger value="specs" className="whitespace-nowrap shrink-0">
            Specifications ({draft.specGroups.reduce((s, g) => s + g.items.length, 0)})
          </TabsTrigger>
          <TabsTrigger value="options" className="whitespace-nowrap shrink-0">
            Options & Configurator
          </TabsTrigger>
          <TabsTrigger value="interop" className="whitespace-nowrap shrink-0">
            Spare Parts & Compatibility ({draft.spareParts.length + draft.compatibleProducts.length})
          </TabsTrigger>
          <TabsTrigger value="docs" className="whitespace-nowrap shrink-0">
            Media, Docs & Training ({draft.photos.length + draft.documents.length})
          </TabsTrigger>
        </TabsList>

        {/* TAB 1: OVERVIEW & IDENTITY */}
        <TabsContent value="overview" className="mt-4 flex flex-col gap-6">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            <Card className="shadow-none lg:col-span-7">
              <CardHeader>
                <CardTitle className="font-heading text-base font-semibold">
                  Product Identification
                </CardTitle>
                <CardDescription>
                  Core fields displayed in the header and identification table on product-detail.html.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="flex flex-col gap-2">
                    <Label>Manufacturer</Label>
                    <Select
                      value={draft.manufacturer}
                      onValueChange={(v) =>
                        setDraft((prev) => ({ ...prev, manufacturer: v }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {VEZAONE_MANUFACTURERS.map((m) => (
                          <SelectItem key={m} value={m}>
                            {m}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex flex-col gap-2">
                    <Label htmlFor="det-name">Product Name</Label>
                    <Input
                      id="det-name"
                      value={draft.name}
                      onChange={(e) =>
                        setDraft((prev) => ({ ...prev, name: e.target.value }))
                      }
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="det-model">Model</Label>
                    <Input
                      id="det-model"
                      value={draft.model}
                      onChange={(e) =>
                        setDraft((prev) => ({ ...prev, model: e.target.value }))
                      }
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="det-sku">Part Number / SKU</Label>
                    <Input
                      id="det-sku"
                      value={draft.sku}
                      className="font-mono text-sm"
                      onChange={(e) =>
                        setDraft((prev) => ({ ...prev, sku: e.target.value }))
                      }
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label>Lifecycle (Internal)</Label>
                    <Select
                      value={draft.lifecycle}
                      onValueChange={(v) =>
                        setDraft((prev) => ({
                          ...prev,
                          lifecycle: v as ProductLifecycleStatus,
                        }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {VEZAONE_LIFECYCLE_OPTIONS.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="flex flex-col gap-2">
                    <Label>Category</Label>
                    <Select
                      value={draft.category}
                      onValueChange={(v) =>
                        setDraft((prev) => ({ ...prev, category: v }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {VEZAONE_CATEGORIES.map((cat) => (
                          <SelectItem key={cat} value={cat}>
                            {cat}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="det-type">Product Type</Label>
                    <Input
                      id="det-type"
                      value={draft.productType}
                      onChange={(e) =>
                        setDraft((prev) => ({
                          ...prev,
                          productType: e.target.value,
                        }))
                      }
                      required
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="det-summary">Product Overview Summary</Label>
                  <Textarea
                    id="det-summary"
                    rows={3}
                    value={draft.summary}
                    onChange={(e) =>
                      setDraft((prev) => ({ ...prev, summary: e.target.value }))
                    }
                  />
                </div>

                <Separator />

                <div className="flex flex-col gap-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <Label>Industries</Label>
                    <span className="text-xs text-muted-foreground tabular-nums">
                      {draft.industries.length} selected
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                    {VEZAONE_INDUSTRIES.map((ind) => (
                      <label
                        key={ind}
                        className="flex items-center gap-2 rounded-md border px-2.5 py-1.5 text-xs cursor-pointer"
                      >
                        <Checkbox
                          checked={draft.industries.includes(ind)}
                          onCheckedChange={() => toggleIndustry(ind)}
                        />
                        <span className="truncate">{ind}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex flex-col gap-6 lg:col-span-5">
              <Card className="shadow-none">
                <CardHeader>
                  <CardTitle className="font-heading text-base font-semibold">
                    Stewardship Ownership
                  </CardTitle>
                  <CardDescription>
                    Controls the OEM Managed vs. VezaOne Managed label shown on product cards and detail headers.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <RadioGroup
                    value={draft.stewardship}
                    onValueChange={(v) =>
                      setDraft((prev) => ({
                        ...prev,
                        stewardship: v as StewardshipType,
                      }))
                    }
                    className="flex flex-col gap-3"
                  >
                    <label className="flex items-start gap-3 rounded-md border p-3 cursor-pointer">
                      <RadioGroupItem value="OEM Managed" className="mt-0.5" />
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">OEM Managed</span>
                        <span className="text-xs text-muted-foreground">
                          Maintained directly by the verified manufacturer via the OEM Portal.
                        </span>
                      </div>
                    </label>
                    <label className="flex items-start gap-3 rounded-md border p-3 cursor-pointer">
                      <RadioGroupItem
                        value="VezaOne Managed"
                        className="mt-0.5"
                      />
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">
                          VezaOne Managed
                        </span>
                        <span className="text-xs text-muted-foreground">
                          Curated and updated by internal VezaOne catalog specialists.
                        </span>
                      </div>
                    </label>
                  </RadioGroup>
                </CardContent>
              </Card>

              <Card className="shadow-none">
                <CardHeader>
                  <CardTitle className="font-heading text-base font-semibold">
                    Key Features
                  </CardTitle>
                  <CardDescription>
                    Bullet highlights shown in the hero and Product Overview section.
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-3">
                  <div className="flex flex-col divide-y divide-border">
                    {draft.keyFeatures.map((feat, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between gap-2 py-2"
                      >
                        <span className="text-sm">{feat}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="size-7 shrink-0 text-muted-foreground hover:text-destructive"
                          onClick={() =>
                            setDraft((prev) => ({
                              ...prev,
                              keyFeatures: prev.keyFeatures.filter(
                                (_, i) => i !== idx
                              ),
                            }))
                          }
                          aria-label="Remove feature"
                        >
                          <XIcon className="size-3.5" />
                        </Button>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center gap-2 pt-1">
                    <Input
                      value={newFeature}
                      onChange={(e) => setNewFeature(e.target.value)}
                      placeholder="Add key feature bullet..."
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        if (!newFeature.trim()) return
                        setDraft((prev) => ({
                          ...prev,
                          keyFeatures: [
                            ...prev.keyFeatures,
                            newFeature.trim(),
                          ],
                        }))
                        setNewFeature("")
                      }}
                    >
                      Add
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Key Specifications highlight grid */}
          <Card className="shadow-none">
            <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0">
              <div>
                <CardTitle className="font-heading text-base font-semibold">
                  Key Specifications Summary
                </CardTitle>
                <CardDescription>
                  At-a-glance highlight attributes rendered in the Overview Key Specifications grid on product-detail.html.
                </CardDescription>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  setDraft((prev) => ({
                    ...prev,
                    keySpecs: [
                      ...prev.keySpecs,
                      {
                        id: `ks-${Date.now()}`,
                        label: "Attribute",
                        value: "",
                      },
                    ],
                  }))
                }
                className="whitespace-nowrap shrink-0"
              >
                <PlusIcon className="size-3.5" />
                Add Highlight
              </Button>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                {draft.keySpecs.map((ks) => (
                  <div
                    key={ks.id}
                    className="grid grid-cols-12 items-center gap-2"
                  >
                    <Input
                      value={ks.label}
                      onChange={(e) =>
                        setDraft((prev) => ({
                          ...prev,
                          keySpecs: prev.keySpecs.map((item) =>
                            item.id === ks.id
                              ? { ...item, label: e.target.value }
                              : item
                          ),
                        }))
                      }
                      className="col-span-5 text-xs"
                      aria-label="Key specification label"
                    />
                    <Input
                      value={ks.value}
                      onChange={(e) =>
                        setDraft((prev) => ({
                          ...prev,
                          keySpecs: prev.keySpecs.map((item) =>
                            item.id === ks.id
                              ? { ...item, value: e.target.value }
                              : item
                          ),
                        }))
                      }
                      className="col-span-6 text-xs"
                      aria-label="Key specification value"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="col-span-1 size-8 text-muted-foreground hover:text-destructive"
                      onClick={() =>
                        setDraft((prev) => ({
                          ...prev,
                          keySpecs: prev.keySpecs.filter(
                            (item) => item.id !== ks.id
                          ),
                        }))
                      }
                      aria-label="Remove key specification"
                    >
                      <XIcon className="size-3.5" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 2: SPECIFICATIONS */}
        <TabsContent value="specs" className="mt-4 flex flex-col gap-6">
          <Card className="shadow-none">
            <CardContent className="pt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <span className="font-heading text-sm font-semibold">
                  Applicable Compliance Standards
                </span>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Standards filters matched in catalog search and displayed on product-detail.html.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-4 shrink-0">
                {VEZAONE_STANDARDS.map((std) => (
                  <label
                    key={std}
                    className="flex items-center gap-1.5 text-xs font-mono cursor-pointer"
                  >
                    <Checkbox
                      checked={draft.standards.includes(std)}
                      onCheckedChange={() => toggleStandard(std)}
                    />
                    <span>{std}</span>
                  </label>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {draft.specGroups.map((group) => (
              <Card key={group.group} className="shadow-none">
                <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0">
                  <div>
                    <CardTitle className="font-heading text-base font-semibold">
                      {group.group}
                    </CardTitle>
                    <CardDescription className="tabular-nums">
                      {group.items.length} specification attributes
                    </CardDescription>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => addSpecEntry(group.group)}
                    className="whitespace-nowrap shrink-0"
                  >
                    <PlusIcon className="size-3.5" />
                    Add Row
                  </Button>
                </CardHeader>
                <CardContent className="flex flex-col gap-2.5">
                  {group.items.map((item) => (
                    <div
                      key={item.id}
                      className="grid grid-cols-12 items-center gap-2"
                    >
                      <Input
                        value={item.label}
                        onChange={(e) =>
                          updateSpecEntry(
                            group.group,
                            item.id,
                            "label",
                            e.target.value
                          )
                        }
                        className="col-span-5 text-xs"
                        aria-label="Specification attribute"
                      />
                      <Input
                        value={item.value}
                        onChange={(e) =>
                          updateSpecEntry(
                            group.group,
                            item.id,
                            "value",
                            e.target.value
                          )
                        }
                        className="col-span-6 text-xs"
                        aria-label="Specification value"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="col-span-1 size-8 text-muted-foreground hover:text-destructive"
                        onClick={() => removeSpecEntry(group.group, item.id)}
                        aria-label="Remove specification row"
                      >
                        <XIcon className="size-3.5" />
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* TAB 3: OPTIONS & CONFIGURATOR */}
        <TabsContent value="options" className="mt-4 flex flex-col gap-6">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="flex flex-col gap-6">
              <Card className="shadow-none">
                <CardHeader>
                  <CardTitle className="font-heading text-base font-semibold">
                    Available Colours
                  </CardTitle>
                  <CardDescription>
                    Shell or finish options displayed on the product page and Saved Configurations.
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                  <div className="grid grid-cols-2 gap-2.5">
                    {Array.from(
                      new Set([
                        ...CONFIG_COLOR_PRESETS,
                        ...draft.configOptions.colors,
                      ])
                    ).map((color) => (
                      <label
                        key={color}
                        className="flex items-center gap-2 rounded-md border px-3 py-2 text-sm cursor-pointer"
                      >
                        <Checkbox
                          checked={draft.configOptions.colors.includes(color)}
                          onCheckedChange={() => toggleColor(color)}
                        />
                        <span className="truncate">{color}</span>
                      </label>
                    ))}
                  </div>
                  <div className="flex items-center gap-2">
                    <Input
                      value={newColor}
                      onChange={(e) => setNewColor(e.target.value)}
                      placeholder="Add custom colour option..."
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        if (!newColor.trim()) return
                        if (
                          !draft.configOptions.colors.includes(newColor.trim())
                        ) {
                          toggleColor(newColor.trim())
                        }
                        setNewColor("")
                      }}
                    >
                      Add
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-none">
                <CardHeader>
                  <CardTitle className="font-heading text-base font-semibold">
                    Available Sizes
                  </CardTitle>
                  <CardDescription>
                    Size variants shown in the product intro selector on product-detail.html.
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                  <div className="grid grid-cols-3 gap-2.5">
                    {Array.from(
                      new Set([
                        ...CONFIG_SIZE_PRESETS,
                        ...draft.configOptions.sizes,
                      ])
                    ).map((size) => (
                      <label
                        key={size}
                        className="flex items-center gap-2 rounded-md border px-3 py-2 text-sm cursor-pointer"
                      >
                        <Checkbox
                          checked={draft.configOptions.sizes.includes(size)}
                          onCheckedChange={() => toggleSize(size)}
                        />
                        <span className="truncate">{size}</span>
                      </label>
                    ))}
                  </div>
                  <div className="flex items-center gap-2">
                    <Input
                      value={newSize}
                      onChange={(e) => setNewSize(e.target.value)}
                      placeholder="Add custom size (e.g. XXL or 53–63 cm)..."
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        if (!newSize.trim()) return
                        if (
                          !draft.configOptions.sizes.includes(newSize.trim())
                        ) {
                          toggleSize(newSize.trim())
                        }
                        setNewSize("")
                      }}
                    >
                      Add
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="shadow-none h-fit">
              <CardHeader>
                <CardTitle className="font-heading text-base font-semibold">
                  Product Options & Mounting Rules
                </CardTitle>
                <CardDescription>
                  Controls the Product Options specification card and buyer configurator rules.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-5">
                <div className="flex flex-col gap-2.5">
                  <Label>Suspension / Fit Options</Label>
                  <div className="grid grid-cols-2 gap-2.5">
                    {CONFIG_SUSPENSION_PRESETS.map((opt) => (
                      <label
                        key={opt}
                        className="flex items-center gap-2 rounded-md border px-3 py-2 text-sm cursor-pointer"
                      >
                        <Checkbox
                          checked={draft.configOptions.suspensionOptions.includes(
                            opt
                          )}
                          onCheckedChange={() => toggleSuspension(opt)}
                        />
                        <span>{opt}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <Separator />

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="cfg-slot">Accessory Slots</Label>
                    <Input
                      id="cfg-slot"
                      value={draft.configOptions.accessorySlot}
                      onChange={(e) =>
                        setDraft((prev) => ({
                          ...prev,
                          configOptions: {
                            ...prev.configOptions,
                            accessorySlot: e.target.value,
                          },
                        }))
                      }
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <Label>Reflective Markings</Label>
                    <Select
                      value={draft.configOptions.reflectiveMarkings}
                      onValueChange={(v) =>
                        setDraft((prev) => ({
                          ...prev,
                          configOptions: {
                            ...prev.configOptions,
                            reflectiveMarkings: v as
                              | "Optional"
                              | "Included"
                              | "No",
                          },
                        }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Optional">Optional</SelectItem>
                        <SelectItem value="Included">Included</SelectItem>
                        <SelectItem value="No">No</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Separator />

                <div className="flex items-center justify-between gap-4">
                  <div className="flex flex-col">
                    <Label htmlFor="cfg-faceshield">
                      Face Shield Compatible
                    </Label>
                    <span className="text-xs text-muted-foreground">
                      Supports integrated or slot-mounted face visors
                    </span>
                  </div>
                  <Switch
                    id="cfg-faceshield"
                    checked={draft.configOptions.faceShieldCompatible}
                    onCheckedChange={(checked) =>
                      setDraft((prev) => ({
                        ...prev,
                        configOptions: {
                          ...prev.configOptions,
                          faceShieldCompatible: checked,
                        },
                      }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between gap-4">
                  <div className="flex flex-col">
                    <Label htmlFor="cfg-earmuff">Earmuff Compatible</Label>
                    <span className="text-xs text-muted-foreground">
                      Supports helmet-mounted hearing protection
                    </span>
                  </div>
                  <Switch
                    id="cfg-earmuff"
                    checked={draft.configOptions.earmuffCompatible}
                    onCheckedChange={(checked) =>
                      setDraft((prev) => ({
                        ...prev,
                        configOptions: {
                          ...prev.configOptions,
                          earmuffCompatible: checked,
                        },
                      }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between gap-4">
                  <div className="flex flex-col">
                    <Label htmlFor="cfg-ratchet">Ratchet Adjustment</Label>
                    <span className="text-xs text-muted-foreground">
                      Expose ratchet option in product configurator
                    </span>
                  </div>
                  <Switch
                    id="cfg-ratchet"
                    checked={draft.configOptions.ratchetIncluded}
                    onCheckedChange={(checked) =>
                      setDraft((prev) => ({
                        ...prev,
                        configOptions: {
                          ...prev.configOptions,
                          ratchetIncluded: checked,
                        },
                      }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between gap-4">
                  <div className="flex flex-col">
                    <Label htmlFor="cfg-branding">Custom Branding Available</Label>
                    <span className="text-xs text-muted-foreground">
                      Indicates OEM logo / reflective decal customization
                    </span>
                  </div>
                  <Switch
                    id="cfg-branding"
                    checked={draft.configOptions.customBranding}
                    onCheckedChange={(checked) =>
                      setDraft((prev) => ({
                        ...prev,
                        configOptions: {
                          ...prev.configOptions,
                          customBranding: checked,
                        },
                      }))
                    }
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* TAB 4: SPARE PARTS & COMPATIBILITY */}
        <TabsContent value="interop" className="mt-4 flex flex-col gap-6">
          <Card className="shadow-none">
            <CardHeader>
              <CardTitle className="font-heading text-base font-semibold">
                Spare Parts & Replacement Components
              </CardTitle>
              <CardDescription>
                Powers the Spare Parts & Accessories sections on product-detail.html.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-5">
                <Input
                  value={newPartNumber}
                  onChange={(e) => setNewPartNumber(e.target.value)}
                  placeholder="Part # (e.g. X5-SUS-6PT)"
                  className="font-mono text-xs"
                />
                <Input
                  value={newPartName}
                  onChange={(e) => setNewPartName(e.target.value)}
                  placeholder="Part name"
                />
                <Input
                  value={newPartRole}
                  onChange={(e) => setNewPartRole(e.target.value)}
                  placeholder="Role (e.g. Replacement)"
                />
                <Input
                  value={newPartCompat}
                  onChange={(e) => setNewPartCompat(e.target.value)}
                  placeholder="Compatible models"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleAddSparePart}
                >
                  <PlusIcon className="size-4" />
                  Add Part
                </Button>
              </div>

              <div className="rounded-md border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-32">Part #</TableHead>
                      <TableHead>Component Name</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Compatible With</TableHead>
                      <TableHead className="w-24 text-center">Available</TableHead>
                      <TableHead className="w-12 text-right">Remove</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {draft.spareParts.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={6}
                          className="text-center text-xs text-muted-foreground py-8"
                        >
                          No spare parts linked yet. Add a part number above.
                        </TableCell>
                      </TableRow>
                    ) : (
                      draft.spareParts.map((part) => (
                        <TableRow key={part.id}>
                          <TableCell className="font-mono text-xs tabular-nums">
                            {part.partNumber}
                          </TableCell>
                          <TableCell className="text-sm font-medium">
                            {part.name}
                          </TableCell>
                          <TableCell className="text-xs text-muted-foreground">
                            {part.role}
                          </TableCell>
                          <TableCell className="text-xs text-muted-foreground">
                            {part.compatibility}
                          </TableCell>
                          <TableCell className="text-center">
                            <div className="flex justify-center">
                              <Switch
                                checked={part.available}
                                onCheckedChange={(checked) =>
                                  setDraft((prev) => ({
                                    ...prev,
                                    spareParts: prev.spareParts.map((sp) =>
                                      sp.id === part.id
                                        ? { ...sp, available: checked }
                                        : sp
                                    ),
                                  }))
                                }
                              />
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="size-8 text-muted-foreground hover:text-destructive"
                              onClick={() =>
                                setDraft((prev) => ({
                                  ...prev,
                                  spareParts: prev.spareParts.filter(
                                    (sp) => sp.id !== part.id
                                  ),
                                }))
                              }
                            >
                              <XIcon className="size-3.5" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-none">
            <CardHeader>
              <CardTitle className="font-heading text-base font-semibold">
                Compatible Interoperable Products
              </CardTitle>
              <CardDescription>
                Link cross-category PPE (eye, face, hearing protection) verified to mount or work with this product.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                <Select
                  value={compatProductId}
                  onValueChange={setCompatProductId}
                >
                  <SelectTrigger className="flex-1 max-w-md">
                    <SelectValue placeholder="Select catalog product to link..." />
                  </SelectTrigger>
                  <SelectContent>
                    {compatibleCandidates.map((cand) => (
                      <SelectItem key={cand.id} value={cand.id}>
                        {cand.manufacturer} {cand.name} ({cand.model})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  type="button"
                  variant="outline"
                  disabled={!compatProductId}
                  onClick={handleAddCompatibleProduct}
                >
                  <PlusIcon className="size-4" />
                  Link Compatible Product
                </Button>
              </div>

              <div className="rounded-md border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Manufacturer</TableHead>
                      <TableHead>Model</TableHead>
                      <TableHead>Product Name</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead className="w-12 text-right">Unlink</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {draft.compatibleProducts.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={5}
                          className="text-center text-xs text-muted-foreground py-8"
                        >
                          No compatible products linked yet.
                        </TableCell>
                      </TableRow>
                    ) : (
                      draft.compatibleProducts.map((cp) => (
                        <TableRow key={cp.id}>
                          <TableCell className="text-sm font-medium">
                            {cp.manufacturer}
                          </TableCell>
                          <TableCell className="font-mono text-xs text-muted-foreground">
                            {cp.model}
                          </TableCell>
                          <TableCell className="text-sm">{cp.name}</TableCell>
                          <TableCell className="text-xs text-muted-foreground">
                            {cp.category}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="size-8 text-muted-foreground hover:text-destructive"
                              onClick={() =>
                                setDraft((prev) => ({
                                  ...prev,
                                  compatibleProducts:
                                    prev.compatibleProducts.filter(
                                      (item) => item.id !== cp.id
                                    ),
                                }))
                              }
                            >
                              <XIcon className="size-3.5" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 5: MEDIA, DOCS & TRAINING */}
        <TabsContent value="docs" className="mt-4 flex flex-col gap-6">
          <Card className="shadow-none">
            <CardHeader>
              <CardTitle className="font-heading text-base font-semibold">
                Product Photo Gallery ({draft.photos.length})
              </CardTitle>
              <CardDescription>
                Product imagery and packshots rendered in the gallery and downloadable from product-detail.html.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-12">
                <Input
                  value={newPhotoTitle}
                  onChange={(e) => setNewPhotoTitle(e.target.value)}
                  placeholder="Photo title (e.g. Helmet — side profile)"
                  className="sm:col-span-4"
                />
                <Input
                  value={newPhotoDims}
                  onChange={(e) => setNewPhotoDims(e.target.value)}
                  placeholder="Dimensions (e.g. 2000 × 1500 px)"
                  className="sm:col-span-3 font-mono text-xs"
                />
                <Select
                  value={newPhotoFormat}
                  onValueChange={(v) =>
                    setNewPhotoFormat(v as ProductPhoto["format"])
                  }
                >
                  <SelectTrigger className="sm:col-span-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PNG">PNG</SelectItem>
                    <SelectItem value="JPG">JPG</SelectItem>
                    <SelectItem value="WEBP">WEBP</SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  value={newPhotoUrl}
                  onChange={(e) => setNewPhotoUrl(e.target.value)}
                  placeholder="Asset URL (optional)"
                  className="sm:col-span-2 text-xs"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleAddPhoto}
                  className="sm:col-span-1 whitespace-nowrap"
                >
                  <PlusIcon className="size-4" />
                  <span className="sm:hidden">Add Photo</span>
                </Button>
              </div>

              {draft.photos.length === 0 ? (
                <div className="rounded-md border border-dashed py-8 text-center text-xs text-muted-foreground">
                  No gallery photos added yet. Add product imagery above.
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {draft.photos.map((photo) => (
                    <div
                      key={photo.id}
                      className="flex flex-col justify-between rounded-md border overflow-hidden"
                    >
                      <div className="relative flex h-36 items-center justify-center bg-muted/40 border-b">
                        {photo.url ? (
                          <img
                            src={photo.url}
                            alt={photo.title}
                            className="h-full w-full object-contain p-2"
                            loading="lazy"
                          />
                        ) : (
                          <ImageIcon className="size-8 text-muted-foreground/50" />
                        )}
                      </div>
                      <div className="flex flex-col gap-2 p-3">
                        <div>
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-sm font-medium truncate">
                              {photo.title}
                            </span>
                            {photo.isPrimary && (
                              <span className="text-[11px] font-medium text-foreground shrink-0">
                                Primary
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground font-mono tabular-nums mt-0.5">
                            {photo.dimensions} · {photo.format}
                          </p>
                        </div>
                        <div className="flex items-center justify-between gap-2 pt-1">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="h-7 text-xs"
                            disabled={photo.isPrimary}
                            onClick={() =>
                              setDraft((prev) => ({
                                ...prev,
                                photos: prev.photos.map((p) => ({
                                  ...p,
                                  isPrimary: p.id === photo.id,
                                })),
                              }))
                            }
                          >
                            <StarIcon className="size-3" />
                            {photo.isPrimary ? "Primary" : "Set Primary"}
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="size-7 text-muted-foreground hover:text-destructive"
                            onClick={() =>
                              setDraft((prev) => ({
                                ...prev,
                                photos: prev.photos.filter(
                                  (p) => p.id !== photo.id
                                ),
                              }))
                            }
                            aria-label={`Remove ${photo.title}`}
                          >
                            <XIcon className="size-3.5" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="shadow-none">
            <CardHeader>
              <CardTitle className="font-heading text-base font-semibold">
                Technical Documents & Certifications
              </CardTitle>
              <CardDescription>
                Files downloadable from the Documents tab on product-detail.html.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-12">
                <Input
                  value={newDocTitle}
                  onChange={(e) => setNewDocTitle(e.target.value)}
                  placeholder="Document title (e.g. ANSI Z89.1 Certificate)"
                  className="sm:col-span-5"
                />
                <Select
                  value={newDocType}
                  onValueChange={(v) =>
                    setNewDocType(v as ProductDocumentLink["docType"])
                  }
                >
                  <SelectTrigger className="sm:col-span-3">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Technical Datasheet">
                      Technical Datasheet
                    </SelectItem>
                    <SelectItem value="User Manual">User Manual</SelectItem>
                    <SelectItem value="Certification">Certification</SelectItem>
                    <SelectItem value="Product Brochure">
                      Product Brochure
                    </SelectItem>
                    <SelectItem value="Technical Drawing">
                      Technical Drawing
                    </SelectItem>
                    <SelectItem value="Care & Maintenance Guide">
                      Care & Maintenance Guide
                    </SelectItem>
                    <SelectItem value="Declaration of Conformity">
                      Declaration of Conformity
                    </SelectItem>
                  </SelectContent>
                </Select>
                <Select
                  value={newDocFormat}
                  onValueChange={(v) =>
                    setNewDocFormat(v as ProductDocumentLink["format"])
                  }
                >
                  <SelectTrigger className="sm:col-span-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PDF">PDF</SelectItem>
                    <SelectItem value="DOCX">DOCX</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleAddDocument}
                  className="sm:col-span-2"
                >
                  <PlusIcon className="size-4" />
                  Attach
                </Button>
              </div>

              <div className="rounded-md border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Document Title</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Format</TableHead>
                      <TableHead className="text-right">Size</TableHead>
                      <TableHead className="text-right">Updated</TableHead>
                      <TableHead className="w-12 text-right">Remove</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {draft.documents.map((doc) => (
                      <TableRow key={doc.id}>
                        <TableCell className="text-sm font-medium">
                          {doc.title}
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground">
                          {doc.docType}
                        </TableCell>
                        <TableCell className="font-mono text-xs">
                          {doc.format}
                        </TableCell>
                        <TableCell className="text-right font-mono text-xs tabular-nums text-muted-foreground">
                          {doc.size}
                        </TableCell>
                        <TableCell className="text-right text-xs tabular-nums text-muted-foreground">
                          {doc.updatedAt}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="size-8 text-muted-foreground hover:text-destructive"
                            onClick={() =>
                              setDraft((prev) => ({
                                ...prev,
                                documents: prev.documents.filter(
                                  (d) => d.id !== doc.id
                                ),
                              }))
                            }
                          >
                            <XIcon className="size-3.5" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <Card className="shadow-none">
              <CardHeader>
                <CardTitle className="font-heading text-base font-semibold">
                  Applications & Work Environments
                </CardTitle>
                <CardDescription>
                  Workplace scenarios displayed in the Applications tab.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-3">
                <div className="flex flex-col divide-y divide-border">
                  {draft.applications.map((app, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between gap-2 py-2"
                    >
                      <span className="text-sm">{app}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="size-7 text-muted-foreground hover:text-destructive"
                        onClick={() =>
                          setDraft((prev) => ({
                            ...prev,
                            applications: prev.applications.filter(
                              (_, i) => i !== idx
                            ),
                          }))
                        }
                      >
                        <XIcon className="size-3.5" />
                      </Button>
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <Input
                    value={newApplication}
                    onChange={(e) => setNewApplication(e.target.value)}
                    placeholder="Add workplace application..."
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      if (!newApplication.trim()) return
                      setDraft((prev) => ({
                        ...prev,
                        applications: [
                          ...prev.applications,
                          newApplication.trim(),
                        ],
                      }))
                      setNewApplication("")
                    }}
                  >
                    Add
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-none">
              <CardHeader>
                <CardTitle className="font-heading text-base font-semibold">
                  Linked Safety Courses
                </CardTitle>
                <CardDescription>
                  Training modules displayed in the Training Materials tab.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-3">
                <div className="flex flex-col divide-y divide-border">
                  {draft.trainingCourses.map((course, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between gap-2 py-2"
                    >
                      <span className="text-sm">{course}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="size-7 text-muted-foreground hover:text-destructive"
                        onClick={() =>
                          setDraft((prev) => ({
                            ...prev,
                            trainingCourses: prev.trainingCourses.filter(
                              (_, i) => i !== idx
                            ),
                          }))
                        }
                      >
                        <XIcon className="size-3.5" />
                      </Button>
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <Input
                    value={newCourse}
                    onChange={(e) => setNewCourse(e.target.value)}
                    placeholder="Link training course title..."
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      if (!newCourse.trim()) return
                      setDraft((prev) => ({
                        ...prev,
                        trainingCourses: [
                          ...prev.trainingCourses,
                          newCourse.trim(),
                        ],
                      }))
                      setNewCourse("")
                    }}
                  >
                    Add
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </form>
  )
}
