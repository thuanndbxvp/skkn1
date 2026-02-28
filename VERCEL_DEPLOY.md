# 🚀 Deploy SKKN Pro lên Vercel

## Bước 1: Truy cập Vercel
1. Vào https://vercel.com
2. Đăng nhập bằng tài khoản GitHub của bạn (thuanndbxvp)

## Bước 2: Import Repository
1. Click **"Add New Project"**
2. Tìm và chọn repository `skkn1`
3. Click **"Import"**

## Bước 3: Cấu hình Build
Vercel sẽ tự động detect Next.js. Các cài đặt mặc định:
- **Framework Preset:** Next.js
- **Build Command:** `npm run build`
- **Output Directory:** `.next`

## Bước 4: Thêm Environment Variables
Trong phần **Environment Variables**, thêm:

| Key | Value |
|-----|-------|
| `OPENAI_API_KEY` | `sk-your-openai-api-key-here` |
| `OPENAI_MODEL` | `gpt-4o-mini` |

> 💡 Lấy API Key tại: https://platform.openai.com/api-keys

## Bước 5: Deploy
Click **"Deploy"** và đợi 2-3 phút.

Vercel sẽ cung cấp URL (ví dụ: `https://skkn1.vercel.app`)

## 🎉 Hoàn thành!

Truy cập URL được cung cấp để sử dụng app.

---

## ⚠️ Lưu ý

1. **OpenAI API Key cần có credit** - Đăng ký pay-as-you-go để tránh rate limit
2. **Không chia sẻ API Key** - Giữ bí mật trong phần Environment Variables
3. **Kiểm tra build logs** nếu deploy bị lỗi

## 🔧 Troubleshooting

### Lỗi "Missing OPENAI_API_KEY"
- Vào Project Settings → Environment Variables
- Thêm lại key và redeploy

### Lỗi build
```bash
# Test build local trước
npm run build
```

---

**Chúc bạn deploy thành công! 🎊**
