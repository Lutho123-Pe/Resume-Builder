"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check, Palette } from "lucide-react"

export interface Template {
  id: string
  name: string
  description: string
  preview: string
  category: "professional" | "creative" | "minimal"
  colors: {
    primary: string
    secondary: string
    accent: string
  }
}

const templates: Template[] = [
  {
    id: "modern",
    name: "Modern Professional",
    description: "Clean design with accent colors and modern typography",
    preview: "/modern-blue-resume.png",
    category: "professional",
    colors: {
      primary: "#374151",
      secondary: "#6366f1",
      accent: "#10b981",
    },
  },
  {
    id: "classic",
    name: "Classic Executive",
    description: "Traditional layout perfect for corporate roles",
    preview: "/classic-resume-template-with-traditional-layout.jpg",
    category: "professional",
    colors: {
      primary: "#1f2937",
      secondary: "#374151",
      accent: "#059669",
    },
  },
  {
    id: "creative",
    name: "Creative Designer",
    description: "Bold design with creative elements for design roles",
    preview: "/creative-resume-template-with-colorful-design-elem.jpg",
    category: "creative",
    colors: {
      primary: "#7c3aed",
      secondary: "#ec4899",
      accent: "#f59e0b",
    },
  },
  {
    id: "minimal",
    name: "Minimal Clean",
    description: "Ultra-clean design focusing on content over decoration",
    preview: "/minimal-resume-template-with-clean-typography.jpg",
    category: "minimal",
    colors: {
      primary: "#111827",
      secondary: "#6b7280",
      accent: "#3b82f6",
    },
  },
]

interface TemplateSelectorProps {
  selectedTemplate: string
  onTemplateChange: (templateId: string) => void
  onCustomizeColors?: (colors: { primary: string; secondary: string; accent: string }) => void
}

export function TemplateSelector({ selectedTemplate, onTemplateChange, onCustomizeColors }: TemplateSelectorProps) {
  const [showColorCustomizer, setShowColorCustomizer] = useState(false)
  const selectedTemplateData = templates.find((t) => t.id === selectedTemplate)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Choose Template</h3>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowColorCustomizer(!showColorCustomizer)}
          className="bg-transparent"
        >
          <Palette className="w-4 h-4 mr-2" />
          Customize Colors
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {templates.map((template) => (
          <Card
            key={template.id}
            className={`cursor-pointer transition-all hover:shadow-md ${
              selectedTemplate === template.id ? "ring-2 ring-secondary" : ""
            }`}
            onClick={() => onTemplateChange(template.id)}
          >
            <CardContent className="p-4">
              <div className="relative mb-3">
                <img
                  src={template.preview || "/placeholder.svg"}
                  alt={template.name}
                  className="w-full h-32 object-cover rounded border"
                />
                {selectedTemplate === template.id && (
                  <div className="absolute top-2 right-2 bg-secondary text-secondary-foreground rounded-full p-1">
                    <Check className="w-4 h-4" />
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-sm">{template.name}</h4>
                  <Badge variant="outline" className="text-xs">
                    {template.category}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">{template.description}</p>
                <div className="flex gap-1">
                  <div className="w-4 h-4 rounded-full border" style={{ backgroundColor: template.colors.primary }} />
                  <div className="w-4 h-4 rounded-full border" style={{ backgroundColor: template.colors.secondary }} />
                  <div className="w-4 h-4 rounded-full border" style={{ backgroundColor: template.colors.accent }} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {showColorCustomizer && selectedTemplateData && onCustomizeColors && (
        <Card>
          <CardContent className="p-4">
            <h4 className="font-medium mb-3">Customize Colors</h4>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium">Primary</label>
                <input
                  type="color"
                  defaultValue={selectedTemplateData.colors.primary}
                  className="w-full h-8 rounded border"
                  onChange={(e) =>
                    onCustomizeColors({
                      ...selectedTemplateData.colors,
                      primary: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <label className="text-sm font-medium">Secondary</label>
                <input
                  type="color"
                  defaultValue={selectedTemplateData.colors.secondary}
                  className="w-full h-8 rounded border"
                  onChange={(e) =>
                    onCustomizeColors({
                      ...selectedTemplateData.colors,
                      secondary: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <label className="text-sm font-medium">Accent</label>
                <input
                  type="color"
                  defaultValue={selectedTemplateData.colors.accent}
                  className="w-full h-8 rounded border"
                  onChange={(e) =>
                    onCustomizeColors({
                      ...selectedTemplateData.colors,
                      accent: e.target.value,
                    })
                  }
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export { templates }
