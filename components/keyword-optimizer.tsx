"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Loader2, Target, TrendingUp, AlertCircle } from "lucide-react"

interface KeywordOptimizerProps {
  content: string
  industry: string
  jobDescription?: string
}

interface OptimizationResult {
  missingKeywords: string[]
  keywordDensity: { [key: string]: number }
  atsScore: number
  suggestions: string[]
}

export function KeywordOptimizer({ content, industry, jobDescription }: KeywordOptimizerProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [result, setResult] = useState<OptimizationResult | null>(null)

  const analyzeKeywords = async () => {
    setIsAnalyzing(true)
    try {
      const response = await fetch("/api/ai/optimize-keywords", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content,
          jobDescription,
          industry,
        }),
      })

      const data = await response.json()
      setResult(data)
    } catch (error) {
      console.error("Failed to analyze keywords:", error)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 8) return "text-green-600"
    if (score >= 6) return "text-yellow-600"
    return "text-red-600"
  }

  return (
    <Card className="border-primary/20">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-sm">
          <Target className="h-4 w-4 text-primary" />
          ATS Keyword Optimizer
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button onClick={analyzeKeywords} disabled={isAnalyzing || !content.trim()} className="w-full" size="sm">
          {isAnalyzing ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <Target className="h-4 w-4 mr-2" />
              Analyze Keywords
            </>
          )}
        </Button>

        {result && (
          <div className="space-y-4">
            {/* ATS Score */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">ATS Compatibility Score</span>
                <span className={`text-sm font-bold ${getScoreColor(result.atsScore)}`}>{result.atsScore}/10</span>
              </div>
              <Progress value={result.atsScore * 10} className="h-2" />
            </div>

            {/* Missing Keywords */}
            {result.missingKeywords.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-yellow-600" />
                  Missing Keywords
                </h4>
                <div className="flex flex-wrap gap-1">
                  {result.missingKeywords.map((keyword, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {keyword}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Suggestions */}
            {result.suggestions.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-blue-600" />
                  Improvement Suggestions
                </h4>
                <ul className="text-xs space-y-1 text-muted-foreground">
                  {result.suggestions.map((suggestion, index) => (
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
