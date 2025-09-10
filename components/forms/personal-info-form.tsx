"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Sparkles } from "lucide-react"
import { AIAssistant } from "@/components/ai-assistant"

interface PersonalInfoData {
  fullName: string
  email: string
  phone: string
  location: string
  linkedin: string
  website: string
  summary: string
}

interface PersonalInfoFormProps {
  data: PersonalInfoData
  onChange: (data: PersonalInfoData) => void
}

export function PersonalInfoForm({ data, onChange }: PersonalInfoFormProps) {
  const updateField = (field: keyof PersonalInfoData, value: string) => {
    onChange({
      ...data,
      [field]: value,
    })
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4">
        <div>
          <Label htmlFor="fullName">Full Name *</Label>
          <Input
            id="fullName"
            value={data.fullName}
            onChange={(e) => updateField("fullName", e.target.value)}
            placeholder="John Doe"
          />
        </div>

        <div>
          <Label htmlFor="email">Email Address *</Label>
          <Input
            id="email"
            type="email"
            value={data.email}
            onChange={(e) => updateField("email", e.target.value)}
            placeholder="john.doe@email.com"
          />
        </div>

        <div>
          <Label htmlFor="phone">Phone Number</Label>
          <Input
            id="phone"
            value={data.phone}
            onChange={(e) => updateField("phone", e.target.value)}
            placeholder="+1 (555) 123-4567"
          />
        </div>

        <div>
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            value={data.location}
            onChange={(e) => updateField("location", e.target.value)}
            placeholder="New York, NY"
          />
        </div>

        <div>
          <Label htmlFor="linkedin">LinkedIn Profile</Label>
          <Input
            id="linkedin"
            value={data.linkedin}
            onChange={(e) => updateField("linkedin", e.target.value)}
            placeholder="linkedin.com/in/johndoe"
          />
        </div>

        <div>
          <Label htmlFor="website">Website/Portfolio</Label>
          <Input
            id="website"
            value={data.website}
            onChange={(e) => updateField("website", e.target.value)}
            placeholder="johndoe.com"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <Label htmlFor="summary">Professional Summary</Label>
            <Button variant="ghost" size="sm" className="h-auto p-1 text-secondary">
              <Sparkles className="w-3 h-3 mr-1" />
              AI Generate
            </Button>
          </div>
          <Textarea
            id="summary"
            value={data.summary}
            onChange={(e) => updateField("summary", e.target.value)}
            placeholder="Write a brief professional summary highlighting your key skills and experience..."
            rows={4}
          />
          <div className="mt-2">
            <AIAssistant
              section="summary"
              userInput={`${data.fullName} - ${data.location}`}
              jobTitle="Professional"
              industry="General"
              onContentGenerated={(content) => updateField("summary", content)}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
