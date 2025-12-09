import { GoogleGenAI } from "@google/genai"
import { NextRequest, NextResponse } from "next/server"

// Initialize Google GenAI client
// It will automatically look for the GEMINI_API_KEY environment variable
const ai = new GoogleGenAI({})

// Define the expected output structure for the LLM
const optimizationSchema = {
  type: "object",
  properties: {
    industryKeywords: {
      type: "array",
      description: "A list of 5-8 high-impact keywords specific to the target industry and role that the candidate should consider adding.",
      items: { type: "string" },
    },
    skillsGaps: {
      type: "array",
      description: "A list of 3-5 critical skills missing from the resume, with a priority and suggestion for each.",
      items: {
        type: "object",
        properties: {
          skill: { type: "string" },
          importance: { type: "string", enum: ["high", "medium", "low"] },
          suggestion: { type: "string" },
        },
        required: ["skill", "importance", "suggestion"],
      },
    },
    experienceReframing: {
      type: "array",
      description: "A list of 2-3 bullet points from the resume that should be reframed, with a reason for the change.",
      items: {
        type: "object",
        properties: {
          section: { type: "string", description: "The job title and company of the experience section." },
          current: { type: "string", description: "The current bullet point or description." },
          suggested: { type: "string", description: "The suggested reframed bullet point." },
          reason: { type: "string", description: "The reason for the reframing, focusing on industry relevance." },
        },
        required: ["section", "current", "suggested", "reason"],
      },
    },
    industryTrends: {
      type: "array",
      description: "A list of 3-5 current industry trends the candidate should be aware of.",
      items: { type: "string" },
    },
    certifications: {
      type: "array",
      description: "A list of 2-3 highly relevant certifications for the target role and industry.",
      items: {
        type: "object",
        properties: {
          name: { type: "string" },
          provider: { type: "string" },
          priority: { type: "string", enum: ["high", "medium", "low"] },
        },
        required: ["name", "provider", "priority"],
      },
    },
    networkingSuggestions: {
      type: "array",
      description: "A list of 3-5 actionable networking tips for the target industry.",
      items: { type: "string" },
    },
    portfolioRecommendations: {
      type: "array",
      description: "A list of 3-5 actionable recommendations for the candidate's professional portfolio.",
      items: { type: "string" },
    },
    interviewTips: {
      type: "array",
      description: "A list of 3-5 specific interview preparation tips for the target role.",
      items: { type: "string" },
    },
  },
  required: [
    "industryKeywords",
    "skillsGaps",
    "experienceReframing",
    "industryTrends",
    "certifications",
    "networkingSuggestions",
    "portfolioRecommendations",
    "interviewTips",
  ],
}

function extractResumeContent(resumeData: any): string {
  let content = ""

  if (resumeData.personalInfo?.summary) {
    content += `Professional Summary: ${resumeData.personalInfo.summary}\n\n`
  }

  if (Array.isArray(resumeData.experience)) {
    content += "Experience:\n"
    resumeData.experience.forEach((exp: any) => {
      content += `- ${exp.position || ""} at ${exp.company || ""}. (${exp.startDate || ""} - ${exp.endDate || ""})\n`
      if (Array.isArray(exp.achievements)) {
        exp.achievements.forEach((achievement: string) => {
          content += `  • ${achievement}\n`
        })
      }
    })
    content += "\n"
  }

  if (Array.isArray(resumeData.education)) {
    content += "Education:\n"
    resumeData.education.forEach((edu: any) => {
      content += `- ${edu.degree || ""} in ${edu.field || ""} from ${edu.institution || ""}.\n`
    })
    content += "\n"
  }

  if (resumeData.skills) {
    content += `Skills: ${[...(resumeData.skills.technical || []), ...(resumeData.skills.soft || [])].join(", ")}\n`
  }

  return content
}

async function analyzeIndustryOptimizationWithLLM(resumeData: any, targetIndustry: string, targetRole: string) {
  const resumeContent = extractResumeContent(resumeData)

  const systemPrompt = `You are an expert career strategist specializing in the ${targetIndustry} industry. Your task is to analyze a candidate's resume and provide a comprehensive, structured optimization plan for a ${targetRole} role within that industry.

Analyze the provided resume content and generate a structured JSON response based on the following criteria:
1. **Industry Keywords:** Identify 5-8 high-impact keywords specific to the ${targetIndustry} industry and ${targetRole} role that the candidate should consider adding.
2. **Skills Gaps:** Identify 3-5 critical skills missing from the resume, with a priority (high, medium, low) and a suggestion for each.
3. **Experience Reframing:** Select 2-3 bullet points from the resume that should be reframed to better align with the ${targetIndustry} industry's focus, providing the current text, a suggested reframe, and the reason.
4. **Industry Trends:** List 3-5 current industry trends the candidate should be aware of.
5. **Certifications:** Recommend 2-3 highly relevant certifications for the target role and industry, including the provider and priority.
6. **Networking Suggestions:** Provide 3-5 actionable networking tips for the ${targetIndustry} industry.
7. **Portfolio Recommendations:** Provide 3-5 actionable recommendations for the candidate's professional portfolio.
8. **Interview Tips:** Provide 3-5 specific interview preparation tips for the ${targetRole} role.

You MUST return a JSON object that strictly adheres to the provided schema.
`

  const userPrompt = `Analyze the following resume content for a ${targetRole} role in the ${targetIndustry} industry:
---
${resumeContent}
---`

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash", // Using a capable model for structured output
      contents: [
        { role: "user", parts: [{ text: systemPrompt + userPrompt }] }
      ],
      config: {
        responseMimeType: "application/json",
        responseSchema: optimizationSchema,
        temperature: 0.3,
      }
    })

    const jsonText = response.text
    if (!jsonText) {
      throw new Error("LLM returned no content.")
    }
    const analysis = JSON.parse(jsonText)
    return analysis
  } catch (error) {
    console.error("LLM analysis failed:", error)
    throw new Error("Failed to get analysis from LLM.")
  }
}

export async function POST(request: NextRequest) {
  try {
    const { resumeData, targetIndustry, targetRole } = await request.json()

    if (!resumeData || !targetIndustry || !targetRole) {
      return NextResponse.json(
        { error: "Resume data, target industry, and target role are required" },
        { status: 400 },
      )
    }

    const analysis = await analyzeIndustryOptimizationWithLLM(resumeData, targetIndustry, targetRole)

    return NextResponse.json(analysis)
  } catch (error) {
    console.error("Industry optimization error:", error)
    return NextResponse.json({ error: "Failed to generate industry optimization" }, { status: 500 })
  }
}
