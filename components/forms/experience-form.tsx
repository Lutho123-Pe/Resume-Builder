"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Trash2 } from "lucide-react"
import { AIAssistant } from "@/components/ai-assistant"

interface ExperienceItem {
  id: string
  company: string
  position: string
  startDate: string
  endDate: string
  current: boolean
  description: string
  achievements: string[]
}

interface ExperienceFormProps {
  data: ExperienceItem[]
  onChange: (data: ExperienceItem[]) => void
}

export function ExperienceForm({ data, onChange }: ExperienceFormProps) {
  const [editingId, setEditingId] = useState<string | null>(null)

  const addExperience = () => {
    const newExperience: ExperienceItem = {
      id: Date.now().toString(),
      company: "",
      position: "",
      startDate: "",
      endDate: "",
      current: false,
      description: "",
      achievements: [],
    }
    onChange([...data, newExperience])
    setEditingId(newExperience.id)
  }

  const updateExperience = (id: string, field: keyof ExperienceItem, value: any) => {
    onChange(data.map((exp) => (exp.id === id ? { ...exp, [field]: value } : exp)))
  }

  const removeExperience = (id: string) => {
    onChange(data.filter((exp) => exp.id !== id))
  }

  const addAchievement = (id: string) => {
    const experience = data.find((exp) => exp.id === id)
    if (experience) {
      updateExperience(id, "achievements", [...experience.achievements, ""])
    }
  }

  const updateAchievement = (id: string, index: number, value: string) => {
    const experience = data.find((exp) => exp.id === id)
    if (experience) {
      const newAchievements = [...experience.achievements]
      newAchievements[index] = value
      updateExperience(id, "achievements", newAchievements)
    }
  }

  const removeAchievement = (id: string, index: number) => {
    const experience = data.find((exp) => exp.id === id)
    if (experience) {
      const newAchievements = experience.achievements.filter((_, i) => i !== index)
      updateExperience(id, "achievements", newAchievements)
    }
  }

  return (
    <div className="space-y-4">
      {data.map((experience) => (
        <Card key={experience.id}>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">
                {experience.position || "New Position"}
                {experience.company && ` at ${experience.company}`}
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeExperience(experience.id)}
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor={`position-${experience.id}`}>Job Title *</Label>
                <Input
                  id={`position-${experience.id}`}
                  value={experience.position}
                  onChange={(e) => updateExperience(experience.id, "position", e.target.value)}
                  placeholder="Software Engineer"
                />
              </div>
              <div>
                <Label htmlFor={`company-${experience.id}`}>Company *</Label>
                <Input
                  id={`company-${experience.id}`}
                  value={experience.company}
                  onChange={(e) => updateExperience(experience.id, "company", e.target.value)}
                  placeholder="Tech Corp"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor={`startDate-${experience.id}`}>Start Date</Label>
                <Input
                  id={`startDate-${experience.id}`}
                  type="month"
                  value={experience.startDate}
                  onChange={(e) => updateExperience(experience.id, "startDate", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor={`endDate-${experience.id}`}>End Date</Label>
                <Input
                  id={`endDate-${experience.id}`}
                  type="month"
                  value={experience.endDate}
                  onChange={(e) => updateExperience(experience.id, "endDate", e.target.value)}
                  disabled={experience.current}
                />
                <div className="flex items-center space-x-2 mt-2">
                  <Checkbox
                    id={`current-${experience.id}`}
                    checked={experience.current}
                    onCheckedChange={(checked) => updateExperience(experience.id, "current", checked)}
                  />
                  <Label htmlFor={`current-${experience.id}`} className="text-sm">
                    I currently work here
                  </Label>
                </div>
              </div>
            </div>

            <div>
              <Label htmlFor={`description-${experience.id}`}>Job Description</Label>
              <Textarea
                id={`description-${experience.id}`}
                value={experience.description}
                onChange={(e) => updateExperience(experience.id, "description", e.target.value)}
                placeholder="Describe your role and responsibilities..."
                rows={3}
              />
              <div className="mt-2">
                <AIAssistant
                  section="experience"
                  userInput={`${experience.position} at ${experience.company}`}
                  jobTitle={experience.position || "Professional"}
                  industry="Technology"
                  onContentGenerated={(content) => updateExperience(experience.id, "description", content)}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <Label>Key Achievements</Label>
                <Button variant="ghost" size="sm" onClick={() => addAchievement(experience.id)} className="h-auto p-1">
                  <Plus className="w-3 h-3 mr-1" />
                  Add Achievement
                </Button>
              </div>
              <div className="space-y-2">
                {experience.achievements.map((achievement, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={achievement}
                      onChange={(e) => updateAchievement(experience.id, index, e.target.value)}
                      placeholder="Increased team productivity by 25%..."
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeAchievement(experience.id, index)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      <Button variant="outline" onClick={addExperience} className="w-full bg-transparent">
        <Plus className="w-4 h-4 mr-2" />
        Add Work Experience
      </Button>
    </div>
  )
}
