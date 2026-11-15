# Wireframe/UI Flow — CHAT-22

**Mục tiêu:** Chuyển hội thoại nhóm thành công việc có người phụ trách, thời hạn, trạng thái và bằng chứng nguồn.

## 1. Vai trò người dùng

- **Trưởng nhóm:** Xem công việc nhóm, duyệt tạo/cập nhật công việc và nhắc việc.
- **Thành viên:** Xem công việc được cấp quyền, xác nhận thông tin và đề nghị chỉnh sửa.

*Quyền phê duyệt cụ thể cần nhóm thống nhất.*

## 2. Các màn hình chính

| Màn hình | Chức năng chính |
|---|---|
| Đăng nhập | Chọn tài khoản và vai trò |
| Hội thoại | Nhập dữ liệu, xem tin nhắn, yêu cầu AI phân tích |
| Đề xuất AI | Xem nguồn; xác nhận, sửa, bác bỏ hoặc làm rõ |
| Task Inbox | Xem và lọc công việc theo người, hạn, trạng thái |
| Chi tiết công việc | Xem thông tin, bằng chứng và lịch sử |
| Duyệt cập nhật | So sánh trước/sau; duyệt đổi hạn, người hoặc trạng thái |
| Nhắc việc | Xem trước, phê duyệt và hủy nhắc |
| Đánh giá AI | Xem Precision, Recall, F1 trên dữ liệu mẫu |

**Bố cục:** Sidebar điều hướng, header hiển thị nhóm/vai trò, vùng nội dung chính. Màn hình duyệt đặt hội thoại nguồn cạnh đề xuất AI.

## 3. Luồng sử dụng

```text
Đăng nhập → Nhập hội thoại → AI đề xuất
                                 ↓
                    Làm rõ / Sửa / Bác bỏ
                                 ↓
                            Xác nhận
                                 ↓
                            Task Inbox
                                 ↓
                 Tin nhắn mới → Duyệt cập nhật
                                 ↓
                    Lưu lịch sử và bằng chứng
                                 ↓
                    Xem trước → Duyệt nhắc việc
```

## 4. Ghi chú trên giao diện

Có nút **“Hiện ghi chú chức năng”**. Mỗi ghi chú giải thích:
- Chức năng dùng để làm gì.
- Người dùng cần thao tác gì.
- Kết quả sau thao tác.

## 5. Quy tắc và trạng thái cần thể hiện

- Đề xuất AI chỉ có hiệu lực sau khi được duyệt.
- Thiếu thông tin phải yêu cầu làm rõ, không tự đoán.
- Mọi công việc và cập nhật đều có nguồn, giữ lịch sử trước/sau.
- Nhắc việc cần phê duyệt riêng.
- Chỉ hiển thị dữ liệu đúng quyền.
- Có trạng thái: đang xử lý, rỗng, lỗi, chờ duyệt và không có quyền.

## 6. Tiêu chí hoàn thành

Prototype bấm thử được từ **nhập hội thoại → duyệt task → cập nhật → xem nguồn → duyệt nhắc việc**; có hai vai trò, dữ liệu mẫu và ghi chú chức năng.

*Đây là đặc tả thiết kế; dữ liệu và xử lý AI trong prototype được mô phỏng.*