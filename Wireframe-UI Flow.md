# Wireframe/UI Flow — CommitChat AI (CHAT-22)

> Cập nhật: 15/11/2026. Thiết kế theo [PRD](prd.md); hiện trạng backend/giao diện thật xem [review](review-commitchat-ai.md).

## 1. Vai trò và phạm vi

Chính sách MVP đề xuất thống nhất với prototype:

| Vai trò | Xem | Thao tác |
|---|---|---|
| Trưởng nhóm | Hội thoại/task trong nhóm được cấp quyền | Xác nhận/sửa/bác bỏ đề xuất, duyệt cập nhật và nhắc riêng |
| Thành viên | Task của mình và hội thoại được cấp quyền | Bổ sung thông tin, yêu cầu làm rõ/đề nghị sửa; gửi trưởng nhóm duyệt |
| Admin (dự kiến) | Theo phạm vi quản trị được cấu hình | Quản trị workspace/member; màn hình riêng sau lát cắt đầu |

Backend phải kiểm tra quyền cho từng request và nguồn bằng chứng. Đổi tài khoản demo chỉ minh họa quyền giao diện.

## 2. Các màn hình

| Màn hình | Thiết kế mục tiêu | commitchat-ai hiện tại |
|---|---|---|
| Đăng nhập | Xác thực, chọn workspace đúng membership | `/login` hiển thị form và alert, chưa gọi API |
| Hội thoại | Nhập văn bản/JSON, xem trước, phân tích theo quyền | `/chat` phản hồi giả bằng timer |
| Đề xuất AI | Đặt nguồn cạnh title/assignee/deadline/confidence; duyệt/sửa/bác bỏ/làm rõ | Chưa có luồng domain |
| Task Inbox | Chờ duyệt, đang làm, hoàn thành; lọc theo người/hạn/hội thoại; dấu quá hạn | `/tasks` có card hardcode; nút mine/team chưa lọc dữ liệu |
| Chi tiết task | Thông tin hiện hành, nguồn, lịch sử và phê duyệt | Chưa có |
| Duyệt cập nhật | So sánh trước/sau, tin đề nghị và tin chốt; kiểm tra version | Chưa có |
| Nhắc việc | Soạn nháp, xem trước, duyệt riêng, hủy và xem lịch sử | Scheduler mới là placeholder |
| Đánh giá | P/R/F1 từ dataset có nhãn, nguồn/trạng thái/độ trễ | Eval template; chưa có màn hình/metric domain thật |

Bố cục mục tiêu: sidebar, header hiển thị workspace/vai trò, vùng chính. Màn hình duyệt cần đọc được ngữ cảnh nguồn mà không mất nội dung đang sửa.

## 3. Luồng chính

```text
Đăng nhập → Kiểm tra membership → Nhập/xem hội thoại được cấp quyền
                                         ↓
                                  Phân tích → Không có task → Thông báo
                                         ↓
                                  Đề xuất có bằng chứng
                                         ↓
                           Làm rõ / Sửa / Bác bỏ / Xác nhận
                                         ↓
                                  Lưu task → Task Inbox
                                         ↓
                        Tin mới → Đề xuất cập nhật (chưa có hiệu lực)
                                         ↓
                          Duyệt → Lưu revision và nguồn → Inbox
                                         ↓
                      Nháp nhắc → Xem trước → Duyệt riêng → Chờ gửi
```

Thành viên gửi phản hồi hoặc đề nghị chỉnh sửa; trưởng nhóm duyệt theo quyền. Nút xác nhận phải bị chặn nếu thiếu thông tin bắt buộc, nguồn không hợp lệ hoặc đề xuất đã lỗi thời.

## 4. Trạng thái và quy tắc hiển thị

- Tách trạng thái **đề xuất/phê duyệt** khỏi **trạng thái công việc**; quá hạn tính từ deadline và thời điểm hiện tại.
- Confidence dưới 0,7 hoặc thiếu trường quan trọng đưa vào làm rõ theo chính sách đề xuất; confidence cao vẫn chờ duyệt trong MVP này.
- Deadline tương đối phải hiển thị ngày/giờ đã diễn giải và múi giờ `Asia/Ho_Chi_Minh`; không chọn sẵn khi còn mơ hồ.
- Mở nguồn phải tới đúng ID tin nhắn; nguồn không còn quyền, bị sửa/xóa hoặc mâu thuẫn hiển thị cần rà soát.
- Duyệt task không tự bật nhắc; sửa người nhận/nội dung/giờ nhắc cần duyệt lại. Đổi deadline task đánh dấu nhắc cần rà soát.
- Có trạng thái đang tải, không có dữ liệu/không có task, lỗi có thể thử lại, chờ duyệt, đề xuất lỗi thời và không có quyền. Retry không nhân đôi dữ liệu.

## 5. Prototype và kiểm chứng

[Prototype HTML](prototype/index.html) minh họa luồng nhập hội thoại → duyệt task → cập nhật → xem nguồn → duyệt nhắc, có hai tài khoản Lan/Nam và ghi chú chức năng bật/tắt. AI, xác thực, ACL và gửi nhắc được mô phỏng.

Giao diện Next.js trong commitchat-ai là một bản khung riêng; chưa tích hợp hành vi từ prototype. 48/48 test prototype đã pass trên DOM giả lập, chưa chứng minh UI thật hoặc ACL backend. Hướng dẫn demo và giới hạn: [README prototype](prototype/README-prototype.md).

## 6. Nghiệm thu UI mục tiêu

- Hai vai trò thực hiện đúng ma trận quyền qua API thật.
- Tạo và cập nhật task sau duyệt; tải lại trang vẫn thấy dữ liệu đã lưu.
- Mở đúng nguồn và lịch sử; không hiển thị dữ liệu vượt quyền.
- Nhắc chưa duyệt không được gửi; gửi lại request không tạo trùng.
- Kiểm tra trình duyệt desktop/tablet, bàn phím, focus, nhập/tải JSON, sáng/tối và các trạng thái lỗi.
