import { type NextRequest, NextResponse } from "next/server"

function analyzeJobMatch(resumeData: any, jobDescription: string, careerKeywords: string[] = []) {
  const resumeText = extractResumeContent(resumeData)
  const resumeLower = resumeText.toLowerCase()
  const jobLower = jobDescription.toLowerCase()

  // Extract keywords from job description using more sophisticated parsing
  const jobKeywords = extractJobKeywords(jobDescription)
  const careerKeywordsLower = careerKeywords.map((k) => k.toLowerCase())

  // Find matching skills and keywords
  const matchingSkills = jobKeywords.filter((keyword) => resumeLower.includes(keyword.toLowerCase()))
  const missingSkills = jobKeywords.filter((keyword) => !resumeLower.includes(keyword.toLowerCase()))

  // Analyze career keyword alignment
  const careerAlignment = careerKeywordsLower.filter((keyword) => jobLower.includes(keyword))
  const careerMisalignment = careerKeywordsLower.filter((keyword) => !jobLower.includes(keyword))

  // Calculate match percentage based on multiple factors
  const skillMatchScore = jobKeywords.length > 0 ? (matchingSkills.length / jobKeywords.length) * 60 : 30
  const careerAlignmentScore = careerKeywords.length > 0 ? (careerAlignment.length / careerKeywords.length) * 25 : 25
  const contentQualityScore = analyzeContentQuality(resumeData, jobDescription) * 15

  const matchPercentage = Math.round(skillMatchScore + careerAlignmentScore + contentQualityScore)

  // Generate personalized suggestions based on actual content analysis
  const suggestions = generateJobMatchSuggestions(resumeData, jobDescription, missingSkills, careerMisalignment)

  // Analyze specific sections for improvement
  const sectionAnalysis = analyzeSectionAlignment(resumeData, jobDescription, jobKeywords)

  return {
    matchPercentage: Math.min(100, matchPercentage),
    matchingSkills: matchingSkills.slice(0, 8),
    missingRequirements: missingSkills.slice(0, 6),
    careerAlignment: {
      aligned: careerAlignment,
      misaligned: careerMisalignment,
    },
    suggestions: suggestions.slice(0, 6),
    keywordsToAdd: missingSkills.slice(0, 5),
    sectionAnalysis,
  }
}

function extractResumeContent(resumeData: any): string {
  let content = ""

  if (resumeData.personalInfo?.summary) {
    content += resumeData.personalInfo.summary + " "
  }

  if (Array.isArray(resumeData.experience)) {
    resumeData.experience.forEach((exp: any) => {
      content += `${exp.jobTitle || ""} ${exp.company || ""} ${exp.description || ""} `
    })
  }

  if (Array.isArray(resumeData.skills)) {
    resumeData.skills.forEach((skill: any) => {
      content += `${skill.name || ""} `
    })
  }

  if (Array.isArray(resumeData.education)) {
    resumeData.education.forEach((edu: any) => {
      content += `${edu.degree || ""} ${edu.school || ""} ${edu.field || ""} `
    })
  }

  return content
}

function extractJobKeywords(jobDescription: string): string[] {
  const text = jobDescription.toLowerCase()

  // Common technical and professional keywords patterns
  const keywordPatterns = [
    /\b(javascript|python|java|react|node\.?js|sql|html|css|git|aws|docker|kubernetes)\b/g,
    /\b(agile|scrum|devops|ci\/cd|api|database|cloud|machine learning|ai|analytics)\b/g,
    /\b(leadership|management|communication|teamwork|problem solving|analytical)\b/g,
    /\b(project management|customer service|sales|marketing|finance|healthcare)\b/g,
    /\b(\d+\+?\s*years?\s*experience|\d+\+?\s*years?)\b/g,
  ]

  const keywords = new Set<string>()

  keywordPatterns.forEach((pattern) => {
    const matches = text.match(pattern) || []
    matches.forEach((match) => keywords.add(match.trim()))
  })

  // Extract degree requirements
  const degreeMatches = text.match(/\b(bachelor|master|phd|degree|certification)\b/g) || []
  degreeMatches.forEach((match) => keywords.add(match))

  return Array.from(keywords)
}

function analyzeContentQuality(resumeData: any, jobDescription: string): number {
  let qualityScore = 0

  // Check if experience descriptions are detailed and relevant
  if (Array.isArray(resumeData.experience)) {
    const avgDescriptionLength =
      resumeData.experience.reduce((sum: number, exp: any) => sum + (exp.description?.length || 0), 0) /
      resumeData.experience.length

    if (avgDescriptionLength > 100) qualityScore += 0.3
    if (avgDescriptionLength > 200) qualityScore += 0.2

    // Check for quantified achievements
    const hasMetrics = resumeData.experience.some(
      (exp: any) => exp.description && /\d+(%|\$|k|million|thousand)/.test(exp.description),
    )
    if (hasMetrics) qualityScore += 0.3
  }

  // Check summary quality
  if (resumeData.personalInfo?.summary && resumeData.personalInfo.summary.length > 50) {
    qualityScore += 0.2
  }

  return Math.min(1, qualityScore)
}

function generateJobMatchSuggestions(
  resumeData: any,
  jobDescription: string,
  missingSkills: string[],
  careerMisalignment: string[],
): string[] {
  const suggestions = []

  if (missingSkills.length > 0) {
    suggestions.push(`Add experience with key requirements: ${missingSkills.slice(0, 3).join(", ")}`)
  }

  if (careerMisalignment.length > 0) {
    suggestions.push(
      `Consider how your career goals align with this role's focus on: ${careerMisalignment.slice(0, 2).join(", ")}`,
    )
  }

  // Analyze current experience relevance
  if (Array.isArray(resumeData.experience)) {
    const hasRelevantTitles = resumeData.experience.some((exp: any) =>
      jobDescription.toLowerCase().includes(exp.jobTitle?.toLowerCase() || ""),
    )
    if (!hasRelevantTitles) {
      suggestions.push("Highlight transferable skills from your experience that relate to this role")
    }
  }

  suggestions.push(
    "Tailor your professional summary to match the job requirements",
    "Use specific keywords from the job description throughout your resume",
    "Quantify your achievements with metrics that demonstrate impact",
  )

  return suggestions
}

function analyzeSectionAlignment(resumeData: any, jobDescription: string, jobKeywords: string[]) {
  const jobLower = jobDescription.toLowerCase()

  return {
    summary: {
      score: resumeData.personalInfo?.summary ? calculateSectionScore(resumeData.personalInfo.summary, jobKeywords) : 0,
      suggestion: "Tailor summary to highlight relevant experience for this specific role",
    },
    experience: {
      score: Array.isArray(resumeData.experience)
        ? resumeData.experience.reduce(
            (avg: number, exp: any) => avg + calculateSectionScore(exp.description || "", jobKeywords),
            0,
          ) / resumeData.experience.length
        : 0,
      suggestion: "Emphasize achievements that demonstrate skills mentioned in the job posting",
    },
    skills: {
      score: Array.isArray(resumeData.skills) ? calculateSkillsAlignment(resumeData.skills, jobKeywords) : 0,
      suggestion: "Add technical skills specifically mentioned in the job requirements",
    },
  }
}

function calculateSectionScore(text: string, keywords: string[]): number {
  if (!text || keywords.length === 0) return 0

  const textLower = text.toLowerCase()
  const matches = keywords.filter((keyword) => textLower.includes(keyword.toLowerCase()))
  return Math.round((matches.length / keywords.length) * 100)
}

function calculateSkillsAlignment(skills: any[], jobKeywords: string[]): number {
  const skillNames = skills.map((s) => (s.name || "").toLowerCase())
  const matches = jobKeywords.filter((keyword) => skillNames.some((skill) => skill.includes(keyword.toLowerCase())))
  return jobKeywords.length > 0 ? Math.round((matches.length / jobKeywords.length) * 100) : 0
}

export async function POST(request: NextRequest) {
  try {
    const { resumeData, jobDescription, careerKeywords } = await request.json()

    if (!resumeData || !jobDescription) {
      return NextResponse.json(
        {
          error: "Resume data and job description are required",
        },
        { status: 400 },
      )
    }

    const analysis = analyzeJobMatch(resumeData, jobDescription, careerKeywords || [])

    return NextResponse.json(analysis)
  } catch (error) {
    console.error("Job matching error:", error)
    return NextResponse.json({ error: "Failed to analyze job match" }, { status: 500 })
  }
}
