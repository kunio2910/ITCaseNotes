# Chức năng sổ tay Helpdesk

## Thiết lập và tra cứu

- Menu Thiết lập gồm Danh mục (tên và icon) và Mẫu case (thêm/sửa/xóa). Mẫu có tên, danh mục, thiết bị, hệ điều hành, triệu chứng, nguyên nhân, xử lý, lệnh và kết quả. Mẫu đã xóa không ảnh hưởng case đã tạo.
- Danh sách Case, Ghi chú, Kiến thức có sáu kiểu sắp xếp theo ngày tạo, tên hoặc danh mục, theo hai chiều. Lựa chọn được nhớ riêng cho từng danh sách trên trình duyệt.
- Nhãn Đã kiểm chứng ở cạnh trái ngôi sao yêu thích.
- Kiến thức có URL tham khảo HTTP/HTTPS. Khung iframe chỉ tải khi bấm Xem trang nhúng; luôn có liên kết mở tab mới vì website có thể chặn nhúng. Khung có sandbox và không gửi referrer.
- Thiết lập được đồng bộ bằng bản ghi dành riêng `itcn-settings-v1` trong Notes, ẩn khỏi danh sách và thùng rác. Metadata chứa danh mục, icon và mẫu. Không xóa/sửa bản ghi này trực tiếp trong Sheet. Backup phiên bản 3 chứa cả icon và mẫu, vẫn đọc được backup cũ.

- Mẫu case: trong Thêm/Chỉnh sửa case, chọn mẫu Windows, Máy in, Mạng / Internet hoặc Microsoft 365 rồi bấm Áp dụng mẫu. Nội dung đang nhập chỉ được thay sau khi xác nhận.
- Liên kết: trong chi tiết case, ghi chú hoặc kiến thức, chọn Chỉnh liên kết, đánh dấu các nội dung và Lưu liên kết. Liên kết là một chiều; có thể mở trực tiếp nội dung được liên kết.
- Đã xem gần đây: lưu tối đa 12 nội dung được mở chi tiết, riêng từng trình duyệt. Nội dung đã xóa được ẩn khỏi lịch sử.
- Kiểm chứng: đánh dấu hoặc bỏ kiểm chứng tại chi tiết; thẻ danh sách hiển thị nhãn. Khi lưu sửa nội dung, trạng thái kiểm chứng được xóa để người dùng kiểm tra lại.
- Kiến thức: nằm giữa Ghi chú và Yêu thích, hỗ trợ danh sách, tìm kiếm, thêm/sửa, ảnh/tệp, yêu thích, nhân bản và xóa mềm. Biểu mẫu không có lệnh và kết quả.

## Lưu và đồng bộ

Kiến thức dùng sheet Notes hiện có và được phân loại bằng `kind=knowledge`. Các trường mở rộng `kind`, `verifiedAt`, `linkedIds` được đóng gói trong một phần tử `type=itcn-metadata`, `version=1` của cột JSON `attachments`. Ứng dụng tách phần tử này khỏi ảnh/tệp khi đọc dữ liệu. Cách này không yêu cầu thay đổi header hoặc triển khai lại Apps Script; không chỉnh sửa/xóa phần tử metadata bằng tay trong Sheet. Các file JSON sao lưu vẫn chứa trường mở rộng trực tiếp trên đối tượng.

## Kiểm thử

`node --check app.js` và `node tests/workspace-features.cjs`.

Kiểm thử giao diện dùng Edge headless và Playwright trong runtime Codex trên máy hiện tại; API được giả lập, không ghi dữ liệu thật lên Google Sheet.
