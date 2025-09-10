"use client"

import { FileText } from "lucide-react"

interface ModernTemplateProps {
  data: any
  colors?: {
    primary: string
    secondary: string
    accent: string
  }
}

export function ModernTemplate({ data, colors }: ModernTemplateProps) {
  const defaultColors = {
    primary: "#374151",
    secondary: "#6366f1",
    accent: "#10b981",
  }
  const templateColors = colors || defaultColors

  return (
    <div className="bg-white border rounded-lg p-8 shadow-sm min-h-[800px] max-w-[8.5in] mx-auto">
      {/* Header with accent sidebar */}
      <div className="flex">
        <div className="w-2 rounded-l-lg mr-6" style={{ backgroundColor: templateColors.secondary }} />
        <div className="flex-1">
          <div className="mb-6">
            <h1 className="text-4xl font-bold mb-2" style={{ color: templateColors.primary }}>
              {data.personalInfo.fullName || "Your Name"}
            </h1>
            <div className="flex flex-wrap gap-4 text-sm" style={{ color: templateColors.primary }}>
              {data.personalInfo.email && <span>{data.personalInfo.email}</span>}
              {data.personalInfo.phone && <span>{data.personalInfo.phone}</span>}
              {data.personalInfo.location && <span>{data.personalInfo.location}</span>}
            </div>
            {(data.personalInfo.linkedin || data.personalInfo.website) && (
              <div className="flex flex-wrap gap-4 text-sm mt-2" style={{ color: templateColors.secondary }}>
                {data.personalInfo.linkedin && <span>{data.personalInfo.linkedin}</span>}
                {data.personalInfo.website && <span>{data.personalInfo.website}</span>}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Summary with modern styling */}
      {data.personalInfo.summary && (
        <div className="mb-6">
          <div className="flex items-center mb-3">
            <div className="w-8 h-1 rounded mr-3" style={{ backgroundColor: templateColors.secondary }} />
            <h2 className="text-xl font-semibold" style={{ color: templateColors.primary }}>
              Professional Summary
            </h2>
          </div>
          <p className="text-gray-700 leading-relaxed pl-11">{data.personalInfo.summary}</p>
        </div>
      )}

      {/* Experience with modern cards */}
      {data.experience.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center mb-4">
            <div className="w-8 h-1 rounded mr-3" style={{ backgroundColor: templateColors.secondary }} />
            <h2 className="text-xl font-semibold" style={{ color: templateColors.primary }}>
              Professional Experience
            </h2>
          </div>
          <div className="space-y-6 pl-11">
            {data.experience.map((exp: any) => (
              <div key={exp.id} className="relative">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-semibold text-lg" style={{ color: templateColors.primary }}>
                      {exp.position}
                    </h3>
                    <p className="font-medium" style={{ color: templateColors.secondary }}>
                      {exp.company}
                    </p>
                  </div>
                  <span
                    className="text-sm px-3 py-1 rounded-full"
                    style={{
                      backgroundColor: `${templateColors.accent}20`,
                      color: templateColors.accent,
                    }}
                  >
                    {exp.startDate} - {exp.current ? "Present" : exp.endDate}
                  </span>
                </div>
                {exp.description && <p className="text-gray-700 mb-3 text-sm leading-relaxed">{exp.description}</p>}
                {exp.achievements.length > 0 && (
                  <ul className="space-y-1">
                    {exp.achievements.map((achievement: string, index: number) => (
                      <li key={index} className="flex items-start text-sm text-gray-700">
                        <div
                          className="w-2 h-2 rounded-full mt-2 mr-3 flex-shrink-0"
                          style={{ backgroundColor: templateColors.accent }}
                        />
                        {achievement}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education and Skills in two columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Education */}
        {data.education.length > 0 && (
          <div>
            <div className="flex items-center mb-4">
              <div className="w-6 h-1 rounded mr-3" style={{ backgroundColor: templateColors.secondary }} />
              <h2 className="text-lg font-semibold" style={{ color: templateColors.primary }}>
                Education
              </h2>
            </div>
            <div className="space-y-4 pl-9">
              {data.education.map((edu: any) => (
                <div key={edu.id}>
                  <h3 className="font-semibold" style={{ color: templateColors.primary }}>
                    {edu.degree} in {edu.field}
                  </h3>
                  <p style={{ color: templateColors.secondary }}>{edu.institution}</p>
                  <p className="text-sm text-gray-600">
                    {edu.startDate} - {edu.endDate}
                    {edu.gpa && ` • GPA: ${edu.gpa}`}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Skills */}
        {(data.skills.technical.length > 0 || data.skills.soft.length > 0) && (
          <div>
            <div className="flex items-center mb-4">
              <div className="w-6 h-1 rounded mr-3" style={{ backgroundColor: templateColors.secondary }} />
              <h2 className="text-lg font-semibold" style={{ color: templateColors.primary }}>
                Skills
              </h2>
            </div>
            <div className="space-y-4 pl-9">
              {data.skills.technical.length > 0 && (
                <div>
                  <h3 className="font-medium mb-2" style={{ color: templateColors.primary }}>
                    Technical
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {data.skills.technical.map((skill: string, index: number) => (
                      <span
                        key={index}
                        className="px-3 py-1 text-xs rounded-full"
                        style={{
                          backgroundColor: `${templateColors.secondary}15`,
                          color: templateColors.secondary,
                        }}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {data.skills.soft.length > 0 && (
                <div>
                  <h3 className="font-medium mb-2" style={{ color: templateColors.primary }}>
                    Soft Skills
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {data.skills.soft.map((skill: string, index: number) => (
                      <span
                        key={index}
                        className="px-3 py-1 text-xs rounded-full"
                        style={{
                          backgroundColor: `${templateColors.accent}15`,
                          color: templateColors.accent,
                        }}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Empty state */}
      {!data.personalInfo.fullName && data.experience.length === 0 && data.education.length === 0 && (
        <div className="text-center py-12 text-gray-400">
          <FileText className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <p className="text-lg mb-2">Modern Professional Template</p>
          <p className="text-sm">Clean design with accent colors and modern typography</p>
        </div>
      )}
    </div>
  )
}
