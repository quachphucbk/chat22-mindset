# CommitChat AI — Product Brief (CHAT-22)

> Cập nhật: 15/11/2026. Tài liệu yêu cầu sản phẩm; hiện trạng triển khai xem [review](review-commitchat-ai.md).

## 1. Tổng quan và vấn đề

CommitChat AI giúp nhóm/phòng ban trong doanh nghiệp vừa và nhỏ chuyển công việc và cam kết trong chat thành danh sách có người phụ trách, thời hạn, trạng thái và bằng chứng nguồn.

Những câu như “Mai gửi proposal nhé” hoặc “Chờ Lan duyệt rồi Nam làm tiếp” dễ bị trôi giữa nhiều chủ đề. Tiếng lóng, thiếu ngữ cảnh và quyết định thay đổi khiến nhóm bỏ sót việc hoặc theo dõi sai deadline.

## 2. Người dùng

- **Trưởng nhóm (Manager):** Theo dõi việc trong nhóm được cấp quyền, duyệt đề xuất và cập nhật, phê duyệt nhắc việc.
- **Thành viên (Member):** Xem công việc của mình và hội thoại được cấp quyền; phản hồi, bổ sung thông tin và gửi đề nghị chỉnh sửa.
- **Admin:** Vai trò quản trị triển khai dự kiến từ P-139; không bắt buộc có màn hình quản trị trong lát cắt đầu tiên.

Ma trận quyền MVP được đề xuất thống nhất trong [PRD](prd.md). Quyền hiển thị ở prototype chưa chứng minh ACL của backend.

## 3. Giải pháp và giá trị

Luồng mục tiêu: **hội thoại được cấp quyền → tách chủ đề → trích xuất có cấu trúc → kiểm tra bằng chứng và độ chắc chắn → người có quyền xác nhận → Task Inbox → phát hiện cập nhật → lưu lịch sử → duyệt nhắc riêng**.

Giá trị nằm ở việc theo dõi quyết định theo thời gian, giữ nguồn chứng minh và tích hợp quyền/phê duyệt vào quy trình làm việc. LLM chỉ đưa ra đề xuất; thiếu căn cứ phải yêu cầu làm rõ.

## 4. Phạm vi

| Giai đoạn | Kết quả |
|---|---|
| Lát cắt 1 | Nhập hội thoại văn bản, xác thực và ACL, trích task/assignee/deadline/status, Confirm/Edit/Reject, nguồn và inbox lưu bền vững |
| Lát cắt 2 | Xử lý hội thoại đan xen cơ bản, tránh gán sai nguồn/người/hạn |
| Lát cắt 3 | Phát hiện đổi hạn, đổi người, hoàn thành/hủy; duyệt trước khi lưu revision |
| Lát cắt 4 | Nhắc trong app có phê duyệt riêng, hủy và chống gửi trùng; đánh giá P/R/F1 trên dữ liệu có nhãn |
| Sau MVP | Dependency graph bằng Neo4j, workload summary, phân luồng/temporal benchmark chuyên sâu, tích hợp lịch và Slack/Teams/Zalo |

MVP ưu tiên dán văn bản/nhập JSON và web nội bộ. Đa phương tiện, đồng bộ nền tảng chat và tạo lịch ngoài chưa thuộc luồng đầu tiên.

## 5. Ràng buộc

1. Không biến mọi câu nói thành task; phân biệt đề nghị với quyết định đã chốt.
2. Mọi task và cập nhật phải có nguồn hợp lệ trong phạm vi người dùng được phép xem.
3. Chỉ thay đổi dữ liệu chính thức sau phê duyệt của người có quyền trong chính sách MVP đề xuất.
4. Lưu lịch sử trước/sau; không sử dụng quyết định đã bị thay thế.
5. Duyệt task không đồng nghĩa duyệt nhắc việc; sửa người nhận/nội dung/giờ nhắc cần duyệt lại.
6. Kiểm tra ACL tại tầng truy xuất trước khi đưa dữ liệu vào LLM.

## 6. Mục tiêu đo lường

Các ngưỡng dưới đây là mục tiêu đề xuất kế thừa docs P-139, chưa phải kết quả đạt được hay ngưỡng bắt buộc của đề bài:

- Task extraction F1 ≥ 0,80 trên tập kiểm thử tiếng Việt tách khỏi dữ liệu phát triển.
- p90 thời gian ingest → nhận đề xuất < 5 giây; thời gian người dùng duyệt đo riêng.
- 100% task/revision đã xác nhận có nguồn hợp lệ; không rò rỉ dữ liệu ở các ca kiểm thử ACL.
- Không có nhắc việc hoạt động trước phê duyệt hoặc gửi trùng khi retry.

## 7. Nền tảng và hiện trạng

- **P-139:** Nguồn tham chiếu docs sản phẩm, kiến trúc và hướng dẫn; có mô tả mục tiêu chưa được code thực hiện.
- **commitchat-ai:** Khung FastAPI/LangGraph, schema CHAT-22, Next.js, Docker Compose, CI và eval mẫu. Chưa có luồng CHAT-22 đầu cuối.
- **chat22-mindset:** Bộ tài liệu yêu cầu và [prototype HTML](prototype/README-prototype.md) mô phỏng.

Stack hiện có trong manifest commitchat-ai: Python/FastAPI/LangGraph, Next.js **16.4.6**, React **19.3.0**, Tailwind **4.3.3**. PostgreSQL + pgvector là đích lưu trữ; Neo4j/Redis đã được khai báo trong Compose nhưng chưa có tích hợp nghiệp vụ. Phiên bản manifest không phải bằng chứng build thành công.

## 8. Rủi ro chính

AI hiểu sai hội thoại đan xen hoặc deadline tương đối; nguồn sửa/xóa; xử lý trùng; dữ liệu vượt quyền; hiểu nhầm giao diện mẫu hoặc eval offline là sản phẩm đã hoàn thành. Cần nghiệm thu theo [PRD](prd.md), [UI flow](<Wireframe-UI Flow.md>) và [review kỹ thuật](review-commitchat-ai.md).
