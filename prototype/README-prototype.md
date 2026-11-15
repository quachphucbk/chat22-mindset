# Prototype CHAT-22

Mở **`index.html`** bằng Chrome, Edge hoặc Firefox. File tự chứa toàn bộ HTML, CSS, JavaScript và dữ liệu minh họa; không cần cài đặt, API key, backend hoặc kết nối mạng.

## Bắt đầu

1. Mặc định dùng **Lan — Trưởng nhóm**. Bấm tài khoản ở thanh đầu trang hoặc góc trái dưới để đổi sang **Nam — Thành viên**.
2. Chọn **Mở kịch bản demo → Giao việc rõ ràng**.
3. Đọc tin nguồn, bấm **Phân tích hội thoại**, rồi vào **Chờ duyệt**.
4. Kiểm tra bằng chứng và **Xác nhận**. Công việc xuất hiện trong tab **Đã xác nhận**.
5. Mở công việc để xem tổng quan, bằng chứng, lịch sử và nhắc việc.

Trang **Hướng dẫn** có UI Flow, checklist demo khoảng 5 phút, ma trận vai trò, giả định, giới hạn và đối chiếu FR01–FR10, **FR10s** / BR01–BR14. Các dấu số màu xanh mở ghi chú chức năng; công tắc trên thanh đầu trang bật/tắt toàn bộ ghi chú.

## FR10s — Thêm công việc thủ công và xác nhận hai chiều

- Trong **Công việc**, bấm **+ Thêm công việc**. Trong hội thoại, mỗi tin nhắn hiện có nút **Tạo công việc từ tin nhắn** để tự gắn nguồn.
- Tên công việc và người phụ trách là bắt buộc. Mô tả, deadline và nguồn hội thoại là tùy chọn. Deadline trống hiển thị **Chưa xác định**.
- Biểu mẫu hiển thị người xác nhận tự chọn theo quy tắc: thành viên tạo thì **Lan duyệt**; Lan giao thành viên thì **thành viên xác nhận nhận việc**. Lan tự giao cho mình chưa được hỗ trợ; không ai được tự duyệt.
- Bấm **Gửi xác nhận**. Đổi sang tài khoản người xác nhận, mở biểu tượng chuông hoặc mục **Chờ xác nhận**. Có ba lựa chọn **Đồng ý**, **Đề nghị chỉnh sửa**, **Từ chối**; hai lựa chọn sau bắt buộc nhập lý do.
- Chỉ bản đã xác nhận mới vào Inbox chính thức. Khi cần sửa, người tạo mở **Tôi đã tạo**, chỉnh sửa và gửi lại. Mọi nội dung thay đổi đều cần xác nhận lại; nút phản hồi của phiên bản cũ bị chặn.
- Nếu sửa một công việc đã xác nhận, bản cũ tiếp tục có hiệu lực trong Inbox cho đến khi bản sửa được đồng ý. Thông tin xác nhận, người tạo, người xác nhận, lý do và các phiên bản được lưu trong lịch sử.
- Trạng thái xác nhận và trạng thái thực hiện được lưu riêng. Xác nhận công việc không tạo hoặc duyệt nhắc việc tự động. Nhắc việc đã có được đánh dấu cần rà soát sau khi bản sửa công việc được chấp nhận.
- Nhãn **Người dùng tạo thủ công** luôn phân biệt với đề xuất AI. Có ghi chú **10s** bật/tắt theo công tắc hiện tại.

Hai kịch bản trong **Mở kịch bản demo**:

1. **Nam tạo → Lan xác nhận:** biểu mẫu điền sẵn “Kiểm tra API” dưới vai trò Nam → Gửi xác nhận → đổi Lan → mở thông báo → Đồng ý → kiểm tra Inbox.
2. **Lan giao → Nam nhận việc:** Lan tạo “Hoàn thiện giao diện”, giao Nam → đổi Nam → Đề nghị chỉnh sửa, nhập deadline mong muốn → đổi Lan → sửa deadline và gửi lại → đổi Nam → Đồng ý → kiểm tra Inbox và lịch sử.

Có thể đổi sang **Bình** hoặc **Mai** trong hộp chọn tài khoản demo để thử nhận việc khi Lan giao cho hai thành viên này. Thông báo chỉ nằm trong ứng dụng, không gửi ra ngoài. Dữ liệu demo cũ được giữ khi bổ sung FR10s; không cần đặt lại toàn bộ.

## Kịch bản

Có **14 kịch bản**: 10 kịch bản ban đầu, 2 kịch bản về đổi người phụ trách / hủy công việc và 2 kịch bản FR10s. Có thể đặt lại từng kịch bản độc lập. Nút đặt lại toàn bộ demo yêu cầu xác nhận.

Đồng hồ cố định: **09:00 ngày 16/11/2026**, múi giờ **Asia/Ho_Chi_Minh**. Nút mô phỏng gửi nhắc không thay đổi đồng hồ này và không gửi thông báo thật.

**Tải JSON mẫu** tải tệp minh họa từ dữ liệu nằm trong HTML. Chọn **Dán hội thoại → Nhập tệp JSON** để nhập, kiểm tra và xem trước trước khi phân tích. Văn bản dán theo dạng `Lan: nội dung`, mỗi tin một dòng.

## Phạm vi mô phỏng

- AI dùng luật và câu mẫu cố định, không gọi mô hình thật. Nội dung ngoài bộ mẫu hiển thị giới hạn rõ ràng.
- Đăng nhập, quyền, phản hồi và gửi nhắc đều là mô phỏng. Hệ thống thật vẫn cần kiểm tra quyền tại tầng truy xuất trước khi cấp dữ liệu cho AI.
- Trạng thái dữ liệu mẫu, yêu cầu thủ công và thông báo minh họa được lưu bằng localStorage. Hội thoại tự nhập và công việc / yêu cầu gắn với nguồn nhập riêng chỉ tồn tại trong bộ nhớ của tab; tải lại trang sẽ mất. Không nhập dữ liệu thật.
- Nhắc việc cần duyệt riêng. Thay đổi nội dung, người nhận hoặc giờ nhắc đưa về chờ duyệt; đổi deadline hoặc nguồn đánh dấu cần rà soát.
- Chỉ số đánh giá tính từ bộ nhãn giả lập có lỗi cố ý, không mô tả chất lượng AI thực tế.

## Kiểm tra

Nếu máy có Node.js:

```sh
node prototype.test.mjs
```

Kết quả khi cập nhật FR10s: **84/84 kiểm tra logic và render HTML trong DOM giả lập đã qua**, gồm 48 kiểm tra hồi quy ban đầu và 36 kiểm tra FR10s. Bao gồm luồng tạo, đề nghị sửa, gửi lại, từ chối, xác nhận qua router biểu mẫu, không tự duyệt, thông báo theo tài khoản, chống trùng / phiên bản cũ, nguồn, lịch sử, nhắc việc và lưu phiên.

**Giới hạn kiểm chứng:** chưa kiểm tra giao diện trực quan và thao tác trên trình duyệt thật. Công cụ điều khiển trình duyệt dừng vì không xác định được URL hiện tại trên Windows. Bộ kiểm tra tự động không thay thế kiểm tra bố cục, focus bàn phím, upload/download và responsive trong trình duyệt.

PRD và các tài liệu có sẵn được giữ nguyên; không có thao tác commit hoặc push.
