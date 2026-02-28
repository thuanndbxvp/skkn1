# 🚀 SKKN Pro - Quick Start Guide

## Bắt đầu trong 5 phút!

### 1️⃣ Clone & Install (1 phút)
```bash
git clone <repository-url>
cd skkn-pro
npm install
```

### 2️⃣ Tạo OpenAI API Key (2 phút)
1. Đi đến: https://platform.openai.com/api-keys
2. Đăng nhập/Đăng ký
3. Click "Create new secret key"
4. Copy key (bắt đầu với `sk-...`)

### 3️⃣ Setup Environment (30 giây)
```bash
# Tạo file .env.local
cp .env.example .env.local

# Mở file và paste API key
# OPENAI_API_KEY=sk-your-key-here
```

### 4️⃣ Chạy App (30 giây)
```bash
npm run dev
```
Mở: http://localhost:3000

### 5️⃣ Test App (1 phút)
1. Click "Bắt đầu viết SKKN"
2. Chọn "Mẫu Sở GD cơ bản"
3. Điền thông tin đơn giản
4. Xem AI viết SKKN!

---

## 🌐 Deploy lên Vercel (5 phút)

### Cách 1: Deploy nhanh qua Dashboard
1. Push code lên GitHub
2. Vào vercel.com → New Project
3. Import GitHub repo
4. Thêm `OPENAI_API_KEY` trong Environment Variables
5. Click Deploy
6. Xong! 🎉

### Cách 2: Deploy qua CLI
```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# Thêm env variable
vercel env add OPENAI_API_KEY
# Paste key và chọn Production

# Deploy lại
vercel --prod
```

---

## 🆘 Troubleshooting nhanh

### ❌ Lỗi: "Missing OPENAI_API_KEY"
✅ Giải pháp:
- Check file `.env.local` đã tạo chưa
- Check key paste đúng chưa (không có space thừa)
- Restart server: `Ctrl+C` → `npm run dev`

### ❌ Lỗi: "npm install failed"
✅ Giải pháp:
```bash
# Xóa và cài lại
rm -rf node_modules package-lock.json
npm install
```

### ❌ Lỗi: "Port 3000 already in use"
✅ Giải pháp:
```bash
# Chạy trên port khác
npm run dev -- -p 3001
```

### ❌ AI không viết được
✅ Giải pháp:
- Check API key còn credit: https://platform.openai.com/usage
- Check internet connection
- Thử lại sau vài giây

---

## 📝 Checklist để deploy thành công

- [ ] Node.js đã cài (v18+)
- [ ] Git đã cài
- [ ] Có OpenAI API key
- [ ] Code đã push lên GitHub
- [ ] Đã tạo account Vercel
- [ ] Đã import project vào Vercel
- [ ] Đã thêm OPENAI_API_KEY
- [ ] Deploy success, có URL

---

## 🎯 Tips sử dụng hiệu quả

1. **Lần đầu dùng**: Chọn mẫu có sẵn để thử nghiệm
2. **Viết SKKN thật**: Upload mẫu của trường/sở
3. **Điền đầy đủ thông tin**: Thông tin chi tiết → AI viết tốt hơn
4. **Review và chỉnh sửa**: AI viết 80%, bạn hoàn thiện 20%
5. **Lưu file thường xuyên**: Export Word ngay khi xong từng phần

---

## 💡 Các mẫu SKKN có sẵn

1. **Mẫu Sở GD cơ bản** (8 phần)
   - Phù hợp: THCS, THPT
   - Cấu trúc: Lý do → Cơ sở → Thực trạng → Giải pháp → Kết quả → Bài học → Kết luận

2. **Mẫu THPT mở rộng** (10 phần)
   - Phù hợp: THPT, đề tài phức tạp
   - Thêm: Phạm vi nghiên cứu, Phương pháp nghiên cứu

3. **Mẫu Tiểu học** (7 phần)
   - Phù hợp: Tiểu học
   - Đơn giản, ngắn gọn hơn

---

## 🔗 Links hữu ích

- 📹 Video hướng dẫn: https://youtu.be/zWGI5ad4HQA
- 📚 Documentation đầy đủ: Xem README.md
- 🐛 Báo lỗi: Tạo GitHub Issue
- 💬 Hỗ trợ: Facebook Trần Hoài Thanh

---

**Chúc bạn viết SKKN thành công! 🎉**
