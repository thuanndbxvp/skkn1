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
      <div className="flex items-center space-x-3 mb-4">
        <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-semibold">Cấu hình Gemini AI</h3>
          <p className="text-sm text-gray-600">
            SKKN Pro sử dụng Google Gemini để viết sáng kiến kinh nghiệm
          </p>
        </div>
      </div>

      {/* API Key Input - Prominent */}
      <div className="space-y-3 p-4 bg-amber-50 rounded-lg border border-amber-200">
        <div className="flex items-center space-x-2">
          <Key className="w-5 h-5 text-amber-600" />
          <Label className="font-semibold text-amber-900">API Key Gemini *</Label>
        </div>
        
        <Input
          type="password"
          placeholder="AIza... (Nhập Gemini API Key của bạn)"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          className="bg-white border-amber-300"
        />
        
        <div className="text-sm text-amber-800 space-y-1">
          <p className="flex items-center">
            <ExternalLink className="w-3 h-3 mr-1" />
            <a 
              href="https://aistudio.google.com/app/apikey" 
              target="_blank" 
              rel="noopener noreferrer"
              className="underline hover:text-amber-900"
            >
              Lấy API Key miễn phí tại aistudio.google.com
            </a>
          </p>
          <p className="text-xs">
            • API key sẽ được lưu trong trình duyệt của bạn
          </p>
          <p className="text-xs">
            • Gemini có miễn phí tier hào phóng cho ngườ dùng mới
          </p>
        </div>
      </div>

      {/* Model Selection */}
      <div className="space-y-2">
        <Label>Model Gemini</Label>
        <Select
          value={model}
          onChange={(e) => setModel(e.target.value)}
          options={availableModels.map((m) => ({
            value: m.id,
            label: `${m.badge ? `[${m.badge}] ` : ''}${m.name} - ${m.description}`,
          }))}
        />
        <p className="text-xs text-gray-500">
          💡 <strong>Gợi ý:</strong> Gemini 3.1 Pro Preview cho chất lượng cao nhất • Gemini 2.0 Flash cho cân bằng tốt
        </p>
      </div>

      {/* Info Note */}
      <div className="flex items-start space-x-2 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
        <div className="text-sm text-blue-900">
          <p className="font-medium">Về Google Gemini:</p>
          <ul className="mt-1 space-y-1 list-disc list-inside text-xs">
            <li>Miễn phí tier: 1,500 request/ngày</li>
            <li>Chất lượng tiếng Việt rất tốt</li>
            <li>Không cần thẻ tín dụng để đăng ký</li>
            <li>Nhanh hơn và rẻ hơn OpenAI</li>
          </ul>
        </div>
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
        className={`flex items-center space-x-2 px-3 py-1.5 rounded-full transition-colors text-sm ${
          hasApiKey 
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
