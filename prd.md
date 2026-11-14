### 1. Produtuct Overview (mô tả sản phẩm và mục tiêu)

	- sản phẩm Ai quản lý công nghiệp và cam kết thoại
	- lĩnh vực tin nhắn  và doanh nghiệp

### 2. User Stories (mô tả nhu cầu của từng người dùng)

trưởng nhóm và thành viên là 2 vai trò phân quyền.

| ID | Vai trò | Nhu cầu | Mục đích |
|---|---|---|---|
| US01 | Trưởng nhóm | Phát hiện công việc và cam kết từ hội thoại | Hạn chế bỏ sót việc |
| US02 | Trưởng nhóm | Xác định người phụ trách, thời hạn và trạng thái | Theo dõi và điều phối |
| US03 | Trưởng nhóm, Thành viên | Phân biệt công việc thuộc các chủ đề đan xen | Tránh liên kết nhầm việc |
| US04 | Trưởng nhóm, Thành viên | Xác nhận, chỉnh sửa hoặc bác bỏ đề xuất AI | Bảo đảm thông tin chính xác |
| US05 | Trưởng nhóm, Thành viên | Được yêu cầu xác nhận khi thông tin chưa rõ | Tránh tạo hoặc cập nhật sai |
| US06 | Thành viên | Xem danh sách công việc được giao và thời hạn | Chủ động thực hiện |
| US07 | Trưởng nhóm, Thành viên | Nhận biết thay đổi người phụ trách, thời hạn hoặc hoàn thành | Nắm đúng tình trạng hiện tại |
| US08 | Trưởng nhóm, Thành viên | Xem lịch sử và tin nhắn nguồn của công việc | Kiểm chứng các quyết định |
| US09 | Trưởng nhóm, Thành viên | Xem trước và phê duyệt nhắc việc | Kiểm soát việc tạo nhắc |
| US10 | Trưởng nhóm, Thành viên | Chỉ truy cập dữ liệu được phép | Bảo vệ thông tin của nhóm |

**User stories nâng cao — đề xuất chọn sau MVP:**

- **US11 — Trưởng nhóm:** Xem quan hệ phụ thuộc giữa các công việc để sắp xếp thứ tự thực hiện.
- **US12 — Trưởng nhóm:** Xem xung đột, thông tin chưa chắc chắn và nguy cơ bỏ sót để xử lý sớm.
- **US13 — Trưởng nhóm:** Xem tổng hợp khối lượng công việc để điều phối nhân sự.
- **US14 — Trưởng nhóm, Thành viên:** Phê duyệt đưa công việc vào lịch để quản lý thời gian.

Thứ tự thực hiện us để tạo lát cắt :
| Lát cắt | US thực hiện theo thứ tự | Kết quả sử dụng được |
|---|---|---|
| **1. Ghi nhận công việc** | **US10 → US01 → US02 → US08 → US05 → US04 → US06** | Người dùng nhập hội thoại đơn giản, AI đề xuất công việc có nguồn, yêu cầu làm rõ nếu cần, người dùng duyệt và thấy việc trong danh sách |
| **2. Xử lý hội thoại đan xen** | **Thêm US03** | Phân biệt công việc thuộc nhiều chủ đề; tránh gán nhầm người, hạn hoặc nguồn |
| **3. Theo dõi thay đổi** | **Thêm US07**, mở rộng US08, US04 và US06 | Nhận diện đổi hạn, đổi người, hoàn thành; duyệt cập nhật; xem trạng thái mới và lịch sử |
| **4. Nhắc việc** | **Thêm US09** | Xem trước, phê duyệt và nhận nhắc việc dựa trên task đã xác nhận |
	
### 3. Functional requirements (liệt kê chức năng hệ thống)

| ID | Chức năng | Yêu cầu chính |
|---|---|---|
| FR01 | Tiếp nhận hội thoại | Nhập hội thoại, lưu nội dung, người gửi, thời gian và liên kết trả lời; kiểm tra dữ liệu lỗi hoặc trùng. |
| FR02 | Đăng nhập và phân quyền | Hỗ trợ ít nhất hai vai trò; kiểm tra quyền ngay tại tầng truy xuất, trước khi cung cấp dữ liệu cho AI. |
| FR03 | Phát hiện công việc và cam kết | Nhận diện task, người phụ trách, thời hạn và trạng thái; phân biệt với trao đổi thông thường. |
| FR04 | Phân luồng hội thoại | Liên kết tin nhắn với đúng chủ đề và công việc trong các cuộc trao đổi đan xen. |
| FR05 | Xác nhận và chỉnh sửa | Cho phép người có quyền xác nhận, sửa hoặc bác bỏ đề xuất AI; yêu cầu xác nhận khi thông tin chưa rõ. |
| FR06 | Quản lý danh sách công việc | Hiển thị và lọc công việc theo người phụ trách, thời hạn, trạng thái và hội thoại. |
| FR07 | Phát hiện cập nhật | Nhận diện hoàn thành, đổi hạn hoặc đổi người phụ trách; phân biệt đề nghị với quyết định có hiệu lực. |
| FR08 | Lịch sử và truy vết | Lưu lịch sử thay đổi; liên kết công việc, cập nhật, tóm tắt và cảnh báo về đúng nguồn bằng chứng. |
| FR09 | Nhắc việc có phê duyệt | Cho phép xem trước, duyệt và hủy nhắc việc; không tạo nhắc việc hoặc lịch khi chưa được duyệt. |
| FR10 | Đánh giá chất lượng AI | Tính Precision, Recall, F1; đo độ đúng nguồn, khả năng theo dõi trạng thái và độ trễ. |

**Chức năng nâng cao:**

- **FR11:** Hiển thị quan hệ phụ thuộc giữa các công việc.
- **FR12:** Phát hiện xung đột giữa các thông tin hoặc quyết định.
- **FR13:** Đánh giá mức độ không chắc chắn của kết quả AI.
- **FR14:** Chủ động phát hiện công việc hoặc cam kết có nguy cơ bị bỏ sót.
- **FR15:** Tổng hợp khối lượng công việc theo người phụ trách.
- **FR16:** Tích hợp lịch sau khi được người dùng phê duyệt.

**Lưu ý:** Cách nhập dữ liệu và bộ lọc là đề xuất thiết kế. Đề bài ghi đầu ra cơ bản/nâng cao là gợi ý; phạm vi phiên bản đầu sẽ được chốt tại phần MVP.

### 4. Business Rules (xác định quy tắc xử lý công việc)


**Quy tắc từ đề bài:**

| ID | Quy tắc |
|---|---|
| BR01 | Không biến mọi câu nói thành công việc; phải phân biệt giao việc, cam kết với trao đổi thông thường. |
| BR02 | Thông tin chưa rõ về công việc, người phụ trách, thời hạn hoặc trạng thái phải được người dùng xác nhận. |
| BR03 | Mọi cập nhật công việc phải có tin nhắn làm bằng chứng. |
| BR04 | Mọi tóm tắt, cam kết và cảnh báo phải liên kết về đúng tin nhắn nguồn. |
| BR05 | Xử lý đúng thay đổi quyết định theo thời gian; không tiếp tục sử dụng quyết định đã bị thay thế hoặc phủ định. |
| BR06 | Không tạo nhắc việc hoặc sự kiện lịch khi chưa được phê duyệt. |
| BR07 | Kiểm tra quyền ngay tại tầng truy xuất; AI chỉ được sử dụng dữ liệu trong phạm vi được phép. |

**Quy tắc đề xuất cho MVP:**

| ID | Quy tắc |
|---|---|
| BR08 | Đề xuất tạo hoặc cập nhật task từ AI chỉ có hiệu lực sau khi người có quyền xác nhận. |
| BR09 | Không tự điền người phụ trách hoặc thời hạn khi thiếu căn cứ; để trống và yêu cầu xác nhận. |
| BR10 | Đề nghị thay đổi chưa được chấp nhận không ghi đè thông tin hiện hành. |
| BR11 | Lưu giá trị trước và sau cập nhật, người xác nhận, thời gian và bằng chứng; không ghi đè mất lịch sử. |
| BR12 | Nhập hoặc xử lý lại cùng tin nhắn không được tạo trùng công việc hay nhắc việc. |
| BR13 | Duyệt công việc không đồng nghĩa duyệt nhắc việc; thay đổi nội dung, người nhận hoặc thời điểm nhắc phải được duyệt lại. |
| BR14 | Khi nguồn bị sửa, xóa hoặc xuất hiện thông tin mâu thuẫn, đưa kết quả liên quan vào trạng thái cần rà soát. |

### 5. Data Requirements (xác định dữ lieu đầu và)

### 6. Non-Functional Requirements (hiệu năng, bảo mật, độ tin cậy)

### 7. Acceptance criteria ( điều kiện kiểm thử và nghiệm thu)

### 8. MVP Scope (chọn những chức năng cần làm trong phiên bản đầu)
