import { type NextRequest, NextResponse } from "next/server"
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from "docx"

export async function POST(request: NextRequest) {
  try {
    const { resumeData, template } = await request.json()

    // Create DOCX document
    const doc = new Document({
      sections: [
        {
          properties: {},
          children: generateDocxContent(resumeData, template),
        },
      ],
    })

    // Generate buffer
    const buffer = await Packer.toBuffer(doc)

    // Return DOCX as response
    return new NextResponse(buffer, {
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "Content-Disposition": `attachment; filename="${resumeData.personalInfo.fullName || "resume"}.docx"`,
      },
    })
  } catch (error) {
    console.error("DOCX generation error:", error)
    return NextResponse.json({ error: "Failed to generate DOCX" }, { status: 500 })
  }
}

function generateDocxContent(resumeData: any, template: string) {
  const { personalInfo, experience, education, skills } = resumeData
  const content: Paragraph[] = []

  // Header with name
  content.push(
    new Paragraph({
      children: [
        new TextRun({
          text: personalInfo.fullName,
          bold: true,
          size: 32,
          color: "2563eb",
        }),
      ],
      alignment: AlignmentType.CENTER,
      spacing: { after: 200 },
    }),
  )

  // Contact information
  const contactInfo = [
    personalInfo.email,
    personalInfo.phone,
    personalInfo.location,
    personalInfo.linkedin,
    personalInfo.website,
  ]
    .filter(Boolean)
    .join(" | ")

  if (contactInfo) {
    content.push(
      new Paragraph({
        children: [
          new TextRun({
            text: contactInfo,
            size: 20,
          }),
        ],
        alignment: AlignmentType.CENTER,
        spacing: { after: 300 },
      }),
    )
  }

  // Professional Summary
  if (personalInfo.summary) {
    content.push(
      new Paragraph({
        children: [
          new TextRun({
            text: "PROFESSIONAL SUMMARY",
            bold: true,
            size: 24,
            color: "2563eb",
          }),
        ],
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 200, after: 100 },
      }),
      new Paragraph({
        children: [
          new TextRun({
            text: personalInfo.summary,
            size: 22,
          }),
        ],
        spacing: { after: 300 },
      }),
    )
  }

  // Professional Experience
  if (experience.length > 0) {
    content.push(
      new Paragraph({
        children: [
          new TextRun({
            text: "PROFESSIONAL EXPERIENCE",
            bold: true,
            size: 24,
            color: "2563eb",
          }),
        ],
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 200, after: 100 },
      }),
    )

    experience.forEach((exp) => {
      // Job title and company
      content.push(
        new Paragraph({
          children: [
            new TextRun({
              text: exp.position,
              bold: true,
              size: 22,
            }),
            new TextRun({
              text: ` | ${exp.company}`,
              size: 22,
            }),
            new TextRun({
              text: `\t${exp.startDate} - ${exp.current ? "Present" : exp.endDate}`,
              size: 20,
              italics: true,
            }),
          ],
          spacing: { before: 100, after: 50 },
        }),
      )

      // Job description
      if (exp.description) {
        content.push(
          new Paragraph({
            children: [
              new TextRun({
                text: exp.description,
                size: 20,
              }),
            ],
            spacing: { after: 50 },
          }),
        )
      }

      // Achievements
      exp.achievements.forEach((achievement) => {
        content.push(
          new Paragraph({
            children: [
              new TextRun({
                text: `• ${achievement}`,
                size: 20,
              }),
            ],
            indent: { left: 360 },
            spacing: { after: 50 },
          }),
        )
      })
    })
  }

  // Education
  if (education.length > 0) {
    content.push(
      new Paragraph({
        children: [
          new TextRun({
            text: "EDUCATION",
            bold: true,
            size: 24,
            color: "2563eb",
          }),
        ],
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 300, after: 100 },
      }),
    )

    education.forEach((edu) => {
      content.push(
        new Paragraph({
          children: [
            new TextRun({
              text: `${edu.degree} in ${edu.field}`,
              bold: true,
              size: 22,
            }),
            new TextRun({
              text: ` | ${edu.institution}`,
              size: 22,
            }),
            new TextRun({
              text: `\t${edu.startDate} - ${edu.endDate}`,
              size: 20,
              italics: true,
            }),
          ],
          spacing: { before: 100, after: 50 },
        }),
      )

      if (edu.gpa) {
        content.push(
          new Paragraph({
            children: [
              new TextRun({
                text: `GPA: ${edu.gpa}`,
                size: 20,
              }),
            ],
            spacing: { after: 100 },
          }),
        )
      }
    })
  }

  // Skills
  content.push(
    new Paragraph({
      children: [
        new TextRun({
          text: "SKILLS",
          bold: true,
          size: 24,
          color: "2563eb",
        }),
      ],
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 300, after: 100 },
    }),
  )

  if (skills.technical.length > 0) {
    content.push(
      new Paragraph({
        children: [
          new TextRun({
            text: "Technical Skills: ",
            bold: true,
            size: 20,
          }),
          new TextRun({
            text: skills.technical.join(", "),
            size: 20,
          }),
        ],
        spacing: { after: 100 },
      }),
    )
  }

  if (skills.soft.length > 0) {
    content.push(
      new Paragraph({
        children: [
          new TextRun({
            text: "Soft Skills: ",
            bold: true,
            size: 20,
          }),
          new TextRun({
            text: skills.soft.join(", "),
            size: 20,
          }),
        ],
        spacing: { after: 100 },
      }),
    )
  }

  if (skills.languages.length > 0) {
    content.push(
      new Paragraph({
        children: [
          new TextRun({
            text: "Languages: ",
            bold: true,
            size: 20,
          }),
          new TextRun({
            text: skills.languages.join(", "),
            size: 20,
          }),
        ],
        spacing: { after: 100 },
      }),
    )
  }

  if (skills.certifications.length > 0) {
    content.push(
      new Paragraph({
        children: [
          new TextRun({
            text: "Certifications: ",
            bold: true,
            size: 20,
          }),
          new TextRun({
            text: skills.certifications.join(", "),
            size: 20,
          }),
        ],
        spacing: { after: 100 },
      }),
    )
  }

  return content
}
