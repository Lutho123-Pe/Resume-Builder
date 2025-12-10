import { type NextRequest, NextResponse } from "next/server"
import OpenAI from "openai"

// Initialize OpenAI client
const openai = new OpenAI()

// Define the expected output structure for the LLM
const matchSchema = {
  type: "object",
  properties: {
    matchPercentage: {
      type: "number",
      description: "A score from 0 to 100 representing the overall match between the resume and the job description.",
    },
    matchingSkills: {
      type: "array",
      description: "A list of 5-8 key skills or requirements from the job description that are present in the resume.",
      items: { type: "string" },
    },
    missingRequirements: {
      type: "array",
      description: "A list of 5-8 critical skills or requirements from the job description that are missing or weakly represented in the resume.",
      items: { type: "string" },
    },
    keywordsToAdd: {
      type: "array",
      description: "A list of 3-5 specific keywords from the job description that should be added to the resume to improve the match.",
      items: { type: "string" },
    },
    suggestions: {
      type: "array",
      description: "A list of 3-5 actionable suggestions to improve the resume's alignment with the job description.",
      items: { type: "string" },
    },
  },
  required: ["matchPercentage", "matchingSkills", "missingRequirements", "keywordsToAdd", "suggestions"],
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

async function analyzeJobMatchWithLLM(resumeData: any, jobDescription: string) {
  const resumeContent = extractResumeContent(resumeData)

  const systemPrompt = `You are an expert Job Match Analyst. Your task is to compare a candidate's resume content against a specific job description and provide a detailed, structured analysis.

Analyze the provided resume content and job description to generate a structured JSON response based on the following criteria:
1. **Match Percentage (0-100):** A single score representing the overall fit.
2. **Matching Skills:** Identify 5-8 key skills/requirements from the job description that are present in the resume.
3. **Missing Requirements:** Identify 5-8 critical skills/requirements from the job description that are missing or weakly represented.
4. **Keywords to Add:** List 3-5 specific, high-value keywords from the job description that the candidate should explicitly add to their resume.
5. **Suggestions:** Provide 3-5 actionable suggestions for the candidate to improve their resume for this specific job.

You MUST return a JSON object that strictly adheres to the provided schema.
`

  const userPrompt = `Job Description:
---
${jobDescription}
---

Candidate Resume Content:
---
${resumeContent}
---
`

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4.1-mini", // Using a capable model for structured output
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      response_format: { type: "json_object" },
      temperature: 0.2,
    })

    const jsonText = response.choices[0].message.content
    if (!jsonText) {
      throw new Error("LLM returned no content.")
    }
    const analysis = JSON.parse(jsonText)
    return analysis
  } catch (error) {
    console.error("LLM analysis failed:", error)
    // Fallback or re-throw
    throw new Error("Failed to get analysis from LLM.")
  }
}

export async function POST(request: NextRequest) {
  try {
    const { resumeData, jobDescription } = await request.json()

    if (!resumeData || !jobDescription) {
      return NextResponse.json(
        {
          error: "Resume data and job description are required",
        },
        { status: 400 },
      )
    }

    const analysis = await analyzeJobMatchWithLLM(resumeData, jobDescription)

    return NextResponse.json(analysis)
  } catch (error) {
    console.error("Job matching error:", error)
    return NextResponse.json({ error: "Failed to analyze job match" }, { status: 500 })
  }
}
