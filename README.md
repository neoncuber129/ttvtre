# Hỗ Trợ Học Thuộc

Web app giúp học thuộc lời thoại từ file Word (.docx).

## Tính năng

- Tải file Word, tự nhận diện lời của từng nhân vật (Nam, Nữ, hoặc tên bất kỳ)
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

## Chạy local

```bash
npm install
npm run dev
```

## Deploy GitHub Pages

1. Push code lên GitHub
2. Vào **Settings → Pages → Build and deployment → Source: GitHub Actions**
3. Mỗi lần push lên `main`/`master`, workflow tự build và deploy

**Live:** [https://neoncuber129.github.io/ttvtre/](https://neoncuber129.github.io/ttvtre/)

Repo: [neoncuber129/ttvtre](https://github.com/neoncuber129/ttvtre)

## Công nghệ

- React + TypeScript + Vite
- [mammoth](https://www.npmjs.com/package/mammoth) — đọc file .docx trên trình duyệt (không cần server)
