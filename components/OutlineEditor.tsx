'use client'

import { useState } from 'react'
import { OutlineItem } from '@/lib/types'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ChevronDown, ChevronRight, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface OutlineEditorProps {
  outline: OutlineItem[]
  isGenerating: boolean
  onConfirm: () => void
}

export function OutlineEditor({
  outline,
  isGenerating,
  onConfirm,
}: OutlineEditorProps) {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(
    new Set(outline.map((item) => item.id))
  )

  const toggleExpand = (id: string) => {
    setExpandedItems((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  if (isGenerating) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          AI đang lập dàn ý chi tiết...
        </h3>
        <p className="text-sm text-gray-600">
          Đang phân tích thông tin và tạo cấu trúc SKKN
        </p>
      </div>
    )
  }

  if (outline.length === 0) {
    return null
  }

  return (
    <div className="space-y-6">
      <div className="text-center pb-4">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Dàn ý chi tiết SKKN
        </h3>
        <p className="text-sm text-gray-600">
          Xem xét dàn ý và chỉnh sửa nếu cần trước khi bắt đầu viết
        </p>
      </div>

      <div className="space-y-2">
        {outline.map((item) => (
          <OutlineItemView
            key={item.id}
            item={item}
            isExpanded={expandedItems.has(item.id)}
            onToggle={() => toggleExpand(item.id)}
          />
        ))}
      </div>

      <div className="pt-4">
        <Button onClick={onConfirm} className="w-full" size="lg">
          Chốt dàn ý và viết SKKN →
        </Button>
      </div>
    </div>
  )
}

function OutlineItemView({
  item,
  isExpanded,
  onToggle,
  level = 0,
}: {
  item: OutlineItem
  isExpanded: boolean
  onToggle: () => void
  level?: number
}) {
  const hasChildren = item.children && item.children.length > 0

  return (
    <div>
      <Card
        className={cn('p-4 cursor-pointer hover:shadow-md transition-all', {
          'bg-blue-50 border-blue-300': level === 0,
          'ml-6': level > 0,
        })}
        onClick={onToggle}
      >
        <div className="flex items-start space-x-2">
          {hasChildren && (
            <div className="flex-shrink-0 mt-0.5">
              {isExpanded ? (
                <ChevronDown className="w-5 h-5 text-gray-600" />
              ) : (
                <ChevronRight className="w-5 h-5 text-gray-600" />
              )}
            </div>
          )}
          <div className="flex-1">
            <h4
              className={cn('font-semibold mb-1', {
                'text-base text-blue-900': level === 0,
                'text-sm text-gray-900': level > 0,
              })}
            >
              {item.title}
            </h4>
            <p className="text-sm text-gray-600">{item.description}</p>
          </div>
        </div>
      </Card>

      {isExpanded && hasChildren && (
        <div className="mt-2 space-y-2">
          {item.children!.map((child) => (
            <OutlineItemView
              key={child.id}
              item={child}
              isExpanded={false}
              onToggle={() => {}}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  )
}
