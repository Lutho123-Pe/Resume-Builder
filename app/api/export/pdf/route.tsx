import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { resumeData, template, customColors } = await request.json()

    // Generate HTML content that can be converted to PDF on the client side
    const htmlContent = generatePrintableHTML(resumeData, template, customColors)

    // Return HTML with special headers for PDF conversion
    return new NextResponse(htmlContent, {
      headers: {
        "Content-Type": "text/html",
        "Content-Disposition": `inline; filename="${resumeData.personalInfo.fullName || "resume"}.html"`,
        "X-PDF-Convert": "true", // Signal for client-side PDF conversion
      },
    })
  } catch (error) {
    console.error("PDF generation error:", error)
    return NextResponse.json({ error: "Failed to generate PDF" }, { status: 500 })
  }
}

function generatePrintableHTML(resumeData: any, template: string, customColors?: any) {
  const colors = customColors || getTemplateColors(template)

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${resumeData.personalInfo.fullName} - Resume</title>
      <style>
        ${getPrintOptimizedCSS(template, colors)}
      </style>
      <script>
        window.onload = function() {
          // Trigger print dialog for PDF generation
          setTimeout(() => {
            window.print();
          }, 500);
        }
      </script>
    </head>
    <body>
      ${generateResumeBody(resumeData, template)}
    </body>
    </html>
  `
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

function getPrintOptimizedCSS(template: string, colors: any) {
  return `
    * { margin: 0; padding: 0; box-sizing: border-box; }
    
    @page {
      size: A4;
      margin: 0.5in;
    }
    
    body { 
      font-family: 'Arial', 'Helvetica', sans-serif; 
      line-height: 1.5; 
      color: #333; 
      background: white;
      font-size: 11pt;
    }
    
    .resume-container { 
      max-width: 100%;
      background: white;
    }
    
    .header { 
      text-align: center; 
      margin-bottom: 1.5rem; 
      border-bottom: 2px solid ${colors.primary};
      padding-bottom: 1rem;
    }
    
    .name { 
      font-size: 24pt; 
      font-weight: bold; 
      color: ${colors.primary}; 
      margin-bottom: 0.5rem;
    }
    
    .contact-info { 
      display: flex; 
      justify-content: center; 
      gap: 1rem; 
      flex-wrap: wrap;
      font-size: 10pt;
      color: ${colors.secondary};
    }
    
    .section { 
      margin-bottom: 1.2rem; 
      page-break-inside: avoid;
    }
    
    .section-title { 
      font-size: 14pt; 
      font-weight: bold; 
      color: ${colors.primary}; 
      border-bottom: 1px solid ${colors.accent};
      padding-bottom: 0.2rem;
      margin-bottom: 0.8rem;
    }
    
    .experience-item, .education-item { 
      margin-bottom: 1rem; 
      page-break-inside: avoid;
    }
    
    .item-header { 
      display: flex; 
      justify-content: space-between; 
      align-items: flex-start;
      margin-bottom: 0.3rem;
    }
    
    .position, .degree { 
      font-weight: bold; 
      color: ${colors.primary}; 
      font-size: 12pt;
    }
    
    .company, .institution { 
      color: ${colors.secondary}; 
      font-size: 11pt;
    }
    
    .date { 
      color: ${colors.secondary}; 
      font-size: 10pt;
      white-space: nowrap;
    }
    
    .description { 
      margin: 0.4rem 0; 
      color: #555;
      font-size: 10pt;
    }
    
    .achievements { 
      list-style: none; 
      margin-left: 1rem;
    }
    
    .achievements li { 
      margin-bottom: 0.2rem; 
      position: relative;
      font-size: 10pt;
    }
    
    .achievements li:before { 
      content: "•"; 
      color: ${colors.primary}; 
      font-weight: bold; 
      position: absolute; 
      left: -1rem;
    }
    
    .skills-grid { 
      display: grid; 
      grid-template-columns: repeat(2, 1fr); 
      gap: 1rem;
    }
    
    .skill-category { 
      margin-bottom: 0.8rem;
    }
    
    .skill-category-title { 
      font-weight: bold; 
      color: ${colors.primary}; 
      margin-bottom: 0.3rem;
      font-size: 11pt;
    }
    
    .skill-list { 
      color: ${colors.secondary};
      font-size: 10pt;
    }
    
    @media print {
      body { 
        print-color-adjust: exact; 
        -webkit-print-color-adjust: exact;
      }
      
      .resume-container { 
        margin: 0; 
        padding: 0;
      }
      
      .section {
        page-break-inside: avoid;
      }
      
      .experience-item, .education-item {
        page-break-inside: avoid;
      }
    }
  `
}

function generateResumeBody(resumeData: any, template: string) {
  const { personalInfo, experience, education, skills } = resumeData

  return `
    <div class="resume-container">
      <header class="header">
        <h1 class="name">${personalInfo.fullName}</h1>
        <div class="contact-info">
          ${personalInfo.email ? `<span>${personalInfo.email}</span>` : ""}
          ${personalInfo.phone ? `<span>${personalInfo.phone}</span>` : ""}
          ${personalInfo.location ? `<span>${personalInfo.location}</span>` : ""}
          ${personalInfo.linkedin ? `<span>${personalInfo.linkedin}</span>` : ""}
          ${personalInfo.website ? `<span>${personalInfo.website}</span>` : ""}
        </div>
      </header>

      ${
        personalInfo.summary
          ? `
        <section class="section">
          <h2 class="section-title">Professional Summary</h2>
          <p class="description">${personalInfo.summary}</p>
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
                <div>
                  <div class="position">${exp.position}</div>
                  <div class="company">${exp.company}</div>
                </div>
                <div class="date">
                  ${exp.startDate} - ${exp.current ? "Present" : exp.endDate}
                </div>
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
                <div>
                  <div class="position">${edu.degree} in ${edu.field}</div>
                  <div class="company">${edu.institution}</div>
                </div>
                <div class="date">${edu.startDate} - ${edu.endDate}</div>
              </div>
              ${edu.gpa ? `<p class="description">GPA: ${edu.gpa}</p>` : ""}
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
              <div class="skill-category-title">Technical Skills</div>
              <div class="skill-list">${skills.technical.join(", ")}</div>
            </div>
          `
              : ""
          }
          ${
            skills.soft.length > 0
              ? `
            <div class="skill-category">
              <div class="skill-category-title">Soft Skills</div>
              <div class="skill-list">${skills.soft.join(", ")}</div>
            </div>
          `
              : ""
          }
          ${
            skills.languages.length > 0
              ? `
            <div class="skill-category">
              <div class="skill-category-title">Languages</div>
              <div class="skill-list">${skills.languages.join(", ")}</div>
            </div>
          `
              : ""
          }
          ${
            skills.certifications.length > 0
              ? `
            <div class="skill-category">
              <div class="skill-category-title">Certifications</div>
              <div class="skill-list">${skills.certifications.join(", ")}</div>
            </div>
          `
              : ""
          }
        </div>
      </section>
    </div>
  `
}
