import { type NextRequest, NextResponse } from "next/server"

function analyzeATSCompatibility(resumeData: any, template: string) {
  const requiredSections = ["personalInfo", "experience", "education", "skills"]
  const optionalSections = ["summary", "projects", "certifications", "awards"]

  let atsScore = 100
  const sectionAnalysis = []
  const formattingIssues = []
  const missingSections = []
  const criticalIssues = []

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
      // Analyze section content
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
        })
      }

      if (section === "skills" && Array.isArray(sectionData) && sectionData.length < 5) {
        issues.push("Too few skills listed")
        suggestions.push("Add more relevant technical and soft skills")
        sectionScore -= 10
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

  // General formatting checks
  const totalContent = JSON.stringify(resumeData).length
  if (totalContent < 500) {
    formattingIssues.push("Resume content appears too brief")
    atsScore -= 15
  }

  // Keyword analysis
  const keywordDensity = Math.min(100, totalContent / 50) // Simple density calculation
  const keywordAnalysis = {
    density: Math.round(keywordDensity),
    suggestions: [
      "Include industry-specific keywords throughout your resume",
      "Use keywords from job descriptions you're targeting",
      "Balance keyword usage to avoid over-optimization",
    ],
  }

  // Generate recommendations
  const recommendations = [
    "Use standard section headings (Experience, Education, Skills)",
    "Save resume in PDF format for best ATS compatibility",
    "Use simple, clean formatting without complex layouts",
    "Include relevant keywords naturally in your content",
    "Quantify achievements with specific numbers and metrics",
  ]

  if (missingSections.length > 0) {
    recommendations.unshift("Add all required resume sections")
  }

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

export async function POST(request: NextRequest) {
  try {
    const { resumeData, template } = await request.json()

    if (!resumeData) {
      return NextResponse.json({ error: "Resume data is required" }, { status: 400 })
    }

    const analysis = analyzeATSCompatibility(resumeData, template || "modern")

    return NextResponse.json(analysis)
  } catch (error) {
    console.error("ATS analysis error:", error)
    return NextResponse.json({ error: "Failed to analyze ATS compatibility" }, { status: 500 })
  }
}
