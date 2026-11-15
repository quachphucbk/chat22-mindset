# Prototype CHAT-22

Mở **`index.html`** bằng Chrome, Edge hoặc Firefox. File tự chứa toàn bộ HTML, CSS, JavaScript và dữ liệu minh họa; không cần cài đặt, API key, backend hoặc kết nối mạng.

## Bắt đầu

1. Mặc định dùng **Lan — Trưởng nhóm**. Bấm tài khoản ở thanh đầu trang hoặc góc trái dưới để đổi sang **Nam — Thành viên**.
2. Chọn **Mở kịch bản demo → Giao việc rõ ràng**.
3. Đọc tin nguồn, bấm **Phân tích hội thoại**, rồi vào **Chờ duyệt**.
4. Kiểm tra bằng chứng và **Xác nhận**. Công việc xuất hiện trong tab **Đã xác nhận**.
5. Mở công việc để xem tổng quan, bằng chứng, lịch sử và nhắc việc.

Trang **Hướng dẫn** có UI Flow, checklist demo khoảng 5 phút, ma trận vai trò, giả định, giới hạn và đối chiếu FR01–FR10 / BR01–BR14. Các dấu số màu xanh mở ghi chú chức năng; công tắc trên thanh đầu trang bật/tắt toàn bộ ghi chú.

## Kịch bản

Có 10 kịch bản theo yêu cầu và 2 kịch bản bổ sung về đổi người phụ trách, hủy công việc. Có thể đặt lại từng kịch bản độc lập. Nút đặt lại toàn bộ demo yêu cầu xác nhận.

Đồng hồ cố định: **09:00 ngày 16/11/2026**, múi giờ **Asia/Ho_Chi_Minh**. Nút mô phỏng gửi nhắc không thay đổi đồng hồ này và không gửi thông báo thật.

**Tải JSON mẫu** tải tệp minh họa từ dữ liệu nằm trong HTML. Chọn **Dán hội thoại → Nhập tệp JSON** để nhập, kiểm tra và xem trước trước khi phân tích. Văn bản dán theo dạng `Lan: nội dung`, mỗi tin một dòng.

## Phạm vi mô phỏng

- AI dùng luật và câu mẫu cố định, không gọi mô hình thật. Nội dung ngoài bộ mẫu hiển thị giới hạn rõ ràng.
- Đăng nhập, quyền, phản hồi và gửi nhắc đều là mô phỏng. Hệ thống thật vẫn cần kiểm tra quyền tại tầng truy xuất trước khi cấp dữ liệu cho AI.
- Chỉ trạng thái dữ liệu mẫu được lưu bằng localStorage. Nội dung tự nhập và các công việc phát sinh từ nội dung đó chỉ tồn tại trong bộ nhớ của tab; tải lại trang sẽ mất. Không nhập dữ liệu thật.
- Nhắc việc cần duyệt riêng. Thay đổi nội dung, người nhận hoặc giờ nhắc đưa về chờ duyệt; đổi deadline hoặc nguồn đánh dấu cần rà soát.
- Chỉ số đánh giá tính từ bộ nhãn giả lập có lỗi cố ý, không mô tả chất lượng AI thực tế.

## Kiểm tra

Nếu máy có Node.js:

```sh
node prototype.test.mjs
```

Kết quả khi bàn giao: **48/48 kiểm tra logic và render HTML trong DOM giả lập đã qua**, bao gồm các kịch bản bắt buộc, nhập dữ liệu, phân quyền giao diện, chống trùng, lịch sử, nhắc việc, nguồn sửa/xóa và lưu phiên.

**Giới hạn kiểm chứng:** chưa kiểm tra giao diện trực quan và thao tác trên trình duyệt thật. Công cụ điều khiển trình duyệt dừng vì không xác định được URL hiện tại trên Windows. Bộ kiểm tra tự động không thay thế kiểm tra bố cục, focus bàn phím, upload/download và responsive trong trình duyệt.

PRD và các tài liệu có sẵn được giữ nguyên; không có thao tác commit hoặc push.
