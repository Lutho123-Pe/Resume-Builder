import { type NextRequest, NextResponse } from "next/server"

function analyzeJobMatch(resumeContent: string, jobDescription: string) {
  const resumeLower = resumeContent.toLowerCase()
  const jobLower = jobDescription.toLowerCase()

  // Extract common job-related keywords
  const commonSkills = [
    "javascript",
    "react",
    "node.js",
    "python",
    "sql",
    "git",
    "agile",
    "scrum",
    "leadership",
    "management",
    "communication",
    "teamwork",
    "problem solving",
    "analytical",
    "creative",
    "detail oriented",
    "customer service",
    "sales",
    "marketing",
    "finance",
    "healthcare",
    "education",
    "project management",
  ]

  // Find matching skills
  const matchingSkills = commonSkills.filter((skill) => resumeLower.includes(skill) && jobLower.includes(skill))

  // Find skills mentioned in job but missing from resume
  const jobSkills = commonSkills.filter((skill) => jobLower.includes(skill))
  const missingSkills = jobSkills.filter((skill) => !resumeLower.includes(skill))

  // Calculate match percentage based on skill overlap
  const matchPercentage = jobSkills.length > 0 ? Math.round((matchingSkills.length / jobSkills.length) * 100) : 50

  // Generate suggestions based on analysis
  const suggestions = [
    "Highlight relevant experience that matches job requirements",
    "Use keywords from the job description throughout your resume",
    "Quantify your achievements with specific metrics and results",
    "Tailor your professional summary to align with the role",
  ]

  if (missingSkills.length > 0) {
    suggestions.unshift(`Consider adding experience with: ${missingSkills.slice(0, 3).join(", ")}`)
  }

  return {
    matchPercentage,
    matchingSkills: matchingSkills.slice(0, 8),
    missingRequirements: missingSkills.slice(0, 6),
    suggestions: suggestions.slice(0, 5),
    keywordsToAdd: missingSkills.slice(0, 5),
  }
}

export async function POST(request: NextRequest) {
  try {
    const { resumeContent, jobDescription } = await request.json()

    if (!resumeContent || !jobDescription) {
      return NextResponse.json(
        {
          error: "Resume content and job description are required",
        },
        { status: 400 },
      )
    }

    const analysis = analyzeJobMatch(resumeContent, jobDescription)

    return NextResponse.json(analysis)
  } catch (error) {
    console.error("Job matching error:", error)
    return NextResponse.json({ error: "Failed to analyze job match" }, { status: 500 })
  }
}
