// Core types for SKKN Pro application

export interface Section {
  id: string
  title: string
  description: string
  required: boolean
  order: number
}

export interface SKKNFormData {
  topicName: string
  subject: string
  level: string
  grade: string
  school: string
  author: string
  researchSubjects: string
  solutionCount: number
  targetPages: number
  specialRequirements: string
  includeRealProblems: boolean
}

export interface OutlineItem {
  id: string
  title: string
  description: string
  order: number
  parentId?: string
  children?: OutlineItem[]
}

export interface WrittenSection {
  id: string
  title: string
  content: string
  order: number
  status: 'pending' | 'writing' | 'completed' | 'error'
  wordCount?: number
}

export interface TemplateStructure {
  name: string
  sections: Section[]
}

export const DEFAULT_TEMPLATES: TemplateStructure[] = [
  {
    name: 'Mẫu Sở GD cơ bản',
    sections: [
      {
        id: '1',
        title: 'I. LÝ DO CHỌN ĐỀ TÀI',
        description: 'Trình bày lý do tác giả chọn đề tài nghiên cứu, tính cấp thiết của vấn đề',
        required: true,
        order: 1,
      },
      {
        id: '2',
        title: 'II. CƠ SỞ LÝ LUẬN VÀ THỰC TIỄN',
        description: 'Nêu cơ sở lý luận, các nghiên cứu liên quan và thực trạng vấn đề',
        required: true,
        order: 2,
      },
      {
        id: '3',
        title: 'III. THỰC TRẠNG VẤN ĐỀ TRƯỚC KHI THỰC HIỆN ĐỀ TÀI',
        description: 'Phân tích thực trạng, khó khăn vướng mắc trước khi áp dụng sáng kiến',
        required: true,
        order: 3,
      },
      {
        id: '4',
        title: 'IV. CÁC GIẢI PHÁP ĐÃ THỰC HIỆN',
        description: 'Trình bày chi tiết các giải pháp, biện pháp đã thực hiện',
        required: true,
        order: 4,
      },
      {
        id: '5',
        title: 'V. KẾT QUẢ VÀ HIỆU QUẢ ĐẠT ĐƯỢC',
        description: 'Đánh giá kết quả, số liệu cụ thể, so sánh trước và sau áp dụng',
        required: true,
        order: 5,
      },
      {
        id: '6',
        title: 'VI. BÀI HỌC KINH NGHIỆM',
        description: 'Rút ra bài học, kinh nghiệm từ quá trình thực hiện',
        required: true,
        order: 6,
      },
      {
        id: '7',
        title: 'VII. KẾT LUẬN VÀ KIẾN NGHỊ',
        description: 'Kết luận về đề tài và các kiến nghị, đề xuất nhân rộng',
        required: true,
        order: 7,
      },
      {
        id: '8',
        title: 'TÀI LIỆU THAM KHẢO',
        description: 'Danh mục tài liệu, sách, báo đã tham khảo',
        required: true,
        order: 8,
      },
    ],
  },
  {
    name: 'Mẫu THPT mở rộng',
    sections: [
      {
        id: '1',
        title: 'I. ĐẶT VẤN ĐỀ',
        description: 'Đặt vấn đề nghiên cứu, tính cấp thiết và ý nghĩa',
        required: true,
        order: 1,
      },
      {
        id: '2',
        title: 'II. CƠ SỞ LÝ LUẬN',
        description: 'Cơ sở khoa học, lý thuyết nền tảng của đề tài',
        required: true,
        order: 2,
      },
      {
        id: '3',
        title: 'III. PHẠM VI VÀ ĐỐI TƯỢNG NGHIÊN CỨU',
        description: 'Xác định rõ phạm vi, đối tượng, mẫu nghiên cứu',
        required: true,
        order: 3,
      },
      {
        id: '4',
        title: 'IV. PHƯƠNG PHÁP NGHIÊN CỨU',
        description: 'Mô tả các phương pháp nghiên cứu đã sử dụng',
        required: true,
        order: 4,
      },
      {
        id: '5',
        title: 'V. THỰC TRẠNG VẤN ĐỀ',
        description: 'Khảo sát, đánh giá thực trạng vấn đề nghiên cứu',
        required: true,
        order: 5,
      },
      {
        id: '6',
        title: 'VI. CÁC GIẢI PHÁP THỰC HIỆN',
        description: 'Trình bày chi tiết các giải pháp, quy trình thực hiện',
        required: true,
        order: 6,
      },
      {
        id: '7',
        title: 'VII. KẾT QUẢ NGHIÊN CỨU',
        description: 'Thống kê, phân tích kết quả đạt được',
        required: true,
        order: 7,
      },
      {
        id: '8',
        title: 'VIII. ĐÁNH GIÁ VÀ KINH NGHIỆM',
        description: 'Đánh giá tổng thể và rút ra bài học kinh nghiệm',
        required: true,
        order: 8,
      },
      {
        id: '9',
        title: 'IX. KẾT LUẬN VÀ KIẾN NGHỊ',
        description: 'Kết luận và các kiến nghị mở rộng',
        required: true,
        order: 9,
      },
      {
        id: '10',
        title: 'TÀI LIỆU THAM KHẢO',
        description: 'Danh mục tài liệu tham khảo',
        required: true,
        order: 10,
      },
    ],
  },
  {
    name: 'Mẫu Tiểu học',
    sections: [
      {
        id: '1',
        title: 'I. LÝ DO CHỌN ĐỀ TÀI',
        description: 'Lý do và tính cần thiết của đề tài',
        required: true,
        order: 1,
      },
      {
        id: '2',
        title: 'II. THỰC TRẠNG VẤN ĐỀ',
        description: 'Thực trạng trước khi thực hiện',
        required: true,
        order: 2,
      },
      {
        id: '3',
        title: 'III. GIẢI PHÁP THỰC HIỆN',
        description: 'Các giải pháp cụ thể đã áp dụng',
        required: true,
        order: 3,
      },
      {
        id: '4',
        title: 'IV. KẾT QUẢ ĐẠT ĐƯỢC',
        description: 'Kết quả cụ thể sau khi thực hiện',
        required: true,
        order: 4,
      },
      {
        id: '5',
        title: 'V. KINH NGHIỆM VÀ BÀI HỌC',
        description: 'Kinh nghiệm rút ra từ quá trình thực hiện',
        required: true,
        order: 5,
      },
      {
        id: '6',
        title: 'VI. KẾT LUẬN',
        description: 'Kết luận chung về đề tài',
        required: true,
        order: 6,
      },
      {
        id: '7',
        title: 'TÀI LIỆU THAM KHẢO',
        description: 'Các tài liệu đã tham khảo',
        required: true,
        order: 7,
      },
    ],
  },
]

export const SUBJECTS = [
  'Toán',
  'Ngữ văn',
  'Vật lý',
  'Hóa học',
  'Sinh học',
  'Tiếng Anh',
  'Lịch sử',
  'Địa lý',
  'GDCD',
  'Tin học',
  'Công nghệ',
  'Thể dục',
  'Âm nhạc',
  'Mỹ thuật',
  'Hoạt động trải nghiệm',
  'Khác',
]

export const LEVELS = ['Mầm non', 'Tiểu học', 'THCS', 'THPT']

export type StepType =
  | 'upload'
  | 'analyze'
  | 'form'
  | 'outline'
  | 'write'
  | 'export'

export interface StepConfig {
  id: StepType
  title: string
  description: string
  order: number
}

export const STEPS: StepConfig[] = [
  {
    id: 'upload',
    title: 'Tải lên mẫu',
    description: 'Tải mẫu SKKN hoặc chọn mẫu có sẵn',
    order: 1,
  },
  {
    id: 'analyze',
    title: 'Phân tích cấu trúc',
    description: 'AI phân tích cấu trúc mẫu',
    order: 2,
  },
  {
    id: 'form',
    title: 'Nhập thông tin',
    description: 'Điền thông tin đề tài SKKN',
    order: 3,
  },
  {
    id: 'outline',
    title: 'Lập dàn ý',
    description: 'AI tạo dàn ý chi tiết',
    order: 4,
  },
  {
    id: 'write',
    title: 'Viết nội dung',
    description: 'AI viết từng phần SKKN',
    order: 5,
  },
  {
    id: 'export',
    title: 'Xuất file',
    description: 'Hoàn thành và tải về',
    order: 6,
  },
]

// AI Provider Types
export type AIProvider = 'openai' | 'gemini'

export interface AIConfig {
  provider: AIProvider
  model: string
  apiKey?: string // For client-side usage (optional, can use server env)
}

export const AI_PROVIDERS: { id: AIProvider; name: string; description: string }[] = [
  { id: 'openai', name: 'OpenAI', description: 'GPT-4o, GPT-4o-mini' },
  { id: 'gemini', name: 'Google Gemini', description: 'Gemini 2.0 Flash, Gemini 1.5 Pro' },
]

// Available models for each provider (Updated with Gemini 2.5 series)
export const AI_MODELS: Record<AIProvider, { id: string; name: string; description: string; badge?: string }[]> = {
  openai: [
    { id: 'gpt-4o-mini', name: 'GPT-4o Mini', description: 'Nhanh, rẻ, chất lượng tốt' },
    { id: 'gpt-4o', name: 'GPT-4o', description: 'Chất lượng cao nhất' },
    { id: 'gpt-4-turbo', name: 'GPT-4 Turbo', description: 'Cân bằng chất lượng và giá' },
    { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo', description: 'Nhanh, giá rẻ' },
  ],
  gemini: [
    // Gemini 2.5 (Latest)
    { id: 'gemini-2.5-pro-preview-03-25', name: 'Gemini 2.5 Pro', description: 'Mới nhất - Chất lượng cao nhất, tư duy nâng cao', badge: 'Mới nhất' },
    { id: 'gemini-2.5-flash-preview-04-17', name: 'Gemini 2.5 Flash', description: 'Mới nhất - Cân bằng tốc độ và chất lượng', badge: 'Mới nhất' },
    // Gemini 2.0
    { id: 'gemini-2.0-flash', name: 'Gemini 2.0 Flash', description: 'Nhanh, hiệu quả, phù hợp hầu hết tác vụ', badge: 'Khuyến nghị' },
    { id: 'gemini-2.0-flash-lite', name: 'Gemini 2.0 Flash Lite', description: 'Nhẹ, rẻ nhất, phù hợp tác vụ đơn giản' },
    { id: 'gemini-2.0-pro-exp-02-05', name: 'Gemini 2.0 Pro (Exp)', description: 'Thử nghiệm - Chất lượng cao cho tác vụ phức tạp', badge: 'Thử nghiệm' },
    // Gemini 1.5
    { id: 'gemini-1.5-pro', name: 'Gemini 1.5 Pro', description: 'Chất lượng cao, phù hợp tác vụ phức tạp' },
    { id: 'gemini-1.5-flash', name: 'Gemini 1.5 Flash', description: 'Cân bằng tốc độ và chất lượng (Phiên bản cũ)' },
    { id: 'gemini-1.5-flash-8b', name: 'Gemini 1.5 Flash 8B', description: 'Nhẹ, nhanh cho tác vụ cơ bản' },
  ],
}
