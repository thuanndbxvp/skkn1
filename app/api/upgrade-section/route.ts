import { NextRequest, NextResponse } from 'next/server'
import { aiChatCompletion, AIProvider } from '@/lib/ai'

export const runtime = 'edge'

// PROMPT 7: CHIẾN LƯỢC NÂNG HẠNG (TỪ ĐẠT -> TỐT)
export async function POST(req: NextRequest) {
  try {
    const { 
      content, 
      sectionTitle,
      topicName,
      currentLevel,
      targetLevel,
      provider, 
      model 
    } = await req.json() as {
      content: string
      sectionTitle?: string
      topicName?: string
      currentLevel?: 'Đạt' | 'Khá' | 'Tốt'
      targetLevel?: 'Khá' | 'Tốt' | 'Xuất sắc'
      provider?: AIProvider
      model?: string
    }

    if (!content) {
      return NextResponse.json(
        { error: 'Content is required' },
        { status: 400 }
      )
    }

    const prompt = `Bạn là chuyên gia tư vấn Sáng kiến kinh nghiệm cấp Tỉnh/Thành phố với 20 năm kinh nghiệm giúp giáo viên đạt giải cao.

NHIỆM VỤ: Tư vấn chiến lược nâng hạng bài SKKN từ mức hiện tại lên mức cao hơn.

${topicName ? `ĐỀ TÀI: "${topicName}"` : ''}
${sectionTitle ? `PHẦN CẦN NÂNG CẤP: "${sectionTitle}"` : ''}
${currentLevel ? `MỨC ĐỘ HIỆN TẠI: ${currentLevel}` : ''}
${targetLevel ? `MỤC TIÊU: ${targetLevel}` : 'MỤC TIÊU: Nâng lên mức cao nhất có thể'}

NỘI DUNG HIỆN TẠI:
---
${content}
---

HÃY TƯ VẤN CHIẾN LƯỢC NÂNG HẠNG:

1. ĐÁNH GIÁ SƠ BỘ MỨC ĐỘ HIỆN TẠI:
- Phân tích điểm mạnh cần giữ
- Chỉ ra các yếu tố còn thiếu so với tiêu chuẩn giải cao
- Xác định khoảng cách đến mục tiêu

2. CÁC YẾU TỐ CẦN BỔ SUNG ĐỂ ĐẠT MỨC CAO HƠN:
- ✅ Tính mới/sáng tạo: Cần thể hiện rõ hơn ở điểm nào?
- ✅ Khả năng nhân rộng: Cần minh chứng gì thêm?
- ✅ Số liệu minh chứng: Cần bổ sung số liệu nào?
- ✅ Cơ sở khoa học: Cần thêm lý luận gì?
- ✅ Hiệu quả thực tiễn: Cần đo lường như thế nào?

3. GỢI Ý CÁCH CHỈNH SỬA NHANH (HIỆU QUẢ CAO, KHÔNG CẦN LÀM LẠI):
- Thay đổi 1: [Mô tả cụ thể] → Kết quả mong đợi
- Thay đổi 2: [Mô tả cụ thể] → Kết quả mong đợi
- Thay đổi 3: [Mô tả cụ thể] → Kết quả mong đợi

4. NỘI DUNG MẪU NÂNG CẤP:
Viết lại đoạn mẫu (1-2 đoạn) thể hiện cách viết đạt mức cao hơn để ngườ dùng tham khảo.

5. CHECKLIST HÀNH ĐỘNG:
- [ ] Việc cần làm 1
- [ ] Việc cần làm 2
- [ ] Việc cần làm 3

Trả về JSON:
{
  "currentAssessment": {
    "level": "Đạt|Khá|Tốt",
    "reason": "Lý do đánh giá",
    "strengthsToKeep": ["Điểm mạnh 1", "Điểm mạnh 2"]
  },
  "missingElements": [
    {
      "element": "Tên yếu tố còn thiếu",
      "importance": "Tại sao cần",
      "howToAdd": "Cách bổ sung cụ thể"
    }
  ],
  "quickImprovements": [
    {
      "change": "Thay đổi cụ thể",
      "expectedImpact": "Tác động dự kiến",
      "effort": "low|medium|high"
    }
  ],
  "exampleUpgrade": "Đoạn văn mẫu đã được nâng cấp...",
  "actionChecklist": [
    "Việc cần làm 1",
    "Việc cần làm 2"
  ],
  "estimatedNewLevel": "Khá|Tốt|Xuất sắc nếu thực hiện đầy đủ"
}

CHỈ trả về JSON hợp lệ, không có text giải thích khác.`

    const result = await aiChatCompletion(
      [
        {
          role: 'system',
          content: 'Bạn là chuyên gia tư vấn SKKN cấp cao, chuyên giúp giáo viên đạt giải. Tư vấn thực tế, khả thi, hiệu quả. Luôn trả về JSON.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      { provider, model, temperature: 0.5, maxTokens: 4000 }
    )

    let parsedResult: {
      currentAssessment: {
        level: string
        reason: string
        strengthsToKeep: string[]
      }
      missingElements: {
        element: string
        importance: string
        howToAdd: string
      }[]
      quickImprovements: {
        change: string
        expectedImpact: string
        effort: string
      }[]
      exampleUpgrade: string
      actionChecklist: string[]
      estimatedNewLevel: string
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
    console.error('Error upgrading section:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to upgrade section' },
      { status: 500 }
    )
  }
}
