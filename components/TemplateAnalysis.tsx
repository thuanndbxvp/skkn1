'use client'

import { Section } from '@/lib/types'
import { Card } from '@/components/ui/card'
import { Check } from 'lucide-react'

interface TemplateAnalysisProps {
  sections: Section[]
  isAnalyzing: boolean
}

export function TemplateAnalysis({
  sections,
  isAnalyzing,
}: TemplateAnalysisProps) {
  if (isAnalyzing) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          AI đang phân tích cấu trúc mẫu...
        </h3>
        <p className="text-sm text-gray-600">
          Vui lòng đợi trong giây lát
        </p>
      </div>
    )
  }

  if (sections.length === 0) {
    return null
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
          <Check className="w-8 h-8 text-green-600" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Phân tích hoàn tất!
        </h3>
        <p className="text-gray-600">
          AI đã xác định được {sections.length} phần chính trong mẫu SKKN
        </p>
      </div>

      <div className="space-y-3">
        {sections.map((section, index) => (
          <Card key={section.id} className="p-4 hover:shadow-md transition-shadow">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-sm font-semibold text-blue-600">
                  {index + 1}
                </span>
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900 mb-1">
                  {section.title}
                </h4>
                <p className="text-sm text-gray-600">{section.description}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
