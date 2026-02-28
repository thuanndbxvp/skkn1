import { NextRequest, NextResponse } from 'next/server'
import { aiChatCompletion, AIProvider } from '@/lib/ai'
import { Section } from '@/lib/types'

export const runtime = 'edge'

export async function POST(req: NextRequest) {
  try {
    const { templateText, provider, model, apiKey } = await req.json() as { 
      templateText: string
      provider?: AIProvider
      model?: string
      apiKey?: string
    }

    if (!templateText || typeof templateText !== 'string') {
      return NextResponse.json(
        { error: 'Template text is required' },
        { status: 400 }
      )
    }

    const prompt = `Bạn là chuyên gia phân tích cấu trúc văn bản Sáng kiến kinh nghiệm (SKKN) của Việt Nam.

Phân tích văn bản mẫu SKKN sau và trích xuất cấu trúc các phần/mục chính:

${templateText}

Yêu cầu:
1. Xác định các phần chính (thường có dạng: I. TÊN PHẦN, II. TÊN PHẦN, v.v.)
2. Với mỗi phần, xác định: tiêu đề, mô tả ngắn gọn nội dung cần viết
3. Đánh số thứ tự các phần
4. Tất cả phần đều là bắt buộc (required: true)

Trả về JSON với cấu trúc:
{
  "sections": [
    {
      "id": "1",
      "title": "Tiêu đề phần (bao gồm số La Mã nếu có)",
      "description": "Mô tả ngắn gọn nội dung phần này",
      "required": true,
      "order": 1
    }
  ]
}

CHỈ trả về JSON, không có text giải thích khác.`

    const content = await aiChatCompletion(
      [
        {
          role: 'system',
          content:
            'Bạn là chuyên gia phân tích cấu trúc văn bản. Luôn trả về JSON hợp lệ.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      { provider, model, apiKey }
    )
    
    // Parse JSON from response
    let sections: Section[] = []
    try {
      const parsed = JSON.parse(content)
      sections = parsed.sections || []
    } catch (e) {
      // If JSON parsing fails, try to extract JSON from markdown code blocks
      const jsonMatch = content.match(/```(?:json)?\s*(\{[\s\S]*\})\s*```/)
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[1])
        sections = parsed.sections || []
      } else {
        throw new Error('Failed to parse AI response')
      }
    }

    return NextResponse.json({ sections })
  } catch (error: any) {
    console.error('Error analyzing template:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to analyze template' },
      { status: 500 }
    )
  }
}
