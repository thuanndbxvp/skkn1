import { NextRequest, NextResponse } from 'next/server'
import { aiChatCompletion, AIProvider } from '@/lib/ai'

export const runtime = 'edge'

// PROMPT 6: RÀ SOÁT LỖI (RED TEAMING)
export async function POST(req: NextRequest) {
  try {
    const { 
      content, 
      sectionTitle,
      topicName,
      provider, 
      model 
    } = await req.json() as {
      content: string
      sectionTitle?: string
      topicName?: string
      provider?: AIProvider
      model?: string
    }

    if (!content) {
      return NextResponse.json(
        { error: 'Content is required' },
        { status: 400 }
      )
    }

    const prompt = `Bạn là thành viên khó tính trong hội đồng chấm SKKN cấp cao với 20 năm kinh nghiệm đánh giá.

NHIỆM VỤ: Đọc kỹ nội dung SKKN và thực hiện "Red Teaming" - chỉ ra mọi điểm yếu, lỗi sai.

${topicName ? `ĐỀ TÀI: "${topicName}"` : ''}
${sectionTitle ? `PHẦN ĐÁNH GIÁ: "${sectionTitle}"` : ''}

NỘI DUNG CẦN RÀ SOÁT:
---
${content}
---

HÃY VẠCH TRẦN VÀ CHỈ RA:

1. ĐIỂM MẠNH (Nếu có - hãy thừa nhận):
- Những điểm tốt cần phát huy
- Điểm sáng trong nội dung

2. LỖI LOGIC VÀ CẤU TRÚC:
- ❌ Các lỗi logic trong lập luận
- ❌ Thiếu sót trong cấu trúc trình bày
- ❌ Các khẳng định không có căn cứ
- ❌ Mâu thuẫn với các phần khác (nếu biết)

3. LỖI NỘI DUNG CHUYÊN MÔN:
- ❌ Thiếu minh chứng, số liệu cụ thể
- ❌ Các giải pháp không khả thi
- ❌ Thiếu cơ sở khoa học/lý luận
- ❌ Không rõ ràng về đối tượng, phạm vi

4. LỖI VĂN PHONG VÀ TRÌNH BÀY:
- ❌ Văn phong kể chuyện, cảm xúc
- ❌ Xưng hô cá nhân không phù hợp
- ❌ Câu cú dài dòng, rườm rà
- ❌ Từ ngữ không chuẩn mực

5. ĐIỂM YẾU THƯỜNG BỊ TRỪ ĐIỂM:
- ❌ Thiếu tính mới/sáng tạo
- ❌ Không có khả năng nhân rộng
- ❌ Kết quả không đo lường được
- ❌ Chưa chứng minh được hiệu quả

6. GỢI Ý CHỈNH SỬA CỤ THỂ:
- ✅ Cách khắc phục từng lỗi
- ✅ Nội dung cần bổ sung
- ✅ Cách viết lại để đạt điểm cao hơn

Trả về JSON:
{
  "strengths": [
    "Điểm mạnh 1",
    "Điểm mạnh 2"
  ],
  "criticalIssues": [
    {
      "type": "logic|content|style|impact",
      "issue": "Mô tả lỗi cụ thể",
      "severity": "high|medium|low",
      "suggestion": "Cách khắc phục cụ thể"
    }
  ],
  "commonMistakes": [
    "Lỗi thường gặp 1",
    "Lỗi thường gặp 2"
  ],
  "improvementPlan": [
    "Bước 1: Làm gì để cải thiện",
    "Bước 2: Làm gì tiếp theo"
  ],
  "predictedScore": "Đánh giá mức độ hiện tại: Đạt/Khá/Tốt/Xuất sắc và lý do"
}

CHỈ trả về JSON hợp lệ, không có text giải thích khác. Hãy thẳng thắn, khắt khe như một giám khảo thực thụ.`

    const result = await aiChatCompletion(
      [
        {
          role: 'system',
          content: 'Bạn là giám khảo khó tính trong hội đồng chấm SKKN. Nhiệm vụ là tìm ra mọi lỗi sai, điểm yếu. Thẳng thắn, khắt khe, không nể nang. Luôn trả về JSON.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      { provider, model, temperature: 0.3, maxTokens: 4000 }
    )

    let parsedResult: {
      strengths: string[]
      criticalIssues: {
        type: string
        issue: string
        severity: string
        suggestion: string
      }[]
      commonMistakes: string[]
      improvementPlan: string[]
      predictedScore: string
    }

    try {
      parsedResult = JSON.parse(result)
    } catch (e) {
      const jsonMatch = result.match(/```(?:json)?\s*(\{[\s\S]*\})\s*```/)
      if (jsonMatch) {
        parsedResult = JSON.parse(jsonMatch[1])
      } else {
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
    console.error('Error reviewing section:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to review section' },
      { status: 500 }
    )
  }
}
