# IT Case Notes

Sổ tay local để ghi lại, tìm kiếm và tái sử dụng các case hỗ trợ IT cá nhân.

## Chạy nhanh

Mở `index.html` trực tiếp trong trình duyệt, hoặc chạy một static server:

```powershell
python -m http.server 4173
```

Sau đó truy cập `http://localhost:4173`.

## Tính năng MVP

- Danh sách case dạng split-view với panel xem nhanh chi tiết.
- Tìm kiếm toàn văn theo tiêu đề, triệu chứng, nguyên nhân, cách xử lý, tag và mã lỗi.
- Thêm, sửa, nhân bản, xóa mềm, khôi phục và ghim case yêu thích.
- Quản lý danh mục, trạng thái và tag.
- Hỗ trợ lệnh CMD/PowerShell với nút sao chép.
- Xem trước ảnh đính kèm và xuất/khôi phục bản sao lưu JSON.
- Dữ liệu lưu tự động trong `localStorage`, không cần backend hoặc tài khoản.

## Ghi chú triển khai

Đây là bản static frontend theo mockup trong tài liệu mô tả. Có thể đưa nguyên repo lên GitHub Pages hoặc nối thêm backend SQLite/Express ở giai đoạn sau.
