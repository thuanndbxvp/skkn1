import { NextRequest, NextResponse } from 'next/server'
import { aiChatCompletion, AIProvider } from '@/lib/ai'

export const runtime = 'edge'

export async function POST(req: NextRequest) {
  try {
    const { subject, grade, level, currentTopic, provider, model } = await req.json() as {
      subject: string
      grade: string
      level: string
      currentTopic?: string
      provider?: AIProvider
      model?: string
    }

    if (!subject || !level) {
      return NextResponse.json(
        { error: 'Subject and level are required' },
        { status: 400 }
      )
    }

    const prompt = `Bạn là chuyên gia giáo dục, hãy đề xuất 5 tên đề tài Sáng kiến kinh nghiệm (SKKN) hay và thu hút.

Thông tin:
- Môn học: ${subject}
- Cấp học: ${level}
- Khối lớp: ${grade || 'Tất cả'}
${currentTopic ? `- Tên đề tài hiện tại (để tham khảo cải thiện): ${currentTopic}` : ''}

Yêu cầu đề tài:
1. Cụ thể, rõ ràng về nội dung và phương pháp
2. Thể hiện tính sáng tạo, đổi mới
3. Phù hợp với thực tiễn giảng dạy Việt Nam
4. Có tính ứng dụng cao
5. Dễ đo lường kết quả

Trả về JSON:
{
  "suggestions": [
    "Tên đề tài 1",
    "Tên đề tài 2",
    "Tên đề tài 3",
    "Tên đề tài 4",
    "Tên đề tài 5"
  ]
}

CHỈ trả về JSON, không text khác.`

    const content = await aiChatCompletion(
      [
        {
          role: 'system',
          content: 'Bạn là chuyên gia tư vấn giáo dục. Luôn trả về JSON hợp lệ.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      { provider, model }
    )
    
    let suggestions: string[] = []
    try {
      const parsed = JSON.parse(content)
      suggestions = parsed.suggestions || []
    } catch (e) {
      const jsonMatch = content.match(/```(?:json)?\s*(\{[\s\S]*\})\s*```/)
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[1])
        suggestions = parsed.suggestions || []
      } else {
        throw new Error('Failed to parse AI response')
      }
    }

    return NextResponse.json({ suggestions })
  } catch (error: any) {
    console.error('Error suggesting topics:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to suggest topics' },
      { status: 500 }
    )
  }
}
