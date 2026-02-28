'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Select } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { AI_PROVIDERS, AI_MODELS, AIProvider } from '@/lib/types'
import { useSKKNStore } from '@/lib/store'
import { Sparkles, Check, AlertCircle } from 'lucide-react'
import toast from 'react-hot-toast'

interface AIConfigPanelProps {
  onClose?: () => void
}

export function AIConfigPanel({ onClose }: AIConfigPanelProps) {
  const { aiConfig, setAIConfig } = useSKKNStore()
  const [provider, setProvider] = useState<AIProvider>(aiConfig.provider)
  const [model, setModel] = useState(aiConfig.model)
  const [apiKey, setApiKey] = useState(aiConfig.apiKey || '')
  const [showKeyInput, setShowKeyInput] = useState(false)

  const handleSave = () => {
    setAIConfig({
      provider,
      model,
      apiKey: apiKey || undefined,
    })
    toast.success(`Đã chọn ${provider === 'openai' ? 'OpenAI' : 'Gemini'} - ${model}`)
    onClose?.()
  }

  const currentProvider = AI_PROVIDERS.find((p) => p.id === provider)
  const availableModels = AI_MODELS[provider]

  return (
    <Card className="p-6 space-y-6">
      <div className="flex items-center space-x-3 mb-4">
        <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-semibold">Cấu hình AI</h3>
          <p className="text-sm text-gray-600">
            Chọn nhà cung cấp AI và model phù hợp
          </p>
        </div>
      </div>

      {/* Provider Selection */}
      <div className="space-y-2">
        <Label>Nhà cung cấp AI</Label>
        <div className="grid grid-cols-2 gap-3">
          {AI_PROVIDERS.map((p) => (
            <button
              key={p.id}
              onClick={() => {
                setProvider(p.id)
                setModel(AI_MODELS[p.id][0].id)
              }}
              className={`p-4 rounded-lg border-2 text-left transition-all ${
                provider === p.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-blue-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-medium">{p.name}</span>
                {provider === p.id && (
                  <Check className="w-4 h-4 text-blue-600" />
                )}
              </div>
              <p className="text-xs text-gray-600 mt-1">{p.description}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Model Selection */}
      <div className="space-y-2">
        <Label>Model AI</Label>
        <Select
          value={model}
          onChange={(e) => setModel(e.target.value)}
          options={availableModels.map((m) => ({
            value: m.id,
            label: `${m.name} - ${m.description}`,
          }))}
        />
      </div>

      {/* API Key Input (Optional) */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label>API Key (Tùy chọn)</Label>
          <button
            onClick={() => setShowKeyInput(!showKeyInput)}
            className="text-sm text-blue-600 hover:underline"
          >
            {showKeyInput ? 'Ẩn' : 'Nhập key riêng'}
          </button>
        </div>
        
        {showKeyInput && (
          <div className="space-y-3">
            <Input
              type="password"
              placeholder={
                provider === 'openai'
                  ? 'sk-... (OpenAI API Key)'
                  : 'AIza... (Gemini API Key)'
              }
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
            />
            <p className="text-xs text-gray-600">
              Nếu để trống, hệ thống sẽ sử dụng API key mặc định từ server.
            </p>
          </div>
        )}
      </div>

      {/* Info Note */}
      <div className="flex items-start space-x-2 p-4 bg-amber-50 rounded-lg border border-amber-200">
        <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
        <div className="text-sm text-amber-900">
          <p className="font-medium">Lưu ý về API Key:</p>
          <ul className="mt-1 space-y-1 list-disc list-inside">
            <li>
              <strong>OpenAI:</strong> Lấy key tại{' '}
              <a
                href="https://platform.openai.com/api-keys"
                target="_blank"
                rel="noopener noreferrer"
                className="underline"
              >
                platform.openai.com
              </a>
            </li>
            <li>
              <strong>Gemini:</strong> Lấy key tại{' '}
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noopener noreferrer"
                className="underline"
              >
                aistudio.google.com
              </a>
            </li>
            <li>API key sẽ được lưu trong trình duyệt của bạn.</li>
          </ul>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-4">
        <Button onClick={handleSave} className="flex-1">
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

  const providerName = AI_PROVIDERS.find((p) => p.id === aiConfig.provider)?.name
  const modelName = AI_MODELS[aiConfig.provider].find(
    (m) => m.id === aiConfig.model
  )?.name

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center space-x-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-purple-100 to-blue-100 hover:from-purple-200 hover:to-blue-200 transition-colors text-sm"
      >
        <Sparkles className="w-4 h-4 text-purple-600" />
        <span className="font-medium text-purple-900">
          {providerName} • {modelName}
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
