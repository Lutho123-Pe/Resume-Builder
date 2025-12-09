"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2, TrendingUp, Award, Users, Briefcase, Target, Lightbulb } from "lucide-react"

interface IndustryOptimizerProps {
  resumeData: any
}

interface OptimizationResult {
  industryKeywords: string[]
  skillsGaps: Array<{
    skill: string
    importance: "high" | "medium" | "low"
    suggestion: string
  }>
  experienceReframing: Array<{
    section: string
    current: string
    suggested: string
    reason: string
  }>
  industryTrends: string[]
  certifications: Array<{
    name: string
    provider: string
    priority: "high" | "medium" | "low"
  }>
  networkingSuggestions: string[]
  portfolioRecommendations: string[]
  interviewTips: string[]
}

export function IndustryOptimizer({ resumeData }: IndustryOptimizerProps) {
  const [targetIndustry, setTargetIndustry] = useState("")
  const [targetRole, setTargetRole] = useState("")
  const [isOptimizing, setIsOptimizing] = useState(false)
  const [optimization, setOptimization] = useState<OptimizationResult | null>(null)

  const industries = [
    "Technology",
    "Healthcare",
    "Finance",
    "Marketing",
    "Education",
    "Manufacturing",
    "Retail",
    "Consulting",
    "Non-Profit",
    "Government",
  ]

  const roles = [
    "Software Engineer",
    "Product Manager",
    "Data Scientist",
    "Marketing Manager",
    "Sales Representative",
    "Business Analyst",
    "Designer",
    "Project Manager",
    "Operations Manager",
    "Customer Success Manager",
  ]

  const runOptimization = async () => {
    if (!targetIndustry || !targetRole) return

    setIsOptimizing(true)
    try {
      const response = await fetch("/api/ai/industry-optimization", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resumeData,
          targetIndustry,
          targetRole,
        }),
      })

      const data = await response.json()
      setOptimization(data)
    } catch (error) {
      console.error("Failed to run optimization:", error)
    } finally {
      setIsOptimizing(false)
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "low":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  return (
    <Card className="border-primary/20">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-sm">
          <TrendingUp className="h-4 w-4 text-primary" />
          Industry Optimization
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 gap-3">
          <Select value={targetIndustry} onValueChange={setTargetIndustry}>
            <SelectTrigger>
              <SelectValue placeholder="Select target industry" />
            </SelectTrigger>
            <SelectContent>
              {industries.map((industry) => (
                <SelectItem key={industry} value={industry}>
                  {industry}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={targetRole} onValueChange={setTargetRole}>
            <SelectTrigger>
              <SelectValue placeholder="Select target role" />
            </SelectTrigger>
            <SelectContent>
              {roles.map((role) => (
                <SelectItem key={role} value={role}>
                  {role}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button
          onClick={runOptimization}
          disabled={isOptimizing || !targetIndustry || !targetRole}
          className="w-full"
          size="sm"
        >
          {isOptimizing ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Optimizing...
            </>
          ) : (
            <>
              <Target className="h-4 w-4 mr-2" />
              Optimize for {targetIndustry}
            </>
          )}
        </Button>

        {optimization && (
          <Tabs defaultValue="keywords" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="keywords">Keywords</TabsTrigger>
              <TabsTrigger value="skills">Skills</TabsTrigger>
              <TabsTrigger value="growth">Growth</TabsTrigger>
              <TabsTrigger value="tips">Tips</TabsTrigger>
            </TabsList>

            <TabsContent value="keywords" className="space-y-3">
              <div className="space-y-2">
                <h4 className="text-sm font-medium flex items-center gap-2">
                  <Target className="h-4 w-4 text-blue-600" />
                  Industry Keywords to Add
                </h4>
                <div className="flex flex-wrap gap-1">
                  {Array.isArray(optimization.industryKeywords) && optimization.industryKeywords.map((keyword, index) => (
                    <Badge key={index} variant="outline" className="text-xs border-blue-200 text-blue-700">
                      {keyword}
                    </Badge>
                  ))}
                </div>
              </div>

              {Array.isArray(optimization.experienceReframing) && optimization.experienceReframing.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium flex items-center gap-2">
                    <Briefcase className="h-4 w-4 text-purple-600" />
                    Experience Reframing
                  </h4>
                  <div className="space-y-2">
                    {optimization.experienceReframing.slice(0, 2).map((reframe, index) => (
                      <div key={index} className="p-2 border rounded text-xs">
                        <div className="font-medium text-purple-700">{reframe.section}</div>
                        <div className="text-muted-foreground mt-1">{reframe.reason}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="skills" className="space-y-3">
              {Array.isArray(optimization.skillsGaps) && optimization.skillsGaps.map((gap, index) => (
                <div key={index} className="p-3 border rounded space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-sm">{gap.skill}</span>
                    <Badge className={`text-xs ${getPriorityColor(gap.importance)}`}>{gap.importance} priority</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">{gap.suggestion}</p>
                </div>
              ))}
            </TabsContent>

            <TabsContent value="growth" className="space-y-3">
              {Array.isArray(optimization.certifications) && optimization.certifications.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium flex items-center gap-2">
                    <Award className="h-4 w-4 text-yellow-600" />
                    Recommended Certifications
                  </h4>
                  <div className="space-y-2">
                    {optimization.certifications.map((cert, index) => (
                      <div key={index} className="flex items-center justify-between p-2 border rounded">
                        <div>
                          <div className="font-medium text-xs">{cert.name}</div>
                          <div className="text-xs text-muted-foreground">{cert.provider}</div>
                        </div>
                        <Badge className={`text-xs ${getPriorityColor(cert.priority)}`}>{cert.priority}</Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {Array.isArray(optimization.industryTrends) && optimization.industryTrends.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-green-600" />
                    Industry Trends
                  </h4>
                  <ul className="text-xs space-y-1">
                    {optimization.industryTrends.map((trend, index) => (
                      <li key={index} className="flex items-start gap-2 text-muted-foreground">
                        <span className="text-primary">•</span>
                        {trend}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </TabsContent>

            <TabsContent value="tips" className="space-y-3">
              {Array.isArray(optimization.networkingSuggestions) && optimization.networkingSuggestions.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium flex items-center gap-2">
                    <Users className="h-4 w-4 text-blue-600" />
                    Networking Tips
                  </h4>
                  <ul className="text-xs space-y-1">
                    {optimization.networkingSuggestions.slice(0, 3).map((tip, index) => (
                      <li key={index} className="flex items-start gap-2 text-muted-foreground">
                        <span className="text-primary">•</span>
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {Array.isArray(optimization.portfolioRecommendations) && optimization.portfolioRecommendations.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium flex items-center gap-2">
                    <Briefcase className="h-4 w-4 text-purple-600" />
                    Portfolio Recommendations
                  </h4>
                  <ul className="text-xs space-y-1">
                    {optimization.portfolioRecommendations.slice(0, 3).map((tip, index) => (
                      <li key={index} className="flex items-start gap-2 text-muted-foreground">
                        <span className="text-primary">•</span>
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {Array.isArray(optimization.interviewTips) && optimization.interviewTips.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium flex items-center gap-2">
                    <Lightbulb className="h-4 w-4 text-yellow-600" />
                    Interview Preparation
                  </h4>
                  <ul className="text-xs space-y-1">
                    {optimization.interviewTips.slice(0, 3).map((tip, index) => (
                      <li key={index} className="flex items-start gap-2 text-muted-foreground">
                        <span className="text-primary">•</span>
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </TabsContent>
          </Tabs>
        )}
      </CardContent>
    </Card>
  )
}
