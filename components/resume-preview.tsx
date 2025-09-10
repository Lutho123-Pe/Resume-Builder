"use client"

import { ModernTemplate } from "./templates/modern-template"
import { ClassicTemplate } from "./templates/classic-template"
import { CreativeTemplate } from "./templates/creative-template"
import { MinimalTemplate } from "./templates/minimal-template"

interface ResumePreviewProps {
  data: any
  template: string
  customColors?: {
    primary: string
    secondary: string
    accent: string
  }
}

export function ResumePreview({ data, template, customColors }: ResumePreviewProps) {
  const renderTemplate = () => {
    switch (template) {
      case "modern":
        return <ModernTemplate data={data} colors={customColors} />
      case "classic":
        return <ClassicTemplate data={data} colors={customColors} />
      case "creative":
        return <CreativeTemplate data={data} colors={customColors} />
      case "minimal":
        return <MinimalTemplate data={data} colors={customColors} />
      default:
        return <ModernTemplate data={data} colors={customColors} />
    }
  }

  return <div className="w-full">{renderTemplate()}</div>
}
