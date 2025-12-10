"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  FileText,
  User,
  Briefcase,
  GraduationCap,
  Award,
  Eye,
  Target,
  CheckCircle,
  Palette,
  TrendingUp,
} from "lucide-react"
import { ResumePreview } from "./resume-preview"
import { PersonalInfoForm } from "./forms/personal-info-form"
import { ExperienceForm } from "./forms/experience-form"
import { EducationForm } from "./forms/education-form"
import { SkillsForm } from "./forms/skills-form"
import { TemplateSelector, templates } from "./template-selector"
import { KeywordOptimizer } from "./keyword-optimizer"
import { JobMatcher } from "./job-matcher"
import { IndustryOptimizer } from "./industry-optimizer"
import { OptimizationDashboard } from "./optimization-dashboard"
import { ExportDialog } from "./export-dialog"

interface ResumeData {
  personalInfo: {
    fullName: string
    email: string
    phone: string
    location: string
    linkedin: string
    website: string
    summary: string
    careerKeywords: string // Added careerKeywords field to interface
  }
  experience: Array<{
    id: string
    company: string
    position: string
    startDate: string
    endDate: string
    current: boolean
    description: string
    achievements: string[]
  }>
  education: Array<{
    id: string
    institution: string
    degree: string
    field: string
    startDate: string
    endDate: string
    gpa?: string
  }>
  skills: {
    technical: string[]
    soft: string[]
    languages: string[]
    certifications: string[]
  }
}

const initialResumeData: ResumeData = {
  personalInfo: {
    fullName: "",
    email: "",
    phone: "",
    location: "",
    linkedin: "",
    website: "",
    summary: "",
    careerKeywords: "", // Added careerKeywords to initial data
  },
  experience: [],
  education: [],
  skills: {
    technical: [],
    soft: [],
    languages: [],
    certifications: [],
  },
}

export function ResumeBuilder() {
  const [resumeData, setResumeData] = useState<ResumeData>(initialResumeData)
  const [activeTab, setActiveTab] = useState("personal")
  const [selectedTemplate, setSelectedTemplate] = useState("modern")
  const [customColors, setCustomColors] = useState<
    | {
        primary: string
        secondary: string
        accent: string
      }
    | undefined
  >(undefined)
  const [showTemplateSelector, setShowTemplateSelector] = useState(false)
  const [showKeywordOptimizer, setShowKeywordOptimizer] = useState(false)
  const [showJobMatcher, setShowJobMatcher] = useState(false)
  const [showIndustryOptimizer, setShowIndustryOptimizer] = useState(false)

  const updateResumeData = (section: keyof ResumeData, data: any) => {
    setResumeData((prev) => ({
      ...prev,
      [section]: data,
    }))
  }

  const handleTemplateChange = (templateId: string) => {
    setSelectedTemplate(templateId)
    setCustomColors(undefined)
    setShowTemplateSelector(false)
  }

  const handleCustomColors = (colors: { primary: string; secondary: string; accent: string }) => {
    setCustomColors(colors)
  }

  const getResumeContentString = () => {
    const { personalInfo, experience, education, skills } = resumeData

    let content = `${personalInfo.fullName}\n${personalInfo.summary}\n\n`

    experience.forEach((exp) => {
      content += `${exp.position} at ${exp.company}\n${exp.description}\n`
      exp.achievements.forEach((achievement) => {
        content += `• ${achievement}\n`
      })
      content += "\n"
    })

    education.forEach((edu) => {
      content += `${edu.degree} in ${edu.field} from ${edu.institution}\n`
    })

    content += `\nSkills: ${[...skills.technical, ...skills.soft].join(", ")}`

    return content
  }

  const tabs = [
    { id: "personal", label: "Personal Info", icon: User },
    { id: "experience", label: "Experience", icon: Briefcase },
    { id: "education", label: "Education", icon: GraduationCap },
    { id: "skills", label: "Skills", icon: Award },
  ]

  const currentTemplate = templates.find((t) => t.id === selectedTemplate)

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 bg-secondary rounded-lg">
                <FileText className="w-6 h-6 text-secondary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">Resume Builder</h1>
                <p className="text-sm text-muted-foreground">Create professional resumes in minutes</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm">
                <Eye className="w-4 h-4 mr-2" />
                Preview
              </Button>
              <ExportDialog resumeData={resumeData} template={selectedTemplate} customColors={customColors} />
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Sidebar - Form */}
          <div className="lg:col-span-1 space-y-6">
            <OptimizationDashboard resumeData={resumeData} template={selectedTemplate} />

            {/* Form Tabs */}
            <Card>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <CardHeader className="pb-3">
                  <TabsList className="grid w-full grid-cols-4">
                    {tabs.map((tab) => {
                      const Icon = tab.icon
                      return (
                        <TabsTrigger key={tab.id} value={tab.id} className="flex flex-col gap-1 py-3">
                          <Icon className="w-4 h-4" />
                          <span className="text-xs">{tab.label}</span>
                        </TabsTrigger>
                      )
                    })}
                  </TabsList>
                </CardHeader>

                <CardContent>
                  <TabsContent value="personal" className="mt-0">
                    <PersonalInfoForm
                      data={resumeData.personalInfo}
                      onChange={(data) => updateResumeData("personalInfo", data)}
                    />
                  </TabsContent>

                  <TabsContent value="experience" className="mt-0">
                    <ExperienceForm
                      data={resumeData.experience}
                      onChange={(data) => updateResumeData("experience", data)}
                    />
                  </TabsContent>

                  <TabsContent value="education" className="mt-0">
                    <EducationForm
                      data={resumeData.education}
                      onChange={(data) => updateResumeData("education", data)}
                    />
                  </TabsContent>

                  <TabsContent value="skills" className="mt-0">
                    <SkillsForm data={resumeData.skills} onChange={(data) => updateResumeData("skills", data)} />
                  </TabsContent>
                </CardContent>
              </Tabs>
            </Card>

            {/* AI Features */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Target className="w-5 h-5 text-secondary" />
                  AI Assistant
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full justify-start bg-transparent"
                  onClick={() => setShowKeywordOptimizer(!showKeywordOptimizer)}
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  ATS Keyword Analysis
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start bg-transparent"
                  onClick={() => setShowJobMatcher(!showJobMatcher)}
                >
                  <Target className="w-4 h-4 mr-2" />
                  Job Match Analysis
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start bg-transparent"
                  onClick={() => setShowIndustryOptimizer(!showIndustryOptimizer)}
                >
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Industry Optimization
                </Button>
              </CardContent>
            </Card>

            {/* AI Analysis Tools */}
            {showKeywordOptimizer && <KeywordOptimizer content={getResumeContentString()} industry="Technology" />}

            {showJobMatcher && <JobMatcher resumeContent={getResumeContentString()} />}

            {showIndustryOptimizer && <IndustryOptimizer resumeData={resumeData} />}
          </div>

          {/* Right Side - Preview */}
          <div className="lg:col-span-2">
            <Card className="h-fit">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Resume Preview</CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">{currentTemplate?.name || "Modern Template"}</Badge>
                    <Button variant="outline" size="sm" onClick={() => setShowTemplateSelector(!showTemplateSelector)}>
                      <Palette className="w-4 h-4 mr-2" />
                      Change Template
                    </Button>
                  </div>
                </div>
                {showTemplateSelector && (
                  <div className="mt-4">
                    <TemplateSelector
                      selectedTemplate={selectedTemplate}
                      onTemplateChange={handleTemplateChange}
                      onCustomizeColors={handleCustomColors}
                    />
                  </div>
                )}
              </CardHeader>
              <CardContent>
                <ResumePreview data={resumeData} template={selectedTemplate} customColors={customColors} />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
