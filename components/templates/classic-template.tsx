"use client"

import { FileText } from "lucide-react"

interface ClassicTemplateProps {
  data: any
  colors?: {
    primary: string
    secondary: string
    accent: string
  }
}

export function ClassicTemplate({ data, colors }: ClassicTemplateProps) {
  const defaultColors = {
    primary: "#1f2937",
    secondary: "#374151",
    accent: "#059669",
  }
  const templateColors = colors || defaultColors

  return (
    <div className="bg-white border rounded-lg p-8 shadow-sm min-h-[800px] max-w-[8.5in] mx-auto">
      {/* Traditional Header */}
      <div className="text-center mb-8 pb-6" style={{ borderBottom: `2px solid ${templateColors.primary}` }}>
        <h1 className="text-3xl font-bold mb-3" style={{ color: templateColors.primary }}>
          {data.personalInfo.fullName || "Your Name"}
        </h1>
        <div className="flex flex-wrap justify-center gap-6 text-sm" style={{ color: templateColors.secondary }}>
          {data.personalInfo.email && <span>{data.personalInfo.email}</span>}
          {data.personalInfo.phone && <span>{data.personalInfo.phone}</span>}
          {data.personalInfo.location && <span>{data.personalInfo.location}</span>}
        </div>
        {(data.personalInfo.linkedin || data.personalInfo.website) && (
          <div className="flex flex-wrap justify-center gap-6 text-sm mt-2" style={{ color: templateColors.accent }}>
            {data.personalInfo.linkedin && <span>{data.personalInfo.linkedin}</span>}
            {data.personalInfo.website && <span>{data.personalInfo.website}</span>}
          </div>
        )}
      </div>

      {/* Summary */}
      {data.personalInfo.summary && (
        <div className="mb-8">
          <h2
            className="text-lg font-bold mb-3 pb-1 uppercase tracking-wide"
            style={{ color: templateColors.primary, borderBottom: `1px solid ${templateColors.secondary}` }}
          >
            Professional Summary
          </h2>
          <p className="text-gray-700 leading-relaxed text-justify">{data.personalInfo.summary}</p>
        </div>
      )}

      {/* Experience */}
      {data.experience.length > 0 && (
        <div className="mb-8">
          <h2
            className="text-lg font-bold mb-4 pb-1 uppercase tracking-wide"
            style={{ color: templateColors.primary, borderBottom: `1px solid ${templateColors.secondary}` }}
          >
            Professional Experience
          </h2>
          <div className="space-y-6">
            {data.experience.map((exp: any) => (
              <div key={exp.id}>
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-bold text-lg" style={{ color: templateColors.primary }}>
                      {exp.position}
                    </h3>
                    <p className="font-semibold" style={{ color: templateColors.secondary }}>
                      {exp.company}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-medium" style={{ color: templateColors.accent }}>
                      {exp.startDate} - {exp.current ? "Present" : exp.endDate}
                    </span>
                  </div>
                </div>
                {exp.description && (
                  <p className="text-gray-700 mb-3 text-sm leading-relaxed text-justify">{exp.description}</p>
                )}
                {exp.achievements.length > 0 && (
                  <ul className="list-disc list-inside text-sm text-gray-700 space-y-1 ml-4">
                    {exp.achievements.map((achievement: string, index: number) => (
                      <li key={index}>{achievement}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {data.education.length > 0 && (
        <div className="mb-8">
          <h2
            className="text-lg font-bold mb-4 pb-1 uppercase tracking-wide"
            style={{ color: templateColors.primary, borderBottom: `1px solid ${templateColors.secondary}` }}
          >
            Education
          </h2>
          <div className="space-y-4">
            {data.education.map((edu: any) => (
              <div key={edu.id} className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold" style={{ color: templateColors.primary }}>
                    {edu.degree} in {edu.field}
                  </h3>
                  <p className="font-semibold" style={{ color: templateColors.secondary }}>
                    {edu.institution}
                  </p>
                  {edu.gpa && (
                    <p className="text-sm" style={{ color: templateColors.accent }}>
                      GPA: {edu.gpa}
                    </p>
                  )}
                </div>
                <span className="text-sm font-medium" style={{ color: templateColors.accent }}>
                  {edu.startDate} - {edu.endDate}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills */}
      {(data.skills.technical.length > 0 || data.skills.soft.length > 0) && (
        <div className="mb-8">
          <h2
            className="text-lg font-bold mb-4 pb-1 uppercase tracking-wide"
            style={{ color: templateColors.primary, borderBottom: `1px solid ${templateColors.secondary}` }}
          >
            Skills & Qualifications
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {data.skills.technical.length > 0 && (
              <div>
                <h3 className="font-semibold mb-2" style={{ color: templateColors.secondary }}>
                  Technical Skills
                </h3>
                <p className="text-sm text-gray-700">{data.skills.technical.join(" • ")}</p>
              </div>
            )}
            {data.skills.soft.length > 0 && (
              <div>
                <h3 className="font-semibold mb-2" style={{ color: templateColors.secondary }}>
                  Professional Skills
                </h3>
                <p className="text-sm text-gray-700">{data.skills.soft.join(" • ")}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Empty state */}
      {!data.personalInfo.fullName && data.experience.length === 0 && data.education.length === 0 && (
        <div className="text-center py-12 text-gray-400">
          <FileText className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <p className="text-lg mb-2">Classic Executive Template</p>
          <p className="text-sm">Traditional layout perfect for corporate roles</p>
        </div>
      )}
    </div>
  )
}
