import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Lightbulb, FileText, Target, Zap } from "lucide-react"

export function ATSTips() {
  const tips = [
    {
      category: "Format",
      icon: FileText,
      tips: [
        "Use standard section headings (Experience, Education, Skills)",
        "Avoid headers, footers, and complex layouts",
        "Use simple bullet points, not symbols or graphics",
        "Save as .docx or .pdf format",
      ],
    },
    {
      category: "Keywords",
      icon: Target,
      tips: [
        "Include exact keywords from job descriptions",
        "Use both acronyms and full terms (AI & Artificial Intelligence)",
        "Place keywords naturally throughout your resume",
        "Include industry-specific terminology",
      ],
    },
    {
      category: "Content",
      icon: Zap,
      tips: [
        "Use standard fonts (Arial, Calibri, Times New Roman)",
        "Keep consistent formatting throughout",
        "Include contact information in text format",
        "Use chronological or reverse-chronological order",
      ],
    },
  ]

  return (
    <Card className="border-primary/20">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-sm">
          <Lightbulb className="h-4 w-4 text-primary" />
          ATS Optimization Tips
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {tips.map((category, index) => {
          const Icon = category.icon
          return (
            <div key={index} className="space-y-2">
              <div className="flex items-center gap-2">
                <Icon className="h-4 w-4 text-primary" />
                <Badge variant="outline" className="text-xs">
                  {category.category}
                </Badge>
              </div>
              <ul className="text-xs space-y-1 ml-6">
                {category.tips.map((tip, tipIndex) => (
                  <li key={tipIndex} className="flex items-start gap-2 text-muted-foreground">
                    <span className="text-primary">•</span>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
