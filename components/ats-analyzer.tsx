"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2, Shield, AlertTriangle, CheckCircle, XCircle, TrendingUp, FileText, Target } from "lucide-react"

interface ATSAnalyzerProps {
  resumeData: any
  template: string
}

interface ATSAnalysis {
  atsScore: number
  sectionAnalysis: Array<{
    section: string
    score: number
    issues: string[]
    suggestions: string[]
  }>
  formattingIssues: string[]
  missingSection: string[]
  keywordAnalysis: {
    density: number
    suggestions: string[]
  }
  recommendations: string[]
  criticalIssues: string[]
}

export function ATSAnalyzer({ resumeData, template }: ATSAnalyzerProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysis, setAnalysis] = useState<ATSAnalysis | null>(null)

  const runATSAnalysis = async () => {
    setIsAnalyzing(true)
    try {
      const response = await fetch("/api/ai/ats-analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resumeData,
          template,
        }),
      })

      const data = await response.json()
      setAnalysis(data)
    } catch (error) {
      console.error("Failed to analyze ATS compatibility:", error)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600"
    if (score >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  const getScoreBadgeVariant = (score: number) => {
    if (score >= 80) return "default"
    if (score >= 60) return "secondary"
    return "destructive"
  }

  return (
    <Card className="border-primary/20">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-sm">
          <Shield className="h-4 w-4 text-primary" />
          ATS Compatibility Analyzer
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button onClick={runATSAnalysis} disabled={isAnalyzing} className="w-full" size="sm">
          {isAnalyzing ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Analyzing ATS Compatibility...
            </>
          ) : (
            <>
              <Shield className="h-4 w-4 mr-2" />
              Run ATS Analysis
            </>
          )}
        </Button>

        {analysis && (
          <div className="space-y-4">
            {/* Overall Score */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">ATS Compatibility Score</span>
                <Badge variant={getScoreBadgeVariant(analysis.atsScore)}>{analysis.atsScore}/100</Badge>
              </div>
              <Progress value={analysis.atsScore} className="h-2" />
              <p className="text-xs text-muted-foreground">
                {analysis.atsScore >= 80
                  ? "Excellent ATS compatibility"
                  : analysis.atsScore >= 60
                    ? "Good compatibility with room for improvement"
                    : "Needs significant ATS optimization"}
              </p>
            </div>

            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="sections">Sections</TabsTrigger>
                <TabsTrigger value="formatting">Format</TabsTrigger>
                <TabsTrigger value="keywords">Keywords</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-3">
                {/* Critical Issues */}
                {analysis.criticalIssues.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium flex items-center gap-2">
                      <XCircle className="h-4 w-4 text-red-600" />
                      Critical Issues
                    </h4>
                    <ul className="text-xs space-y-1">
                      {analysis.criticalIssues.map((issue, index) => (
                        <li key={index} className="flex items-start gap-2 text-red-700">
                          <span className="text-red-600">•</span>
                          {issue}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Top Recommendations */}
                {analysis.recommendations.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-blue-600" />
                      Top Recommendations
                    </h4>
                    <ul className="text-xs space-y-1">
                      {analysis.recommendations.slice(0, 3).map((rec, index) => (
                        <li key={index} className="flex items-start gap-2 text-muted-foreground">
                          <span className="text-primary">•</span>
                          {rec}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="sections" className="space-y-3">
                {analysis.sectionAnalysis.map((section, index) => (
                  <div key={index} className="border rounded-lg p-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{section.section}</span>
                      <Badge variant={getScoreBadgeVariant(section.score)}>{section.score}/100</Badge>
                    </div>

                    {section.issues.length > 0 && (
                      <div className="space-y-1">
                        <span className="text-xs font-medium text-red-600">Issues:</span>
                        <ul className="text-xs space-y-1">
                          {section.issues.map((issue, i) => (
                            <li key={i} className="flex items-start gap-2 text-red-700">
                              <span>•</span>
                              {issue}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {section.suggestions.length > 0 && (
                      <div className="space-y-1">
                        <span className="text-xs font-medium text-blue-600">Suggestions:</span>
                        <ul className="text-xs space-y-1">
                          {section.suggestions.map((suggestion, i) => (
                            <li key={i} className="flex items-start gap-2 text-muted-foreground">
                              <span className="text-primary">•</span>
                              {suggestion}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </TabsContent>

              <TabsContent value="formatting" className="space-y-3">
                {analysis.formattingIssues.length > 0 ? (
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-yellow-600" />
                      Formatting Issues
                    </h4>
                    <ul className="text-xs space-y-1">
                      {analysis.formattingIssues.map((issue, index) => (
                        <li key={index} className="flex items-start gap-2 text-yellow-700">
                          <span className="text-yellow-600">•</span>
                          {issue}
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-green-600">
                    <CheckCircle className="h-4 w-4" />
                    <span className="text-sm">No formatting issues detected</span>
                  </div>
                )}

                {analysis.missingSection && analysis.missingSection.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium flex items-center gap-2">
                      <FileText className="h-4 w-4 text-orange-600" />
                      Missing Sections
                    </h4>
                    <div className="flex flex-wrap gap-1">
                      {analysis.missingSection.map((section, index) => (
                        <Badge key={index} variant="outline" className="text-xs border-orange-200 text-orange-700">
                          {section}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="keywords" className="space-y-3">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Keyword Density</span>
                    <span className="text-sm font-bold">{analysis.keywordAnalysis.density}%</span>
                  </div>
                  <Progress value={analysis.keywordAnalysis.density} className="h-2" />
                  <p className="text-xs text-muted-foreground">
                    {analysis.keywordAnalysis.density >= 2
                      ? "Good keyword density for ATS"
                      : "Consider adding more relevant keywords"}
                  </p>
                </div>

                {analysis.keywordAnalysis.suggestions.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium flex items-center gap-2">
                      <Target className="h-4 w-4 text-blue-600" />
                      Keyword Suggestions
                    </h4>
                    <div className="flex flex-wrap gap-1">
                      {analysis.keywordAnalysis.suggestions.map((keyword, index) => (
                        <Badge key={index} variant="outline" className="text-xs border-blue-200 text-blue-700">
                          {keyword}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
