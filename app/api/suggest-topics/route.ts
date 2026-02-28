import { NextRequest, NextResponse } from 'next/server'
import { aiChatCompletion, AIProvider } from '@/lib/ai'

export const runtime = 'edge'

export async function POST(req: NextRequest) {
  try {
    const { 
      subject, 
      grade, 
      level, 
      currentTopic, 
      teachingContext,
      studentDifficulties,
      interventions,
      provider, 
      model,
      apiKey
    } = await req.json() as {
      subject: string
      grade: string
      level: string
      currentTopic?: string
      teachingContext?: string
      studentDifficulties?: string
      interventions?: string
      provider?: AIProvider
      model?: string
      apiKey?: string
    }

    if (!subject || !level) {
      return NextResponse.json(
        { error: 'Subject and level are required' },
        { status: 400 }
      )
    }

    // PROMPT 1: "TÌM TÊN ĐỀ TÀI TỪ VIỆC HÀNG NGÀY" - Chuyên nghiệp
    const prompt = `Bạn là chuyên gia hướng dẫn viết Sáng kiến kinh nghiệm (SKKN) cấp cao.

THÔNG TIN CÔNG VIỆC GIẢNG DẠY THỰC TẾ:
- Môn học: ${subject}
- Cấp học: ${level}
- Khối lớp: ${grade || 'Chưa xác định'}
${teachingContext ? `- Mô tả lớp dạy: ${teachingContext}` : ''}
${studentDifficulties ? `- Khó khăn cụ thể của học sinh: ${studentDifficulties}` : ''}
${interventions ? `- Những điều đã điều chỉnh/thay đổi: ${interventions}` : ''}
${currentTopic ? `- Đề tài đang cân nhắc: ${currentTopic}` : ''}

NHIỆM VỤ CỦA BẠN:
1. Xác định vấn đề nghiên cứu cốt lõi từ thực tiễn trên
2. Đề xuất 5 tên đề tài SKKN ấn tượng, khoa học, sáng tạo

YÊU CẦU TÊN ĐỀ TÀI:
- Phải cụ thể, rõ ràng về nội dung và phương pháp
- Thể hiện tính đổi mới, sáng tạo trong giảng dạy
- Có thể đo lường kết quả hiệu quả
- Phù hợp với chương trình GDPT mới của Việt Nam
- Ngôn ngữ chuẩn mực, khoa học, không chung chung

Với mỗi đề tài, cung cấp:
- Tên đề tài đầy đủ
- Lý do chọn đề tài (2-3 câu giải thích tính cấp thiết)

Trả về JSON:
{
  "suggestions": [
    {
      "title": "Tên đề tài đầy đủ, khoa học",
      "rationale": "Lý do chọn đề tài, tính cấp thiết"
    }
  ]
}

CHỈ trả về JSON hợp lệ, không có text giải thích khác.`

    const content = await aiChatCompletion(
      [
        {
          role: 'system',
          content: 'Bạn là chuyên gia SKKN cấp cao với 20 năm kinh nghiệm. Luôn trả về JSON hợp lệ, đúng định dạng.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      { provider, model, temperature: 0.8, apiKey }
    )
    
    let suggestions: { title: string; rationale: string }[] = []
    try {
      const parsed = JSON.parse(content)
      suggestions = parsed.suggestions || []
    } catch (e) {
      const jsonMatch = content.match(/```(?:json)?\s*(\{[\s\S]*\})\s*```/)
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[1])
        suggestions = parsed.suggestions || []
      } else {
        // Fallback: try to extract array
        const arrayMatch = content.match(/\[\s*\{[\s\S]*\}\s*\]/)
        if (arrayMatch) {
          suggestions = JSON.parse(arrayMatch[0])
        } else {
          throw new Error('Failed to parse AI response')
        }
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
