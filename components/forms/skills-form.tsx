"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, X, Sparkles } from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"

// --- Zod Schema for Validation ---
const SkillsDataSchema = z.object({
  technical: z.array(z.string()).optional(),
  soft: z.array(z.string()).optional(),
  languages: z.array(z.string()).optional(),
  certifications: z.array(z.string()).optional(),
})

export type SkillsData = z.infer<typeof SkillsDataSchema>

interface SkillsFormProps {
  data: SkillsData
  onChange: (data: SkillsData) => void
}

export function SkillsForm({ data, onChange }: SkillsFormProps) {
  const form = useForm<SkillsData>({
    resolver: zodResolver(SkillsDataSchema),
    defaultValues: data,
    mode: "onChange",
  })

  // Watch all fields and update parent state on change
  form.watch((value) => {
    onChange(value as SkillsData)
  })

  const { register, formState: { errors }, setValue, getValues } = form

  const [newSkill, setNewSkill] = useState({
    technical: "",
    soft: "",
    languages: "",
    certifications: "",
  })

  const addSkill = (category: keyof SkillsData) => {
    const skill = newSkill[category].trim()
    if (skill) {
      const currentSkills = getValues(category) || []
      if (!currentSkills.includes(skill)) {
        setValue(category, [...currentSkills, skill], { shouldValidate: true })
        setNewSkill((prev) => ({ ...prev, [category]: "" }))
      }
    }
  }

  const removeSkill = (category: keyof SkillsData, skillToRemove: string) => {
    const currentSkills = getValues(category) || []
    setValue(category, currentSkills.filter((skill) => skill !== skillToRemove), { shouldValidate: true })
  }

  const handleKeyPress = (e: React.KeyboardEvent, category: keyof SkillsData) => {
    if (e.key === "Enter") {
      e.preventDefault()
      addSkill(category)
    }
  }

  const skillCategories = [
    {
      key: "technical" as keyof SkillsData,
      title: "Technical Skills",
      placeholder: "JavaScript, Python, React...",
      description: "Programming languages, frameworks, tools",
    },
    {
      key: "soft" as keyof SkillsData,
      title: "Soft Skills",
      placeholder: "Leadership, Communication...",
      description: "Interpersonal and professional skills",
    },
    {
      key: "languages" as keyof SkillsData,
      title: "Languages",
      placeholder: "English, Spanish...",
      description: "Spoken languages and proficiency",
    },
    {
      key: "certifications" as keyof SkillsData,
      title: "Certifications",
      placeholder: "AWS Certified, PMP...",
      description: "Professional certifications and licenses",
    },
  ]

  return (
    <div className="space-y-6">
      {skillCategories.map((category) => (
        <Card key={category.key}>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base">{category.title}</CardTitle>
                <p className="text-sm text-muted-foreground">{category.description}</p>
              </div>
              <Button variant="ghost" size="sm" className="text-secondary">
                <Sparkles className="w-4 h-4 mr-1" />
                Suggest
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                value={newSkill[category.key]}
                onChange={(e) => setNewSkill((prev) => ({ ...prev, [category.key]: e.target.value }))}
                onKeyPress={(e) => handleKeyPress(e, category.key)}
                placeholder={category.placeholder}
              />
              <Button onClick={() => addSkill(category.key)} size="sm" disabled={!newSkill[category.key].trim()}>
                <Plus className="w-4 h-4" />
              </Button>
            </div>

            {(getValues(category.key) || []).length > 0 && (
              <div className="flex flex-wrap gap-2">
                {(getValues(category.key) || []).map((skill, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    {skill}
                    <button onClick={() => removeSkill(category.key, skill)} className="ml-1 hover:text-destructive">
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
