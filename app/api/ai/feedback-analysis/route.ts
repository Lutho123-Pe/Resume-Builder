import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { originalContent, editedContent, editType } = await request.json()

    // Analyze the changes made
    const originalLength = originalContent?.length || 0
    const editedLength = editedContent?.length || 0
    const lengthChange = editedLength - originalLength

    // Determine change type and quality
    let changeAnalysis = ""
    let editQuality: "excellent" | "good" | "neutral" | "poor" = "neutral"
    const userPreferences: string[] = []

    if (lengthChange > 50) {
      changeAnalysis = "User expanded content significantly, likely adding more detail or examples"
      editQuality = "good"
      userPreferences.push("prefers detailed descriptions", "values comprehensive information")
    } else if (lengthChange < -50) {
      changeAnalysis = "User condensed content, focusing on brevity and key points"
      editQuality = "good"
      userPreferences.push("prefers concise content", "values clarity over detail")
    } else if (Math.abs(lengthChange) <= 50) {
      changeAnalysis = "User made minor refinements, likely improving word choice or structure"
      editQuality = "excellent"
      userPreferences.push("attention to detail", "values precision in language")
    }

    // Analyze edit patterns based on edit type
    if (editType === "summary") {
      userPreferences.push("focuses on personal branding", "values professional positioning")
    } else if (editType === "experience") {
      userPreferences.push("emphasizes achievements", "values quantifiable results")
    } else if (editType === "skills") {
      userPreferences.push("technical accuracy", "industry-specific terminology")
    }

    // Check for common improvements
    const hasNumbers = /\d+/.test(editedContent)
    const hasActionVerbs = /\b(achieved|managed|led|developed|implemented|created|improved|increased|reduced)\b/i.test(
      editedContent,
    )
    const hasIndustryTerms = editedContent?.length > originalLength && editedContent.includes(originalContent)

    if (hasNumbers && !originalContent.match(/\d+/)) {
      editQuality = "excellent"
      userPreferences.push("quantifies achievements", "data-driven approach")
    }

    if (
      hasActionVerbs &&
      !originalContent.match(/\b(achieved|managed|led|developed|implemented|created|improved|increased|reduced)\b/i)
    ) {
      editQuality = "excellent"
      userPreferences.push("uses strong action verbs", "results-oriented language")
    }

    const feedback = {
      changeAnalysis,
      userPreferences: [...new Set(userPreferences)], // Remove duplicates
      editQuality,
      futureRecommendations: [
        editQuality === "excellent"
          ? "Continue with similar editing approach"
          : "Consider adding more specific details",
        lengthChange > 0 ? "Balance detail with readability" : "Ensure key information isn't lost in brevity",
        hasNumbers ? "Maintain quantifiable metrics" : "Consider adding measurable achievements",
        hasActionVerbs ? "Keep using strong action verbs" : "Use more dynamic language to describe accomplishments",
      ],
      learningPoints: [
        `User editing style: ${lengthChange > 0 ? "expansive" : lengthChange < 0 ? "concise" : "refinement-focused"}`,
        `Quality preference: ${editQuality}`,
        `Content focus: ${editType} optimization`,
        `Improvement areas: ${!hasNumbers ? "quantification, " : ""}${!hasActionVerbs ? "action-oriented language" : "maintain current approach"}`,
      ],
    }

    return NextResponse.json(feedback)
  } catch (error) {
    console.error("Feedback analysis error:", error)
    return NextResponse.json({ error: "Failed to analyze feedback" }, { status: 500 })
  }
}
