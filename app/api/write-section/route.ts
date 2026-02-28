import { NextRequest } from 'next/server'
import { aiStreamCompletion, AIProvider } from '@/lib/ai'
import { OutlineItem, SKKNFormData } from '@/lib/types'

// Helper to detect section type from title
function detectSectionType(title: string): 'theoretical' | 'solution' | 'conclusion' | 'general' {
  const normalizedTitle = title.toLowerCase()
  
  // Cơ sở lý luận / Cơ sở khoa học
  if (normalizedTitle.includes('cơ sở lý luận') || 
      normalizedTitle.includes('cơ sở khoa học') ||
      normalizedTitle.includes('lý luận') ||
      normalizedTitle.includes('cơ sở')) {
    return 'theoretical'
  }
  
  // Giải pháp / Biện pháp / Thực hiện
  if (normalizedTitle.includes('giải pháp') || 
      normalizedTitle.includes('biện pháp') ||
      normalizedTitle.includes('thực hiện') ||
      normalizedTitle.includes('thực trạng')) {
    return 'solution'
  }
  
  // Kết luận / Kiến nghị
  if (normalizedTitle.includes('kết luận') || 
      normalizedTitle.includes('kiến nghị') ||
      normalizedTitle.includes('đề xuất')) {
    return 'conclusion'
  }
  
  return 'general'
}

// PROMPT 2: CƠ SỞ LÝ LUẬN CHUYÊN NGHIỆP
function buildTheoreticalPrompt(
  formData: SKKNFormData,
  sectionTitle: string,
  outlineText: string,
  targetWords: number,
  previousSections?: string
): string {
  return `Bạn là chuyên gia xây dựng cơ sở lý luận cho SKKN cấp cao.

ĐỀ TÀI: "${formData.topicName}"
Cấp học: ${formData.level} | Môn học: ${formData.subject}

NHIỆM VỤ - Viết phần "${sectionTitle}" ngắn gọn, súc tích, mang tính học thuật:

1. CÁC KHÁI NIỆM TRỌNG TÂM NHẤT:
- Định nghĩa chính xác các khái niệm cốt lõi liên quan đến đề tài
- Phân tích mối quan hệ giữa các khái niệm

2. QUAN ĐIỂM GIÁO DỤC HIỆN HÀNH:
- Căn cứ vào Chương trình GDPT mới của Việt Nam
- Các văn bản pháp quy liên quan (Thông tư, Quyết định của Bộ GD&ĐT)

3. NGUYÊN TẮC SƯ PHẠM TRỰC TIẾP CHI PHỐI:
- Các lý thuyết sư phạm hiện đại áp dụng
- Cơ sở khoa học cho phương pháp đề xuất

YÊU CẦU:
- Viết gọn, súc tích, không lan man
- Mang tính học thuật, khoa học
- Phù hợp với Chương trình GDPT 2018
- Độ dài: khoảng ${targetWords} từ
- Tuyệt đối không chép dài dòng, sáo rỗng

DÀN Ý THAM KHẢO:
${outlineText}

${previousSections ? `\nCÁC PHẦN ĐÃ VIẾT TRƯỚC:\n${previousSections.substring(0, 500)}...` : ''}

HÃY VIẾT NỘI DUNG NGAY, KHÔNG CẦN GIẢI THÍCH.`
}

// PROMPT 3: CHUYỂN KINH NGHIỆM THÀNH BIỆN PHÁP KHOA HỌC
function buildSolutionPrompt(
  formData: SKKNFormData,
  sectionTitle: string,
  outlineText: string,
  targetWords: number,
  previousSections?: string
): string {
  return `Bạn là chuyên gia chuẩn hóa biện pháp trong SKKN cấp cao.

ĐỀ TÀI: "${formData.topicName}"
Cấp học: ${formData.level} | Môn học: ${formData.subject} | Khối: ${formData.grade}
Đối tượng: ${formData.researchSubjects}

NHIỆM VỤ - Viết phần "${sectionTitle}" với yêu cầu cao nhất:

CHUYỂN ĐỔI KINH NGHIỆM THỰC TẾ THÀNH CÁC BIỆN PHÁP KHOA HỌC:

Cấu trúc MỖI biện pháp phải bao gồm:
1. TÊN BIỆN PHÁP - Ngắn gọn, khoa học, thể hiện tính sáng tạo
2. MỤC TIÊU - Xác định rõ kết quả cần đạt được
3. CÁCH THỰC HIỆN - Các bước cụ thể, khả thi
4. ĐIỂM MỚI/SÁNG TẠO - Khác biệt so với cách làm truyền thống

YÊU CẦU TUYỆT ĐỐI:
- Sử dụng NGÔN NGỮ SKKN chuyên nghiệp, khách quan
- KHÔNG DÙNG văn phong kể chuyện cá nhân ("tôi làm", "tôi thấy")
- Phải có số liệu minh chứng cụ thể từ lớp học
- Logic chặt chẽ, các biện pháp có liên kết với nhau
- Độ dài: khoảng ${targetWords} từ
${formData.includeRealProblems ? '- Bắt buộc có ví dụ thực tế, bài tập minh họa' : ''}

DÀN Ý CHI TIẾT:
${outlineText}

${previousSections ? `\nCÁC PHẦN ĐÃ VIẾT TRƯỚC (để đảm bảo liên kết):\n${previousSections.substring(0, 800)}...` : ''}

HÃY VIẾT NỘI DUNG NGAY, KHÔNG CẦN GIẢI THÍCH.`
}

// PROMPT 4: KẾT LUẬN & KIẾN NGHỊ CHUẨN MỰC
function buildConclusionPrompt(
  formData: SKKNFormData,
  sectionTitle: string,
  outlineText: string,
  targetWords: number,
  previousSections?: string
): string {
  return `Bạn là chuyên gia hoàn thiện văn bản giáo dục cấp cao.

ĐỀ TÀI: "${formData.topicName}"
Cấp học: ${formData.level} | Môn học: ${formData.subject}

NHIỆM VỤ - Viết phần "${sectionTitle}" với văn phong hành chính - giáo dục:

NỘI DUNG BẮT BUỘC:

1. PHẦN KẾT LUẬN:
- Khẳng định lại HIỆU QUẢ cốt lõi của sáng kiến (bằng số liệu cụ thể)
- Tóm tắt GIÁ TRỊ THỰC TIỄN quan trọng nhất
- Nêu rõ TÍNH KHẢ THI và khả năng NHÂN RỘNG
- KHÔNG đưa cảm xúc cá nhân, kể lể

2. PHẦN KIẾN NGHỊ (nếu có):
- Đề xuất cụ thể với Tổ chuyên môn
- Đề xuất với Nhà trường
- Đề xuất với Phòng GD&ĐT (nếu phù hợp)
- Mỗi kiến nghị phải khả thi, có lộ trình thực hiện

YÊU CẦU VĂN PHONG:
- Ngắn gọn, súc tích, không dài dòng
- Trang trọng, mang tính hành chính - giáo dục
- Khách quan, dựa trên kết quả đạt được
- Độ dài: khoảng ${targetWords} từ

DÀN Ý THAM KHẢO:
${outlineText}

${previousSections ? `\nCÁC PHẦN ĐÃ VIẾT TRƯỚC:\n${previousSections.substring(0, 600)}...` : ''}

HÃY VIẾT NỘI DUNG NGAY, KHÔNG CẦN GIẢI THÍCH.`
}

// Prompt mặc định cho các phần khác
function buildGeneralPrompt(
  formData: SKKNFormData,
  sectionTitle: string,
  sectionDescription: string,
  outlineText: string,
  targetWords: number,
  previousSections?: string
): string {
  return `Bạn là chuyên gia viết Sáng kiến kinh nghiệm (SKKN) cho giáo viên Việt Nam theo chuẩn Bộ GD&ĐT.

THÔNG TIN ĐỀ TÀI:
- Tên đề tài: ${formData.topicName}
- Môn học: ${formData.subject} | Cấp: ${formData.level} | Khối: ${formData.grade}
- Trường: ${formData.school}
- Tác giả: ${formData.author}
- Đối tượng nghiên cứu: ${formData.researchSubjects}
- Số giải pháp: ${formData.solutionCount}

PHẦN CẦN VIẾT: ${sectionTitle}

MÔ TẢ NỘI DUNG: ${sectionDescription}

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
}

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
      apiKey,
    } = (await req.json()) as {
      sectionTitle: string
      sectionDescription: string
      outline: OutlineItem[]
      formData: SKKNFormData
      previousSections?: string
      provider?: AIProvider
      model?: string
      apiKey?: string
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

    // Detect section type and use appropriate professional prompt
    const sectionType = detectSectionType(sectionTitle)
    
    let prompt: string
    let systemPrompt: string
    let temperature = 0.7

    switch (sectionType) {
      case 'theoretical':
        prompt = buildTheoreticalPrompt(formData, sectionTitle, outlineText, targetWords, previousSections)
        systemPrompt = 'Bạn là chuyên gia xây dựng cơ sở lý luận SKKN với 20 năm kinh nghiệm. Viết súc tích, học thuật, không lan man.'
        temperature = 0.6
        break
      
      case 'solution':
        prompt = buildSolutionPrompt(formData, sectionTitle, outlineText, targetWords, previousSections)
        systemPrompt = 'Bạn là chuyên gia chuẩn hóa biện pháp SKKN. Viết khoa học, khách quan, KHÔNG dùng văn phong kể chuyện cá nhân.'
        temperature = 0.65
        break
      
      case 'conclusion':
        prompt = buildConclusionPrompt(formData, sectionTitle, outlineText, targetWords, previousSections)
        systemPrompt = 'Bạn là chuyên gia hoàn thiện văn bản giáo dục. Viết ngắn gọn, trang trọng, không cảm xúc cá nhân.'
        temperature = 0.55
        break
      
      default:
        prompt = buildGeneralPrompt(formData, sectionTitle, sectionDescription, outlineText, targetWords, previousSections)
        systemPrompt = 'Bạn là chuyên gia viết SKKN. Viết văn học thuật chuyên nghiệp, có số liệu cụ thể.'
        temperature = 0.7
    }

    // Use unified AI streaming with section-specific settings
    const aiStream = aiStreamCompletion(
      [
        {
          role: 'system',
          content: systemPrompt,
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      { provider, model, apiKey, temperature, maxTokens: 4000 }
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
