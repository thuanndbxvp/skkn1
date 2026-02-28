'use client'

import { useState, useEffect } from 'react'
import { WrittenSection, OutlineItem, SKKNFormData } from '@/lib/types'
import { useSKKNStore } from '@/lib/store'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Progress } from '@/components/ui/progress'
import {
  Loader2,
  Check,
  Edit,
  RefreshCw,
  ChevronRight,
  AlertCircle,
} from 'lucide-react'
import { cn, countWords } from '@/lib/utils'
import { SectionEnhancer } from './SectionEnhancer'
import toast from 'react-hot-toast'

interface SectionWriterProps {
  sections: WrittenSection[]
  outline: OutlineItem[]
  formData: SKKNFormData
  onSectionComplete: (section: WrittenSection) => void
  onSectionUpdate: (id: string, content: string) => void
}

export function SectionWriter({
  sections,
  outline,
  formData,
  onSectionComplete,
  onSectionUpdate,
}: SectionWriterProps) {
  const { aiConfig } = useSKKNStore()
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0)
  const [isWriting, setIsWriting] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [isAutoWriting, setIsAutoWriting] = useState(false)

  const totalSections = outline.length
  const completedCount = sections.filter(
    (s) => s.status === 'completed'
  ).length
  const progress = (completedCount / totalSections) * 100

  const currentOutlineItem = outline[currentSectionIndex]
  const currentSection = sections.find(
    (s) => s.title === currentOutlineItem?.title
  )

  const writeSection = async (sectionIndex: number, rewrite: boolean = false) => {
    const outlineItem = outline[sectionIndex]
    if (!outlineItem) return

    setIsWriting(true)
    setCurrentSectionIndex(sectionIndex)

    try {
      // Get previous sections for context
      const previousSections = sections
        .filter((s) => s.order < outlineItem.order && s.status === 'completed')
        .map((s) => `${s.title}\n${s.content}`)
        .join('\n\n')

      const response = await fetch('/api/write-section', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sectionTitle: outlineItem.title,
          sectionDescription: outlineItem.description,
          outline,
          formData,
          previousSections: previousSections || undefined,
          provider: aiConfig.provider,
          model: aiConfig.model,
          apiKey: aiConfig.apiKey,
        }),
      })

      if (!response.ok) throw new Error('Failed to write section')

      // Stream the response
      const reader = response.body?.getReader()
      const decoder = new TextDecoder()
      let accumulatedContent = ''

      if (reader) {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          const chunk = decoder.decode(value, { stream: true })
          accumulatedContent += chunk

          // Update section content in real-time
          const newSection: WrittenSection = {
            id: outlineItem.id,
            title: outlineItem.title,
            content: accumulatedContent,
            order: outlineItem.order,
            status: 'writing',
            wordCount: countWords(accumulatedContent),
          }
          onSectionComplete(newSection)
        }

        // Mark as completed
        const finalSection: WrittenSection = {
          id: outlineItem.id,
          title: outlineItem.title,
          content: accumulatedContent,
          order: outlineItem.order,
          status: 'completed',
          wordCount: countWords(accumulatedContent),
        }
        onSectionComplete(finalSection)
        toast.success(`Đã hoàn thành: ${outlineItem.title}`)
      }
    } catch (error: any) {
      toast.error(error.message || 'Không thể viết phần này')
      setIsAutoWriting(false)
      const errorSection: WrittenSection = {
        id: outlineItem.id,
        title: outlineItem.title,
        content: currentSection?.content || '',
        order: outlineItem.order,
        status: 'error',
      }
      onSectionComplete(errorSection)
    } finally {
      setIsWriting(false)
    }
  }

  const handleNext = () => {
    if (currentSectionIndex < totalSections - 1) {
      setCurrentSectionIndex(currentSectionIndex + 1)
    }
  }

  const handleEdit = (id: string) => {
    setEditingId(id)
  }

  const handleSaveEdit = (id: string, content: string) => {
    onSectionUpdate(id, content)
    setEditingId(null)
    toast.success('Đã lưu chỉnh sửa')
  }

  // Auto-write first section or continue auto-writing next section
  useEffect(() => {
    if (sections.length === 0 && outline.length > 0 && !isWriting && !isAutoWriting) {
      writeSection(0)
    }
  }, [outline])

  // Effect to handle Auto-write flow
  useEffect(() => {
    if (isAutoWriting && !isWriting) {
      const nextIndex = currentSectionIndex + 1
      if (nextIndex < totalSections) {
        if (sections.find((s) => s.order === outline[nextIndex].order && s.status === 'completed')) {
          // Skip if already completed (guard)
          setCurrentSectionIndex(nextIndex)
        } else {
          // Add a small delay for UX before writing next part
          setTimeout(() => {
            writeSection(nextIndex)
          }, 1000)
        }
      } else {
        setIsAutoWriting(false)
      }
    }
  }, [isWriting, isAutoWriting, currentSectionIndex, totalSections])

  return (
    <div className="space-y-6">
      {/* Progress */}
      <div className="sticky top-0 bg-white z-10 pb-4 border-b">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold">
            Đang viết: {currentOutlineItem?.title || 'Đang tải...'}
          </h3>
          <span className="text-sm text-gray-600">
            {completedCount}/{totalSections} phần
          </span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Current Section Being Written */}
      {isWriting && currentSection && (
        <Card className="p-6 border-blue-500 bg-blue-50">
          <div className="flex items-start space-x-3 mb-4">
            <Loader2 className="w-6 h-6 text-blue-600 animate-spin flex-shrink-0 mt-1" />
            <div>
              <h4 className="font-semibold text-blue-900 mb-1">
                {currentSection.title}
              </h4>
              <p className="text-sm text-blue-700">
                AI đang viết... ({currentSection.wordCount || 0} từ)
              </p>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg max-h-96 overflow-y-auto">
            <p className="text-sm text-gray-800 whitespace-pre-wrap">
              {currentSection.content}
            </p>
          </div>
        </Card>
      )}

      {/* Completed Sections */}
      <div className="space-y-4">
        {sections
          .filter((s) => s.status === 'completed')
          .sort((a, b) => a.order - b.order)
          .map((section) => (
            <Card key={section.id} className="p-6 border-green-200 bg-green-50">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start space-x-3">
                  <Check className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">
                      {section.title}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {section.wordCount} từ • Hoàn thành ✓
                    </p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(section.id)}
                >
                  <Edit className="w-4 h-4 mr-1" />
                  Sửa
                </Button>
              </div>

              {editingId === section.id ? (
                <div className="space-y-3">
                  <Textarea
                    value={section.content}
                    onChange={(e) =>
                      onSectionUpdate(section.id, e.target.value)
                    }
                    rows={15}
                    className="bg-white"
                  />
                  <div className="flex gap-2">
                    <Button
                      onClick={() =>
                        handleSaveEdit(section.id, section.content)
                      }
                      size="sm"
                    >
                      Lưu
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setEditingId(null)}
                      size="sm"
                    >
                      Hủy
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="bg-white p-4 rounded-lg max-h-64 overflow-y-auto">
                    <p className="text-sm text-gray-800 whitespace-pre-wrap">
                      {section.content}
                    </p>
                  </div>
                  {/* Section Enhancer */}
                  <SectionEnhancer
                    sectionId={section.id}
                    sectionTitle={section.title}
                    content={section.content}
                    topicName={formData.topicName}
                    onContentUpdate={(newContent) =>
                      onSectionUpdate(section.id, newContent)
                    }
                  />
                </>
              )}
            </Card>
          ))}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 mt-6">
        {currentSectionIndex < totalSections - 1 && !isWriting && (
          <Button
            onClick={() => writeSection(currentSectionIndex + 1)}
            className="flex-1"
            size="lg"
            variant="outline"
          >
            <ChevronRight className="w-5 h-5 mr-2" />
            Viết phần tiếp theo
          </Button>
        )}

        {currentSectionIndex < totalSections - 1 && (
          <Button
            onClick={() => setIsAutoWriting(!isAutoWriting)}
            className={cn("flex-1", isAutoWriting ? "bg-amber-600 hover:bg-amber-700" : "")}
            size="lg"
          >
            {isAutoWriting ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Dừng tự động viết
              </>
            ) : (
              <>
                <RefreshCw className="w-5 h-5 mr-2" />
                Tự động viết tất cả
              </>
            )}
          </Button>
        )}

        {currentSection?.status === 'completed' && !isWriting && !isAutoWriting && (
          <Button
            onClick={() => writeSection(currentSectionIndex, true)}
            variant="outline"
            size="lg"
          >
            <RefreshCw className="w-5 h-5 mr-2" />
            Viết lại phần này
          </Button>
        )}
      </div>

      {/* Info */}
      {!isWriting && completedCount === 0 && (
        <div className="flex items-start space-x-2 p-4 bg-amber-50 rounded-lg border border-amber-200">
          <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-amber-900">
            <p className="font-medium">Bắt đầu viết SKKN</p>
            <p className="mt-1">
              AI sẽ viết từng phần một cách tuần tự. Bạn có thể chỉnh sửa nội
              dung sau khi mỗi phần được hoàn thành.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
