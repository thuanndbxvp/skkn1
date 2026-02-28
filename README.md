# 🎓 SKKN Pro - Trợ lý AI viết Sáng Kiến Kinh Nghiệm

**SKKN Pro** là ứng dụng web thông minh sử dụng AI để giúp giáo viên Việt Nam viết Sáng kiến kinh nghiệm (SKKN) nhanh gấp 10 lần, tiết kiệm đến 90% thời gian so với cách truyền thống.

## ✨ Tính năng nổi bật

- 📂 **Tải lên mẫu tùy chỉnh**: Upload mẫu SKKN của trường/sở, AI tự động phân tích cấu trúc
- 🤖 **AI viết tự động**: Tạo nội dung SKKN chuyên nghiệp theo đúng chuẩn Bộ GD&ĐT
- 🎯 **Bám sát format**: Viết đúng theo từng phần, mục yêu cầu
- 💡 **Gợi ý thông minh**: AI đề xuất tên đề tài hay, thu hút
- 📊 **Dàn ý chi tiết**: Tự động tạo outline logic, mạch lạc
- ⚡ **Viết real-time**: Streaming content, xem nội dung được viết theo thời gian thực
- ✏️ **Chỉnh sửa dễ dàng**: Edit trực tiếp, viết lại từng phần khi cần
- 📥 **Xuất file Word**: Download file .docx đúng format A4, Times New Roman, sẵn sàng nộp
- 💾 **Lưu trữ tự động**: Session storage giữ dữ liệu khi reload trang
- 📱 **Responsive**: Hoạt động tốt trên mọi thiết bị

## 🚀 Demo & Video hướng dẫn

- 📹 **Video hướng dẫn**: [https://youtu.be/zWGI5ad4HQA](https://youtu.be/zWGI5ad4HQA)
- 🌐 **Website gốc**: [https://giaovienai.vercel.app](https://giaovienai.vercel.app)

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui + Radix UI
- **AI**: OpenAI GPT-4o-mini
- **State Management**: Zustand
- **File Processing**:
  - Word: mammoth.js
  - PDF: pdf-parse
- **Word Generation**: docx
- **Notifications**: react-hot-toast
- **Icons**: Lucide React

## 📋 Yêu cầu hệ thống

- Node.js 18+ hoặc 20+
- npm, yarn, hoặc pnpm
- OpenAI API Key

## 🔧 Cài đặt & Chạy Local

### 1. Clone repository

```bash
git clone <repository-url>
cd skkn-pro
```

### 2. Cài đặt dependencies

```bash
npm install
# hoặc
yarn install
# hoặc
pnpm install
```

### 3. Tạo file môi trường

Tạo file `.env.local` trong thư mục gốc:

```bash
cp .env.example .env.local
```

Sau đó mở `.env.local` và thêm OpenAI API Key:

```env
OPENAI_API_KEY=sk-your-openai-api-key-here
OPENAI_MODEL=gpt-4o-mini
```

> **Lấy OpenAI API Key**: 
> 1. Đăng ký/đăng nhập tại [platform.openai.com](https://platform.openai.com)
> 2. Vào mục [API Keys](https://platform.openai.com/api-keys)
> 3. Tạo key mới và copy vào `.env.local`

### 4. Chạy development server

```bash
npm run dev
# hoặc
yarn dev
# hoặc
pnpm dev
```

Mở trình duyệt và truy cập: [http://localhost:3000](http://localhost:3000)

## 🌐 Deploy lên Vercel (Khuyến nghị)

Vercel là nền tảng tốt nhất để deploy Next.js app, miễn phí và dễ dàng.

### Bước 1: Push code lên GitHub

```bash
# Tạo repository mới trên GitHub
git init
git add .
git commit -m "Initial commit - SKKN Pro"
git branch -M main
git remote add origin https://github.com/your-username/skkn-pro.git
git push -u origin main
```

### Bước 2: Import vào Vercel

1. Truy cập [vercel.com](https://vercel.com)
2. Đăng nhập bằng GitHub
3. Click **"New Project"**
4. Import repository vừa tạo
5. Vercel tự động detect Next.js config

### Bước 3: Thêm Environment Variables

Trong phần **Environment Variables** của Vercel:

```
OPENAI_API_KEY=sk-your-openai-api-key-here
OPENAI_MODEL=gpt-4o-mini
```

### Bước 4: Deploy

Click **"Deploy"** và đợi vài phút. Vercel sẽ cung cấp URL public cho app.

## 🚢 Deploy lên các nền tảng khác

### Deploy lên GitHub Pages (Static Export)

⚠️ **Lưu ý**: GitHub Pages chỉ hỗ trợ static sites, không hỗ trợ API routes. Bạn cần deploy backend riêng.

### Deploy lên Netlify

Netlify hỗ trợ Next.js với Netlify Functions:

1. Kết nối repository với Netlify
2. Build command: `npm run build`
3. Publish directory: `.next`
4. Thêm environment variables
5. Deploy

### Deploy lên Railway/Render

Các nền tảng này hỗ trợ full-stack Next.js:

1. Kết nối GitHub repo
2. Chọn Next.js template
3. Thêm env variables
4. Deploy

## 📁 Cấu trúc dự án

```
skkn-pro/
├── app/
│   ├── api/                    # API Routes
│   │   ├── analyze-template/   # Phân tích cấu trúc mẫu
│   │   ├── suggest-topics/     # Gợi ý tên đề tài
│   │   ├── generate-outline/   # Tạo dàn ý
│   │   └── write-section/      # Viết nội dung section
│   ├── skkn/                   # Main app page
│   │   └── page.tsx            # Multi-step wizard
│   ├── layout.tsx              # Root layout
│   ├── page.tsx                # Landing page
│   └── globals.css             # Global styles
├── components/
│   ├── ui/                     # shadcn/ui components
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── card.tsx
│   │   └── ...
│   ├── StepIndicator.tsx       # Progress indicator
│   ├── FileUpload.tsx          # File upload component
│   ├── InfoForm.tsx            # Form nhập thông tin
│   ├── TemplateAnalysis.tsx    # Hiển thị phân tích
│   ├── OutlineEditor.tsx       # Editor dàn ý
│   ├── SectionWriter.tsx       # Viết sections
│   └── ExportButton.tsx        # Export Word button
├── lib/
│   ├── types.ts                # TypeScript types
│   ├── utils.ts                # Utility functions
│   ├── store.ts                # Zustand store
│   ├── openai.ts               # OpenAI client
│   ├── parseFile.ts            # Parse Word/PDF
│   └── generateWord.ts         # Generate .docx
├── public/                     # Static assets
├── .env.example                # Environment template
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── next.config.js
└── README.md
```

## 🎯 Quy trình sử dụng

### Bước 1: Tải lên mẫu SKKN
- Upload file Word (.docx) hoặc PDF của trường/sở
- Hoặc chọn một trong 3 mẫu có sẵn:
  - Mẫu Sở GD cơ bản
  - Mẫu THPT mở rộng
  - Mẫu Tiểu học

### Bước 2: AI phân tích cấu trúc
- AI tự động nhận diện các phần/mục trong mẫu
- Hiển thị danh sách các section cần viết

### Bước 3: Nhập thông tin
- Tên đề tài (có gợi ý từ AI)
- Môn học, cấp học, khối lớp
- Trường/đơn vị, tên tác giả
- Đối tượng nghiên cứu
- Số giải pháp, số trang dự kiến
- Yêu cầu đặc biệt (nếu có)

### Bước 4: AI lập dàn ý
- Tạo outline chi tiết cho toàn bộ SKKN
- Phân chia các mục con logic, mạch lạc
- Có thể xem trước và chỉnh sửa

### Bước 5: AI viết nội dung
- AI viết từng section một cách tuần tự
- Hiển thị real-time streaming
- Có thể chỉnh sửa, viết lại từng phần

### Bước 6: Xuất file Word
- Download file .docx hoàn chỉnh
- Format chuẩn: A4, Times New Roman, line spacing 1.5
- Sẵn sàng nộp hoặc chỉnh sửa thêm

## 🔑 API Routes Documentation

### POST `/api/analyze-template`
Phân tích cấu trúc mẫu SKKN

**Request Body:**
```json
{
  "templateText": "string - nội dung mẫu SKKN"
}
```

**Response:**
```json
{
  "sections": [
    {
      "id": "string",
      "title": "string",
      "description": "string",
      "required": true,
      "order": 1
    }
  ]
}
```

### POST `/api/suggest-topics`
Gợi ý tên đề tài SKKN

**Request Body:**
```json
{
  "subject": "string",
  "level": "string",
  "grade": "string",
  "currentTopic": "string (optional)"
}
```

**Response:**
```json
{
  "suggestions": ["string", "string", ...]
}
```

### POST `/api/generate-outline`
Tạo dàn ý chi tiết

**Request Body:**
```json
{
  "formData": { ... },
  "templateStructure": [ ... ]
}
```

**Response:**
```json
{
  "outline": [
    {
      "id": "string",
      "title": "string",
      "description": "string",
      "order": 1,
      "children": [ ... ]
    }
  ]
}
```

### POST `/api/write-section`
Viết nội dung một section (Streaming)

**Request Body:**
```json
{
  "sectionTitle": "string",
  "sectionDescription": "string",
  "outline": [ ... ],
  "formData": { ... },
  "previousSections": "string (optional)"
}
```

**Response:** Streaming text content

## ⚙️ Cấu hình

### OpenAI Model
Mặc định sử dụng `gpt-4o-mini` (rẻ, nhanh, chất lượng tốt). Có thể thay đổi trong `.env.local`:

```env
OPENAI_MODEL=gpt-4o        # Chất lượng cao hơn, đắt hơn
OPENAI_MODEL=gpt-4-turbo   # Cân bằng
OPENAI_MODEL=gpt-4o-mini   # Khuyến nghị (default)
```

### File Upload Limits
- Max file size: 10MB
- Supported formats: .docx, .pdf

### Customization
- Màu chủ đạo: Edit `tailwind.config.ts`
- Default templates: Edit `lib/types.ts` → `DEFAULT_TEMPLATES`
- AI prompts: Edit các file trong `app/api/`

## 🐛 Troubleshooting

### Lỗi: "Missing OPENAI_API_KEY"
- Đảm bảo đã tạo file `.env.local`
- Check API key đã đúng format
- Restart dev server sau khi thêm env variable

### Lỗi: "Failed to parse file"
- Đảm bảo file Word là định dạng .docx (không phải .doc cũ)
- PDF phức tạp có thể parse lỗi → nên dùng Word
- Check file size < 10MB

### AI không viết được
- Check API key còn credit
- Check internet connection
- Thử giảm `targetPages` trong form

### Deploy lên Vercel bị lỗi
- Check đã thêm `OPENAI_API_KEY` vào Environment Variables
- Check build logs để xem lỗi cụ thể
- Đảm bảo đã push code mới nhất

## 📝 Roadmap

- [ ] Hỗ trợ nhiều ngôn ngữ hơn
- [ ] Tích hợp Gemini AI (alternative cho OpenAI)
- [ ] Upload nhiều tài liệu tham khảo
- [ ] Export PDF trực tiếp
- [ ] Templates library với hàng trăm mẫu
- [ ] Collaboration mode (nhiều người cùng viết)
- [ ] Mobile app (React Native)

## 🤝 Đóng góp

Mọi đóng góp đều được hoan nghênh!

1. Fork repository
2. Tạo branch mới (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Mở Pull Request

## 📄 License

MIT License - xem file [LICENSE](LICENSE) để biết thêm chi tiết.

## 👤 Tác giả

**Trần Hoài Thanh**
- Facebook: [@tranhoaithanhvicko](https://www.facebook.com/tranhoaithanhvicko)
- Website: [giaovienai.vercel.app](https://giaovienai.vercel.app)

## 💝 Hỗ trợ dự án

Nếu bạn thấy SKKN Pro hữu ích, hãy:
- ⭐ Star repository này
- 📢 Chia sẻ với đồng nghiệp
- 💬 Để lại feedback
- ☕ [Mua tác giả một ly cà phê](https://ko-fi.com/tranhoaithanh) (optional)

## 🙏 Cảm ơn

- [OpenAI](https://openai.com) - AI API
- [Vercel](https://vercel.com) - Hosting platform
- [shadcn/ui](https://ui.shadcn.com) - UI Components
- Cộng đồng giáo viên Việt Nam - Feedback & Support

---

**Được phát triển với ❤️ bởi giáo viên, vì giáo viên Việt Nam.**

🎯 **Sứ mệnh**: Giúp giáo viên tiết kiệm thời gian hành chính để tập trung vào học sinh.
