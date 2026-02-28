import { NextRequest, NextResponse } from 'next/server'
import { aiChatCompletion, AIProvider } from '@/lib/ai'

export const runtime = 'edge'

// PROMPT 5: CHUẨN HÓA NGÔN NGỮ (CHỮA LỖI VĂN PHONG)
export async function POST(req: NextRequest) {
  try {
    const { 
      content, 
      sectionTitle,
      provider, 
      model 
    } = await req.json() as {
      content: string
      sectionTitle?: string
      provider?: AIProvider
      model?: string
    }

    if (!content) {
      return NextResponse.json(
        { error: 'Content is required' },
        { status: 400 }
      )
    }

    const prompt = `Bạn là chuyên gia biên tập và chuẩn hóa ngôn ngữ Sáng kiến kinh nghiệm (SKKN) cấp cao với 20 năm kinh nghiệm.

NHIỆM VỤ: Chuẩn hóa văn bản SKKN sau sang ngôn ngữ khoa học - hành chính - giáo dục.

${sectionTitle ? `PHẦN VĂN BẢN: "${sectionTitle}"` : ''}

NỘI DUNG GỐC CẦN CHUẨN HÓA:
---
${content}
---

YÊU CẦU XỬ LÝ:

1. PHÁT HIỆN VÀ SỬA CÁC LỖI SAU:
- ❌ Câu mang tính kể chuyện, cảm tính
- ❌ Xưng hô cá nhân ("tôi", "em", "chúng tôi", "chúng em") → Chuyển sang văn phong khách quan
- ❌ Câu cú lủng củng, không rõ ràng
- ❌ Từ ngữ đợi thường, không chuyên môn
- ❌ Giọng điệu phô trương, kể lể

2. VIẾT LẠI TOÀN BỘ VỚI VĂN PHONG:
- ✅ Ngôn ngữ khoa học - hành chính - giáo dục
- ✅ Khách quan, mang tính chuyên môn cao
- ✅ Câu văn chặt chẽ, logic
- ✅ Sang trọng, đúng chuẩn hội đồng chấm thi
- ✅ Không dùng đại từ nhân xưng cá nhân

3. NGUYÊN TẮC VÀNG:
- Giữ nguyên ý nghĩa chuyên môn
- Không làm mất nội dung thực tiễn
- Chuyển từ "tôi làm" thành "biện pháp được thực hiện"
- Chuyển từ "tôi thấy" thành "kết quả cho thấy"

Trả về JSON:
{
  "originalIssues": [
    "Mô tả lỗi 1 được phát hiện",
    "Mô tả lỗi 2 được phát hiện"
  ],
  "rewrittenContent": "Nội dung đã được viết lại chuẩn hóa...",
  "improvements": [
    "Cải thiện 1",
    "Cải thiện 2"
  ]
}

CHỈ trả về JSON hợp lệ, không có text giải thích khác.`

    const result = await aiChatCompletion(
      [
        {
          role: 'system',
          content: 'Bạn là chuyên gia biên tập SKKN cấp cao. Chuyên phát hiện và sửa lỗi văn phong, chuẩn hóa ngôn ngữ. Luôn trả về JSON.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      { provider, model, temperature: 0.4, maxTokens: 4000 }
    )

    let parsedResult: {
      originalIssues: string[]
      rewrittenContent: string
      improvements: string[]
    }

    try {
      parsedResult = JSON.parse(result)
    } catch (e) {
      const jsonMatch = result.match(/```(?:json)?\s*(\{[\s\S]*\})\s*```/)
      if (jsonMatch) {
        parsedResult = JSON.parse(jsonMatch[1])
      } else {
        // Try to extract JSON directly
        const jsonStart = result.indexOf('{')
        const jsonEnd = result.lastIndexOf('}')
        if (jsonStart >= 0 && jsonEnd > jsonStart) {
          parsedResult = JSON.parse(result.slice(jsonStart, jsonEnd + 1))
        } else {
          throw new Error('Failed to parse AI response')
        }
      }
    }

    return NextResponse.json(parsedResult)
  } catch (error: any) {
    console.error('Error rewriting section:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to rewrite section' },
      { status: 500 }
    )
  }
}
