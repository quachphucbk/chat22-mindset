1. project overview: (giới thiệu dự án)
	- Xây dựng một hệ thống AI hỗ trợ quản lý công việc phát sinh trong hội thoại nhóm. 
	-AI tự động phát hiện công việc, người phụ trách, thời hạn và trạng thái; đồng thời cập nhật thay đổi dựa trên các 	tin nhắn mới.
2.problem statement: (xác định vấn đề thực tế và hậu quả)
	-các nhóm chat công ty, trường học,... thường có rất nhiều việc được giao qua nhóm chat chung. không phải lúc nào 	người dung cũng trực nhóm chat từ đó khi tin nhắn tang lên thì thông tin công việc bàn giao, deadline,.. sẽ bị trôi.
	-hậu quả : trễ deadline quên việc, hậu quả ảnh hưởng đến việc làm có thể không hoàn thành công việc được giao. nhiều 	lần gây hậu quả cực kỳ xấu.
3.target users: (ai gặp vấn đề?, ai dùng sản phẩm?)
	người gặp vấn đề:
	-trưởng nhóm, cần quản lý công việc nhiều theo dõi tiến độ dự án nên có rất nhiều tin tức trong nhóm chat cần phảm 	theo dõi.
	-nhân viên cần biết công việc nào cần bàn giao cho mình tránh bỏ sót
	người dùng sản phẩm:
	-những người làm việc và học tập dùng nhóm chat để phổ biến và triển khai công việc
4. Proposed Solution : (giải pháp)
	-Ai đọc hội thoại được cấp quyền --> phát hiện và tập hợp công việc thành danh sách có cấu trúc.
	-Hệ thống nhận ra các thay đổi, cập nhật phù hợp và lưu bằng chứng nguồn.
	-Những trường hợp mơ hồ cần được user xác nhận trước khi cập nhật chính thức.
5. key objactives : (mục tiêu sản phẩm)
	-tự động hóa việc ghi nhận các task
	-theo dỗi thay đổi
	-GIẢM bỏ sót công việc và giúp người dung kiểm tra lại các quyết định
6.project scope: (giới hạn phạm vi của sản phẩm)
	-xử lý tin nhắn văn bản ( có thể nâng cấp xử lý hình hhh và âm  thanh)
	-phát hiện task --> trích xuất người phụ trách/deadline
	-phân luồng hội thoại, theo dõi trạng thái và trích dẫn tin nhắn nguồn
7.success criteria ( tiêu chí để thành công) --> phần này cần đặt giới hạn do nhóm thống nhất cần off để t hống nhất
	- nhận diện chính xác tt nhất bao nhiêu %
	- phát hiện thay đổi deadline, người phụ trách bao nhiêu %
	- mỗi task và thay đổi quan trọng có thể truy về tin nhắn nguồn
	- người dung kiểm tra và sửa kết quả của ai
8. risks & constraints ( rủi ro và giới hạn)
	- AI có thể hiểu sai tiếng lóng, câu nói mơ hồ, các cuộc hội thoại đan xen hoặc quyết định bị phủ định.
	- các rủi ro về quyền truy cập và bảo mật tin nhắn công ty.
	
	
	