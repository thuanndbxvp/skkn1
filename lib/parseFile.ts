// File parsing utilities for Word (.docx) and PDF files
import mammoth from 'mammoth'

export async function parseWordFile(file: File): Promise<string> {
  try {
    const arrayBuffer = await file.arrayBuffer()
    const result = await mammoth.extractRawText({ arrayBuffer })
    return result.value
  } catch (error) {
    console.error('Error parsing Word file:', error)
    throw new Error('Không thể đọc file Word. Vui lòng kiểm tra lại file.')
  }
}

export async function parsePDFFile(file: File): Promise<string> {
  try {
    // For PDF parsing, we'll use a simple approach
    // In production, you might want to use pdf-parse or pdfjs-dist
    // For now, we'll return a placeholder
    return 'PDF parsing requires server-side processing. Please use Word files or select a default template.'
  } catch (error) {
    console.error('Error parsing PDF file:', error)
    throw new Error('Không thể đọc file PDF. Vui lòng sử dụng file Word hoặc chọn mẫu có sẵn.')
  }
}

export async function parseFile(file: File): Promise<string> {
  const fileType = file.type
  const fileName = file.name.toLowerCase()

  if (
    fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
    fileName.endsWith('.docx')
  ) {
    return parseWordFile(file)
  } else if (fileType === 'application/pdf' || fileName.endsWith('.pdf')) {
    return parsePDFFile(file)
  } else if (fileType === 'application/msword' || fileName.endsWith('.doc')) {
    throw new Error('File .doc cũ không được hỗ trợ. Vui lòng chuyển sang .docx')
  } else {
    throw new Error('Định dạng file không được hỗ trợ. Vui lòng sử dụng file .docx hoặc .pdf')
  }
}

export function validateFileSize(file: File, maxSizeMB: number = 10): boolean {
  const maxSizeBytes = maxSizeMB * 1024 * 1024
  return file.size <= maxSizeBytes
}

export function validateFileType(file: File): boolean {
  const validTypes = [
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/pdf',
    'application/msword',
  ]
  const validExtensions = ['.docx', '.pdf', '.doc']
  
  return (
    validTypes.includes(file.type) ||
    validExtensions.some(ext => file.name.toLowerCase().endsWith(ext))
  )
}
