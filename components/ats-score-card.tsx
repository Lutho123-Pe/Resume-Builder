import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Shield, TrendingUp, AlertTriangle, CheckCircle } from "lucide-react"

interface ATSScoreCardProps {
  score: number
  issues: number
  recommendations: number
  className?: string
}

export function ATSScoreCard({ score, issues, recommendations, className }: ATSScoreCardProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600"
    if (score >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  const getScoreStatus = (score: number) => {
    if (score >= 80) return { text: "Excellent", color: "text-green-600", icon: CheckCircle }
    if (score >= 60) return { text: "Good", color: "text-yellow-600", icon: TrendingUp }
    return { text: "Needs Work", color: "text-red-600", icon: AlertTriangle }
  }

  const status = getScoreStatus(score)
  const StatusIcon = status.icon

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-sm">
          <Shield className="h-4 w-4 text-primary" />
          ATS Compatibility
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Overall Score</span>
            <div className="flex items-center gap-2">
              <StatusIcon className={`h-4 w-4 ${status.color}`} />
              <span className={`text-sm font-bold ${getScoreColor(score)}`}>{score}/100</span>
            </div>
          </div>
          <Progress value={score} className="h-2" />
          <p className={`text-xs ${status.color}`}>{status.text}</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-lg font-bold text-red-600">{issues}</div>
            <div className="text-xs text-muted-foreground">Issues Found</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-blue-600">{recommendations}</div>
            <div className="text-xs text-muted-foreground">Suggestions</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
