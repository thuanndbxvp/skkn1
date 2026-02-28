'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Select } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { AI_MODELS } from '@/lib/types'
import { useSKKNStore } from '@/lib/store'
import { Sparkles, Check, AlertCircle, Key, ExternalLink, ChevronDown, ChevronUp } from 'lucide-react'
import toast from 'react-hot-toast'

export function AIConfigInline() {
  const { aiConfig, setAIConfig } = useSKKNStore()
  const [model, setModel] = useState(aiConfig.model)
  const [apiKey, setApiKey] = useState(aiConfig.apiKey || '')
  const [isExpanded, setIsExpanded] = useState(false)

  // Auto-expand if no API key
  useEffect(() => {
    if (!aiConfig.apiKey) {
      setIsExpanded(true)
    }
  }, [aiConfig.apiKey])

  const handleSave = () => {
    setAIConfig({
      provider: 'gemini',
      model,
      apiKey: apiKey || undefined,
    })
    toast.success('Đã lưu cấu hình Gemini!')
    setIsExpanded(false)
  }

  const availableModels = AI_MODELS['gemini']
  const hasApiKey = !!aiConfig.apiKey

  // Nếu đã có API key và đang thu gọn, hiển thị dạng compact
  if (hasApiKey && !isExpanded) {
    return (
      <Card className="p-4 mb-6 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Gemini AI Đã Sẵn Sàng</h3>
              <p className="text-sm text-gray-600">
                Model: {availableModels.find(m => m.id === aiConfig.model)?.name || aiConfig.model}
              </p>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={() => setIsExpanded(true)}>
            Thay đổi cấu hình
          </Button>
        </div>
      </Card>
    )
  }

  return (
    <Card className="p-6 mb-6 border-2 border-amber-300 bg-gradient-to-b from-amber-50/50 to-white">
      {/* Header */}
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
          <Sparkles className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900">🔑 Cấu hình Gemini AI</h3>
          <p className="text-sm text-gray-600">
            Nhập API Key để bắt đầu viết SKKN với AI
          </p>
        </div>
      </div>

      {/* API Key Input - Nổi bật */}
      <div className="space-y-4 p-5 bg-amber-100/50 rounded-xl border-2 border-amber-300 mb-6">
        <div className="flex items-center space-x-2">
          <Key className="w-5 h-5 text-amber-700" />
          <Label className="font-bold text-amber-900 text-base">API Key Gemini * (Bắt buộc)</Label>
        </div>
        
        <Input
          type="password"
          placeholder="AIzaSy... (Dán API Key của bạn vào đây)"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          className="bg-white border-amber-400 text-lg py-3"
        />
        
        <div className="flex flex-wrap gap-2 text-sm">
          <a 
            href="https://aistudio.google.com/app/apikey" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <ExternalLink className="w-4 h-4 mr-1" />
            Lấy API Key miễn phí
          </a>
          <span className="text-amber-800 text-xs flex items-center">
            <AlertCircle className="w-3 h-3 mr-1" />
            API key được lưu trong trình duyệt của bạn
          </span>
        </div>
      </div>

      {/* Model Selection */}
      <div className="space-y-3 mb-6">
        <Label className="font-semibold text-gray-700">Chọn Model AI</Label>
        <Select
          value={model}
          onChange={(e) => setModel(e.target.value)}
          options={availableModels.map((m) => ({
            value: m.id,
            label: `${m.badge ? `[${m.badge}] ` : ''}${m.name}`,
          }))}
        />
        <p className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
          💡 <strong>Gợi ý:</strong> {availableModels.find(m => m.id === model)?.description}
        </p>
      </div>

      {/* Benefits */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="p-3 bg-green-50 rounded-lg border border-green-200">
          <p className="text-sm font-medium text-green-800">✓ Miễn phí 1,500 request/ngày</p>
        </div>
        <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm font-medium text-blue-800">✓ Không cần thẻ tín dụng</p>
        </div>
        <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
          <p className="text-sm font-medium text-purple-800">✓ Tiếng Việt chuẩn</p>
        </div>
        <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
          <p className="text-sm font-medium text-orange-800">✓ Nhanh hơn OpenAI</p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <Button 
          onClick={handleSave} 
          className="flex-1 py-3 text-lg"
          disabled={!apiKey.trim()}
        >
          <Check className="w-5 h-5 mr-2" />
          {hasApiKey ? 'Cập nhật cấu hình' : 'Lưu và bắt đầu'}
        </Button>
        {hasApiKey && (
          <Button variant="outline" onClick={() => setIsExpanded(false)}>
            Đóng
          </Button>
        )}
      </div>

      {!apiKey.trim() && (
        <p className="text-center text-amber-600 text-sm mt-3">
          ⚠️ Vui lòng nhập API Key để sử dụng tính năng AI
        </p>
      )}
    </Card>
  )
}
