import { type NextRequest, NextResponse } from "next/server"
import OpenAI from "openai"

// Initialize OpenAI client
const openai = new OpenAI()

async function generateContentWithLLM(section: string, userInput: string, jobTitle: string, industry: string, context?: string) {
  let systemPrompt = ""
  let userPrompt = ""

  switch (section) {
    case "summary":
      systemPrompt = `You are an expert resume writer. Your task is to generate a compelling, 3-4 sentence professional summary for a resume. The summary must be tailored for a ${jobTitle} role in the ${industry} industry. It should highlight key skills, experience, and quantifiable achievements (if provided in the context).`
      userPrompt = `Generate a professional summary.
Target Role: ${jobTitle}
Target Industry: ${industry}
Career Keywords: ${userInput.split("Career Focus:")[1]?.trim() || "None"}
Context/Current Summary: ${context || "No current summary provided."}`
      break

    case "experience":
      systemPrompt = `You are an expert resume writer. Your task is to generate 3-5 high-impact, quantifiable bullet points for a work experience section. The bullet points must be tailored for a ${jobTitle} role in the ${industry} industry, focusing on achievements and results using the STAR method (Situation, Task, Action, Result).`
      userPrompt = `Generate 3-5 achievement-focused bullet points for the following experience:
Job Title and Company: ${userInput}
Context/Current Description: ${context || "No current description provided."}`
      break

    case "skills":
      systemPrompt = `You are an expert career coach. Your task is to generate a list of 10-15 highly relevant technical and soft skills for a ${jobTitle} role in the ${industry} industry. The list should be comma-separated.`
      userPrompt = `Generate a comma-separated list of skills for a ${jobTitle} in the ${industry} industry.`
      break

    default:
      throw new Error("Invalid section for content generation.")
  }

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.7,
    })

    const content = response.choices[0].message.content
    if (!content) {
      throw new Error("LLM returned no content.")
    }
    return content.trim()
  } catch (error) {
    console.error("LLM content generation failed:", error)
    throw new Error("Failed to generate content from LLM.")
  }
}

export async function POST(request: NextRequest) {
  try {
    const { section, userInput, jobTitle, industry, context, careerKeywords } = await request.json()

    if (!section || !userInput || !jobTitle || !industry) {
      return NextResponse.json(
        { error: "Missing required parameters for content generation" },
        { status: 400 },
      )
    }

    const content = await generateContentWithLLM(section, userInput, jobTitle, industry, context)

    return NextResponse.json({ content })
  } catch (error) {
    console.error("Content generation error:", error)
    return NextResponse.json({ error: "Failed to generate content" }, { status: 500 })
  }
}
