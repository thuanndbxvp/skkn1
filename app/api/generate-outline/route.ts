import { NextRequest, NextResponse } from 'next/server'
import { aiChatCompletion, AIProvider } from '@/lib/ai'
import { OutlineItem, Section, SKKNFormData } from '@/lib/types'

export const runtime = 'edge'

export async function POST(req: NextRequest) {
  try {
    const { formData, templateStructure, provider, model, apiKey } = (await req.json()) as {
      formData: SKKNFormData
      templateStructure: Section[]
      provider?: AIProvider
      model?: string
      apiKey?: string
    }

    if (!formData || !templateStructure) {
      return NextResponse.json(
        { error: 'Form data and template structure are required' },
        { status: 400 }
      )
    }

    const sectionsInfo = templateStructure
      .map((s) => `${s.title}: ${s.description}`)
      .join('\n')

    const prompt = `Bạn là chuyên gia viết Sáng kiến kinh nghiệm (SKKN) cho giáo viên Việt Nam.

Hãy lập dàn ý chi tiết cho SKKN với thông tin sau:

THÔNG TIN ĐỀ TÀI:
- Tên đề tài: ${formData.topicName}
- Môn học: ${formData.subject}
- Cấp học: ${formData.level}
- Khối lớp: ${formData.grade}
- Trường: ${formData.school}
- Tác giả: ${formData.author}
- Đối tượng nghiên cứu: ${formData.researchSubjects}
- Số lượng giải pháp: ${formData.solutionCount}
- Số trang dự kiến: ${formData.targetPages}
${formData.specialRequirements ? `- Yêu cầu đặc biệt: ${formData.specialRequirements}` : ''}
${formData.includeRealProblems ? '- Cần bổ sung bài toán/ví dụ thực tế' : ''}

CẤU TRÚC MẪU SKKN:
${sectionsInfo}

YÊU CẦU:
1. Tạo dàn ý chi tiết cho TỪNG phần trong cấu trúc mẫu
2. Mỗi phần có các mục con cụ thể (2-5 mục con)
3. Mỗi mục có mô tả ngắn về nội dung cần viết
4. Đảm bảo logic, mạch lạc, khoa học
5. Phù hợp với thực tiễn giảng dạy Việt Nam

Trả về JSON:
{
  "outline": [
    {
      "id": "1",
      "title": "I. LÝ DO CHỌN ĐỀ TÀI",
      "description": "Mô tả ngắn",
      "order": 1,
      "children": [
        {
          "id": "1.1",
          "title": "1.1. Tính cấp thiết của đề tài",
          "description": "Nội dung cần viết: ...",
          "order": 1,
          "parentId": "1"
        }
      ]
    }
  ]
}

CHỈ trả về JSON hợp lệ, không có text khác.`

    const content = await aiChatCompletion(
      [
        {
          role: 'system',
          content:
            'Bạn là chuyên gia viết SKKN. Luôn trả về JSON hợp lệ với dàn ý chi tiết.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      {
        provider,
        model,
        apiKey,
        temperature: 0.7,
        maxTokens: 4000,
      }
    )
    
    let outline: OutlineItem[] = []
    try {
      const parsed = JSON.parse(content)
      outline = parsed.outline || []
    } catch (e) {
      const jsonMatch = content.match(/```(?:json)?\s*(\{[\s\S]*\})\s*```/)
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[1])
        outline = parsed.outline || []
      } else {
        throw new Error('Failed to parse AI response')
      }
    }

    return NextResponse.json({ outline })
  } catch (error: any) {
    console.error('Error generating outline:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to generate outline' },
      { status: 500 }
    )
  }
}
