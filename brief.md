# CommitChat AI — Product Brief (CHAT-22)

> Cập nhật: 15/11/2026. Tài liệu yêu cầu sản phẩm; hiện trạng triển khai xem [review](review-commitchat-ai.md).

## 1. giới thiệu dự án
-Xây dựng một hệ thống AI hỗ trợ quản lý công việc phát sinh trong hội thoại nhóm. 

-CommitChat AI giúp nhóm/phòng ban trong doanh nghiệp vừa và nhỏ chuyển công việc và cam kết trong chat thành danh sách có người phụ trách, thời hạn, trạng thái và bằng chứng nguồn.

## 2. problem statement: (xác định vấn đề thực tế và hậu quả)
- Nhân viên thường giao việc, nhận việc, hỏi tiến độ và sửa deadline ngay trong hội thoại.
- Task tracker thường cần cập nhật thủ công; thông tin mới có thể nằm ở thread khác hoặc nhóm chat khác.
- Một câu ngắn như “ok để mình làm” thiếu ý nghĩa nếu tách khỏi tin nhắn trước đó.
- Lời đề xuất và quyết định đã được chấp thuận dễ bị nhầm lẫn.
- Doanh nghiệp quan tâm đến quyền riêng tư, quyền truy cập và bằng chứng truy vết khi dùng AI.


-hậu quả : trễ deadline quên việc, hậu quả ảnh hưởng đến việc làm có thể không hoàn thành công việc được giao. nhiều lần gây hậu quả cực kỳ xấu.


## 3. target users: (ai gặp vấn đề?, ai dùng sản phẩm?)
- người gặp vấn đề: nhóm trướng và thành viện trong nhóm

- nhóm nhỏ 3–10 người, giao tiếp chủ yếu bằng tiếng Việt, dùng TaskMind Web Chat. Không định vị là đối thủ thay thế toàn diện của Jira/Teams/Slack trong 5 tuần

## 4.Proposed Solution : (giải pháp)
-tạo ra ứng dụng AI giúp hỗ trích xuất tin nhắn, tách luồng hội thoại, lọc task có cấu trúc, kiểm tra bằng chứng và yêu cầu phê duyệt, xử lý thông tin.


## 5. key objactives : (mục tiêu sản phẩm)
-tự động hóa việc ghi nhận các task
-theo dỗi thay đổi
-GIẢM bỏ sót công việc và giúp người dùng kiểm tra lại các quyết định

## 6.project scope: (giới hạn phạm vi của sản phẩm)

-xử lý tin nhắn văn bản ( có thể nâng cấp xử lý hình hhh và âm  thanh)
-phát hiện task --> trích xuất người phụ trách/deadline
-phân luồng hội thoại, theo dõi trạng thái và trích dẫn tin nhắn nguồn
-nhắc nhở có phê duyệt, hủy và chống gửi trùng.

## 7.  success criteria ( tiêu chí để thành công)
- nhận diện chính xác tt nhất bao nhiêu 80%
- phát hiện thay đổi deadline, người phụ trách bao nhiêu 70%
- mỗi task và thay đổi quan trọng có thể truy về tin nhắn nguồn có
- người dung kiểm tra và sửa kết quả của AI

## 8. Rủi ro chính

AI hiểu sai hội thoại đan xen hoặc deadline tương đối; nguồn sửa/xóa; xử lý trùng; dữ liệu vượt quyền; hiểu nhầm giao diện mẫu hoặc eval offline là sản phẩm đã hoàn thành. Cần nghiệm thu theo [PRD](prd.md), [UI flow](<Wireframe-UI Flow.md>) và [review kỹ thuật](review-commitchat-ai.md).
