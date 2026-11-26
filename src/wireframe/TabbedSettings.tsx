import * as React from "react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SchemaFieldRenderer } from "@/src/wireframe/RecordFormControls"
import type { SettingsSectionConfig } from "@/src/wireframe/types"

interface TabbedSettingsProps {
  sections: SettingsSectionConfig[]
  values: Record<string, unknown>
  onSave: (nextValues: Record<string, unknown>) => void
}

export function TabbedSettings({
  sections,
  values,
  onSave,
}: TabbedSettingsProps) {
  const [draft, setDraft] = React.useState<Record<string, unknown>>(values)

  React.useEffect(() => {
    setDraft(values)
  }, [values])

  if (sections.length === 0) return null

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    onSave(draft)
  }

  return (
    <form onSubmit={handleSubmit}>
      <Tabs defaultValue={sections[0].id} className="w-full">
        <TabsList>
          {sections.map((section) => (
            <TabsTrigger
              key={section.id}
              value={section.id}
              className="whitespace-nowrap shrink-0"
            >
              {section.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {sections.map((section) => (
          <TabsContent key={section.id} value={section.id} className="mt-4">
            <Card className="shadow-none">
              <CardHeader>
                <CardTitle className="font-heading text-base font-semibold">
                  {section.title}
                </CardTitle>
                <CardDescription>{section.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-5">
                {section.fields.map((field, idx) => (
                  <React.Fragment key={field.name}>
                    <SchemaFieldRenderer
                      field={field}
                      value={draft[field.name]}
                      onChange={(nextVal) =>
                        setDraft((prev) => ({ ...prev, [field.name]: nextVal }))
                      }
                    />
                    {idx < section.fields.length - 1 && <Separator />}
                  </React.Fragment>
                ))}
              </CardContent>
              <CardFooter className="border-t pt-4 justify-end">
                <Button type="submit">Save {section.label}</Button>
              </CardFooter>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </form>
  )
}
