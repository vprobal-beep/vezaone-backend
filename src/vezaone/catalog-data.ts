import type { FieldConfig } from "@/src/wireframe"

export type StewardshipType = "OEM Managed" | "VezaOne Managed"
export type ProductLifecycleStatus =
  | "Draft"
  | "In Progress"
  | "In Review"
  | "Approved"
  | "Rejected"
  | "Active"
  | "Deprecated"
  | "Obsolete"

export const VEZAONE_LIFECYCLE_OPTIONS: {
  value: ProductLifecycleStatus
  label: string
}[] = [
  { value: "Draft", label: "Draft" },
  { value: "In Progress", label: "In Progress" },
  { value: "In Review", label: "In Review" },
  { value: "Approved", label: "Approved" },
  { value: "Rejected", label: "Rejected" },
  { value: "Active", label: "Active" },
  { value: "Deprecated", label: "Deprecated" },
  { value: "Obsolete", label: "Obsolete" },
]

export function formatLifecycleLabel(status: ProductLifecycleStatus): string {
  return (
    VEZAONE_LIFECYCLE_OPTIONS.find((opt) => opt.value === status)?.label ??
    status
  )
}

export interface SpecEntry {
  id: string
  label: string
  value: string
}

export interface SpecGroup {
  group:
    | "Materials & Construction"
    | "Dimensions & Fit"
    | "Protection & Performance"
    | "Standards & Compliance"
  items: SpecEntry[]
}

export interface ConfiguratorOptions {
  colors: string[]
  sizes: string[]
  suspensionOptions: string[]
  ratchetIncluded: boolean
  customBranding: boolean
  faceShieldCompatible: boolean
  earmuffCompatible: boolean
  reflectiveMarkings: "Optional" | "Included" | "No"
  accessorySlot: string
}

export interface SparePartLink {
  id: string
  partNumber: string
  name: string
  role: string
  compatibility: string
  available: boolean
}

export interface CompatibleProductLink {
  id: string
  manufacturer: string
  model: string
  name: string
  category: string
}

export interface ProductDocumentLink {
  id: string
  title: string
  docType:
    | "Technical Datasheet"
    | "User Manual"
    | "Certification"
    | "Product Brochure"
    | "Technical Drawing"
    | "Care & Maintenance Guide"
    | "Declaration of Conformity"
  format: "PDF" | "DOCX"
  size: string
  updatedAt: string
}

export interface ProductPhoto {
  id: string
  title: string
  dimensions: string
  format: "PNG" | "JPG" | "WEBP"
  url: string
  isPrimary?: boolean
}

export interface VezaOneProduct extends Record<string, unknown> {
  id: string
  sku: string
  manufacturer: string
  name: string
  model: string
  category: string
  productType: string
  industries: string[]
  standards: string[]
  stewardship: StewardshipType
  lifecycle: ProductLifecycleStatus
  updatedAt: string
  summary: string
  keyFeatures: string[]
  keySpecs: SpecEntry[]
  specGroups: SpecGroup[]
  configOptions: ConfiguratorOptions
  spareParts: SparePartLink[]
  compatibleProducts: CompatibleProductLink[]
  documents: ProductDocumentLink[]
  photos: ProductPhoto[]
  applications: string[]
  trainingCourses: string[]
}

export const VEZAONE_CATEGORIES = [
  "Head Protection",
  "Eye Protection",
  "Hearing Protection",
  "Respiratory Protection",
  "Hand Protection",
  "Foot Protection",
  "Fall Protection",
  "Safety Clothing",
  "Fire Safety",
  "Emergency Equipment",
  "Safety Accessories",
  "Tools & Maintenance",
  "Workplace Safety",
  "Facility Safety",
  "First Aid & Medical",
  "Spill Control & Environment",
  "Industrial Hygiene",
  "Other Products",
] as const

export const VEZAONE_INDUSTRIES = [
  "Construction",
  "Manufacturing",
  "Infrastructure",
  "Utilities",
  "Oil & Gas",
  "Electrical & Power",
  "Mining",
  "Logistics",
  "Telecommunication",
  "Chemical",
  "Marine",
  "Agriculture",
  "Emergency",
] as const

export const VEZAONE_MANUFACTURERS = [
  "3M",
  "Honeywell",
  "MSA",
  "uvex",
  "Ansell",
  "BW Technologies",
  "JSP",
  "Scott Safety",
] as const

export const VEZAONE_STANDARDS = ["ANSI", "EN", "NIOSH", "CSA"] as const

export const CONFIG_COLOR_PRESETS = [
  "White",
  "Yellow",
  "Blue",
  "Red",
  "Black",
  "Green",
  "High-visibility Green",
  "Orange",
] as const

export const CONFIG_SIZE_PRESETS = [
  "S",
  "M",
  "L",
  "XL",
  "One Size",
  "Universal",
] as const

export const CONFIG_SUSPENSION_PRESETS = [
  "4-point",
  "6-point",
  "Ratchet",
  "Pinlock",
] as const

export function createDefaultProductDetail(
  category: string,
  productType: string,
  standards: string[]
): Pick<
  VezaOneProduct,
  | "industries"
  | "summary"
  | "keyFeatures"
  | "keySpecs"
  | "specGroups"
  | "configOptions"
  | "spareParts"
  | "compatibleProducts"
  | "documents"
  | "photos"
  | "applications"
  | "trainingCourses"
> {
  return {
    industries: ["Manufacturing", "Construction"],
    summary: `Industrial ${productType.toLowerCase()} engineered for workplace compliance and durability in ${category.toLowerCase()}.`,
    keyFeatures: [
      `Engineered for ${category.toLowerCase()} applications`,
      standards.length > 0
        ? `${standards.join(" / ")} certified protection`
        : "Manufacturer-tested industrial construction",
      "Ergonomic fit for extended shift wear",
    ],
    keySpecs: [
      { id: "ks-1", label: "Product Type", value: productType },
      { id: "ks-2", label: "Material", value: "High-impact polymer" },
      {
        id: "ks-3",
        label: "Standards",
        value: standards.length > 0 ? standards.join(", ") : "Pending",
      },
      { id: "ks-4", label: "Size", value: "Standard / Adjustable" },
    ],
    specGroups: [
      {
        group: "Materials & Construction",
        items: [
          { id: "mc-1", label: "Primary material", value: "High-impact polymer" },
          { id: "mc-2", label: "Adjustment system", value: "Ergonomic fit" },
        ],
      },
      {
        group: "Dimensions & Fit",
        items: [
          { id: "df-1", label: "Available sizes", value: "Standard / Adjustable" },
        ],
      },
      {
        group: "Protection & Performance",
        items: [
          { id: "pp-1", label: "Operating temperature", value: "−20°C to +50°C" },
        ],
      },
      {
        group: "Standards & Compliance",
        items: [
          {
            id: "sc-1",
            label: "Primary standard",
            value: standards.length > 0 ? standards.join(", ") : "Pending entry",
          },
          { id: "sc-2", label: "Quality management", value: "ISO 9001" },
        ],
      },
    ],
    configOptions: {
      colors: ["Black", "Yellow", "White"],
      sizes: ["M", "L"],
      suspensionOptions: ["4-point", "Ratchet"],
      ratchetIncluded: true,
      customBranding: false,
      faceShieldCompatible: false,
      earmuffCompatible: false,
      reflectiveMarkings: "Optional",
      accessorySlot: "Standard mount",
    },
    spareParts: [],
    compatibleProducts: [],
    documents: [
      {
        id: "doc-def-1",
        title: "Technical Datasheet",
        docType: "Technical Datasheet",
        format: "PDF",
        size: "1.1 MB",
        updatedAt: "Nov 2026",
      },
    ],
    photos: [],
    applications: [
      "Manufacturing and production facilities",
      "Site inspections and supervision",
    ],
    trainingCourses: [`${category} Essentials`],
  }
}

export const INITIAL_VEZAONE_PRODUCTS: VezaOneProduct[] = [
  {
    id: "PRD-001",
    sku: "70071684532",
    manufacturer: "3M",
    name: "SecureFit™ Safety Helmet",
    model: "X5000",
    category: "Head Protection",
    productType: "Vented Helmet",
    industries: ["Construction", "Manufacturing", "Infrastructure", "Utilities"],
    standards: ["ANSI", "EN"],
    stewardship: "OEM Managed",
    lifecycle: "Active",
    updatedAt: "12 Sep 2026",
    summary:
      "The 3M SecureFit X5000 safety helmet features a ventilated shell, a 4-point suspension with Pressure Diffusion Technology, and a patented chin strap selector to switch between EN 12492 and EN 397 standards.",
    keyFeatures: [
      "Vented design for improved airflow",
      "4-point suspension with Pressure Diffusion Technology",
      "Multiple size options",
      "ANSI / EN certified",
    ],
    keySpecs: [
      { id: "x5-ks1", label: "Product Type", value: "Safety Helmet" },
      { id: "x5-ks2", label: "Model", value: "X5000" },
      { id: "x5-ks3", label: "Material", value: "ABS" },
      { id: "x5-ks4", label: "Suspension", value: "4-point" },
      { id: "x5-ks5", label: "Size", value: "Adjustable (53–63 cm)" },
      { id: "x5-ks6", label: "Weight", value: "370 g" },
      { id: "x5-ks7", label: "Ventilation", value: "Yes" },
      { id: "x5-ks8", label: "Standards", value: "ANSI Z89.1, EN 397" },
      { id: "x5-ks9", label: "Country of Origin", value: "USA" },
    ],
    specGroups: [
      {
        group: "Materials & Construction",
        items: [
          { id: "x5-m1", label: "Shell material", value: "High-impact ABS" },
          { id: "x5-m2", label: "Suspension material", value: "Polyester webbing" },
          { id: "x5-m3", label: "Sweatband material", value: "Moisture-wicking foam" },
          { id: "x5-m4", label: "Suspension points", value: "4-point" },
          { id: "x5-m5", label: "Adjustment system", value: "Ratchet" },
          { id: "x5-m6", label: "Chin strap attachment", value: "4-point compatible" },
        ],
      },
      {
        group: "Dimensions & Fit",
        items: [
          { id: "x5-d1", label: "Weight", value: "370 g" },
          { id: "x5-d2", label: "Head size range", value: "53–63 cm" },
          { id: "x5-d3", label: "Available sizes", value: "S, M, L, XL" },
          { id: "x5-d4", label: "Shell profile", value: "Low profile" },
          { id: "x5-d5", label: "Peak style", value: "Short peak" },
          { id: "x5-d6", label: "Fit adjustment", value: "One-handed ratchet" },
        ],
      },
      {
        group: "Protection & Performance",
        items: [
          { id: "x5-p1", label: "Impact protection", value: "Type I" },
          { id: "x5-p2", label: "Electrical class", value: "Class C" },
          { id: "x5-p3", label: "Ventilation", value: "Integrated vents" },
          { id: "x5-p4", label: "Lateral deformation", value: "LD compliant" },
          { id: "x5-p5", label: "Molten metal resistance", value: "MM compliant" },
          { id: "x5-p6", label: "Operating temperature", value: "−30°C to +50°C" },
        ],
      },
      {
        group: "Standards & Compliance",
        items: [
          { id: "x5-s1", label: "ANSI standard", value: "ANSI Z89.1-2014" },
          { id: "x5-s2", label: "European standard", value: "EN 397:2012+A1:2012" },
          { id: "x5-s3", label: "CE marking", value: "Yes" },
          { id: "x5-s4", label: "Quality management", value: "ISO 9001" },
          { id: "x5-s5", label: "Country of origin", value: "United States" },
          { id: "x5-s6", label: "Declaration", value: "EU conformity available" },
        ],
      },
    ],
    configOptions: {
      colors: [
        "White",
        "Yellow",
        "Blue",
        "Red",
        "Black",
        "Green",
        "High-visibility Green",
        "Orange",
      ],
      sizes: ["S", "M", "L", "XL"],
      suspensionOptions: ["4-point", "6-point", "Ratchet"],
      ratchetIncluded: true,
      customBranding: true,
      faceShieldCompatible: true,
      earmuffCompatible: true,
      reflectiveMarkings: "Optional",
      accessorySlot: "Universal 30 mm",
    },
    spareParts: [
      {
        id: "sp-1",
        partNumber: "X5-SUS-6PT",
        name: "6-Point Suspension Assembly",
        role: "Replacement suspension",
        compatibility: "X5000, X5500",
        available: true,
      },
      {
        id: "sp-2",
        partNumber: "X5-CHIN-01",
        name: "Adjustable Chin Strap",
        role: "Retention accessory",
        compatibility: "X5000 Series",
        available: true,
      },
      {
        id: "sp-3",
        partNumber: "X5-SWBD01",
        name: "Replacement Sweatband",
        role: "Comfort component",
        compatibility: "X5000, X5500",
        available: true,
      },
      {
        id: "sp-4",
        partNumber: "X5-VENT-04",
        name: "Ventilation Plug Set",
        role: "Shell component",
        compatibility: "X5000 Vented",
        available: true,
      },
      {
        id: "sp-5",
        partNumber: "X5-VIS-CLR",
        name: "Clear Face Visor",
        role: "Face protection",
        compatibility: "X5000 with visor mount",
        available: true,
      },
      {
        id: "sp-6",
        partNumber: "P3EG-PK",
        name: "Earmuff Adapter Kit",
        role: "Hearing protection",
        compatibility: "Select 3M PELTOR headsets",
        available: true,
      },
    ],
    compatibleProducts: [
      {
        id: "cp-1",
        manufacturer: "3M",
        model: "V9A",
        name: "Integrated Safety Glasses, Amber",
        category: "Eye Protection",
      },
      {
        id: "cp-2",
        manufacturer: "3M",
        model: "V9G",
        name: "Integrated Safety Glasses, Grey",
        category: "Eye Protection",
      },
      {
        id: "cp-3",
        manufacturer: "3M",
        model: "X5P3E",
        name: "PELTOR X5 Helmet-Mounted Earmuffs",
        category: "Hearing Protection",
      },
      {
        id: "cp-4",
        manufacturer: "3M",
        model: "X2P3E",
        name: "PELTOR X2 Helmet-Mounted Earmuffs",
        category: "Hearing Protection",
      },
    ],
    documents: [
      {
        id: "doc-1",
        title: "Technical Datasheet",
        docType: "Technical Datasheet",
        format: "PDF",
        size: "1.2 MB",
        updatedAt: "12 Sep 2026",
      },
      {
        id: "doc-2",
        title: "User Manual",
        docType: "User Manual",
        format: "DOCX",
        size: "3.8 MB",
        updatedAt: "08 Sep 2026",
      },
      {
        id: "doc-3",
        title: "ANSI Z89.1 Certification",
        docType: "Certification",
        format: "PDF",
        size: "640 KB",
        updatedAt: "04 Sep 2026",
      },
      {
        id: "doc-4",
        title: "EN 397 Certification",
        docType: "Certification",
        format: "PDF",
        size: "720 KB",
        updatedAt: "04 Sep 2026",
      },
      {
        id: "doc-5",
        title: "Product Brochure",
        docType: "Product Brochure",
        format: "PDF",
        size: "2.4 MB",
        updatedAt: "28 Aug 2026",
      },
      {
        id: "doc-6",
        title: "Technical Drawing",
        docType: "Technical Drawing",
        format: "DOCX",
        size: "980 KB",
        updatedAt: "20 Aug 2026",
      },
      {
        id: "doc-7",
        title: "Care and Maintenance Guide",
        docType: "Care & Maintenance Guide",
        format: "PDF",
        size: "850 KB",
        updatedAt: "14 Aug 2026",
      },
      {
        id: "doc-8",
        title: "Declaration of Conformity",
        docType: "Declaration of Conformity",
        format: "PDF",
        size: "520 KB",
        updatedAt: "02 Aug 2026",
      },
    ],
    photos: [
      {
        id: "ph-1",
        title: "Helmet — front profile",
        dimensions: "2000 × 2000 px",
        format: "PNG",
        url: "https://vezaone-demo.pages.dev/products/helmet-front.png",
        isPrimary: true,
      },
      {
        id: "ph-2",
        title: "Helmet — side profile",
        dimensions: "2000 × 1500 px",
        format: "PNG",
        url: "https://vezaone-demo.pages.dev/products/helmet-side.png",
      },
      {
        id: "ph-3",
        title: "Available colour range",
        dimensions: "1920 × 2215 px",
        format: "JPG",
        url: "https://vezaone-demo.pages.dev/products/helmet-colours.jpg",
      },
      {
        id: "ph-4",
        title: "Bulk storage view",
        dimensions: "3743 × 2277 px",
        format: "JPG",
        url: "https://vezaone-demo.pages.dev/products/helmet-storage.jpg",
      },
      {
        id: "ph-5",
        title: "PPE equipment set",
        dimensions: "1024 × 1024 px",
        format: "JPG",
        url: "https://vezaone-demo.pages.dev/products/helmet-ppe-set.jpg",
      },
      {
        id: "ph-6",
        title: "Helmet in use",
        dimensions: "3000 × 2001 px",
        format: "JPG",
        url: "https://vezaone-demo.pages.dev/products/helmet-in-use.jpg",
      },
    ],
    applications: [
      "Construction and infrastructure projects",
      "Manufacturing and production facilities",
      "Site inspections and supervision",
      "Equipment installation and maintenance",
      "Plant and facility operations",
      "Contractor and visitor site access",
    ],
    trainingCourses: [
      "Choosing the Right Safety Helmet",
      "Helmet Fitting & Adjustment",
      "Helmet Inspection & Care",
      "Helmet Accessories & Compatibility",
    ],
  },
  {
    id: "PRD-002",
    sku: "HON-A79R-01",
    manufacturer: "Honeywell",
    name: "North Safety Helmet",
    model: "A79R",
    category: "Head Protection",
    productType: "Safety Helmet",
    standards: ["ANSI"],
    stewardship: "VezaOne Managed",
    lifecycle: "In Review",
    updatedAt: "Nov 22, 2026",
    ...createDefaultProductDetail("Head Protection", "Safety Helmet", ["ANSI"]),
  },
  {
    id: "PRD-003",
    sku: "MSA-VG1-00",
    manufacturer: "MSA",
    name: "V-Gard Safety Helmet",
    model: "VG1",
    category: "Head Protection",
    productType: "Safety Helmet",
    standards: ["ANSI", "EN"],
    stewardship: "OEM Managed",
    lifecycle: "Active",
    updatedAt: "Nov 21, 2026",
    ...createDefaultProductDetail("Head Protection", "Safety Helmet", [
      "ANSI",
      "EN",
    ]),
  },
  {
    id: "PRD-004",
    sku: "UVX-9772330",
    manufacturer: "uvex",
    name: "Pheos Safety Helmet",
    model: "9772",
    category: "Head Protection",
    productType: "Vented Helmet",
    standards: ["EN"],
    stewardship: "VezaOne Managed",
    lifecycle: "Approved",
    updatedAt: "Nov 20, 2026",
    ...createDefaultProductDetail("Head Protection", "Vented Helmet", ["EN"]),
  },
  {
    id: "PRD-005",
    sku: "ANS-PF200",
    manufacturer: "Ansell",
    name: "PureFlo Safety Helmet",
    model: "PF200",
    category: "Head Protection",
    productType: "Safety Helmet",
    standards: [],
    stewardship: "OEM Managed",
    lifecycle: "Draft",
    updatedAt: "Nov 19, 2026",
    ...createDefaultProductDetail("Head Protection", "Safety Helmet", []),
  },
  {
    id: "PRD-006",
    sku: "HON-L3B-01",
    manufacturer: "Honeywell",
    name: "Howard Full Brim Helmet",
    model: "L3B",
    category: "Head Protection",
    productType: "Full Brim Helmet",
    standards: ["ANSI", "CSA"],
    stewardship: "VezaOne Managed",
    lifecycle: "Active",
    updatedAt: "Nov 18, 2026",
    ...createDefaultProductDetail("Head Protection", "Full Brim Helmet", [
      "ANSI",
      "CSA",
    ]),
  },
  {
    id: "PRD-007",
    sku: "3M-H703R",
    manufacturer: "3M",
    name: "H-700 Safety Helmet",
    model: "H-700",
    category: "Head Protection",
    productType: "Safety Helmet",
    standards: [],
    stewardship: "OEM Managed",
    lifecycle: "Deprecated",
    updatedAt: "Nov 17, 2026",
    ...createDefaultProductDetail("Head Protection", "Safety Helmet", []),
  },
  {
    id: "PRD-008",
    sku: "MSA-VG500",
    manufacturer: "MSA",
    name: "V-Gard 500 Safety Helmet",
    model: "VG500",
    category: "Head Protection",
    productType: "Vented Helmet",
    standards: ["ANSI", "EN"],
    stewardship: "OEM Managed",
    lifecycle: "Active",
    updatedAt: "Nov 16, 2026",
    ...createDefaultProductDetail("Head Protection", "Vented Helmet", [
      "ANSI",
      "EN",
    ]),
  },
  {
    id: "PRD-009",
    sku: "UVX-9192",
    manufacturer: "uvex",
    name: "Pheos Safety Glasses",
    model: "9192",
    category: "Eye Protection",
    productType: "Safety Glasses",
    standards: ["EN"],
    stewardship: "VezaOne Managed",
    lifecycle: "Active",
    updatedAt: "Nov 15, 2026",
    ...createDefaultProductDetail("Eye Protection", "Safety Glasses", ["EN"]),
  },
  {
    id: "PRD-010",
    sku: "MSA-420-RES",
    manufacturer: "MSA",
    name: "Advantage® Respirator",
    model: "420",
    category: "Respiratory Protection",
    productType: "Respirator",
    standards: ["NIOSH"],
    stewardship: "OEM Managed",
    lifecycle: "In Progress",
    updatedAt: "Nov 14, 2026",
    ...createDefaultProductDetail("Respiratory Protection", "Respirator", [
      "NIOSH",
    ]),
  },
  {
    id: "PRD-011",
    sku: "HON-T4500",
    manufacturer: "Honeywell",
    name: "Titan™ Fall Arrest Harness",
    model: "T4500",
    category: "Fall Protection",
    productType: "Harness",
    standards: ["ANSI"],
    stewardship: "VezaOne Managed",
    lifecycle: "Rejected",
    updatedAt: "Nov 12, 2026",
    ...createDefaultProductDetail("Fall Protection", "Harness", ["ANSI"]),
  },
  {
    id: "PRD-012",
    sku: "ANS-H200",
    manufacturer: "Ansell",
    name: "NoiseBlock™ Earmuff",
    model: "H200",
    category: "Hearing Protection",
    productType: "Earmuff",
    standards: ["EN"],
    stewardship: "OEM Managed",
    lifecycle: "Obsolete",
    updatedAt: "Nov 10, 2026",
    ...createDefaultProductDetail("Hearing Protection", "Earmuff", ["EN"]),
  },
]

export const NEW_PRODUCT_FIELDS: FieldConfig[] = [
  {
    name: "manufacturer",
    label: "Manufacturer",
    type: "select",
    required: true,
    options: VEZAONE_MANUFACTURERS.map((m) => ({ label: m, value: m })),
  },
  {
    name: "name",
    label: "Product Name",
    type: "text",
    placeholder: "e.g., SecureFit™ Safety Helmet",
    required: true,
  },
  {
    name: "model",
    label: "Model",
    type: "text",
    placeholder: "e.g., X5000",
    required: true,
  },
  {
    name: "sku",
    label: "Part Number / SKU",
    type: "text",
    placeholder: "e.g., 70071684532",
    required: true,
  },
  {
    name: "category",
    label: "Category",
    type: "select",
    options: VEZAONE_CATEGORIES.map((c) => ({ label: c, value: c })),
  },
  {
    name: "productType",
    label: "Product Type",
    type: "text",
    placeholder: "e.g., Vented Helmet",
    required: true,
  },
  {
    name: "stewardship",
    label: "Stewardship",
    type: "select",
    options: [
      { label: "VezaOne Managed", value: "VezaOne Managed" },
      { label: "OEM Managed", value: "OEM Managed" },
    ],
  },
  {
    name: "lifecycle",
    label: "Lifecycle (Internal)",
    type: "select",
    options: VEZAONE_LIFECYCLE_OPTIONS,
  },
]
