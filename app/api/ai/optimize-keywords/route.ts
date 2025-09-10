import { type NextRequest, NextResponse } from "next/server"

const industryKeywords = {
  technology: [
    "JavaScript",
    "React",
    "Node.js",
    "Python",
    "SQL",
    "Git",
    "Agile",
    "Scrum",
    "API",
    "Database",
    "Cloud",
    "AWS",
    "Docker",
    "CI/CD",
    "Testing",
    "DevOps",
  ],
  healthcare: [
    "Patient Care",
    "Clinical",
    "HIPAA",
    "Medical Records",
    "Healthcare",
    "Treatment",
    "Diagnosis",
    "Compliance",
    "Safety",
    "Quality Assurance",
    "EMR",
    "EHR",
  ],
  finance: [
    "Financial Analysis",
    "Risk Management",
    "Compliance",
    "Audit",
    "Excel",
    "Financial Modeling",
    "Budgeting",
    "Forecasting",
    "Regulatory",
    "Investment",
  ],
  marketing: [
    "Digital Marketing",
    "SEO",
    "SEM",
    "Social Media",
    "Analytics",
    "Campaign",
    "Brand Management",
    "Content Marketing",
    "Lead Generation",
    "ROI",
    "KPI",
  ],
  education: [
    "Curriculum",
    "Teaching",
    "Assessment",
    "Student",
    "Learning",
    "Education",
    "Classroom Management",
    "Lesson Planning",
    "Academic",
    "Professional Development",
  ],
}

function analyzeKeywords(content: string, industry: string, jobDescription?: string) {
  const normalizedIndustry = industry?.toLowerCase() || "technology"
  const relevantKeywords =
    industryKeywords[normalizedIndustry as keyof typeof industryKeywords] || industryKeywords.technology

  const contentLower = content.toLowerCase()
  const foundKeywords = relevantKeywords.filter((keyword) => contentLower.includes(keyword.toLowerCase()))

  const missingKeywords = relevantKeywords
    .filter((keyword) => !contentLower.includes(keyword.toLowerCase()))
    .slice(0, 8) // Limit to top 8 suggestions

  // Simple ATS score calculation
  const keywordCoverage = foundKeywords.length / relevantKeywords.length
  const atsScore = Math.min(10, Math.max(1, Math.round(keywordCoverage * 10 + 2)))

  return {
    missingKeywords,
    keywordDensity: `${foundKeywords.length}/${relevantKeywords.length} relevant keywords found`,
    atsScore,
    suggestions: [
      `Add ${missingKeywords.slice(0, 3).join(", ")} to improve keyword coverage`,
      "Use industry-specific terminology throughout your resume",
      "Include relevant technical skills in your skills section",
      "Quantify achievements with specific metrics when possible",
    ],
  }
}

export async function POST(request: NextRequest) {
  try {
    const { content, jobDescription, industry } = await request.json()

    const analysis = analyzeKeywords(content, industry, jobDescription)

    return NextResponse.json(analysis)
  } catch (error) {
    console.error("Keyword optimization error:", error)
    return NextResponse.json({ error: "Failed to optimize keywords" }, { status: 500 })
  }
}
