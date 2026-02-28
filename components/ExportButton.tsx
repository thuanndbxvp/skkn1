'use client'

import { Loader2, FileDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { WrittenSection } from '@/lib/types'
import { generateWordDocument, generateFileName } from '@/lib/generateWord'
import { downloadFile, countWords } from '@/lib/utils'
import toast from 'react-hot-toast'
import { useState } from 'react'

interface ExportButtonProps {
  sections: WrittenSection[]
  formData: {
    topicName: string
    author: string
    school: string
  }
}

export function ExportButton({ sections, formData }: ExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false)

  const handleExport = async () => {
    if (sections.length === 0) {
      toast.error('Chưa có nội dung để xuất file')
      return
    }

    setIsExporting(true)
    toast.loading('Đang tạo file Word...')

    try {
      const blob = await generateWordDocument({
        title: formData.topicName,
        author: formData.author,
        school: formData.school,
        sections: sections.filter((s) => s.status === 'completed'),
      })

      const filename = generateFileName(formData.topicName)
      downloadFile(blob, filename)

      toast.dismiss()
      toast.success('Đã tải xuống file Word thành công!')
    } catch (error: any) {
      toast.dismiss()
      toast.error(error.message || 'Không thể xuất file. Vui lòng thử lại.')
    } finally {
      setIsExporting(false)
    }
  }

  const completedSections = sections.filter((s) => s.status === 'completed')
  const totalWords = completedSections.reduce(
    (sum, s) => sum + countWords(s.content),
    0
  )

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-4 text-center">
        <div className="p-4 bg-blue-50 rounded-lg">
          <p className="text-2xl font-bold text-blue-600">
            {completedSections.length}
          </p>
          <p className="text-sm text-gray-600">Phần hoàn thành</p>
        </div>
        <div className="p-4 bg-green-50 rounded-lg">
          <p className="text-2xl font-bold text-green-600">{totalWords}</p>
          <p className="text-sm text-gray-600">Tổng số từ</p>
        </div>
        <div className="p-4 bg-orange-50 rounded-lg">
          <p className="text-2xl font-bold text-orange-600">
            ~{Math.ceil(totalWords / 500)}
          </p>
          <p className="text-sm text-gray-600">Số trang ước tính</p>
        </div>
      </div>

      <Button
        onClick={handleExport}
        disabled={isExporting || completedSections.length === 0}
        className="w-full"
        size="lg"
      >
        {isExporting ? (
          <>
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            Đang tạo file...
          </>
        ) : (
          <>
            <FileDown className="w-5 h-5 mr-2" />
            📥 Tải về file Word (.docx)
          </>
        )}
      </Button>
    </div>
  )
}
