'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { StepIndicator } from '@/components/StepIndicator'
import { FileUpload } from '@/components/FileUpload'
import { TemplateAnalysis } from '@/components/TemplateAnalysis'
import { InfoForm } from '@/components/InfoForm'
import { OutlineEditor } from '@/components/OutlineEditor'
import { SectionWriter } from '@/components/SectionWriter'
import { ExportButton } from '@/components/ExportButton'
import { AIConfigBadge } from '@/components/AIConfigPanel'
import { AIConfigInline } from '@/components/AIConfigInline'
import { useSKKNStore } from '@/lib/store'
import { Section, OutlineItem, WrittenSection } from '@/lib/types'
import { ArrowLeft, RefreshCw, Sparkles } from 'lucide-react'
import toast from 'react-hot-toast'

export default function SKKNPage() {
  const {
    currentStep,
    setCurrentStep,
    templateFile,
    templateText,
    templateStructure,
    formData,
    outline,
    sections,
    isLoading,
    aiConfig,
    setTemplateFile,
    setTemplateText,
    setTemplateStructure,
    updateFormData,
    setOutline,
    addSection,
    updateSection,
    setIsLoading,
    resetAll,
    useDefaultTemplate,
  } = useSKKNStore()

  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [isGeneratingOutline, setIsGeneratingOutline] = useState(false)

  // Handle file selection
  const handleFileSelect = async (file: File, text: string) => {
    setTemplateFile(file)
    setTemplateText(text)
    await analyzeTemplate(text)
  }

  // Handle default template selection
  const handleUseDefaultTemplate = async (templateName: string) => {
    useDefaultTemplate(templateName)
    toast.success(`Đã chọn: ${templateName}`)
    setCurrentStep('form')
  }

  // Analyze template structure
  const analyzeTemplate = async (text: string) => {
    setIsAnalyzing(true)
    setCurrentStep('analyze')

    try {
      const response = await fetch('/api/analyze-template', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          templateText: text,
          provider: aiConfig.provider,
          model: aiConfig.model,
          apiKey: aiConfig.apiKey,
        }),
      })

      if (!response.ok) throw new Error('Failed to analyze template')

      const data = await response.json()
      const sections: Section[] = data.sections || []
      setTemplateStructure(sections)
      toast.success('Phân tích cấu trúc thành công!')

      setTimeout(() => {
        setCurrentStep('form')
      }, 1500)
    } catch (error) {
      toast.error('Không thể phân tích mẫu. Vui lòng thử lại.')
    } finally {
      setIsAnalyzing(false)
    }
  }

  // Generate outline
  const handleGenerateOutline = async () => {
    setIsGeneratingOutline(true)
    setCurrentStep('outline')

    try {
      const response = await fetch('/api/generate-outline', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          formData,
          templateStructure,
          provider: aiConfig.provider,
          model: aiConfig.model,
          apiKey: aiConfig.apiKey,
        }),
      })

      if (!response.ok) throw new Error('Failed to generate outline')

      const data = await response.json()
      const outline: OutlineItem[] = data.outline || []
      setOutline(outline)
      toast.success('Đã tạo dàn ý chi tiết!')
    } catch (error) {
      toast.error('Không thể tạo dàn ý. Vui lòng thử lại.')
      setCurrentStep('form')
    } finally {
      setIsGeneratingOutline(false)
    }
  }

  // Start writing sections
  const handleStartWriting = () => {
    setCurrentStep('write')
  }

  // Handle section complete
  const handleSectionComplete = (section: WrittenSection) => {
    addSection(section)

    // Auto-move to export step when all sections are completed
    const completedCount =
      sections.filter((s) => s.status === 'completed').length + 1
    if (completedCount >= outline.length) {
      setTimeout(() => {
        setCurrentStep('export')
      }, 1000)
    }
  }

  // Handle section update
  const handleSectionUpdate = (id: string, content: string) => {
    updateSection(id, { content })
  }

  // Reset and start over
  const handleReset = () => {
    if (
      confirm(
        'Bạn có chắc muốn bắt đầu lại? Tất cả dữ liệu hiện tại sẽ bị xóa.'
      )
    ) {
      resetAll()
      setCurrentStep('upload')
      toast.success('Đã reset. Bắt đầu lại từ đầu!')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="w-5 h-5" />
                </Button>
              </Link>
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">SKKN Pro</h1>
                  <p className="text-xs text-gray-600">Trợ lý AI viết SKKN</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <AIConfigBadge />
              <Button variant="outline" onClick={handleReset}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Bắt đầu lại
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* AI Config - Hiển thị ở giữa màn hình */}
      <div className="container mx-auto px-4 py-6">
        <AIConfigInline />
      </div>

      {/* Step Indicator */}
      <div className="container mx-auto px-4">
        <StepIndicator currentStep={currentStep} />
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 pb-16">
        <Card className="max-w-5xl mx-auto p-8">
          {/* Step: Upload */}
          {currentStep === 'upload' && (
            <div>
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Bước 1: Chọn mẫu SKKN
                </h2>
                <p className="text-gray-600">
                  Tải lên mẫu của trường/sở hoặc chọn mẫu chuẩn Bộ GD&ĐT
                </p>
              </div>
              <FileUpload
                onFileSelect={handleFileSelect}
                onUseDefaultTemplate={handleUseDefaultTemplate}
              />
            </div>
          )}

          {/* Step: Analyze */}
          {currentStep === 'analyze' && (
            <div>
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Bước 2: Phân tích cấu trúc
                </h2>
                <p className="text-gray-600">
                  AI đang phân tích cấu trúc mẫu SKKN của bạn
                </p>
              </div>
              <TemplateAnalysis
                sections={templateStructure}
                isAnalyzing={isAnalyzing}
                onContinue={() => setCurrentStep('form')}
              />
            </div>
          )}

          {/* Step: Form */}
          {currentStep === 'form' && (
            <div>
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Bước 3: Nhập thông tin SKKN
                </h2>
                <p className="text-gray-600">
                  Điền đầy đủ thông tin về đề tài, đối tượng nghiên cứu
                </p>
              </div>
              <InfoForm
                formData={formData}
                onUpdate={updateFormData}
                onSubmit={handleGenerateOutline}
              />
            </div>
          )}

          {/* Step: Outline */}
          {currentStep === 'outline' && (
            <div>
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Bước 4: Dàn ý chi tiết
                </h2>
                <p className="text-gray-600">
                  AI đã tạo dàn ý hoàn chỉnh cho SKKN của bạn
                </p>
              </div>
              <OutlineEditor
                outline={outline}
                isGenerating={isGeneratingOutline}
                onConfirm={handleStartWriting}
              />
            </div>
          )}

          {/* Step: Write */}
          {currentStep === 'write' && (
            <div>
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Bước 5: Viết nội dung SKKN
                </h2>
                <p className="text-gray-600">
                  AI đang viết từng phần một cách chi tiết và chuyên nghiệp
                </p>
              </div>
              <SectionWriter
                sections={sections}
                outline={outline}
                formData={formData}
                onSectionComplete={handleSectionComplete}
                onSectionUpdate={handleSectionUpdate}
              />
            </div>
          )}

          {/* Step: Export */}
          {currentStep === 'export' && (
            <div>
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  🎉 Hoàn thành SKKN!
                </h2>
                <p className="text-gray-600">
                  Tuyệt vời! SKKN của bạn đã sẵn sàng. Tải về file Word ngay
                  bây giờ.
                </p>
              </div>
              <ExportButton
                sections={sections}
                formData={{
                  topicName: formData.topicName,
                  author: formData.author,
                  school: formData.school,
                }}
              />

              <div className="mt-8 text-center space-y-4">
                <Button
                  variant="outline"
                  onClick={() => setCurrentStep('write')}
                >
                  ← Quay lại chỉnh sửa
                </Button>

                <div className="p-6 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-900">
                    <strong>💡 Mẹo:</strong> Sau khi tải file Word, bạn có thể
                    chỉnh sửa, bổ sung thêm hình ảnh, bảng biểu theo nhu cầu.
                    SKKN Pro đã tạo nền tảng vững chắc để bạn hoàn thiện!
                  </p>
                </div>

                <div className="text-center">
                  <p className="text-gray-600 mb-2">
                    Thấy hữu ích? Chia sẻ với đồng nghiệp!
                  </p>
                  <div className="flex gap-2 justify-center">
                    <Button variant="outline" size="sm" onClick={handleReset}>
                      Viết SKKN mới
                    </Button>
                    <Button variant="outline" size="sm" asChild>
                      <Link href="/">Về trang chủ</Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </Card>
      </main>
    </div>
  )
}
