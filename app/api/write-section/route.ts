import { NextRequest } from 'next/server'
import { aiStreamCompletion, AIProvider } from '@/lib/ai'
import { OutlineItem, SKKNFormData } from '@/lib/types'

export const runtime = 'edge'

export async function POST(req: NextRequest) {
  try {
    const {
      sectionTitle,
      sectionDescription,
      outline,
      formData,
      previousSections,
      provider,
      model,
    } = (await req.json()) as {
      sectionTitle: string
      sectionDescription: string
      outline: OutlineItem[]
      formData: SKKNFormData
      previousSections?: string
      provider?: AIProvider
      model?: string
    }

    if (!sectionTitle || !outline || !formData) {
      return new Response('Missing required fields', { status: 400 })
    }

    // Find section outline
    const sectionOutline = outline.find((item) =>
      item.title.includes(sectionTitle.split('.')[0])
    )

    const outlineText = sectionOutline
      ? `${sectionOutline.title}\n${sectionOutline.children
          ?.map((child) => `  - ${child.title}: ${child.description}`)
          .join('\n')}`
      : sectionDescription

    const targetWords = Math.floor(
      (formData.targetPages * 500) / outline.length
    )

    const prompt = `Bạn là chuyên gia viết Sáng kiến kinh nghiệm (SKKN) cho giáo viên Việt Nam theo chuẩn Bộ GD&ĐT.

THÔNG TIN ĐỀ TÀI:
- Tên đề tài: ${formData.topicName}
- Môn học: ${formData.subject} | Cấp: ${formData.level} | Khối: ${formData.grade}
- Trường: ${formData.school}
- Tác giả: ${formData.author}
- Đối tượng nghiên cứu: ${formData.researchSubjects}
- Số giải pháp: ${formData.solutionCount}

PHẦN CẦN VIẾT:
${sectionTitle}

MÔ TẢ NỘI DUNG:
${sectionDescription}

DÀN Ý CHI TIẾT:
${outlineText}

${previousSections ? `\nCÁC PHẦN ĐÃ VIẾT TRƯỚC ĐÓ (để đảm bảo tính liên kết):\n${previousSections.substring(0, 1000)}...` : ''}

YÊU CẦU VIẾT:
1. Văn phong học thuật, khoa học, chuyên nghiệp
2. Bám sát dàn ý đã lập
3. Có số liệu cụ thể, ví dụ thực tế từ lớp học
4. Phân tích sâu, logic, mạch lạc
5. Độ dài: khoảng ${targetWords} từ
6. Định dạng: đoạn văn rõ ràng, có tiêu đề mục phụ nếu cần
7. Phù hợp chuẩn SKKN Bộ GD&ĐT Việt Nam
8. Thể hiện tính sáng tạo, đổi mới của tác giả
${formData.includeRealProblems ? '9. Bổ sung bài toán/ví dụ thực tế minh họa' : ''}

HÃY VIẾT NGAY NỘI DUNG, KHÔNG CẦN GIẢI THÍCH GÌ THÊM.`

    // Use unified AI streaming
    const aiStream = aiStreamCompletion(
      [
        {
          role: 'system',
          content:
            'Bạn là chuyên gia viết SKKN. Viết văn học thuật chuyên nghiệp, có số liệu cụ thể.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      { provider, model, temperature: 0.7, maxTokens: 4000 }
    )

    // Convert AI stream to Response stream
    const encoder = new TextEncoder()
    const readableStream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of aiStream) {
            if (chunk) {
              controller.enqueue(encoder.encode(chunk))
            }
          }
          controller.close()
        } catch (error) {
          controller.error(error)
        }
      },
    })

    return new Response(readableStream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Transfer-Encoding': 'chunked',
      },
    })
  } catch (error: any) {
    console.error('Error writing section:', error)
    return new Response(error.message || 'Failed to write section', {
      status: 500,
    })
  }
}
