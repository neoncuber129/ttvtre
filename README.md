# Hỗ Trợ Học Thuộc

Web app giúp học thuộc lời thoại từ file Word (.docx).

## Tính năng

- **Kịch bản Hải đoàn 18 có sẵn** — mở app là học luôn, không cần upload
- Tải file Word khác nếu muốn đổi kịch bản
- Tự nhận diện lời NAM, NỮ, CẢ ĐỘI, CẢ HAI
- Chọn vai bạn đóng
- Luyện từng câu với **gợi ý dần** (từ ít → nhiều → hiện đáp án)
- Nút **Chuyển** để sang câu tiếp theo (cả lời của bạn và người kia)

## Định dạng file Word (kịch bản tuyên truyền)

Mỗi lời thoại bắt đầu bằng vai diễn:

```
NAM: Kính thưa thủ trưởng! Kính thưa các đồng chí!
NỮ: Lịch sử dân tộc Việt Nam là lịch sử của những khát vọng lớn lao.
CẢ ĐỘI: Nguyện tuyệt đối trung thành với Đảng!
CẢ HAI: KHÁT VỌNG VIỆT NAM – BẢN LĨNH VƯƠN MÌNH!
```

App tự bỏ tiêu đề, chương và chỉ dẫn sân khấu `(Nhạc nền...)`.

## Google Text-to-Speech (giọng nam / nữ)

App dùng [Google Cloud TTS](https://cloud.google.com/text-to-speech):

| Vai | Giọng Google |
|-----|----------------|
| NAM, CẢ ĐỘI | `vi-VN-Neural2-D` (nam) |
| NỮ, CẢ HAI | `vi-VN-Neural2-A` (nữ) |

### Cấu hình API key

1. Vào [Google Cloud Console](https://console.cloud.google.com/)
2. Tạo project → bật **Cloud Text-to-Speech API**
3. **APIs & Services → Credentials → Create API key**
4. (Khuyên dùng) Giới hạn key chỉ cho Text-to-Speech API

**Local:** tạo file `.env.local`:

```
GOOGLE_TTS_API_KEY=your_api_key_here
```

**Vercel:** Project → **Settings → Environment Variables** → thêm `GOOGLE_TTS_API_KEY` → Redeploy.

Endpoint proxy: `POST /api/tts` → `https://texttospeech.googleapis.com/v1/text:synthesize`

## Chạy local

```bash
npm install
cp .env.example .env.local   # rồi điền API key
npm run dev
```

## Deploy Vercel (khuyên dùng)

1. Vào [vercel.com](https://vercel.com) → đăng nhập bằng **GitHub**
2. **Add New → Project**
3. Chọn repo **neoncuber129/ttvtre** → **Import**
4. Giữ mặc định (Vercel tự nhận Vite):

   | Mục | Giá trị |
   |-----|---------|
   | Framework Preset | Vite |
   | Build Command | `npm run build` |
   | Output Directory | `dist` |
   | Install Command | `npm install` |

5. **Không** thêm biến `VITE_BASE_PATH` (để trống)
6. Bấm **Deploy** → đợi 1–2 phút

Mỗi lần push lên `main`, Vercel tự deploy lại.

Repo: [neoncuber129/ttvtre](https://github.com/neoncuber129/ttvtre)

## Deploy GitHub Pages (tùy chọn)

Chỉ dùng nếu muốn host trên `github.io`. Workflow đã set `VITE_BASE_PATH=/ttvtre/`.

1. **Settings → Pages → Source: GitHub Actions**
2. URL: [https://neoncuber129.github.io/ttvtre/](https://neoncuber129.github.io/ttvtre/)

## Công nghệ

- React + TypeScript + Vite
- [mammoth](https://www.npmjs.com/package/mammoth) — đọc file .docx trên trình duyệt (không cần server)
