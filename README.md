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
- Dữ liệu vẫn được lưu cục bộ trong `localStorage` để hỗ trợ offline và đồng bộ thêm lên Google Sheet qua Apps Script Web App.

## Ghi chú triển khai

Đây là bản static frontend theo mockup trong tài liệu mô tả. `app.js` đã cấu hình Apps Script Web App để tải dữ liệu từ Google Sheet khi mở app, đưa dữ liệu mẫu lên nếu Sheet đang trống và đồng bộ các thao tác thêm/sửa/xóa mềm sau đó.

Apps Script cần có các action `bootstrap`, `upsertCase`, `upsertNote` và `upsertCategory`, đồng thời lưu `SPREADSHEET_ID` trong Script Properties. Không đưa client secret hoặc API key vào repository.
