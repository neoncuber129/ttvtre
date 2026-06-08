# Hỗ Trợ Học Thuộc

Web app giúp học thuộc lời thoại từ file Word (.docx).

## Tính năng

- Tải file Word, tự nhận diện lời của từng nhân vật (Nam, Nữ, hoặc tên bất kỳ)
- Chọn vai bạn đóng
- Luyện từng câu với **gợi ý dần** (từ ít → nhiều → hiện đáp án)
- Nút **Chuyển** để sang câu tiếp theo (cả lời của bạn và người kia)

## Định dạng file Word

Mỗi dòng lời thoại cần có tên nhân vật ở đầu:

```
Nam: Xin chào em, hôm nay em thế nào?
Nữ - Chào anh, em khỏe ạ.
[Giáo viên] Các em mở sách trang 10.
```

Hỗ trợ các ký hiệu: `:`, `-`, `[Tên]`, `|`

## Chạy local

```bash
npm install
npm run dev
```

## Deploy GitHub Pages

1. Push code lên GitHub
2. Vào **Settings → Pages → Build and deployment → Source: GitHub Actions**
3. Mỗi lần push lên `main`/`master`, workflow tự build và deploy

URL: `https://<username>.github.io/<tên-repo>/`

Nếu repo dùng tên khác, workflow tự lấy tên repo làm `base` path.

## Công nghệ

- React + TypeScript + Vite
- [mammoth](https://www.npmjs.com/package/mammoth) — đọc file .docx trên trình duyệt (không cần server)
