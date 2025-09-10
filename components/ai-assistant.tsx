"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, Sparkles } from "lucide-react"

interface AIAssistantProps {
  section: "summary" | "experience" | "skills"
  userInput: string
  jobTitle: string
  industry: string
  onContentGenerated: (content: string) => void
}

export function AIAssistant({ section, userInput, jobTitle, industry, onContentGenerated }: AIAssistantProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedContent, setGeneratedContent] = useState("")

  const generateContent = async () => {
    setIsGenerating(true)
    try {
      const response = await fetch("/api/ai/generate-content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          section,
          userInput,
          jobTitle,
          industry,
          context: `Generate professional ${section} content`,
        }),
      })

      const data = await response.json()
      if (data.content) {
        setGeneratedContent(data.content)
      }
    } catch (error) {
      console.error("Failed to generate content:", error)
    } finally {
      setIsGenerating(false)
    }
  }

  const useGenerated = () => {
    onContentGenerated(generatedContent)
    setGeneratedContent("")
  }

  return (
    <Card className="border-primary/20">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-sm">
          <Sparkles className="h-4 w-4 text-primary" />
          AI Assistant
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Button onClick={generateContent} disabled={isGenerating || !userInput.trim()} className="w-full" size="sm">
          {isGenerating ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4 mr-2" />
              Generate {section} content
            </>
          )}
        </Button>

        {generatedContent && (
          <div className="space-y-3">
            <Textarea
              value={generatedContent}
              onChange={(e) => setGeneratedContent(e.target.value)}
              className="min-h-[100px] text-sm"
              placeholder="AI-generated content will appear here..."
            />
            <div className="flex gap-2">
              <Button onClick={useGenerated} size="sm" className="flex-1">
                Use This Content
              </Button>
              <Button onClick={generateContent} variant="outline" size="sm" disabled={isGenerating}>
                Regenerate
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
