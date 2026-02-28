# 🏗️ Giải thích Kiến trúc Code SKKN Pro

## 📁 Tổng quan thư mục

```
skkn-pro/
├── app/                    # Next.js App Router
│   ├── api/               # API Routes (backend)
│   │   ├── analyze-template/    # Phân tích cấu trúc mẫu
│   │   ├── suggest-topics/      # Gợi ý tên đề tài
│   │   ├── generate-outline/    # Tạo dàn ý
│   │   └── write-section/       # Viết nội dung (streaming)
│   ├── skkn/              # Trang chính (6-step wizard)
│   ├── page.tsx           # Landing page
│   └── layout.tsx         # Root layout
├── components/            # React Components
│   ├── ui/               # shadcn/ui components
│   ├── FileUpload.tsx    # Upload file mẫu
│   ├── InfoForm.tsx      # Form nhập thông tin
│   ├── OutlineEditor.tsx # Editor dàn ý
│   ├── SectionWriter.tsx # Viết từng phần
│   └── ...
└── lib/                  # Utilities
    ├── types.ts          # TypeScript types
    ├── store.ts          # Zustand state management
    ├── openai.ts         # OpenAI client
    ├── parseFile.ts      # Parse Word/PDF
    └── generateWord.ts   # Generate .docx
```

---

## 🔄 Flow xử lý chính

### 1️⃣ Upload & Phân tích mẫu

**File:** `components/FileUpload.tsx` → `app/api/analyze-template/route.ts`

```typescript
// User upload file .docx
FileUpload → parseFile() → extract text → API /analyze-template

// AI phân tích
OpenAI analyzes template structure → returns Section[]

// Lưu vào store
useSKKNStore.setTemplateStructure(sections)
```

### 2️⃣ Nhập thông tin

**File:** `components/InfoForm.tsx`

```typescript
// Form data structure
interface SKKNFormData {
  topicName: string        // Tên đề tài
  subject: string          // Môn học
  level: string           // Cấp học
  grade: string           // Khối lớp
  school: string          // Trường
  author: string          // Tác giả
  researchSubjects: string // Đối tượng nghiên cứu
  solutionCount: number   // Số giải pháp
  targetPages: number     // Số trang dự kiến
}
```

### 3️⃣ Tạo dàn ý

**File:** `app/api/generate-outline/route.ts`

```typescript
// Input: formData + templateStructure
// Output: OutlineItem[]

AI prompt bao gồm:
- Thông tin đề tài
- Cấu trúc mẫu SKKN
→ Tạo dàn ý chi tiết với các mục con
```

### 4️⃣ Viết nội dung (Streaming)

**File:** `app/api/write-section/route.ts` + `components/SectionWriter.tsx`

```typescript
// Streaming flow:
SectionWriter → fetch /write-section → OpenAI stream

// Response: ReadableStream
// Hiển thị real-time từng chữ AI viết

for await (const chunk of stream) {
  display(chunk.content)  // Hiển thị ngay lập tức
}
```

### 5️⃣ Xuất Word

**File:** `lib/generateWord.ts` + `components/ExportButton.tsx`

```typescript
// Sử dụng thư viện 'docx'
Document → Paragraph[] → Packer.toBlob() → Download .docx

// Format chuẩn:
- Font: Times New Roman
- Size: 13pt (nội dung), 14pt (heading)
- Line spacing: 1.5
- Margin: 2.5cm (trái 3cm)
```

---

## 🧠 State Management (Zustand)

**File:** `lib/store.ts`

```typescript
interface SKKNState {
  // Current step in wizard
  currentStep: 'upload' | 'analyze' | 'form' | 'outline' | 'write' | 'export'
  
  // Template data
  templateStructure: Section[]    // Cấu trúc phân tích từ AI
  
  // Form data
  formData: SKKNFormData         // Thông tin đề tài
  
  // Outline
  outline: OutlineItem[]         // Dàn ý chi tiết
  
  // Written content
  sections: WrittenSection[]     // Nội dung đã viết
}

// Persist middleware: Lưu vào localStorage
```

---

## 🤖 AI Integration

**File:** `lib/openai.ts`

### Non-streaming APIs
```typescript
// analyze-template, suggest-topics, generate-outline
const response = await chatCompletion(messages, {
  temperature: 0.7,
  maxTokens: 4000,
  stream: false
})
```

### Streaming API
```typescript
// write-section
const stream = await streamCompletion(messages)
// Returns AsyncIterable<ChatCompletionChunk>
```

### Prompt Engineering Pattern

Mỗi API đều có:
1. **System prompt:** Định nghĩa vai trò ("Bạn là chuyên gia viết SKKN")
2. **User prompt:** Context cụ thể + yêu cầu
3. **Output format:** JSON hoặc plain text

---

## 📄 File Processing

**File:** `lib/parseFile.ts`

### Word (.docx)
```typescript
import mammoth from 'mammoth'
const result = await mammoth.extractRawText({ arrayBuffer })
```

### PDF
```typescript
// Placeholder - cần server-side processing
// Hoặc dùng pdf-parse
```

---

## 🎨 UI Components

Sử dụng **shadcn/ui** + Tailwind CSS:

| Component | Usage |
|-----------|-------|
| `Button` | Các nút hành động |
| `Card` | Container content |
| `Input` | Form inputs |
| `Textarea` | Multi-line text |
| `Select` | Dropdown chọn |
| `Progress` | Progress bar |

---

## 🔒 Security Considerations

1. **API Key:** Chỉ lưu ở server (env variables), không expose client-side
2. **File upload:** Validate type & size (max 10MB)
3. **Rate limiting:** Nên thêm cho production
4. **Input sanitization:** Validate form data trước khi gửi AI

---

## 🚀 Performance Tips

1. **Streaming:** Viết section dùng streaming để UX tốt hơn
2. **Edge Runtime:** API routes dùng `export const runtime = 'edge'`
3. **Lazy loading:** Components load khi cần
4. **State persistence:** Zustand persist để không mất data khi refresh

---

## 📝 Cách thêm tính năng mới

### Thêm API route mới
1. Tạo folder: `app/api/new-feature/route.ts`
2. Export `POST` handler
3. Add `export const runtime = 'edge'`

### Thêm component mới
1. Tạo file: `components/NewComponent.tsx`
2. Import vào page cần dùng
3. Update store nếu cần state mới

### Thêm field vào form
1. Update `SKKNFormData` trong `lib/types.ts`
2. Update `initialFormData` trong `lib/store.ts`
3. Update `InfoForm.tsx` UI
4. Update API prompts nếu cần

---

## 🔗 Luồng dữ liệu tổng quan

```
User → Upload File → Parse Text → AI Analyze → Sections[]
                                          ↓
User → Fill Form ─────────────────────────→ FormData
                                          ↓
                              AI Generate Outline → Outline[]
                                          ↓
                              AI Write Sections (streaming) → WrittenSections[]
                                          ↓
                              Generate Word → Download .docx
```

---

## 📚 Tài liệu tham khảo

- [Next.js Docs](https://nextjs.org/docs)
- [OpenAI API](https://platform.openai.com/docs)
- [Zustand](https://github.com/pmndrs/zustand)
- [shadcn/ui](https://ui.shadcn.com)
- [docx library](https://docx.js.org)
