"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Download, FileText, File, Globe, Loader2, CheckCircle } from "lucide-react"

interface ExportDialogProps {
  resumeData: any
  template: string
  customColors?: any
}

export function ExportDialog({ resumeData, template, customColors }: ExportDialogProps) {
  const [isExporting, setIsExporting] = useState<string | null>(null)
  const [exportSuccess, setExportSuccess] = useState<string | null>(null)

  const exportFormats = [
    {
      id: "pdf",
      name: "PDF",
      description: "Professional format, best for applications",
      icon: FileText,
      color: "text-red-600",
      recommended: true,
    },
    {
      id: "docx",
      name: "DOCX",
      description: "Editable Word document",
      icon: File,
      color: "text-blue-600",
      recommended: false,
    },
    {
      id: "html",
      name: "HTML",
      description: "Web format with interactive links",
      icon: Globe,
      color: "text-green-600",
      recommended: false,
    },
  ]

  const handleExport = async (format: string) => {
    setIsExporting(format)
    setExportSuccess(null)

    try {
      const response = await fetch(`/api/export/${format}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resumeData,
          template,
          customColors,
        }),
      })

      if (!response.ok) {
        throw new Error(`Export failed: ${response.statusText}`)
      }

      // Get the blob and create download link
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url

      // Get filename from Content-Disposition header or use default
      const contentDisposition = response.headers.get("Content-Disposition")
      const filename = contentDisposition
        ? contentDisposition.split("filename=")[1]?.replace(/"/g, "")
        : `${resumeData.personalInfo.fullName || "resume"}.${format}`

      a.download = filename
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)

      setExportSuccess(format)
      setTimeout(() => setExportSuccess(null), 3000)
    } catch (error) {
      console.error(`Failed to export ${format}:`, error)
      // You could add error state handling here
    } finally {
      setIsExporting(null)
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm" className="bg-secondary hover:bg-secondary/90">
          <Download className="w-4 h-4 mr-2" />
          Export Resume
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Download className="w-5 h-5" />
            Export Your Resume
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          {exportFormats.map((format) => {
            const Icon = format.icon
            const isLoading = isExporting === format.id
            const isSuccess = exportSuccess === format.id

            return (
              <Card key={format.id} className="relative">
                {format.recommended && (
                  <Badge className="absolute -top-2 -right-2 bg-primary text-primary-foreground">Recommended</Badge>
                )}
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Icon className={`w-5 h-5 ${format.color}`} />
                    {format.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">{format.description}</p>

                  <Button
                    onClick={() => handleExport(format.id)}
                    disabled={isLoading}
                    className="w-full"
                    variant={format.recommended ? "default" : "outline"}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Exporting...
                      </>
                    ) : isSuccess ? (
                      <>
                        <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
                        Downloaded!
                      </>
                    ) : (
                      <>
                        <Download className="w-4 h-4 mr-2" />
                        Export {format.name}
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <div className="mt-6 p-4 bg-muted rounded-lg">
          <h4 className="font-medium mb-2">Export Tips:</h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• PDF format is recommended for job applications</li>
            <li>• DOCX allows further editing and customization</li>
            <li>• HTML format includes clickable links and is web-friendly</li>
            <li>• All formats are ATS-compatible with proper formatting</li>
          </ul>
        </div>
      </DialogContent>
    </Dialog>
  )
}
