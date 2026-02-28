'use client'

import { useState } from 'react'
import { Loader2, Lightbulb, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select } from '@/components/ui/select'
import { Card } from '@/components/ui/card'
import { SKKNFormData, SUBJECTS, LEVELS } from '@/lib/types'
import toast from 'react-hot-toast'

interface InfoFormProps {
  formData: SKKNFormData
  onUpdate: (data: Partial<SKKNFormData>) => void
  onSubmit: () => void
}

export function InfoForm({ formData, onUpdate, onSubmit }: InfoFormProps) {
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false)

  const handleSuggestTopics = async () => {
    if (!formData.subject || !formData.level) {
      toast.error('Vui lòng chọn môn học và cấp học trước')
      return
    }

    setIsLoadingSuggestions(true)
    try {
      const res = await fetch('/api/suggest-topics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject: formData.subject,
          level: formData.level,
          grade: formData.grade,
          currentTopic: formData.topicName,
        }),
      })

      if (!res.ok) throw new Error('Failed to get suggestions')

      const data = await res.json()
      setSuggestions(data.suggestions || [])
      setShowSuggestions(true)
      toast.success('Đã tạo gợi ý tên đề tài!')
    } catch (error) {
      toast.error('Không thể tạo gợi ý. Vui lòng thử lại.')
    } finally {
      setIsLoadingSuggestions(false)
    }
  }

  const handleSelectSuggestion = (suggestion: string) => {
    onUpdate({ topicName: suggestion })
    setShowSuggestions(false)
  }

  const canSubmit =
    formData.topicName &&
    formData.subject &&
    formData.level &&
    formData.grade &&
    formData.school &&
    formData.author &&
    formData.researchSubjects

  return (
    <div className="space-y-6">
      {/* Topic Name */}
      <div className="space-y-2">
        <Label htmlFor="topicName">
          Tên đề tài SKKN <span className="text-red-500">*</span>
        </Label>
        <div className="flex gap-2">
          <Input
            id="topicName"
            placeholder="VD: Sử dụng phần mềm GeoGebra trong dạy học hình học không gian lớp 11"
            value={formData.topicName}
            onChange={(e) => onUpdate({ topicName: e.target.value })}
            className="flex-1"
          />
          <Button
            type="button"
            variant="outline"
            onClick={handleSuggestTopics}
            disabled={isLoadingSuggestions}
          >
            {isLoadingSuggestions ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Lightbulb className="w-4 h-4" />
            )}
            <span className="ml-2 hidden sm:inline">Gợi ý</span>
          </Button>
        </div>
      </div>

      {/* Suggestions Modal */}
      {showSuggestions && (
        <Card className="p-4 border-blue-500 bg-blue-50">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-semibold text-blue-900">
              Gợi ý tên đề tài hay:
            </h4>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowSuggestions(false)}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          <div className="space-y-2">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                className="w-full text-left p-3 bg-white hover:bg-blue-100 rounded-lg transition-colors text-sm border border-blue-200"
                onClick={() => handleSelectSuggestion(suggestion)}
              >
                {suggestion}
              </button>
            ))}
          </div>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Subject */}
        <div className="space-y-2">
          <Label htmlFor="subject">
            Môn học <span className="text-red-500">*</span>
          </Label>
          <Select
            id="subject"
            value={formData.subject}
            onChange={(e) => onUpdate({ subject: e.target.value })}
            options={SUBJECTS.map((s) => ({ value: s, label: s }))}
          />
        </div>

        {/* Level */}
        <div className="space-y-2">
          <Label htmlFor="level">
            Cấp học <span className="text-red-500">*</span>
          </Label>
          <Select
            id="level"
            value={formData.level}
            onChange={(e) => onUpdate({ level: e.target.value })}
            options={LEVELS.map((l) => ({ value: l, label: l }))}
          />
        </div>

        {/* Grade */}
        <div className="space-y-2">
          <Label htmlFor="grade">
            Khối/Lớp <span className="text-red-500">*</span>
          </Label>
          <Input
            id="grade"
            placeholder="VD: 11, 10-11, 6-7-8"
            value={formData.grade}
            onChange={(e) => onUpdate({ grade: e.target.value })}
          />
        </div>

        {/* School */}
        <div className="space-y-2">
          <Label htmlFor="school">
            Trường/Đơn vị <span className="text-red-500">*</span>
          </Label>
          <Input
            id="school"
            placeholder="VD: THPT Nguyễn Du"
            value={formData.school}
            onChange={(e) => onUpdate({ school: e.target.value })}
          />
        </div>
      </div>

      {/* Author */}
      <div className="space-y-2">
        <Label htmlFor="author">
          Tên tác giả <span className="text-red-500">*</span>
        </Label>
        <Input
          id="author"
          placeholder="VD: Nguyễn Văn A"
          value={formData.author}
          onChange={(e) => onUpdate({ author: e.target.value })}
        />
      </div>

      {/* Research Subjects */}
      <div className="space-y-2">
        <Label htmlFor="researchSubjects">
          Đối tượng nghiên cứu <span className="text-red-500">*</span>
        </Label>
        <Textarea
          id="researchSubjects"
          placeholder="VD: 42 học sinh lớp 11A1 (nhóm thực nghiệm) và 40 học sinh lớp 11A2 (nhóm đối chứng)"
          value={formData.researchSubjects}
          onChange={(e) => onUpdate({ researchSubjects: e.target.value })}
          rows={3}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Solution Count */}
        <div className="space-y-2">
          <Label htmlFor="solutionCount">Số lượng giải pháp</Label>
          <Input
            id="solutionCount"
            type="number"
            min={1}
            max={10}
            value={formData.solutionCount}
            onChange={(e) =>
              onUpdate({ solutionCount: parseInt(e.target.value) || 3 })
            }
          />
        </div>

        {/* Target Pages */}
        <div className="space-y-2">
          <Label htmlFor="targetPages">Số trang dự kiến</Label>
          <Input
            id="targetPages"
            type="number"
            min={5}
            max={50}
            value={formData.targetPages}
            onChange={(e) =>
              onUpdate({ targetPages: parseInt(e.target.value) || 15 })
            }
          />
        </div>
      </div>

      {/* Special Requirements */}
      <div className="space-y-2">
        <Label htmlFor="specialRequirements">
          Yêu cầu đặc biệt (tùy chọn)
        </Label>
        <Textarea
          id="specialRequirements"
          placeholder="VD: Tập trung vào phương pháp dạy học tích cực, có bài toán thực tế..."
          value={formData.specialRequirements}
          onChange={(e) =>
            onUpdate({ specialRequirements: e.target.value })
          }
          rows={3}
        />
      </div>

      {/* Include Real Problems */}
      <div className="flex items-center space-x-2">
        <input
          id="includeRealProblems"
          type="checkbox"
          checked={formData.includeRealProblems}
          onChange={(e) =>
            onUpdate({ includeRealProblems: e.target.checked })
          }
          className="w-4 h-4 text-blue-600 rounded"
        />
        <Label htmlFor="includeRealProblems" className="cursor-pointer">
          Thêm bài toán/ví dụ thực tế minh họa
        </Label>
      </div>

      {/* Submit Button */}
      <div className="pt-4">
        <Button
          onClick={onSubmit}
          disabled={!canSubmit}
          className="w-full"
          size="lg"
        >
          Lập dàn ý ngay →
        </Button>
      </div>
    </div>
  )
}
