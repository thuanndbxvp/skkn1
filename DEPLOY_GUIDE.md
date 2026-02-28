# 🚀 Hướng dẫn Deploy SKKN Pro lên Vercel

## 📋 Yêu cầu

- Tài khoản GitHub
- Tài khoản Vercel (miễn phí)
- OpenAI API Key

## 🔧 Bước 1: Chuẩn bị mã nguồn

### 1.1 Cài đặt dependencies
```bash
npm install
```

### 1.2 Tạo file môi trường
```bash
cp .env.example .env.local
```

Chỉnh sửa `.env.local`:
```env
OPENAI_API_KEY=sk-your-openai-api-key-here
OPENAI_MODEL=gpt-4o-mini
```

> **Lấy OpenAI API Key:**
> 1. Truy cập [platform.openai.com](https://platform.openai.com)
> 2. Đăng ký/đăng nhập
> 3. Vào mục API Keys → Create new secret key

### 1.3 Test local
```bash
npm run dev
```
Mở trình duyệt: http://localhost:3000

---

## 🌐 Bước 2: Push lên GitHub

### 2.1 Khởi tạo Git repository
```bash
git init
git add .
git commit -m "Initial commit - SKKN Pro"
```

### 2.2 Tạo repository trên GitHub
1. Vào [github.com](https://github.com) → New Repository
2. Đặt tên: `skkn-pro` (hoặc tên bạn muốn)
3. Copy URL repository

### 2.3 Push code
```bash
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/skkn-pro.git
git push -u origin main
```

---

## 🚀 Bước 3: Deploy lên Vercel

### 3.1 Import project
1. Truy cập [vercel.com](https://vercel.com)
2. Đăng nhập bằng GitHub
3. Click **"Add New Project"**
4. Chọn repository `skkn-pro` vừa tạo

### 3.2 Cấu hình Build
Vercel sẽ tự động detect Next.js. Các cài đặt mặc định:
- **Framework Preset:** Next.js
- **Build Command:** `npm run build`
- **Output Directory:** `.next`

### 3.3 Thêm Environment Variables
Trong phần **Environment Variables**, thêm:

| Key | Value |
|-----|-------|
| `OPENAI_API_KEY` | `sk-your-openai-api-key` |
| `OPENAI_MODEL` | `gpt-4o-mini` |

### 3.4 Deploy
Click **"Deploy"** và đợi 2-3 phút.

Vercel sẽ cung cấp URL public (ví dụ: `https://skkn-pro.vercel.app`)

---

## ⚠️ Lưu ý quan trọng

### Về OpenAI API Key
- **Chi phí:** GPT-4o-mini rất rẻ (~$0.15/1M input tokens)
- **Rate limits:** Free tier có giới hạn, nên đăng ký pay-as-you-go
- **Bảo mật:** Không bao giờ commit API key lên GitHub!

### Về File Upload
- Tối đa 10MB mỗi file
- Hỗ trợ: `.docx`, `.pdf`
- File `.doc` cũ không được hỗ trợ

### Về Database
- Hiện tại không cần database (dùng session storage)
- Dữ liệu lưu local trong browser

---

## 🔧 Tùy chỉnh (Optional)

### Đổi tên thương hiệu
Sửa trong `app/page.tsx`:
- Tên app: Tìm "SKKN Pro"
- Màu chủ đạo: Sửa trong `tailwind.config.ts`

### Thêm mẫu SKKN mặc định
Sửa trong `lib/types.ts` → `DEFAULT_TEMPLATES`

### Đổi model AI
Trong `.env.local`:
```env
OPENAI_MODEL=gpt-4o        # Chất lượng cao hơn, đắt hơn
OPENAI_MODEL=gpt-4-turbo   # Cân bằng
OPENAI_MODEL=gpt-4o-mini   # Rẻ nhất (khuyến nghị)
```

---

## 🆘 Troubleshooting

### Lỗi "Missing OPENAI_API_KEY"
- Kiểm tra đã thêm env variable trong Vercel chưa
- Redeploy sau khi thêm env

### Lỗi "Failed to parse file"
- File Word phải là .docx (không phải .doc)
- File PDF phức tạp có thể lỗi → dùng Word

### Lỗi build
```bash
# Thử build local trước
npm run build
```

---

## 📞 Hỗ trợ

- Xem video hướng dẫn: https://youtu.be/zWGI5ad4HQA
- Liên hệ tác giả: [Trần Hoài Thanh](https://www.facebook.com/tranhoaithanhvicko)

Chúc bạn deploy thành công! 🎉
