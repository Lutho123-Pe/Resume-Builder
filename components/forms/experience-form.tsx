"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Trash2, Sparkles } from "lucide-react"
import { AIAssistant } from "@/components/ai-assistant"
import { useForm, useFieldArray, useWatch } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"

// --- Zod Schema for Validation ---
const ExperienceItemSchema = z.object({
  id: z.string(),
  company: z.string().min(1, { message: "Company name is required." }),
  position: z.string().min(1, { message: "Position is required." }),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  current: z.boolean().default(false),
  description: z.string().optional(),
  achievements: z.array(z.string().min(1, "Achievement cannot be empty.")).optional(),
})

const ExperienceFormSchema = z.object({
  experience: z.array(ExperienceItemSchema),
})

export type ExperienceItem = z.infer<typeof ExperienceItemSchema>
export type ExperienceData = z.infer<typeof ExperienceFormSchema>

interface ExperienceFormProps {
  data: ExperienceItem[]
  onChange: (data: ExperienceItem[]) => void
}

export function ExperienceForm({ data, onChange }: ExperienceFormProps) {
  const form = useForm<ExperienceData>({
    resolver: zodResolver(ExperienceFormSchema),
    defaultValues: { experience: data },
    mode: "onChange",
  })

  const { control, register, formState: { errors }, watch, setValue } = form
  const { fields, append, remove } = useFieldArray({
    control,
    name: "experience",
  })

  // Watch all fields and update parent state on change
  const watchedFields = watch()
  if (JSON.stringify(watchedFields.experience) !== JSON.stringify(data)) {
    onChange(watchedFields.experience)
  }

  const addExperience = () => {
    append({
      id: Date.now().toString(),
      company: "",
      position: "",
      startDate: "",
      endDate: "",
      current: false,
      description: "",
      achievements: [],
    })
  }

  const addAchievement = (index: number) => {
    const currentAchievements = form.getValues(`experience.${index}.achievements`) || []
    setValue(`experience.${index}.achievements`, [...currentAchievements, ""], { shouldValidate: true })
  }

  const removeAchievement = (expIndex: number, achIndex: number) => {
    const currentAchievements = form.getValues(`experience.${expIndex}.achievements`) || []
    const newAchievements = currentAchievements.filter((_, i) => i !== achIndex)
    setValue(`experience.${expIndex}.achievements`, newAchievements, { shouldValidate: true })
  }

  const handleContentGenerated = (expIndex: number, content: string) => {
    setValue(`experience.${expIndex}.description`, content, { shouldValidate: true })
  }

  return (
    <div className="space-y-4">
      {fields.map((field, index) => (
        <Card key={field.id}>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">
                {watch(`experience.${index}.position`) || "New Position"}
                {watch(`experience.${index}.company`) && ` at ${watch(`experience.${index}.company`)}`}
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => remove(index)}
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Job Title */}
              <div>
                <Label htmlFor={`experience.${index}.position`}>Job Title *</Label>
                <Input
                  id={`experience.${index}.position`}
                  {...register(`experience.${index}.position`)}
                  placeholder="Software Engineer"
                />
                {errors.experience?.[index]?.position && <p className="text-red-500 text-xs mt-1">{errors.experience[index].position.message}</p>}
              </div>
              {/* Company */}
              <div>
                <Label htmlFor={`experience.${index}.company`}>Company *</Label>
                <Input
                  id={`experience.${index}.company`}
                  {...register(`experience.${index}.company`)}
                  placeholder="Tech Corp"
                />
                {errors.experience?.[index]?.company && <p className="text-red-500 text-xs mt-1">{errors.experience[index].company.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Start Date */}
              <div>
                <Label htmlFor={`experience.${index}.startDate`}>Start Date</Label>
                <Input
                  id={`experience.${index}.startDate`}
                  type="month"
                  {...register(`experience.${index}.startDate`)}
                />
              </div>
              {/* End Date */}
              <div>
                <Label htmlFor={`experience.${index}.endDate`}>End Date</Label>
                <Input
                  id={`experience.${index}.endDate`}
                  type="month"
                  {...register(`experience.${index}.endDate`)}
                  disabled={watch(`experience.${index}.current`)}
                />
                <div className="flex items-center space-x-2 mt-2">
                  <Checkbox
                    id={`experience.${index}.current`}
                    checked={watch(`experience.${index}.current`)}
                    onCheckedChange={(checked) => setValue(`experience.${index}.current`, checked as boolean)}
                  />
                  <Label htmlFor={`experience.${index}.current`} className="text-sm">
                    I currently work here
                  </Label>
                </div>
              </div>
            </div>

            {/* Job Description */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label htmlFor={`experience.${index}.description`}>Job Description</Label>
                <Button variant="ghost" size="sm" className="h-auto p-1 text-secondary">
                  <Sparkles className="w-3 h-3 mr-1" />
                  AI Generate
                </Button>
              </div>
              <Textarea
                id={`experience.${index}.description`}
                {...register(`experience.${index}.description`)}
                placeholder="Describe your role and responsibilities..."
                rows={3}
              />
              <div className="mt-2">
                <AIAssistant
                  section="experience"
                  userInput={`${watch(`experience.${index}.position`)} at ${watch(`experience.${index}.company`)}`}
                  jobTitle={watch(`experience.${index}.position`) || "Professional"}
                  industry="Technology"
                  onContentGenerated={(content) => handleContentGenerated(index, content)}
                />
              </div>
            </div>

            {/* Key Achievements */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label>Key Achievements</Label>
                <Button variant="ghost" size="sm" onClick={() => addAchievement(index)} className="h-auto p-1">
                  <Plus className="w-3 h-3 mr-1" />
                  Add Achievement
                </Button>
              </div>
              <div className="space-y-2">
                {watch(`experience.${index}.achievements`)?.map((achievement, achIndex) => (
                  <div key={achIndex} className="flex gap-2">
                    <Input
                      {...register(`experience.${index}.achievements.${achIndex}`)}
                      placeholder="Increased team productivity by 25%..."
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeAchievement(index, achIndex)}
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
