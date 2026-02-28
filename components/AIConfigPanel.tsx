'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Select } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { AI_MODELS } from '@/lib/types'
import { useSKKNStore } from '@/lib/store'
import { Sparkles, Check, AlertCircle, Key, ExternalLink } from 'lucide-react'
import toast from 'react-hot-toast'

interface AIConfigPanelProps {
  onClose?: () => void
}

export function AIConfigPanel({ onClose }: AIConfigPanelProps) {
  const { aiConfig, setAIConfig } = useSKKNStore()
  const [model, setModel] = useState(aiConfig.model)
  const [apiKey, setApiKey] = useState(aiConfig.apiKey || '')

  const handleSave = () => {
    setAIConfig({
      provider: 'gemini',
      model,
      apiKey: apiKey || undefined,
    })
    toast.success(`Đã chọn: Gemini ${model}`)
    onClose?.()
  }

  const availableModels = AI_MODELS['gemini']

  return (
    <Card className="p-6 space-y-6">
      <div className="space-y-2">
        <Label className="font-semibold text-gray-900">API Key Gemini *</Label>
        <Input
          type="password"
          placeholder="AIza... (Nhập Gemini API Key của bạn)"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
        />
        <div className="text-xs text-gray-500 flex items-center">
          <ExternalLink className="w-3 h-3 mr-1" />
          <a
            href="https://aistudio.google.com/app/apikey"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-600 underline"
          >
            Lấy API Key miễn phí tại Google AI Studio
          </a>
        </div>
      </div>

      {/* Model Selection */}
      <div className="space-y-2">
        <Label className="font-semibold text-gray-900">Model Gemini</Label>
        <Select
          value={model}
          onChange={(e) => setModel(e.target.value)}
          options={availableModels.map((m) => ({
            value: m.id,
            label: `${m.badge ? `[${m.badge}] ` : ''}${m.name} - ${m.description}`,
          }))}
        />
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-4">
        <Button
          onClick={handleSave}
          className="flex-1"
          disabled={!apiKey.trim()}
        >
          <Check className="w-4 h-4 mr-2" />
          Lưu cấu hình
        </Button>
        {onClose && (
          <Button variant="outline" onClick={onClose}>
            Hủy
          </Button>
        )}
      </div>
    </Card>
  )
}

// Compact version for header
export function AIConfigBadge() {
  const { aiConfig, setAIConfig } = useSKKNStore()
  const [isOpen, setIsOpen] = useState(false)

  const modelName = AI_MODELS['gemini'].find(
    (m) => m.id === aiConfig.model
  )?.name || aiConfig.model

  const hasApiKey = !!aiConfig.apiKey

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={`flex items-center space-x-2 px-3 py-1.5 rounded-full transition-colors text-sm ${hasApiKey
            ? 'bg-gradient-to-r from-blue-100 to-purple-100 hover:from-blue-200 hover:to-purple-200'
            : 'bg-red-100 hover:bg-red-200 animate-pulse'
          }`}
      >
        <Sparkles className={`w-4 h-4 ${hasApiKey ? 'text-blue-600' : 'text-red-600'}`} />
        <span className={`font-medium ${hasApiKey ? 'text-blue-900' : 'text-red-900'}`}>
          {hasApiKey ? `Gemini • ${modelName}` : 'Chưa có API Key'}
        </span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="max-w-md w-full">
            <AIConfigPanel onClose={() => setIsOpen(false)} />
          </div>
        </div>
      )}
    </>
  )
}
