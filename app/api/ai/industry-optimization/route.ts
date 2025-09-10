import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { resumeData, targetIndustry, targetRole, careerKeywords } = await request.json()

    const industryData = getIndustryData()
    const industry = industryData[targetIndustry?.toLowerCase() as keyof typeof industryData] || industryData.technology

    // Analyze current resume content
    const resumeAnalysis = analyzeCurrentContent(resumeData, careerKeywords || [])

    // Generate personalized skill gaps based on actual skills vs industry requirements
    const skillsGaps = generatePersonalizedSkillGaps(resumeData, industry, targetRole)

    const experienceReframing = generateExperienceReframing(resumeData, industry, targetRole, careerKeywords || [])

    // Analyze keyword alignment with career goals
    const keywordAlignment = analyzeKeywordAlignment(resumeAnalysis.content, industry.keywords, careerKeywords || [])

    const optimization = {
      currentAnalysis: resumeAnalysis,
      industryKeywords: industry.keywords,
      skillsGaps,
      experienceReframing,
      keywordAlignment,
      industryTrends: industry.trends,
      certifications: industry.certifications,
      personalizedRecommendations: generatePersonalizedRecommendations(resumeAnalysis, industry, targetRole),
      networkingSuggestions: [
        `Join ${targetIndustry} professional associations`,
        `Attend industry conferences and meetups`,
        `Connect with ${targetRole} professionals on LinkedIn`,
        "Participate in industry-specific online communities",
      ],
      portfolioRecommendations: generatePortfolioRecommendations(resumeAnalysis, industry, targetRole),
      interviewTips: generateInterviewTips(industry, targetRole, resumeAnalysis),
    }

    return NextResponse.json(optimization)
  } catch (error) {
    console.error("Industry optimization error:", error)
    return NextResponse.json({ error: "Failed to generate industry optimization" }, { status: 500 })
  }
}

function analyzeCurrentContent(resumeData: any, careerKeywords: string[]) {
  let content = ""
  const sections = {
    summary: resumeData.personalInfo?.summary || "",
    experience: [],
    skills: [],
    education: [],
  }

  // Extract and analyze experience
  if (Array.isArray(resumeData.experience)) {
    sections.experience = resumeData.experience.map((exp: any) => ({
      title: exp.jobTitle || "",
      company: exp.company || "",
      description: exp.description || "",
      keywords: extractKeywordsFromText(exp.description || ""),
    }))
    content += resumeData.experience.map((exp: any) => `${exp.jobTitle} ${exp.company} ${exp.description}`).join(" ")
  }

  // Extract and analyze skills
  if (Array.isArray(resumeData.skills)) {
    sections.skills = resumeData.skills.map((skill: any) => skill.name || "")
    content += resumeData.skills.map((skill: any) => skill.name || "").join(" ")
  }

  // Extract education
  if (Array.isArray(resumeData.education)) {
    sections.education = resumeData.education.map((edu: any) => ({
      degree: edu.degree || "",
      field: edu.field || "",
      school: edu.school || "",
    }))
    content += resumeData.education.map((edu: any) => `${edu.degree} ${edu.field} ${edu.school}`).join(" ")
  }

  content += sections.summary

  return {
    content: content.toLowerCase(),
    sections,
    careerKeywordMatches: careerKeywords.filter((keyword) => content.toLowerCase().includes(keyword.toLowerCase())),
    contentLength: content.length,
    hasQuantifiedAchievements: /\d+(%|\$|k|million|thousand|years?)/.test(content),
  }
}

function generatePersonalizedSkillGaps(resumeData: any, industry: any, targetRole: string) {
  const currentSkills = Array.isArray(resumeData.skills)
    ? resumeData.skills.map((s: any) => s.name?.toLowerCase()).filter(Boolean)
    : []

  return industry.skills
    .filter(
      (skill: string) =>
        !currentSkills.some(
          (current: string) => current.includes(skill.toLowerCase()) || skill.toLowerCase().includes(current),
        ),
    )
    .map((skill: string) => ({
      skill,
      importance: determineSkillImportance(skill, targetRole),
      suggestion: `Add ${skill} experience to strengthen your ${targetRole} profile`,
      learningResources: generateLearningResources(skill),
    }))
}

function generateExperienceReframing(resumeData: any, industry: any, targetRole: string, careerKeywords: string[]) {
  if (!Array.isArray(resumeData.experience)) return []

  return resumeData.experience.slice(0, 3).map((exp: any, index: number) => {
    const currentDesc = exp.description || ""
    const missingKeywords = industry.keywords.filter(
      (keyword: string) => !currentDesc.toLowerCase().includes(keyword.toLowerCase()),
    )

    const careerKeywordGaps = careerKeywords.filter(
      (keyword: string) => !currentDesc.toLowerCase().includes(keyword.toLowerCase()),
    )

    return {
      section: `${exp.jobTitle || "Experience"} at ${exp.company || "Company"}`,
      current: currentDesc,
      suggested: generateImprovedDescription(currentDesc, missingKeywords.slice(0, 3), careerKeywordGaps.slice(0, 2)),
      missingKeywords: missingKeywords.slice(0, 5),
      reason: `Better alignment with ${targetRole} requirements and ${industry.keywords.slice(0, 2).join(", ")} focus`,
    }
  })
}

function analyzeKeywordAlignment(content: string, industryKeywords: string[], careerKeywords: string[]) {
  const industryMatches = industryKeywords.filter((keyword) => content.includes(keyword.toLowerCase()))
  const careerMatches = careerKeywords.filter((keyword) => content.includes(keyword.toLowerCase()))

  return {
    industryAlignment: {
      matched: industryMatches,
      missing: industryKeywords.filter((k) => !industryMatches.includes(k)),
      score: industryKeywords.length > 0 ? Math.round((industryMatches.length / industryKeywords.length) * 100) : 0,
    },
    careerAlignment: {
      matched: careerMatches,
      missing: careerKeywords.filter((k) => !careerMatches.includes(k)),
      score: careerKeywords.length > 0 ? Math.round((careerMatches.length / careerKeywords.length) * 100) : 0,
    },
  }
}

function extractKeywordsFromText(text: string): string[] {
  const keywords = text.toLowerCase().match(/\b[a-z]{3,}\b/g) || []
  return [...new Set(keywords)].slice(0, 10)
}

function determineSkillImportance(skill: string, targetRole: string): "high" | "medium" | "low" {
  const highPrioritySkills = ["programming", "management", "analysis", "leadership"]
  const mediumPrioritySkills = ["communication", "teamwork", "organization"]

  if (highPrioritySkills.some((priority) => skill.toLowerCase().includes(priority))) return "high"
  if (mediumPrioritySkills.some((priority) => skill.toLowerCase().includes(priority))) return "medium"
  return "low"
}

function generateLearningResources(skill: string): string[] {
  const resourceMap: { [key: string]: string[] } = {
    programming: ["Codecademy", "freeCodeCamp", "LeetCode"],
    cloud: ["AWS Training", "Google Cloud Skills Boost", "Azure Learn"],
    data: ["Coursera Data Science", "Kaggle Learn", "DataCamp"],
    management: ["PMI Courses", "Scrum.org", "LinkedIn Learning"],
  }

  const matchedKey = Object.keys(resourceMap).find((key) => skill.toLowerCase().includes(key))

  return matchedKey ? resourceMap[matchedKey] : ["Online courses", "Professional workshops", "Industry certifications"]
}

function generateImprovedDescription(current: string, industryKeywords: string[], careerKeywords: string[]): string {
  if (!current)
    return `Incorporate ${[...industryKeywords, ...careerKeywords].slice(0, 3).join(", ")} in your role description`

  const suggestions = []
  if (industryKeywords.length > 0) {
    suggestions.push(`Add ${industryKeywords.slice(0, 2).join(" and ")} experience`)
  }
  if (careerKeywords.length > 0) {
    suggestions.push(`Highlight ${careerKeywords.slice(0, 2).join(" and ")} skills`)
  }
  if (!/\d+/.test(current)) {
    suggestions.push("Include quantifiable achievements")
  }

  return `${current.slice(0, 100)}... ${suggestions.join(", ")}`
}

function generatePersonalizedRecommendations(analysis: any, industry: any, targetRole: string): string[] {
  const recommendations = []

  if (analysis.careerKeywordMatches.length < 3) {
    recommendations.push("Incorporate more career-relevant keywords throughout your resume")
  }

  if (!analysis.hasQuantifiedAchievements) {
    recommendations.push("Add specific metrics and quantifiable achievements to your experience")
  }

  if (analysis.sections.summary.length < 100) {
    recommendations.push(`Expand your professional summary to highlight ${targetRole} relevant experience`)
  }

  recommendations.push(
    `Focus on ${industry.keywords.slice(0, 3).join(", ")} skills for ${targetRole} roles`,
    "Tailor each application to specific job requirements",
    "Keep resume updated with latest industry trends",
  )

  return recommendations.slice(0, 5)
}

function generatePortfolioRecommendations(analysis: any, industry: any, targetRole: string): string[] {
  return [
    `Create projects showcasing ${industry.keywords.slice(0, 2).join(" and ")} skills`,
    `Document case studies relevant to ${targetRole} responsibilities`,
    "Build an online presence showcasing your expertise",
    "Contribute to industry publications or open source projects",
  ]
}

function generateInterviewTips(industry: any, targetRole: string, analysis: any): string[] {
  return [
    `Research current trends in ${industry.keywords.slice(0, 2).join(" and ")}`,
    `Prepare examples demonstrating ${targetRole} relevant achievements`,
    "Practice explaining technical concepts in business terms",
    "Prepare questions about company culture and growth opportunities",
  ]
}

function getIndustryData() {
  return {
    technology: {
      keywords: [
        "agile",
        "scrum",
        "CI/CD",
        "cloud computing",
        "microservices",
        "API",
        "DevOps",
        "machine learning",
        "data analytics",
        "cybersecurity",
        "javascript",
        "python",
        "react",
      ],
      skills: [
        "programming languages",
        "cloud platforms",
        "database management",
        "version control",
        "testing frameworks",
        "system architecture",
      ],
      certifications: [
        { name: "AWS Certified Solutions Architect", provider: "Amazon", priority: "high" as const },
        { name: "Google Cloud Professional", provider: "Google", priority: "high" as const },
        { name: "Certified Kubernetes Administrator", provider: "CNCF", priority: "medium" as const },
      ],
      trends: ["AI/ML integration", "cloud-native development", "containerization", "serverless architecture"],
    },
    healthcare: {
      keywords: [
        "patient care",
        "HIPAA compliance",
        "electronic health records",
        "clinical protocols",
        "quality assurance",
        "regulatory compliance",
        "medical terminology",
      ],
      skills: ["medical terminology", "patient management systems", "healthcare analytics", "compliance frameworks"],
      certifications: [
        { name: "Certified Healthcare Administrator", provider: "ACHE", priority: "high" as const },
        { name: "HIPAA Compliance Certification", provider: "Various", priority: "high" as const },
      ],
      trends: ["telemedicine", "digital health records", "AI diagnostics", "patient experience optimization"],
    },
    finance: {
      keywords: [
        "financial analysis",
        "risk management",
        "compliance",
        "portfolio management",
        "financial modeling",
        "regulatory reporting",
        "investment",
        "banking",
      ],
      skills: ["financial software", "data analysis", "risk assessment", "regulatory knowledge"],
      certifications: [
        { name: "CFA Charter", provider: "CFA Institute", priority: "high" as const },
        { name: "Financial Risk Manager", provider: "GARP", priority: "high" as const },
      ],
      trends: ["fintech innovation", "digital banking", "cryptocurrency", "automated trading"],
    },
    marketing: {
      keywords: [
        "digital marketing",
        "SEO",
        "content strategy",
        "social media",
        "analytics",
        "campaign management",
        "brand management",
        "conversion optimization",
      ],
      skills: ["marketing automation", "data analytics", "content creation", "social media management"],
      certifications: [
        { name: "Google Analytics Certified", provider: "Google", priority: "high" as const },
        { name: "HubSpot Content Marketing", provider: "HubSpot", priority: "medium" as const },
      ],
      trends: ["AI-powered marketing", "personalization", "omnichannel experiences", "influencer marketing"],
    },
  }
}
