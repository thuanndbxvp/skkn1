'use client'

import { useState, useRef } from 'react'
import { Upload, File, X, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { cn, formatFileSize } from '@/lib/utils'
import { parseFile, validateFileSize, validateFileType } from '@/lib/parseFile'
import { useSKKNStore } from '@/lib/store'
import toast from 'react-hot-toast'

interface FileUploadProps {
  onFileSelect: (file: File, text: string) => void
  onUseDefaultTemplate: (templateName: string) => void
}

export function FileUpload({
  onFileSelect,
  onUseDefaultTemplate,
}: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { aiConfig } = useSKKNStore()

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragging(true)
    } else if (e.type === 'dragleave') {
      setIsDragging(false)
    }
  }

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      await processFile(files[0])
    }
  }

  const handleFileInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      await processFile(files[0])
    }
  }

  const processFile = async (file: File) => {
    // Validate file type
    if (!validateFileType(file)) {
      toast.error('Định dạng file không được hỗ trợ. Vui lòng chọn file .docx hoặc .pdf')
      return
    }

    // Validate file size (max 10MB)
    if (!validateFileSize(file, 10)) {
      toast.error('File quá lớn. Vui lòng chọn file nhỏ hơn 10MB')
      return
    }

    setSelectedFile(file)
    setIsProcessing(true)

    try {
      const text = await parseFile(file)
      if (!text || text.trim().length < 100) {
        throw new Error('File không chứa đủ nội dung để phân tích')
      }
      toast.success('Đọc file thành công!')
      onFileSelect(file, text)
    } catch (error: any) {
      toast.error(error.message || 'Không thể đọc file')
      setSelectedFile(null)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleRemoveFile = () => {
    setSelectedFile(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <Card
        className={cn(
          'border-2 border-dashed transition-all cursor-pointer hover:border-blue-400',
          {
            'border-blue-500 bg-blue-50': isDragging,
            'border-gray-300': !isDragging,
          }
        )}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <div className="p-12 text-center">
          <Upload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold mb-2">
            Tải lên mẫu SKKN của trường/sở
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Kéo thả file vào đây hoặc click để chọn file
          </p>
          <p className="text-xs text-gray-500">
            Hỗ trợ file .docx, .pdf (tối đa 10MB)
          </p>
        </div>
      </Card>

      <input
        ref={fileInputRef}
        type="file"
        accept=".docx,.pdf,.doc"
        onChange={handleFileInput}
        className="hidden"
      />

      {/* Selected File */}
      {selectedFile && (
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <File className="w-8 h-8 text-blue-600" />
              <div>
                <p className="font-medium">{selectedFile.name}</p>
                <p className="text-sm text-gray-500">
                  {formatFileSize(selectedFile.size)}
                </p>
              </div>
            </div>
            {!isProcessing && (
              <Button
                variant="ghost"
                size="icon"
                onClick={handleRemoveFile}
                type="button"
              >
                <X className="w-5 h-5" />
              </Button>
            )}
          </div>
          {isProcessing && (
            <div className="mt-3">
              <div className="flex items-center space-x-2 text-sm text-blue-600">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-600 border-t-transparent" />
                <span>Đang phân tích file...</span>
              </div>
            </div>
          )}
        </Card>
      )}

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-4 bg-white text-gray-500">
            Hoặc chọn mẫu có sẵn
          </span>
        </div>
      </div>

      {/* Default Templates */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {['Mẫu Sở GD cơ bản', 'Mẫu THPT mở rộng', 'Mẫu Tiểu học'].map(
          (templateName) => (
            <Card
              key={templateName}
              className="p-4 hover:shadow-md transition-shadow cursor-pointer border-2 hover:border-blue-500"
              onClick={() => onUseDefaultTemplate(templateName)}
            >
              <div className="text-center">
                <File className="w-10 h-10 mx-auto text-blue-600 mb-2" />
                <h4 className="font-medium text-sm">{templateName}</h4>
                <p className="text-xs text-gray-500 mt-1">
                  Mẫu chuẩn Bộ GD&ĐT
                </p>
              </div>
            </Card>
          )
        )}
      </div>

      {/* Info Note */}
      <div className="flex items-start space-x-2 p-4 bg-blue-50 rounded-lg">
        <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
        <div className="text-sm text-blue-900">
          <p className="font-medium">Lưu ý:</p>
          <p className="mt-1">
            AI sẽ phân tích cấu trúc mẫu SKKN của bạn và viết đúng theo format
            đó. Nếu không có mẫu riêng, hãy chọn một trong các mẫu chuẩn bên
            dưới.
          </p>
        </div>
      </div>
    </div>
  )
}
