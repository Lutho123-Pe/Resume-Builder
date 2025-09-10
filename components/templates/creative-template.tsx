"use client"

import { FileText } from "lucide-react"

interface CreativeTemplateProps {
  data: any
  colors?: {
    primary: string
    secondary: string
    accent: string
  }
}

export function CreativeTemplate({ data, colors }: CreativeTemplateProps) {
  const defaultColors = {
    primary: "#7c3aed",
    secondary: "#ec4899",
    accent: "#f59e0b",
  }
  const templateColors = colors || defaultColors

  return (
    <div className="bg-white border rounded-lg shadow-sm min-h-[800px] max-w-[8.5in] mx-auto overflow-hidden">
      {/* Creative Header with Gradient */}
      <div
        className="p-8 text-white relative"
        style={{
          background: `linear-gradient(135deg, ${templateColors.primary} 0%, ${templateColors.secondary} 100%)`,
        }}
      >
        <div className="relative z-10">
          <h1 className="text-4xl font-bold mb-3">{data.personalInfo.fullName || "Your Name"}</h1>
          <div className="flex flex-wrap gap-4 text-sm opacity-90">
            {data.personalInfo.email && <span>{data.personalInfo.email}</span>}
            {data.personalInfo.phone && <span>{data.personalInfo.phone}</span>}
            {data.personalInfo.location && <span>{data.personalInfo.location}</span>}
          </div>
          {(data.personalInfo.linkedin || data.personalInfo.website) && (
            <div className="flex flex-wrap gap-4 text-sm mt-2 opacity-80">
              {data.personalInfo.linkedin && <span>{data.personalInfo.linkedin}</span>}
              {data.personalInfo.website && <span>{data.personalInfo.website}</span>}
            </div>
          )}
        </div>
        {/* Decorative elements */}
        <div
          className="absolute top-4 right-4 w-20 h-20 rounded-full opacity-20"
          style={{ backgroundColor: templateColors.accent }}
        />
        <div
          className="absolute bottom-4 right-12 w-12 h-12 rounded-full opacity-15"
          style={{ backgroundColor: templateColors.accent }}
        />
      </div>

      <div className="p-8">
        {/* Summary with creative styling */}
        {data.personalInfo.summary && (
          <div className="mb-8">
            <div className="flex items-center mb-4">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center mr-4"
                style={{ backgroundColor: `${templateColors.primary}15` }}
              >
                <div className="w-6 h-6 rounded-full" style={{ backgroundColor: templateColors.primary }} />
              </div>
              <h2 className="text-2xl font-bold" style={{ color: templateColors.primary }}>
                About Me
              </h2>
            </div>
            <p className="text-gray-700 leading-relaxed text-lg">{data.personalInfo.summary}</p>
          </div>
        )}

        {/* Experience with creative cards */}
        {data.experience.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center mb-6">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center mr-4"
                style={{ backgroundColor: `${templateColors.secondary}15` }}
              >
                <div className="w-6 h-6 rounded-full" style={{ backgroundColor: templateColors.secondary }} />
              </div>
              <h2 className="text-2xl font-bold" style={{ color: templateColors.primary }}>
                Experience
              </h2>
            </div>
            <div className="space-y-6">
              {data.experience.map((exp: any, index: number) => (
                <div
                  key={exp.id}
                  className="relative p-6 rounded-2xl"
                  style={{
                    backgroundColor: index % 2 === 0 ? `${templateColors.primary}08` : `${templateColors.secondary}08`,
                  }}
                >
                  <div
                    className="absolute top-4 left-4 w-3 h-3 rounded-full"
                    style={{ backgroundColor: templateColors.accent }}
                  />
                  <div className="ml-8">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-bold text-xl" style={{ color: templateColors.primary }}>
                          {exp.position}
                        </h3>
                        <p className="font-semibold text-lg" style={{ color: templateColors.secondary }}>
                          {exp.company}
                        </p>
                      </div>
                      <span
                        className="px-4 py-2 rounded-full text-sm font-medium"
                        style={{
                          backgroundColor: templateColors.accent,
                          color: "white",
                        }}
                      >
                        {exp.startDate} - {exp.current ? "Present" : exp.endDate}
                      </span>
                    </div>
                    {exp.description && <p className="text-gray-700 mb-4 leading-relaxed">{exp.description}</p>}
                    {exp.achievements.length > 0 && (
                      <div className="space-y-2">
                        {exp.achievements.map((achievement: string, achIndex: number) => (
                          <div key={achIndex} className="flex items-start">
                            <div
                              className="w-2 h-2 rounded-full mt-2 mr-3 flex-shrink-0"
                              style={{ backgroundColor: templateColors.accent }}
                            />
                            <span className="text-gray-700">{achievement}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education and Skills in creative layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Education */}
          {data.education.length > 0 && (
            <div>
              <div className="flex items-center mb-6">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center mr-3"
                  style={{ backgroundColor: `${templateColors.accent}15` }}
                >
                  <div className="w-5 h-5 rounded-full" style={{ backgroundColor: templateColors.accent }} />
                </div>
                <h2 className="text-xl font-bold" style={{ color: templateColors.primary }}>
                  Education
                </h2>
              </div>
              <div className="space-y-4">
                {data.education.map((edu: any) => (
                  <div
                    key={edu.id}
                    className="p-4 rounded-xl"
                    style={{ backgroundColor: `${templateColors.accent}10` }}
                  >
                    <h3 className="font-bold" style={{ color: templateColors.primary }}>
                      {edu.degree} in {edu.field}
                    </h3>
                    <p className="font-semibold" style={{ color: templateColors.secondary }}>
                      {edu.institution}
                    </p>
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
              <div className="flex items-center mb-6">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center mr-3"
                  style={{ backgroundColor: `${templateColors.secondary}15` }}
                >
                  <div className="w-5 h-5 rounded-full" style={{ backgroundColor: templateColors.secondary }} />
                </div>
                <h2 className="text-xl font-bold" style={{ color: templateColors.primary }}>
                  Skills
                </h2>
              </div>
              <div className="space-y-6">
                {data.skills.technical.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-3" style={{ color: templateColors.primary }}>
                      Technical Skills
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {data.skills.technical.map((skill: string, index: number) => (
                        <span
                          key={index}
                          className="px-4 py-2 rounded-full text-sm font-medium"
                          style={{
                            backgroundColor: templateColors.primary,
                            color: "white",
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
                    <h3 className="font-semibold mb-3" style={{ color: templateColors.primary }}>
                      Creative Skills
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {data.skills.soft.map((skill: string, index: number) => (
                        <span
                          key={index}
                          className="px-4 py-2 rounded-full text-sm font-medium"
                          style={{
                            backgroundColor: templateColors.secondary,
                            color: "white",
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
      </div>

      {/* Empty state */}
      {!data.personalInfo.fullName && data.experience.length === 0 && data.education.length === 0 && (
        <div className="text-center py-12 text-gray-400">
          <FileText className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <p className="text-lg mb-2">Creative Designer Template</p>
          <p className="text-sm">Bold design with creative elements for design roles</p>
        </div>
      )}
    </div>
  )
}
