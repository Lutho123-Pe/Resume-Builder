"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Loader2, Search, CheckCircle, XCircle, Lightbulb } from "lucide-react"

interface JobMatcherProps {
  resumeContent: string
}

interface MatchResult {
  matchPercentage: number
  matchingSkills: string[]
  missingRequirements: string[]
  suggestions: string[]
  keywordsToAdd: string[]
}

export function JobMatcher({ resumeContent }: JobMatcherProps) {
  const [jobDescription, setJobDescription] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [result, setResult] = useState<MatchResult | null>(null)

  const analyzeMatch = async () => {
    setIsAnalyzing(true)
    try {
      const response = await fetch("/api/ai/match-job", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resumeContent,
          jobDescription,
        }),
      })

      const data = await response.json()
      setResult(data)
    } catch (error) {
      console.error("Failed to analyze job match:", error)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const getMatchColor = (percentage: number) => {
    if (percentage >= 80) return "text-green-600"
    if (percentage >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  return (
    <Card className="border-primary/20">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-sm">
          <Search className="h-4 w-4 text-primary" />
          Job Description Matcher
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Textarea
          placeholder="Paste the job description here to analyze how well your resume matches..."
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          className="min-h-[100px] text-sm"
        />

        <Button
          onClick={analyzeMatch}
          disabled={isAnalyzing || !jobDescription.trim() || !resumeContent.trim()}
          className="w-full"
          size="sm"
        >
          {isAnalyzing ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Analyzing Match...
            </>
          ) : (
            <>
              <Search className="h-4 w-4 mr-2" />
              Analyze Job Match
            </>
          )}
        </Button>

        {result && (
          <div className="space-y-4">
            {/* Match Percentage */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Job Match Score</span>
                <span className={`text-sm font-bold ${getMatchColor(result.matchPercentage)}`}>
                  {result.matchPercentage}%
                </span>
              </div>
              <Progress value={result.matchPercentage} className="h-2" />
            </div>

            {/* Matching Skills */}
            {(result.matchingSkills?.length ?? 0) > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  Matching Qualifications
                </h4>
                <div className="flex flex-wrap gap-1">
                  {(result.matchingSkills || []).map((skill, index) => (
                    <Badge key={index} variant="default" className="text-xs bg-green-100 text-green-800">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Missing Requirements */}
            {(result.missingRequirements?.length ?? 0) > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium flex items-center gap-2">
                  <XCircle className="h-4 w-4 text-red-600" />
                  Missing Requirements
                </h4>
                <div className="flex flex-wrap gap-1">
                  {(result.missingRequirements || []).map((req, index) => (
                    <Badge key={index} variant="outline" className="text-xs border-red-200 text-red-700">
                      {req}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Keywords to Add */}
            {(result.keywordsToAdd?.length ?? 0) > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium flex items-center gap-2">
                  <Lightbulb className="h-4 w-4 text-blue-600" />
                  Keywords to Add
                </h4>
                <div className="flex flex-wrap gap-1">
                  {(result.keywordsToAdd || []).map((keyword, index) => (
                    <Badge key={index} variant="outline" className="text-xs border-blue-200 text-blue-700">
                      {keyword}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Suggestions */}
            {(result.suggestions?.length ?? 0) > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Improvement Suggestions</h4>
                <ul className="text-xs space-y-1 text-muted-foreground">
                  {(result.suggestions || []).map((suggestion, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      {suggestion}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
