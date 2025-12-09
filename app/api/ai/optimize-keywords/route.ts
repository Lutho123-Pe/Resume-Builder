import { GoogleGenAI } from "@google/genai"
import { NextRequest, NextResponse } from "next/server"

// Initialize Google GenAI client
// It will automatically look for the GEMINI_API_KEY environment variable
const ai = new GoogleGenAI({})

// Define the expected output structure for the LLM
const optimizationSchema = {
  type: "object",
  properties: {
    missingKeywords: {
      type: "array",
      description: "A list of 5-8 high-impact keywords relevant to the industry that are missing from the resume content.",
      items: { type: "string" },
    },
    atsScore: {
      type: "number",
      description: "A score from 1 to 10 representing the resume's ATS compatibility based on keyword density, formatting, and industry relevance.",
    },
    suggestions: {
      type: "array",
      description: "A list of 3-5 actionable suggestions to improve the resume's ATS score and keyword coverage.",
      items: { type: "string" },
    },
  },
  required: ["missingKeywords", "atsScore", "suggestions"],
}

async function analyzeKeywordsWithLLM(content: string, industry: string, jobDescription?: string) {
  const systemPrompt = `You are an expert Applicant Tracking System (ATS) and career coach. Your task is to analyze a resume's content against a target industry and job description (if provided) to determine its ATS compatibility.

Analyze the provided resume content and generate a structured JSON response based on the following criteria:
1. **ATS Score (1-10):** Evaluate the resume's overall compatibility. Factors to consider include keyword density, use of industry-specific terminology, and clear section headings.
2. **Missing Keywords:** Identify 5-8 critical keywords for the ${industry} industry (and the specific job if provided) that are absent from the resume.
3. **Suggestions:** Provide 3-5 specific, actionable suggestions to improve the resume's ATS score and keyword alignment.

The user's target industry is: ${industry}.
The job description (if provided) is: ${jobDescription || "N/A"}.
You MUST return a JSON object that strictly adheres to the provided schema.
`

  const userPrompt = `Analyze the following resume content:
---
${content}
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
        temperature: 0.2,
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
    // Fallback or re-throw
    throw new Error("Failed to get analysis from LLM.")
  }
}

export async function POST(request: NextRequest) {
  try {
    const { content, jobDescription, industry } = await request.json()

    if (!content || !industry) {
      return NextResponse.json(
        { error: "Content and industry are required" },
        { status: 400 },
      )
    }

    const analysis = await analyzeKeywordsWithLLM(content, industry, jobDescription)

    return NextResponse.json(analysis)
  } catch (error) {
    console.error("Keyword optimization error:", error)
    return NextResponse.json({ error: "Failed to optimize keywords" }, { status: 500 })
  }
}
