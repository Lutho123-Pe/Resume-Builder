"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Trash2 } from "lucide-react"
import { useForm, useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"

// --- Zod Schema for Validation ---
const EducationItemSchema = z.object({
  id: z.string(),
  institution: z.string().min(1, { message: "Institution name is required." }),
  degree: z.string().min(1, { message: "Degree is required." }),
  field: z.string().min(1, { message: "Field of study is required." }),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  gpa: z.string().optional(),
})

const EducationFormSchema = z.object({
  education: z.array(EducationItemSchema),
})

export type EducationItem = z.infer<typeof EducationItemSchema>

interface EducationFormProps {
  data: EducationItem[]
  onChange: (data: EducationItem[]) => void
}

export function EducationForm({ data, onChange }: EducationFormProps) {
  const form = useForm<z.infer<typeof EducationFormSchema>>({
    resolver: zodResolver(EducationFormSchema),
    defaultValues: { education: data },
    mode: "onChange",
  })

  const { control, register, formState: { errors }, watch } = form
  const { fields, append, remove } = useFieldArray({
    control,
    name: "education",
  })

  // Watch all fields and update parent state on change
  const watchedFields = watch()
  if (JSON.stringify(watchedFields.education) !== JSON.stringify(data)) {
    onChange(watchedFields.education)
  }

  const addEducation = () => {
    append({
      id: Date.now().toString(),
      institution: "",
      degree: "",
      field: "",
      startDate: "",
      endDate: "",
      gpa: "",
    })
  }

  return (
    <div className="space-y-4">
      {fields.map((field, index) => (
        <Card key={field.id}>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">
                {watch(`education.${index}.degree`) || "New Education"}
                {watch(`education.${index}.institution`) && ` at ${watch(`education.${index}.institution`)}`}
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
              {/* Institution */}
              <div>
                <Label htmlFor={`education.${index}.institution`}>Institution *</Label>
                <Input
                  id={`education.${index}.institution`}
                  {...register(`education.${index}.institution`)}
                  placeholder="University of Technology"
                />
                {errors.education?.[index]?.institution && <p className="text-red-500 text-xs mt-1">{errors.education[index].institution.message}</p>}
              </div>
              {/* Degree */}
              <div>
                <Label htmlFor={`education.${index}.degree`}>Degree *</Label>
                <Input
                  id={`education.${index}.degree`}
                  {...register(`education.${index}.degree`)}
                  placeholder="Bachelor of Science"
                />
                {errors.education?.[index]?.degree && <p className="text-red-500 text-xs mt-1">{errors.education[index].degree.message}</p>}
              </div>
            </div>

            {/* Field of Study */}
            <div>
              <Label htmlFor={`education.${index}.field`}>Field of Study *</Label>
              <Input
                id={`education.${index}.field`}
                {...register(`education.${index}.field`)}
                placeholder="Computer Science"
              />
              {errors.education?.[index]?.field && <p className="text-red-500 text-xs mt-1">{errors.education[index].field.message}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Start Date */}
              <div>
                <Label htmlFor={`education.${index}.startDate`}>Start Date</Label>
                <Input
                  id={`education.${index}.startDate`}
                  type="month"
                  {...register(`education.${index}.startDate`)}
                />
              </div>
              {/* End Date */}
              <div>
                <Label htmlFor={`education.${index}.endDate`}>End Date</Label>
                <Input
                  id={`education.${index}.endDate`}
                  type="month"
                  {...register(`education.${index}.endDate`)}
                />
              </div>
              {/* GPA */}
              <div>
                <Label htmlFor={`education.${index}.gpa`}>GPA (Optional)</Label>
                <Input
                  id={`education.${index}.gpa`}
                  {...register(`education.${index}.gpa`)}
                  placeholder="3.8"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      <Button variant="outline" onClick={addEducation} className="w-full bg-transparent">
        <Plus className="w-4 h-4 mr-2" />
        Add Education
      </Button>
    </div>
  )
}
