'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { useSKKNStore } from '@/lib/store'
import {
  Wand2,
  AlertTriangle,
  TrendingUp,
  Loader2,
  Check,
  X,
  ChevronDown,
  ChevronUp,
} from 'lucide-react'
import toast from 'react-hot-toast'

interface SectionEnhancerProps {
  sectionId: string
  sectionTitle: string
  content: string
  topicName?: string
  onContentUpdate: (newContent: string) => void
}

type EnhancerMode = 'rewrite' | 'review' | 'upgrade' | null

export function SectionEnhancer({
  sectionId,
  sectionTitle,
  content,
  topicName,
  onContentUpdate,
}: SectionEnhancerProps) {
  const { aiConfig } = useSKKNStore()
  const [isOpen, setIsOpen] = useState(false)
  const [activeMode, setActiveMode] = useState<EnhancerMode>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<any>(null)

  const handleRewrite = async () => {
    setIsLoading(true)
    setActiveMode('rewrite')
    try {
      const response = await fetch('/api/rewrite-section', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content,
          sectionTitle,
          provider: aiConfig.provider,
          model: aiConfig.model,
          apiKey: aiConfig.apiKey,
        }),
      })

      if (!response.ok) throw new Error('Failed to rewrite')

      const data = await response.json()
      setResult(data)
      toast.success('Đã chuẩn hóa ngôn ngữ!')
    } catch (error) {
      toast.error('Không thể chuẩn hóa. Vui lòng thử lại.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleReview = async () => {
    setIsLoading(true)
    setActiveMode('review')
    try {
      const response = await fetch('/api/review-section', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content,
          sectionTitle,
          topicName,
          provider: aiConfig.provider,
          model: aiConfig.model,
          apiKey: aiConfig.apiKey,
        }),
      })

      if (!response.ok) throw new Error('Failed to review')

      const data = await response.json()
      setResult(data)
      toast.success('Đánh giá hoàn tất!')
    } catch (error) {
      toast.error('Không thể đánh giá. Vui lòng thử lại.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpgrade = async () => {
    setIsLoading(true)
    setActiveMode('upgrade')
    try {
      const response = await fetch('/api/upgrade-section', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content,
          sectionTitle,
          topicName,
          provider: aiConfig.provider,
          model: aiConfig.model,
          apiKey: aiConfig.apiKey,
        }),
      })

      if (!response.ok) throw new Error('Failed to upgrade')

      const data = await response.json()
      setResult(data)
      toast.success('Phân tích nâng hạng hoàn tất!')
    } catch (error) {
      toast.error('Không thể phân tích. Vui lòng thử lại.')
    } finally {
      setIsLoading(false)
    }
  }

  const applyRewrittenContent = () => {
    if (result?.rewrittenContent) {
      onContentUpdate(result.rewrittenContent)
      toast.success('Đã áp dụng nội dung chuẩn hóa!')
      setResult(null)
      setActiveMode(null)
    }
  }

  if (!isOpen) {
    return (
      <div className="flex gap-2 mt-3">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsOpen(true)}
          className="text-purple-600 border-purple-200 hover:bg-purple-50"
        >
          <Wand2 className="w-4 h-4 mr-1" />
          Nâng cao
        </Button>
      </div>
    )
  }

  return (
    <Card className="mt-3 p-4 border-purple-200 bg-purple-50/50">
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-semibold text-purple-900 flex items-center">
          <Wand2 className="w-4 h-4 mr-2" />
          Công cụ nâng cao
        </h4>
        <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
          <X className="w-4 h-4" />
        </Button>
      </div>

      {/* Action Buttons */}
      {!isLoading && !result && (
        <div className="grid grid-cols-3 gap-2 mb-4">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRewrite}
            className="flex-col h-auto py-2"
          >
            <Wand2 className="w-4 h-4 mb-1" />
            <span className="text-xs">Chuẩn hóa</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleReview}
            className="flex-col h-auto py-2"
          >
            <AlertTriangle className="w-4 h-4 mb-1" />
            <span className="text-xs">Rà soát lỗi</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleUpgrade}
            className="flex-col h-auto py-2"
          >
            <TrendingUp className="w-4 h-4 mb-1" />
            <span className="text-xs">Nâng hạng</span>
          </Button>
        </div>
      )}

      {/* Loading */}
      {isLoading && (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-purple-600" />
          <span className="ml-2 text-sm text-purple-900">
            {activeMode === 'rewrite' && 'Đang chuẩn hóa ngôn ngữ...'}
            {activeMode === 'review' && 'Đang rà soát lỗi...'}
            {activeMode === 'upgrade' && 'Đang phân tích nâng hạng...'}
          </span>
        </div>
      )}

      {/* Rewrite Result */}
      {!isLoading && activeMode === 'rewrite' && result && (
        <div className="space-y-3">
          <div className="bg-white p-3 rounded-lg">
            <h5 className="text-sm font-medium text-amber-700 mb-2 flex items-center">
              <AlertTriangle className="w-4 h-4 mr-1" />
              Vấn đề phát hiện:
            </h5>
            <ul className="text-sm text-gray-700 space-y-1">
              {result.originalIssues?.map((issue: string, i: number) => (
                <li key={i}>• {issue}</li>
              ))}
            </ul>
          </div>

          <div className="bg-white p-3 rounded-lg">
            <h5 className="text-sm font-medium text-green-700 mb-2">
              Nội dung chuẩn hóa:
            </h5>
            <Textarea
              value={result.rewrittenContent}
              readOnly
              rows={6}
              className="text-sm bg-gray-50"
            />
          </div>

          <div className="bg-green-50 p-3 rounded-lg">
            <h5 className="text-sm font-medium text-green-700 mb-1">
              Cải thiện:
            </h5>
            <ul className="text-sm text-green-800 space-y-1">
              {result.improvements?.map((imp: string, i: number) => (
                <li key={i}>✓ {imp}</li>
              ))}
            </ul>
          </div>

          <div className="flex gap-2">
            <Button
              size="sm"
              onClick={applyRewrittenContent}
              className="flex-1"
            >
              <Check className="w-4 h-4 mr-1" />
              Áp dụng
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setResult(null)}
            >
              Đóng
            </Button>
          </div>
        </div>
      )}

      {/* Review Result */}
      {!isLoading && activeMode === 'review' && result && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Badge
              variant={result.predictedScore?.includes('Xuất sắc') ? 'default' : 
                      result.predictedScore?.includes('Tốt') ? 'secondary' : 'outline'}
            >
              {result.predictedScore || 'Chưa đánh giá'}
            </Badge>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setResult(null)}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          {result.strengths?.length > 0 && (
            <div className="bg-green-50 p-3 rounded-lg">
              <h5 className="text-sm font-medium text-green-700 mb-1">
                Điểm mạnh:
              </h5>
              <ul className="text-sm text-green-800 space-y-1">
                {result.strengths.map((s: string, i: number) => (
                  <li key={i}>✓ {s}</li>
                ))}
              </ul>
            </div>
          )}

          {result.criticalIssues?.length > 0 && (
            <div className="bg-red-50 p-3 rounded-lg">
              <h5 className="text-sm font-medium text-red-700 mb-2">
                Lỗi cần khắc phục:
              </h5>
              <div className="space-y-2">
                {result.criticalIssues.map((issue: any, i: number) => (
                  <div key={i} className="text-sm">
                    <Badge
                      variant={
                        issue.severity === 'high'
                          ? 'destructive'
                          : issue.severity === 'medium'
                          ? 'secondary'
                          : 'outline'
                      }
                      className="text-xs mb-1"
                    >
                      {issue.severity === 'high'
                        ? 'Nghiêm trọng'
                        : issue.severity === 'medium'
                        ? 'Cần cải thiện'
                        : 'Nhẹ'}
                    </Badge>
                    <p className="text-red-800">{issue.issue}</p>
                    <p className="text-green-700 text-xs mt-1">
                      💡 {issue.suggestion}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {result.improvementPlan?.length > 0 && (
            <div className="bg-blue-50 p-3 rounded-lg">
              <h5 className="text-sm font-medium text-blue-700 mb-1">
                Kế hoạch cải thiện:
              </h5>
              <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
                {result.improvementPlan.map((step: string, i: number) => (
                  <li key={i}>{step}</li>
                ))}
              </ol>
            </div>
          )}
        </div>
      )}

      {/* Upgrade Result */}
      {!isLoading && activeMode === 'upgrade' && result && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-sm text-gray-600">Hiện tại: </span>
              <Badge variant="outline">{result.currentAssessment?.level}</Badge>
              <span className="text-sm text-gray-600 ml-2">→ Dự kiến: </span>
              <Badge>{result.estimatedNewLevel}</Badge>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setResult(null)}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          {result.missingElements?.length > 0 && (
            <div className="bg-amber-50 p-3 rounded-lg">
              <h5 className="text-sm font-medium text-amber-700 mb-2">
                Yếu tố cần bổ sung:
              </h5>
              <div className="space-y-2">
                {result.missingElements.map((item: any, i: number) => (
                  <div key={i} className="text-sm">
                    <p className="font-medium text-amber-900">{item.element}</p>
                    <p className="text-amber-700 text-xs">{item.importance}</p>
                    <p className="text-green-700 text-xs mt-1">
                      ✓ {item.howToAdd}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {result.quickImprovements?.length > 0 && (
            <div className="bg-blue-50 p-3 rounded-lg">
              <h5 className="text-sm font-medium text-blue-700 mb-2">
                Cải thiện nhanh (hiệu quả cao):
              </h5>
              <div className="space-y-2">
                {result.quickImprovements.map((imp: any, i: number) => (
                  <div key={i} className="text-sm">
                    <p className="text-blue-900">{imp.change}</p>
                    <p className="text-green-700 text-xs">
                      → {imp.expectedImpact}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {result.exampleUpgrade && (
            <div className="bg-white p-3 rounded-lg border">
              <h5 className="text-sm font-medium text-gray-700 mb-2">
                Ví dụ nâng cấp:
              </h5>
              <p className="text-sm text-gray-600 whitespace-pre-wrap">
                {result.exampleUpgrade}
              </p>
            </div>
          )}

          {result.actionChecklist?.length > 0 && (
            <div className="bg-gray-50 p-3 rounded-lg">
              <h5 className="text-sm font-medium text-gray-700 mb-1">
                Checklist hành động:
              </h5>
              <ul className="text-sm text-gray-600 space-y-1">
                {result.actionChecklist.map((item: string, i: number) => (
                  <li key={i}>□ {item}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </Card>
  )
}
