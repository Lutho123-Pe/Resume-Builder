"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { TrendingUp, Target, CheckCircle, AlertCircle, Zap } from "lucide-react"

interface OptimizationDashboardProps {
  resumeData: any
  template: string
}

export function OptimizationDashboard({ resumeData, template }: OptimizationDashboardProps) {
  const [optimizationScore, setOptimizationScore] = useState(0)
  const [completionMetrics, setCompletionMetrics] = useState({
    personalInfo: 0,
    experience: 0,
    education: 0,
    skills: 0,
  })

  useEffect(() => {
    calculateOptimizationScore()
  }, [resumeData])

  const calculateOptimizationScore = () => {
    const { personalInfo, experience, education, skills } = resumeData

    // Calculate completion percentages
    const personalComplete = calculatePersonalInfoCompletion(personalInfo)
    const experienceComplete = calculateExperienceCompletion(experience)
    const educationComplete = calculateEducationCompletion(education)
    const skillsComplete = calculateSkillsCompletion(skills)

    setCompletionMetrics({
      personalInfo: personalComplete,
      experience: experienceComplete,
      education: educationComplete,
      skills: skillsComplete,
    })

    // Overall optimization score
    const overallScore = Math.round((personalComplete + experienceComplete + educationComplete + skillsComplete) / 4)
    setOptimizationScore(overallScore)
  }

  const calculatePersonalInfoCompletion = (info: any) => {
    const fields = ["fullName", "email", "phone", "location", "summary"]
    const completed = fields.filter((field) => info[field]?.trim()).length
    return Math.round((completed / fields.length) * 100)
  }

  const calculateExperienceCompletion = (experience: any[]) => {
    if (experience.length === 0) return 0

    const totalFields = experience.length * 4 // position, company, description, achievements
    let completedFields = 0

    experience.forEach((exp) => {
      if (exp.position?.trim()) completedFields++
      if (exp.company?.trim()) completedFields++
      if (exp.description?.trim()) completedFields++
      if (exp.achievements?.length > 0) completedFields++
    })

    return Math.round((completedFields / totalFields) * 100)
  }

  const calculateEducationCompletion = (education: any[]) => {
    if (education.length === 0) return 50 // Not required but recommended

    const totalFields = education.length * 4 // degree, field, institution, dates
    let completedFields = 0

    education.forEach((edu) => {
      if (edu.degree?.trim()) completedFields++
      if (edu.field?.trim()) completedFields++
      if (edu.institution?.trim()) completedFields++
      if (edu.startDate && edu.endDate) completedFields++
    })

    return Math.round((completedFields / totalFields) * 100)
  }

  const calculateSkillsCompletion = (skills: any) => {
    const categories = ["technical", "soft", "languages", "certifications"]
    const completed = categories.filter((cat) => skills[cat]?.length > 0).length
    return Math.round((completed / categories.length) * 100)
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600"
    if (score >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  const getScoreIcon = (score: number) => {
    if (score >= 80) return CheckCircle
    if (score >= 60) return AlertCircle
    return Target
  }

  const sections = [
    { key: "personalInfo", label: "Personal Info", icon: Target },
    { key: "experience", label: "Experience", icon: TrendingUp },
    { key: "education", label: "Education", icon: CheckCircle },
    { key: "skills", label: "Skills", icon: Zap },
  ]

  const ScoreIcon = getScoreIcon(optimizationScore)

  return (
    <Card className="border-primary/20">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-sm">
          <TrendingUp className="h-4 w-4 text-primary" />
          Optimization Score
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Overall Score */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Overall Completion</span>
            <div className="flex items-center gap-2">
              <ScoreIcon className={`h-4 w-4 ${getScoreColor(optimizationScore)}`} />
              <span className={`text-sm font-bold ${getScoreColor(optimizationScore)}`}>{optimizationScore}%</span>
            </div>
          </div>
          <Progress value={optimizationScore} className="h-2" />
        </div>

        {/* Section Breakdown */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium">Section Completion</h4>
          {sections.map((section) => {
            const score = completionMetrics[section.key as keyof typeof completionMetrics]
            const Icon = section.icon

            return (
              <div key={section.key} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Icon className="h-3 w-3 text-muted-foreground" />
                  <span className="text-xs">{section.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-16 h-1 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-primary transition-all duration-300" style={{ width: `${score}%` }} />
                  </div>
                  <span className="text-xs font-medium w-8 text-right">{score}%</span>
                </div>
              </div>
            )
          })}
        </div>

        {/* Quick Tips */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Quick Improvements</h4>
          <div className="space-y-1">
            {optimizationScore < 100 && (
              <>
                {completionMetrics.personalInfo < 100 && (
                  <div className="text-xs text-muted-foreground flex items-center gap-2">
                    <span className="text-yellow-600">•</span>
                    Complete your professional summary
                  </div>
                )}
                {completionMetrics.experience < 80 && (
                  <div className="text-xs text-muted-foreground flex items-center gap-2">
                    <span className="text-yellow-600">•</span>
                    Add more detailed job descriptions
                  </div>
                )}
                {completionMetrics.skills < 75 && (
                  <div className="text-xs text-muted-foreground flex items-center gap-2">
                    <span className="text-yellow-600">•</span>
                    Include more skill categories
                  </div>
                )}
              </>
            )}
            {optimizationScore >= 100 && (
              <div className="text-xs text-green-600 flex items-center gap-2">
                <CheckCircle className="h-3 w-3" />
                Your resume is well-optimized!
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
