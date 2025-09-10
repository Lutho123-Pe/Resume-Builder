import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { resumeData, targetIndustry, targetRole } = await request.json()

    // Industry-specific optimization data
    const industryData = {
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
        ],
        skills: [
          "programming languages",
          "cloud platforms",
          "database management",
          "version control",
          "testing frameworks",
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
        ],
        skills: ["marketing automation", "data analytics", "content creation", "social media management"],
        certifications: [
          { name: "Google Analytics Certified", provider: "Google", priority: "high" as const },
          { name: "HubSpot Content Marketing", provider: "HubSpot", priority: "medium" as const },
        ],
        trends: ["AI-powered marketing", "personalization", "omnichannel experiences", "influencer marketing"],
      },
    }

    const industry = industryData[targetIndustry?.toLowerCase() as keyof typeof industryData] || industryData.technology

    // Generate skill gaps based on current resume
    const currentSkills = resumeData.skills?.map((s: any) => s.name?.toLowerCase()) || []
    const skillsGaps = industry.skills
      .filter((skill) => !currentSkills.some((current) => current.includes(skill.toLowerCase())))
      .map((skill) => ({
        skill,
        importance: "high" as const,
        suggestion: `Consider adding ${skill} to strengthen your profile for ${targetRole} roles`,
      }))

    // Generate experience reframing suggestions
    const experienceReframing =
      resumeData.experience?.slice(0, 2).map((exp: any, index: number) => ({
        section: `Experience ${index + 1}`,
        current: exp.description || "Current job description",
        suggested: `Reframe to emphasize ${industry.keywords.slice(0, 3).join(", ")} and quantifiable achievements`,
        reason: `Better alignment with ${targetIndustry} industry expectations`,
      })) || []

    const optimization = {
      industryKeywords: industry.keywords,
      skillsGaps,
      experienceReframing,
      industryTrends: industry.trends,
      certifications: industry.certifications,
      networkingSuggestions: [
        `Join ${targetIndustry} professional associations`,
        `Attend industry conferences and meetups`,
        `Connect with ${targetRole} professionals on LinkedIn`,
        "Participate in industry-specific online communities",
      ],
      portfolioRecommendations: [
        `Create projects showcasing ${industry.keywords.slice(0, 2).join(" and ")} skills`,
        "Document case studies of your achievements",
        "Build an online presence in your field",
        "Contribute to open source or industry publications",
      ],
      interviewTips: [
        `Research current ${targetIndustry} trends and challenges`,
        `Prepare examples demonstrating ${industry.keywords.slice(0, 3).join(", ")}`,
        "Practice explaining technical concepts in business terms",
        "Prepare questions about company culture and growth opportunities",
      ],
    }

    return NextResponse.json(optimization)
  } catch (error) {
    console.error("Industry optimization error:", error)
    return NextResponse.json({ error: "Failed to generate industry optimization" }, { status: 500 })
  }
}
