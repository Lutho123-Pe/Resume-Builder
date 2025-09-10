import { type NextRequest, NextResponse } from "next/server"

const industryTemplates = {
  technology: {
    summary:
      "Experienced {jobTitle} with expertise in modern technologies and agile development practices. Proven track record of delivering scalable solutions and driving technical innovation. Strong problem-solving skills and collaborative approach to software development.",
    experience: [
      "Developed and maintained scalable applications using modern frameworks and technologies",
      "Collaborated with cross-functional teams to deliver high-quality software solutions",
      "Implemented best practices for code quality, testing, and deployment processes",
      "Optimized application performance and resolved complex technical challenges",
      "Mentored junior developers and contributed to technical documentation",
    ],
    skills: [
      "JavaScript",
      "React",
      "Node.js",
      "Python",
      "SQL",
      "Git",
      "Agile",
      "Problem Solving",
      "Team Collaboration",
    ],
  },
  healthcare: {
    summary:
      "Dedicated {jobTitle} with comprehensive experience in healthcare delivery and patient care. Committed to maintaining high standards of clinical excellence while ensuring patient safety and satisfaction. Strong communication and analytical skills.",
    experience: [
      "Provided exceptional patient care while maintaining strict adherence to safety protocols",
      "Collaborated with multidisciplinary teams to develop comprehensive treatment plans",
      "Maintained accurate patient records and documentation in compliance with regulations",
      "Implemented quality improvement initiatives to enhance patient outcomes",
      "Educated patients and families on treatment procedures and care management",
    ],
    skills: [
      "Patient Care",
      "Clinical Assessment",
      "Medical Documentation",
      "HIPAA Compliance",
      "Team Collaboration",
      "Critical Thinking",
      "Communication",
    ],
  },
  finance: {
    summary:
      "Results-driven {jobTitle} with strong analytical skills and expertise in financial analysis and risk management. Proven ability to drive business growth through data-driven insights and strategic financial planning.",
    experience: [
      "Conducted comprehensive financial analysis to support strategic business decisions",
      "Developed and maintained financial models and forecasting tools",
      "Ensured compliance with regulatory requirements and internal policies",
      "Collaborated with stakeholders to optimize financial performance and reduce costs",
      "Prepared detailed reports and presentations for senior management",
    ],
    skills: [
      "Financial Analysis",
      "Excel",
      "Financial Modeling",
      "Risk Management",
      "Regulatory Compliance",
      "Data Analysis",
      "Strategic Planning",
    ],
  },
  marketing: {
    summary:
      "Creative and data-driven {jobTitle} with expertise in digital marketing strategies and brand management. Proven track record of developing successful campaigns that drive engagement and business growth.",
    experience: [
      "Developed and executed comprehensive marketing campaigns across multiple channels",
      "Analyzed market trends and consumer behavior to inform strategic decisions",
      "Managed social media presence and created engaging content for target audiences",
      "Collaborated with design and content teams to produce high-quality marketing materials",
      "Tracked campaign performance and optimized strategies based on data insights",
    ],
    skills: [
      "Digital Marketing",
      "Social Media",
      "Content Creation",
      "Analytics",
      "SEO/SEM",
      "Brand Management",
      "Campaign Management",
    ],
  },
  education: {
    summary:
      "Passionate {jobTitle} dedicated to fostering student learning and academic excellence. Experienced in curriculum development and innovative teaching methodologies that engage diverse learners.",
    experience: [
      "Designed and implemented engaging lesson plans aligned with curriculum standards",
      "Assessed student progress and provided individualized support and feedback",
      "Collaborated with colleagues and parents to support student success",
      "Integrated technology and innovative teaching methods to enhance learning",
      "Participated in professional development and continuous improvement initiatives",
    ],
    skills: [
      "Curriculum Development",
      "Classroom Management",
      "Student Assessment",
      "Educational Technology",
      "Communication",
      "Adaptability",
      "Mentoring",
    ],
  },
}

export async function POST(request: NextRequest) {
  try {
    const { section, userInput, jobTitle, industry, context } = await request.json()

    const normalizedIndustry = industry?.toLowerCase() || "technology"
    const template =
      industryTemplates[normalizedIndustry as keyof typeof industryTemplates] || industryTemplates.technology

    let content = ""

    switch (section) {
      case "summary":
        content = template.summary.replace("{jobTitle}", jobTitle || "Professional")
        break

      case "experience":
        content = template.experience.join("\n• ")
        break

      case "skills":
        content = template.skills.join(", ")
        break

      default:
        throw new Error("Invalid section")
    }

    return NextResponse.json({ content })
  } catch (error) {
    console.error("Content generation error:", error)
    return NextResponse.json({ error: "Failed to generate content" }, { status: 500 })
  }
}
