import { type NextRequest, NextResponse } from "next/server"

function analyzeATSCompatibility(resumeData: any, template: string, careerKeywords: string[] = []) {
  const requiredSections = ["personalInfo", "experience", "education", "skills"]
  const optionalSections = ["summary", "projects", "certifications", "awards"]

  let atsScore = 100
  const sectionAnalysis = []
  const formattingIssues = []
  const missingSections = []
  const criticalIssues = []

  // Extract all text content from resume for keyword analysis
  const resumeText = extractResumeText(resumeData).toLowerCase()
  const careerKeywordsLower = careerKeywords.map((k) => k.toLowerCase())

  // Check required sections
  for (const section of requiredSections) {
    const sectionData = resumeData[section]
    let sectionScore = 100
    const issues = []
    const suggestions = []

    if (!sectionData || (Array.isArray(sectionData) && sectionData.length === 0)) {
      missingSections.push(section)
      sectionScore = 0
      atsScore -= 20
      criticalIssues.push(`Missing required section: ${section}`)
    } else {
      // Analyze section content based on actual user data
      if (section === "experience" && Array.isArray(sectionData)) {
        sectionData.forEach((exp, index) => {
          if (!exp.jobTitle || exp.jobTitle.length < 2) {
            issues.push(`Experience ${index + 1}: Missing or too short job title`)
            sectionScore -= 10
          }
          if (!exp.company || exp.company.length < 2) {
            issues.push(`Experience ${index + 1}: Missing or too short company name`)
            sectionScore -= 10
          }
          if (!exp.description || exp.description.length < 50) {
            issues.push(`Experience ${index + 1}: Description too short or missing`)
            suggestions.push("Add detailed job descriptions with quantifiable achievements")
            sectionScore -= 15
          }

          // Check if experience aligns with career keywords
          const expText = (exp.description || "").toLowerCase()
          const keywordMatches = careerKeywordsLower.filter((keyword) => expText.includes(keyword))
          if (careerKeywords.length > 0 && keywordMatches.length === 0) {
            suggestions.push(
              `Experience ${index + 1}: Consider incorporating career-relevant keywords: ${careerKeywords.slice(0, 3).join(", ")}`,
            )
            sectionScore -= 5
          }
        })
      }

      if (section === "skills" && Array.isArray(sectionData)) {
        if (sectionData.length < 5) {
          issues.push("Too few skills listed")
          suggestions.push("Add more relevant technical and soft skills")
          sectionScore -= 10
        }

        // Check skill alignment with career goals
        const skillNames = sectionData.map((s) => (s.name || "").toLowerCase())
        const skillKeywordMatches = careerKeywordsLower.filter((keyword) =>
          skillNames.some((skill) => skill.includes(keyword)),
        )
        if (careerKeywords.length > 0 && skillKeywordMatches.length < careerKeywords.length * 0.3) {
          suggestions.push(`Add skills related to your career goals: ${careerKeywords.slice(0, 3).join(", ")}`)
          sectionScore -= 10
        }
      }

      if (section === "personalInfo") {
        if (!sectionData.email || !sectionData.email.includes("@")) {
          issues.push("Missing or invalid email address")
          sectionScore -= 20
          criticalIssues.push("Valid email address is required")
        }
        if (!sectionData.phone || sectionData.phone.length < 10) {
          issues.push("Missing or invalid phone number")
          sectionScore -= 15
        }

        // Check if summary aligns with career keywords
        if (sectionData.summary && careerKeywords.length > 0) {
          const summaryText = sectionData.summary.toLowerCase()
          const summaryKeywordMatches = careerKeywordsLower.filter((keyword) => summaryText.includes(keyword))
          if (summaryKeywordMatches.length < careerKeywords.length * 0.5) {
            suggestions.push(
              `Professional summary should include more career-relevant keywords: ${careerKeywords.slice(0, 3).join(", ")}`,
            )
            sectionScore -= 5
          }
        }
      }
    }

    sectionAnalysis.push({
      section,
      score: Math.max(0, sectionScore),
      issues,
      suggestions,
    })

    atsScore -= Math.max(0, 100 - sectionScore) * 0.2
  }

  // Template-specific analysis
  if (template === "creative") {
    formattingIssues.push("Creative templates may have ATS parsing issues")
    atsScore -= 10
  }

  // Enhanced keyword analysis based on actual content and career goals
  const keywordAnalysis = analyzeKeywordDensity(resumeText, careerKeywords)

  const recommendations = generatePersonalizedRecommendations(resumeData, careerKeywords, missingSections)

  return {
    atsScore: Math.max(0, Math.round(atsScore)),
    sectionAnalysis,
    formattingIssues,
    missingSections,
    keywordAnalysis,
    recommendations: recommendations.slice(0, 6),
    criticalIssues,
  }
}

function extractResumeText(resumeData: any): string {
  let text = ""

  if (resumeData.personalInfo?.summary) {
    text += resumeData.personalInfo.summary + " "
  }

  if (Array.isArray(resumeData.experience)) {
    resumeData.experience.forEach((exp: any) => {
      text += (exp.jobTitle || "") + " " + (exp.company || "") + " " + (exp.description || "") + " "
    })
  }

  if (Array.isArray(resumeData.skills)) {
    resumeData.skills.forEach((skill: any) => {
      text += (skill.name || "") + " "
    })
  }

  if (Array.isArray(resumeData.education)) {
    resumeData.education.forEach((edu: any) => {
      text += (edu.degree || "") + " " + (edu.school || "") + " " + (edu.field || "") + " "
    })
  }

  return text
}

function analyzeKeywordDensity(resumeText: string, careerKeywords: string[]) {
  const totalWords = resumeText.split(/\s+/).length
  const keywordMatches = careerKeywords.filter((keyword) => resumeText.toLowerCase().includes(keyword.toLowerCase()))

  const density = totalWords > 0 ? Math.round((keywordMatches.length / totalWords) * 100) : 0

  return {
    density: Math.min(100, density * 10), // Scale for better representation
    matchedKeywords: keywordMatches,
    missingKeywords: careerKeywords.filter((keyword) => !resumeText.toLowerCase().includes(keyword.toLowerCase())),
    suggestions: [
      "Include industry-specific keywords throughout your resume",
      "Use keywords from job descriptions you're targeting",
      "Balance keyword usage to avoid over-optimization",
      careerKeywords.length > 0 ? `Focus on incorporating: ${careerKeywords.slice(0, 3).join(", ")}` : null,
    ].filter(Boolean),
  }
}

function generatePersonalizedRecommendations(resumeData: any, careerKeywords: string[], missingSections: string[]) {
  const recommendations = []

  if (missingSections.length > 0) {
    recommendations.push("Add all required resume sections")
  }

  if (careerKeywords.length > 0) {
    recommendations.push(`Incorporate career-relevant keywords: ${careerKeywords.slice(0, 3).join(", ")}`)
  }

  if (resumeData.experience && Array.isArray(resumeData.experience)) {
    const hasQuantifiedAchievements = resumeData.experience.some(
      (exp: any) => exp.description && /\d+/.test(exp.description),
    )
    if (!hasQuantifiedAchievements) {
      recommendations.push("Add quantified achievements with specific numbers and metrics")
    }
  }

  recommendations.push(
    "Use standard section headings (Experience, Education, Skills)",
    "Save resume in PDF format for best ATS compatibility",
    "Use simple, clean formatting without complex layouts",
  )

  return recommendations
}

export async function POST(request: NextRequest) {
  try {
    const { resumeData, template, careerKeywords } = await request.json()

    if (!resumeData) {
      return NextResponse.json({ error: "Resume data is required" }, { status: 400 })
    }

    const analysis = analyzeATSCompatibility(resumeData, template || "modern", careerKeywords || [])

    return NextResponse.json(analysis)
  } catch (error) {
    console.error("ATS analysis error:", error)
    return NextResponse.json({ error: "Failed to analyze ATS compatibility" }, { status: 500 })
  }
}
