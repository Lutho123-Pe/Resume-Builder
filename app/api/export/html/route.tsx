import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { resumeData, template, customColors } = await request.json()

    // Generate complete HTML document
    const htmlContent = generateCompleteHTML(resumeData, template, customColors)

    // Return HTML as downloadable file
    return new NextResponse(htmlContent, {
      headers: {
        "Content-Type": "text/html",
        "Content-Disposition": `attachment; filename="${resumeData.personalInfo.fullName || "resume"}.html"`,
      },
    })
  } catch (error) {
    console.error("HTML generation error:", error)
    return NextResponse.json({ error: "Failed to generate HTML" }, { status: 500 })
  }
}

function generateCompleteHTML(resumeData: any, template: string, customColors?: any) {
  const colors = customColors || getTemplateColors(template)
  const { personalInfo, experience, education, skills } = resumeData

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${personalInfo.fullName} - Resume</title>
    <style>
        ${getResponsiveCSS(template, colors)}
    </style>
</head>
<body>
    <div class="resume-container">
        <header class="header">
            <h1 class="name">${personalInfo.fullName}</h1>
            <div class="contact-info">
                ${personalInfo.email ? `<a href="mailto:${personalInfo.email}">${personalInfo.email}</a>` : ""}
                ${personalInfo.phone ? `<span>${personalInfo.phone}</span>` : ""}
                ${personalInfo.location ? `<span>${personalInfo.location}</span>` : ""}
                ${personalInfo.linkedin ? `<a href="${personalInfo.linkedin}" target="_blank">LinkedIn</a>` : ""}
                ${personalInfo.website ? `<a href="${personalInfo.website}" target="_blank">Portfolio</a>` : ""}
            </div>
        </header>

        ${
          personalInfo.summary
            ? `
            <section class="section">
                <h2 class="section-title">Professional Summary</h2>
                <p class="summary">${personalInfo.summary}</p>
            </section>
        `
            : ""
        }

        ${
          experience.length > 0
            ? `
            <section class="section">
                <h2 class="section-title">Professional Experience</h2>
                ${experience
                  .map(
                    (exp) => `
                    <div class="experience-item">
                        <div class="item-header">
                            <div class="item-title">
                                <h3 class="position">${exp.position}</h3>
                                <p class="company">${exp.company}</p>
                            </div>
                            <div class="date">${exp.startDate} - ${exp.current ? "Present" : exp.endDate}</div>
                        </div>
                        ${exp.description ? `<p class="description">${exp.description}</p>` : ""}
                        ${
                          exp.achievements.length > 0
                            ? `
                            <ul class="achievements">
                                ${exp.achievements.map((achievement) => `<li>${achievement}</li>`).join("")}
                            </ul>
                        `
                            : ""
                        }
                    </div>
                `,
                  )
                  .join("")}
            </section>
        `
            : ""
        }

        ${
          education.length > 0
            ? `
            <section class="section">
                <h2 class="section-title">Education</h2>
                ${education
                  .map(
                    (edu) => `
                    <div class="education-item">
                        <div class="item-header">
                            <div class="item-title">
                                <h3 class="degree">${edu.degree} in ${edu.field}</h3>
                                <p class="institution">${edu.institution}</p>
                            </div>
                            <div class="date">${edu.startDate} - ${edu.endDate}</div>
                        </div>
                        ${edu.gpa ? `<p class="gpa">GPA: ${edu.gpa}</p>` : ""}
                    </div>
                `,
                  )
                  .join("")}
            </section>
        `
            : ""
        }

        <section class="section">
            <h2 class="section-title">Skills</h2>
            <div class="skills-grid">
                ${
                  skills.technical.length > 0
                    ? `
                    <div class="skill-category">
                        <h4 class="skill-category-title">Technical Skills</h4>
                        <div class="skill-tags">
                            ${skills.technical.map((skill) => `<span class="skill-tag">${skill}</span>`).join("")}
                        </div>
                    </div>
                `
                    : ""
                }
                ${
                  skills.soft.length > 0
                    ? `
                    <div class="skill-category">
                        <h4 class="skill-category-title">Soft Skills</h4>
                        <div class="skill-tags">
                            ${skills.soft.map((skill) => `<span class="skill-tag">${skill}</span>`).join("")}
                        </div>
                    </div>
                `
                    : ""
                }
                ${
                  skills.languages.length > 0
                    ? `
                    <div class="skill-category">
                        <h4 class="skill-category-title">Languages</h4>
                        <div class="skill-tags">
                            ${skills.languages.map((skill) => `<span class="skill-tag">${skill}</span>`).join("")}
                        </div>
                    </div>
                `
                    : ""
                }
                ${
                  skills.certifications.length > 0
                    ? `
                    <div class="skill-category">
                        <h4 class="skill-category-title">Certifications</h4>
                        <div class="skill-tags">
                            ${skills.certifications.map((skill) => `<span class="skill-tag">${skill}</span>`).join("")}
                        </div>
                    </div>
                `
                    : ""
                }
            </div>
        </section>
    </div>
</body>
</html>`
}

function getTemplateColors(template: string) {
  const colorSchemes = {
    modern: { primary: "#2563eb", secondary: "#64748b", accent: "#0ea5e9" },
    classic: { primary: "#1f2937", secondary: "#6b7280", accent: "#374151" },
    creative: { primary: "#7c3aed", secondary: "#a78bfa", accent: "#c084fc" },
    minimal: { primary: "#000000", secondary: "#666666", accent: "#999999" },
  }
  return colorSchemes[template as keyof typeof colorSchemes] || colorSchemes.modern
}

function getResponsiveCSS(template: string, colors: any) {
  return `
    * { margin: 0; padding: 0; box-sizing: border-box; }
    
    body { 
      font-family: 'Arial', 'Helvetica', sans-serif; 
      line-height: 1.6; 
      color: #333; 
      background: #f8fafc;
      padding: 2rem 1rem;
    }
    
    .resume-container { 
      max-width: 800px; 
      margin: 0 auto; 
      background: white;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      border-radius: 8px;
      overflow: hidden;
    }
    
    .header { 
      background: linear-gradient(135deg, ${colors.primary}, ${colors.accent});
      color: white;
      padding: 2rem;
      text-align: center;
    }
    
    .name { 
      font-size: 2.5rem; 
      font-weight: bold; 
      margin-bottom: 0.5rem;
      text-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    
    .contact-info { 
      display: flex; 
      justify-content: center; 
      gap: 1.5rem; 
      flex-wrap: wrap;
      font-size: 1rem;
      opacity: 0.95;
    }
    
    .contact-info a { 
      color: white; 
      text-decoration: none; 
      transition: opacity 0.2s;
    }
    
    .contact-info a:hover { 
      opacity: 0.8; 
      text-decoration: underline;
    }
    
    .section { 
      padding: 2rem;
      border-bottom: 1px solid #e2e8f0;
    }
    
    .section:last-child {
      border-bottom: none;
    }
    
    .section-title { 
      font-size: 1.5rem; 
      font-weight: bold; 
      color: ${colors.primary}; 
      margin-bottom: 1.5rem;
      position: relative;
      padding-bottom: 0.5rem;
    }
    
    .section-title::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      width: 50px;
      height: 3px;
      background: ${colors.accent};
      border-radius: 2px;
    }
    
    .summary {
      font-size: 1.1rem;
      color: #4a5568;
      line-height: 1.7;
    }
    
    .experience-item, .education-item { 
      margin-bottom: 2rem; 
      padding: 1.5rem;
      background: #f8fafc;
      border-radius: 8px;
      border-left: 4px solid ${colors.accent};
    }
    
    .item-header { 
      display: flex; 
      justify-content: space-between; 
      align-items: flex-start;
      margin-bottom: 1rem;
      gap: 1rem;
    }
    
    .position, .degree { 
      font-size: 1.2rem;
      font-weight: bold; 
      color: ${colors.primary}; 
      margin-bottom: 0.25rem;
    }
    
    .company, .institution { 
      color: ${colors.secondary}; 
      font-size: 1rem;
    }
    
    .date { 
      color: ${colors.secondary}; 
      font-size: 0.9rem;
      font-weight: 500;
      white-space: nowrap;
    }
    
    .description { 
      margin: 1rem 0; 
      color: #4a5568;
      line-height: 1.6;
    }
    
    .achievements { 
      list-style: none; 
      margin-left: 0;
    }
    
    .achievements li { 
      margin-bottom: 0.5rem; 
      position: relative;
      padding-left: 1.5rem;
      color: #4a5568;
      line-height: 1.5;
    }
    
    .achievements li:before { 
      content: "▸"; 
      color: ${colors.primary}; 
      font-weight: bold; 
      position: absolute; 
      left: 0;
    }
    
    .skills-grid { 
      display: grid; 
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); 
      gap: 1.5rem;
    }
    
    .skill-category { 
      background: #f8fafc;
      padding: 1.5rem;
      border-radius: 8px;
      border: 1px solid #e2e8f0;
    }
    
    .skill-category-title { 
      font-weight: bold; 
      color: ${colors.primary}; 
      margin-bottom: 1rem;
      font-size: 1.1rem;
    }
    
    .skill-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
    }
    
    .skill-tag {
      background: ${colors.primary};
      color: white;
      padding: 0.25rem 0.75rem;
      border-radius: 20px;
      font-size: 0.85rem;
      font-weight: 500;
    }
    
    @media (max-width: 768px) {
      body { padding: 1rem 0.5rem; }
      .resume-container { margin: 0; }
      .header { padding: 1.5rem 1rem; }
      .name { font-size: 2rem; }
      .contact-info { gap: 1rem; font-size: 0.9rem; }
      .section { padding: 1.5rem 1rem; }
      .item-header { flex-direction: column; gap: 0.5rem; }
      .date { align-self: flex-start; }
      .skills-grid { grid-template-columns: 1fr; }
    }
    
    @media print {
      body { 
        background: white; 
        padding: 0; 
        font-size: 12pt;
        line-height: 1.4;
      }
      .resume-container { 
        box-shadow: none; 
        border-radius: 0;
        max-width: none;
      }
      .header { 
        background: ${colors.primary} !important;
        print-color-adjust: exact;
      }
      .section { 
        padding: 1rem 0;
        page-break-inside: avoid;
      }
      .experience-item, .education-item {
        background: transparent !important;
        border-left: 2pt solid ${colors.accent} !important;
        print-color-adjust: exact;
        page-break-inside: avoid;
      }
      .skill-tag {
        background: ${colors.primary} !important;
        print-color-adjust: exact;
      }
    }
  `
}
