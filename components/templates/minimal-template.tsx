"use client"

import { FileText } from "lucide-react"

interface MinimalTemplateProps {
  data: any
  colors?: {
    primary: string
    secondary: string
    accent: string
  }
}

export function MinimalTemplate({ data, colors }: MinimalTemplateProps) {
  const defaultColors = {
    primary: "#111827",
    secondary: "#6b7280",
    accent: "#3b82f6",
  }
  const templateColors = colors || defaultColors

  return (
    <div className="bg-white border rounded-lg p-12 shadow-sm min-h-[800px] max-w-[8.5in] mx-auto">
      {/* Ultra-minimal header */}
      <div className="mb-12">
        <h1 className="text-5xl font-light mb-4" style={{ color: templateColors.primary }}>
          {data.personalInfo.fullName || "Your Name"}
        </h1>
        <div className="flex flex-wrap gap-8 text-sm" style={{ color: templateColors.secondary }}>
          {data.personalInfo.email && <span>{data.personalInfo.email}</span>}
          {data.personalInfo.phone && <span>{data.personalInfo.phone}</span>}
          {data.personalInfo.location && <span>{data.personalInfo.location}</span>}
        </div>
        {(data.personalInfo.linkedin || data.personalInfo.website) && (
          <div className="flex flex-wrap gap-8 text-sm mt-2" style={{ color: templateColors.accent }}>
            {data.personalInfo.linkedin && <span>{data.personalInfo.linkedin}</span>}
            {data.personalInfo.website && <span>{data.personalInfo.website}</span>}
          </div>
        )}
      </div>

      {/* Summary */}
      {data.personalInfo.summary && (
        <div className="mb-12">
          <p className="text-lg leading-relaxed" style={{ color: templateColors.secondary }}>
            {data.personalInfo.summary}
          </p>
        </div>
      )}

      {/* Experience */}
      {data.experience.length > 0 && (
        <div className="mb-12">
          <h2 className="text-sm font-medium mb-8 tracking-widest uppercase" style={{ color: templateColors.primary }}>
            Experience
          </h2>
          <div className="space-y-10">
            {data.experience.map((exp: any) => (
              <div key={exp.id}>
                <div className="flex justify-between items-baseline mb-2">
                  <h3 className="text-xl font-light" style={{ color: templateColors.primary }}>
                    {exp.position}
                  </h3>
                  <span className="text-sm" style={{ color: templateColors.secondary }}>
                    {exp.startDate} — {exp.current ? "Present" : exp.endDate}
                  </span>
                </div>
                <p className="text-lg font-light mb-4" style={{ color: templateColors.accent }}>
                  {exp.company}
                </p>
                {exp.description && (
                  <p className="leading-relaxed mb-4" style={{ color: templateColors.secondary }}>
                    {exp.description}
                  </p>
                )}
                {exp.achievements.length > 0 && (
                  <ul className="space-y-2">
                    {exp.achievements.map((achievement: string, index: number) => (
                      <li key={index} className="leading-relaxed" style={{ color: templateColors.secondary }}>
                        — {achievement}
                      </li>
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
        <div className="mb-12">
          <h2 className="text-sm font-medium mb-8 tracking-widest uppercase" style={{ color: templateColors.primary }}>
            Education
          </h2>
          <div className="space-y-6">
            {data.education.map((edu: any) => (
              <div key={edu.id}>
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="text-lg font-light" style={{ color: templateColors.primary }}>
                    {edu.degree} in {edu.field}
                  </h3>
                  <span className="text-sm" style={{ color: templateColors.secondary }}>
                    {edu.startDate} — {edu.endDate}
                  </span>
                </div>
                <p style={{ color: templateColors.accent }}>{edu.institution}</p>
                {edu.gpa && (
                  <p className="text-sm mt-1" style={{ color: templateColors.secondary }}>
                    GPA: {edu.gpa}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills */}
      {(data.skills.technical.length > 0 || data.skills.soft.length > 0) && (
        <div className="mb-12">
          <h2 className="text-sm font-medium mb-8 tracking-widest uppercase" style={{ color: templateColors.primary }}>
            Skills
          </h2>
          <div className="space-y-6">
            {data.skills.technical.length > 0 && (
              <div>
                <h3 className="text-lg font-light mb-3" style={{ color: templateColors.primary }}>
                  Technical
                </h3>
                <p className="leading-relaxed" style={{ color: templateColors.secondary }}>
                  {data.skills.technical.join(" • ")}
                </p>
              </div>
            )}
            {data.skills.soft.length > 0 && (
              <div>
                <h3 className="text-lg font-light mb-3" style={{ color: templateColors.primary }}>
                  Professional
                </h3>
                <p className="leading-relaxed" style={{ color: templateColors.secondary }}>
                  {data.skills.soft.join(" • ")}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Empty state */}
      {!data.personalInfo.fullName && data.experience.length === 0 && data.education.length === 0 && (
        <div className="text-center py-12 text-gray-400">
          <FileText className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <p className="text-lg mb-2">Minimal Clean Template</p>
          <p className="text-sm">Ultra-clean design focusing on content over decoration</p>
        </div>
      )}
    </div>
  )
}
