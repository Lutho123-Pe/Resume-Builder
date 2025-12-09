"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Sparkles } from "lucide-react"
import { AIAssistant } from "@/components/ai-assistant"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"

// --- Zod Schema for Validation ---
const PersonalInfoSchema = z.object({
  fullName: z.string().min(2, { message: "Full Name is required." }),
  email: z.string().email({ message: "Invalid email address." }),
  phone: z.string().optional(),
  location: z.string().optional(),
  linkedin: z.string().optional(),
  website: z.string().optional(),
  summary: z.string().optional(),
  careerKeywords: z.string().optional(),
})

export type PersonalInfoData = z.infer<typeof PersonalInfoSchema>

interface PersonalInfoFormProps {
  data: PersonalInfoData
  onChange: (data: PersonalInfoData) => void
}

export function PersonalInfoForm({ data, onChange }: PersonalInfoFormProps) {
  const form = useForm<PersonalInfoData>({
    resolver: zodResolver(PersonalInfoSchema),
    defaultValues: data,
    mode: "onChange",
  })

  // Watch all fields and update parent state on change
  form.watch((value) => {
    onChange(value as PersonalInfoData)
  })

  const { register, formState: { errors }, setValue } = form

  const handleContentGenerated = (content: string) => {
    setValue("summary", content, { shouldValidate: true })
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4">
        {/* Full Name */}
        <div>
          <Label htmlFor="fullName">Full Name *</Label>
          <Input
            id="fullName"
            {...register("fullName")}
            placeholder="John Doe"
          />
          {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName.message}</p>}
        </div>

        {/* Email Address */}
        <div>
          <Label htmlFor="email">Email Address *</Label>
          <Input
            id="email"
            type="email"
            {...register("email")}
            placeholder="john.doe@email.com"
          />
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
        </div>

        {/* Phone Number */}
        <div>
          <Label htmlFor="phone">Phone Number</Label>
          <Input
            id="phone"
            {...register("phone")}
            placeholder="+1 (555) 123-4567"
          />
          {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
        </div>

        {/* Location */}
        <div>
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            {...register("location")}
            placeholder="New York, NY"
          />
          {errors.location && <p className="text-red-500 text-xs mt-1">{errors.location.message}</p>}
        </div>

        {/* LinkedIn Profile */}
        <div>
          <Label htmlFor="linkedin">LinkedIn Profile</Label>
          <Input
            id="linkedin"
            {...register("linkedin")}
            placeholder="linkedin.com/in/johndoe"
          />
          {errors.linkedin && <p className="text-red-500 text-xs mt-1">{errors.linkedin.message}</p>}
        </div>

        {/* Website/Portfolio */}
        <div>
          <Label htmlFor="website">Website/Portfolio</Label>
          <Input
            id="website"
            {...register("website")}
            placeholder="johndoe.com"
          />
          {errors.website && <p className="text-red-500 text-xs mt-1">{errors.website.message}</p>}
        </div>

        {/* Career Keywords */}
        <div>
          <Label htmlFor="careerKeywords">Career Keywords</Label>
          <Input
            id="careerKeywords"
            {...register("careerKeywords")}
            placeholder="e.g., software engineer, full-stack developer, React, Node.js"
          />
          <p className="text-xs text-muted-foreground mt-1">
            Enter keywords related to your desired career to generate a targeted summary
          </p>
          {errors.careerKeywords && <p className="text-red-500 text-xs mt-1">{errors.careerKeywords.message}</p>}
        </div>

        {/* Professional Summary */}
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
            {...register("summary")}
            placeholder="Write a brief professional summary highlighting your key skills and experience..."
            rows={4}
          />
          <div className="mt-2">
            <AIAssistant
              section="summary"
              userInput={`${form.getValues("fullName")} - ${form.getValues("location")} - Career Focus: ${form.getValues("careerKeywords") || "General Professional"}`}
              jobTitle={form.getValues("careerKeywords") || "Professional"}
              industry="General"
              onContentGenerated={handleContentGenerated}
            />
          </div>
          {errors.summary && <p className="text-red-500 text-xs mt-1">{errors.summary.message}</p>}
        </div>
      </div>
    </div>
  )
}
