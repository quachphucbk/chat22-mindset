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
| US10 | Trưởng nhóm, Thành viên | Chỉ truy cập dữ liệu được phép | Bảo vệ thông tin của nhóm|
|US10s | Trưởng nhóm, Thành viên | Trưởng nhóm và thành viên muốn tự thêm công việc khi AI bỏ sót hoặc phát sinh ngoài hội thoại, gửi người liên quan xác nhận để thống nhất trách nhiệm. | tự động thêm không cần trao đổi qua tin nhắn| 

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
| FR10s | Thêm công việc thủ công | Cho phép tự tạo công việc; thành viên tạo thì trưởng nhóm duyệt, trưởng nhóm giao thì thành viên được giao xác nhận trước khi công việc có hiệu lực. |

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
| BR15 | Công việc phát sinh từ nhóm chat ngoài hệ thống được người dùng nhập thủ công; thành viên tạo thì trưởng nhóm duyệt, trưởng nhóm giao thì thành viên được giao xác nhận trước khi công việc có hiệu lực. |

### 5. Data Requirements (xác định dữ lieu đầu vào)

### 5.1. Mục tiêu

Hệ thống phải tiếp nhận và phân tích dữ liệu hội thoại nhằm tự động phát hiện công việc và cam kết, xác định người phụ trách, thời hạn, trạng thái và những thay đổi phát sinh theo thời gian.

Dữ liệu phải hỗ trợ ba năng lực cốt lõi:

1. **Thread Disentanglement:** Xác định các tin nhắn thuộc cùng luồng hội thoại hoặc chủ đề công việc, kể cả khi nhiều chủ đề đan xen.
2. **Temporal State Tracking:** Theo dõi sự thay đổi công việc, cam kết và quyết định theo dòng thời gian.
3. **Evidence Grounding:** Liên kết mọi kết luận, cập nhật, tóm tắt hoặc cảnh báo tới đúng tin nhắn hoặc tài liệu nguồn.

### 5.2. Dữ liệu đầu vào

| Nhóm dữ liệu | Thông tin cần có | Mục đích |
|---|---|---|
| Tin nhắn | ID, nội dung, thời gian gửi | Phát hiện công việc và nội dung thay đổi |
| Người gửi | ID, tên hiển thị | Xác định người giao việc, thực hiện và xác nhận |
| Hội thoại | ID nhóm, ID hội thoại | Xác định nguồn và phạm vi trao đổi |
| Quan hệ tin nhắn | Reply, thread, tin nhắn liên quan (nếu có) | Hỗ trợ tách luồng hội thoại |
| Thời gian | Timestamp, múi giờ | Xác định deadline và thứ tự quyết định |
| Quyền truy cập | ID người dùng, vai trò, quyền trên tài nguyên | Kiểm tra ACL trước khi truy xuất |
| Tài liệu/đa phương tiện | ID, loại dữ liệu, nội dung trích xuất nếu hỗ trợ | Cung cấp ngữ cảnh và bằng chứng |

**Yêu cầu xử lý đầu vào:**

- Tiếp nhận dữ liệu có nội dung giao việc, cam kết, đề xuất, xác nhận và thay đổi quyết định.
- Xử lý tin nhắn viết tắt, tiếng lóng và câu thiếu thông tin rõ ràng.
- Phân biệt trao đổi thông thường với nội dung có khả năng chứa công việc.
- Bảo toàn liên kết tới nội dung nguồn.
- Phát hiện thông tin chưa đủ căn cứ và yêu cầu xác nhận.
- Kiểm tra quyền truy cập trước khi đưa dữ liệu vào quá trình phân tích AI.

**Lưu ý:** Đề bài có nhắc đến hội thoại đa phương tiện nhưng chưa bắt buộc MVP xử lý đầy đủ hình ảnh, âm thanh và video. Phạm vi định dạng cần được nhóm xác định.

### 5.3. Dữ liệu AI cần trích xuất

| Trường | Ý nghĩa |
|---|---|
| Task | Công việc cần thực hiện |
| Assignee | Người phụ trách |
| Deadline | Thời hạn hoàn thành |
| Status | Trạng thái công việc |
| Commitment | Cam kết được đưa ra trong hội thoại |
| Thread Reference | Các tin nhắn thuộc cùng ngữ cảnh |
| Source Evidence | Tin nhắn/tài liệu chứng minh kết luận |
| Change Type | Tạo mới, hoàn thành, đổi hạn, đổi người, hủy |

Nếu một trường không thể xác định đáng tin cậy, hệ thống phải biểu diễn trạng thái **chưa xác định**, thay vì tự điền thông tin không có bằng chứng.

### 5.4. Dữ liệu đầu ra

Hệ thống cần tạo dữ liệu công việc có cấu trúc để hiển thị, quản lý và cập nhật.

**Task Record – Bản ghi công việc**

| Trường | Mô tả |
|---|---|
| task_id | Định danh duy nhất của công việc |
| task_title | Tên công việc |
| task_description | Nội dung thực hiện |
| assignee_id | Người phụ trách, nếu xác định được |
| deadline | Thời hạn hiện tại, nếu có |
| task_status | Trạng thái hiện tại |
| approval_status | Trạng thái xác nhận |
| source_message_ids | Danh sách tin nhắn nguồn |
| conversation_id | Hội thoại chứa công việc |
| thread_id | Luồng hội thoại liên quan |
| created_at | Thời điểm ghi nhận |
| updated_at | Thời điểm cập nhật |

**Task Change History – Lịch sử thay đổi**

Hệ thống phải lưu:

- Task bị thay đổi.
- Loại thay đổi: deadline, assignee, status hoặc thông tin công việc.
- Giá trị trước và sau thay đổi.
- Thời điểm thay đổi.
- Tin nhắn làm bằng chứng.
- Người xác nhận hoặc tác nhân thực hiện.
- Trạng thái phê duyệt.

Lịch sử phải cho phép xác định **trạng thái nào có hiệu lực tại từng thời điểm**, không chỉ lưu giá trị mới nhất.

### 5.5. Các nhóm dữ liệu cần lưu trữ

| Nhóm | Nội dung |
|---|---|
| Users & Permissions | Người dùng, vai trò, quyền truy cập |
| Conversations | Nhóm và các cuộc hội thoại |
| Messages | Tin nhắn gốc và metadata |
| Threads | Quan hệ giữa các tin nhắn cùng chủ đề |
| Tasks | Thông tin công việc hiện tại |
| Task Events | Sự kiện tạo, sửa, hoàn thành, hủy |
| Evidence | Liên kết giữa kết luận và tin nhắn nguồn |
| Confirmations | Xác nhận, chỉnh sửa, từ chối |
| Reminders | Đề xuất, phê duyệt và trạng thái nhắc việc |
| Evaluation Data | Nhãn chuẩn và kết quả đánh giá AI |

Đây là mô hình dữ liệu logic, không bắt buộc tương ứng một-một với các bảng cơ sở dữ liệu.

### 5.6. Ràng buộc dữ liệu

- **DR-01:** Mọi task được AI ghi nhận phải liên kết được với tin nhắn hoặc tài liệu nguồn.
- **DR-02:** Mọi cập nhật task phải có tin nhắn làm bằng chứng và lưu lịch sử thay đổi.
- **DR-03:** Tóm tắt, cam kết và cảnh báo phải truy vết về đúng nguồn liên quan.
- **DR-04:** Không tự suy đoán người phụ trách, deadline hoặc quyết định khi ngữ cảnh chưa đủ rõ; phải yêu cầu xác nhận.
- **DR-05:** Không đưa dữ liệu vượt quyền truy cập vào quá trình truy xuất, tìm kiếm hoặc ngữ cảnh LLM.
- **DR-06:** Thông tin thay đổi theo thời gian phải được lưu mà không làm mất các quyết định trước đó.
- **DR-07:** Phân biệt kết quả AI dự đoán, thông tin chờ xác nhận và trạng thái công việc chính thức.

### 5.7. Dữ liệu phục vụ đánh giá AI

Các bộ dữ liệu được đề bài đưa ra để tham chiếu:

| Bộ dữ liệu | Mục đích tham khảo |
|---|---|
| SAMSum / DialogSum | Hội thoại và tóm tắt hội thoại |
| MeetingBank | Nội dung cuộc họp và quyết định |
| Ubuntu Chat Disentanglement | Tách luồng hội thoại |
| MultiWOZ / τ-bench | Hội thoại nhiều bước và xử lý tác vụ |
| FLORES-200 / PhoMT | Xử lý đa ngôn ngữ |
| VIVOS | Dữ liệu tiếng nói tiếng Việt |
| PhishTank / ViHSD | Dữ liệu an toàn, nội dung rủi ro |

Không phải tất cả bộ dữ liệu trên đều có sẵn nhãn task, assignee, deadline và trạng thái phù hợp với CHAT-22.

Nhóm cần xây dựng hoặc lựa chọn tập đánh giá có nhãn chuẩn phù hợp với bài toán. Tập dữ liệu phải bao gồm cả tin nhắn không chứa task, câu mơ hồ, hội thoại đan xen và các quyết định bị sửa hoặc phủ định.

---

## 6. Non-Functional Requirements – Yêu cầu phi chức năng

### 6.1. Security & Access Control – Bảo mật và phân quyền

| Mã | Yêu cầu |
|---|---|
| NFR-01 | Hỗ trợ ít nhất hai vai trò phân quyền |
| NFR-02 | Kiểm tra ACL ngay tại tầng truy xuất dữ liệu |
| NFR-03 | Không trả về tin nhắn, task hoặc bằng chứng vượt quyền |
| NFR-04 | Không cung cấp dữ liệu không được phép truy cập cho LLM |
| NFR-05 | Chỉ người có quyền mới được xác nhận hoặc chỉnh sửa thông tin |
| NFR-06 | Lưu nhật ký các thao tác xác nhận và thay đổi quan trọng |

**Hai vai trò đề xuất cho MVP:**

- **Quản lý nhóm:** Quản lý công việc và phê duyệt hành động trong phạm vi được cấp quyền.
- **Thành viên:** Xem và thao tác với công việc, hội thoại được cấp quyền; xác nhận hoặc đề xuất chỉnh sửa theo quyền được giao.

Phạm vi quyền cụ thể phải thống nhất với Business Rules.

### 6.2. Reliability – Độ tin cậy

| Mã | Yêu cầu |
|---|---|
| NFR-07 | Không biến mọi câu nói thành task |
| NFR-08 | Trường hợp không rõ phải yêu cầu xác nhận |
| NFR-09 | Không tự tạo reminder hoặc lịch trước khi được phê duyệt |
| NFR-10 | Không tự coi đề xuất thay đổi là quyết định đã có hiệu lực |
| NFR-11 | Duy trì lịch sử các quyết định bị sửa hoặc phủ định |
| NFR-12 | Không làm mất dữ liệu đã xác nhận khi LLM gặp lỗi |
| NFR-13 | Tóm tắt, cam kết và cảnh báo phải có bằng chứng nguồn |

### 6.3. Performance – Hiệu năng

- **NFR-14:** Đo được thời gian phản hồi của chức năng phân tích hội thoại, phát hiện task và phát hiện cập nhật.
- **NFR-15:** Đo được thời gian tải Task Inbox và truy xuất bằng chứng.
- **NFR-16:** Hạn chế xử lý trùng lặp gây tạo task hoặc cập nhật giống nhau cho cùng sự kiện.
- **NFR-17:** Khi AI xử lý chậm hoặc thất bại, hệ thống phải thông báo trạng thái phù hợp và bảo toàn dữ liệu.

Đề bài không quy định thời gian phản hồi tối đa. Nhóm cần xác định ngưỡng hiệu năng dựa trên môi trường triển khai và kết quả thử nghiệm.

### 6.4. Usability – Khả năng sử dụng

- **NFR-18:** Cung cấp giao diện web xem công việc, người phụ trách, deadline và trạng thái.
- **NFR-19:** Cho phép người dùng xác nhận hoặc chỉnh sửa thông tin AI phát hiện.
- **NFR-20:** Cho phép truy cập bằng chứng nguồn từ task, cập nhật hoặc cảnh báo.
- **NFR-21:** Phân biệt rõ thông tin đã xác nhận và đang chờ xác nhận.
- **NFR-22:** Thông báo rõ khi hành động cần phê duyệt.

### 6.5. Evaluation & Observability – Đánh giá và giám sát

- **NFR-23:** Có bộ đo lường định lượng chất lượng AI trên dữ liệu hội thoại có nhãn.
- **NFR-24:** Có báo cáo Precision, Recall và F1 cho việc phát hiện task.
- **NFR-25:** Có khả năng truy vết lỗi phát hiện sai task, sai người phụ trách, sai trạng thái hoặc sai nguồn.
- **NFR-26:** Với chức năng nâng cao, đánh giá thêm chất lượng tách luồng, theo dõi trạng thái thời gian, độ trung thực và độ trễ.

---

## 7. Acceptance Criteria – Điều kiện kiểm thử và nghiệm thu

### 7.1. Mục tiêu

Xác định các điều kiện chứng minh hệ thống CHAT-22 giải quyết đúng bài toán, đáp ứng yêu cầu đầu ra và tuân thủ ràng buộc.

Việc nghiệm thu dựa trên:

- Kiểm thử chức năng.
- Kiểm thử phân quyền và phê duyệt.
- Kiểm tra bằng chứng nguồn.
- Đánh giá định lượng chất lượng AI.

### 7.2. Tiêu chí nghiệm thu chức năng

| Mã | Chức năng | Điều kiện nghiệm thu |
|---|---|---|
| AC-01 | Task Extraction | Phát hiện lời giao việc và không tạo task từ nội dung không phải công việc |
| AC-02 | Assignee Extraction | Xác định đúng người phụ trách khi có đủ bằng chứng |
| AC-03 | Deadline Extraction | Xác định deadline theo ngữ cảnh, yêu cầu xác nhận khi chưa rõ |
| AC-04 | Status Detection | Nhận biết trạng thái công việc |
| AC-05 | Update Detection | Phát hiện hoàn thành, đổi hạn và đổi người phụ trách |
| AC-06 | Thread Disentanglement | Liên kết đúng các tin nhắn thuộc cùng công việc |
| AC-07 | Temporal State Tracking | Theo dõi chính xác các thay đổi và quyết định có hiệu lực |
| AC-08 | Confirm/Edit | Cho phép người dùng xác nhận, chỉnh sửa hoặc từ chối kết quả |
| AC-09 | Task Inbox | Hiển thị công việc, người phụ trách, deadline và trạng thái |
| AC-10 | Reminder | Chỉ kích hoạt sau khi có phê duyệt |
| AC-11 | Evidence Tracking | Truy vết task, cập nhật và kết luận về đúng nguồn |
| AC-12 | ACL | Ngăn truy xuất dữ liệu vượt quyền tại tầng truy xuất |
| AC-13 | Evaluation | Có báo cáo Precision, Recall, F1 trên dữ liệu gắn nhãn |
| AC-14 | Web Deployment | Có ứng dụng web triển khai với ít nhất hai vai trò |

### 7.3. Các kịch bản kiểm thử

#### TC-01 – Phát hiện công việc

**Input:** "Nam hoàn thành báo cáo trước thứ Sáu."

**Expected Result:**

- Phát hiện công việc.
- Xác định Nam là người phụ trách.
- Xác định thời hạn khi đủ ngữ cảnh.
- Liên kết tin nhắn nguồn.

#### TC-02 – Xử lý câu mơ hồ

**Input:** "Mai gửi proposal nhé."

**Expected Result:**

- Phân tích ngữ cảnh để xác định "Mai" là tên người hay ngày mai.
- Nếu thiếu căn cứ, yêu cầu người dùng xác nhận.
- Không tự điền thông tin không được chứng minh.

#### TC-03 – Công việc có điều kiện phụ thuộc

**Input:** "Phần này chờ Lan duyệt rồi Nam làm tiếp."

**Expected Result:**

- Nhận diện hành động chờ Lan duyệt và Nam tiếp tục thực hiện sau đó.
- Không tự xác định Nam đã bắt đầu hoặc hoàn thành công việc.
- Lưu điều kiện phụ thuộc cùng bằng chứng nguồn.

#### TC-04 – Thay đổi deadline

**Input:**

- Tin 1: "Nam gửi báo cáo trước thứ Sáu."
- Tin 2: "Báo cáo dời sang thứ Hai nhé."
- Tin 3: "Đồng ý, chốt thứ Hai."

**Expected Result:**

- Xác định task đang được thay đổi.
- Phân biệt đề xuất với quyết định được xác nhận.
- Cập nhật theo quy tắc phê duyệt và thẩm quyền.
- Lưu lịch sử trước/sau và tin nhắn nguồn.

#### TC-05 – Hội thoại đan xen

**Input:**

- Tin 1: "Nam làm giao diện."
- Tin 2: "Bình phụ trách API."
- Tin 3: "Phần giao diện chuyển sang thứ Hai."
- Tin 4: "API đã hoàn thành."

**Expected Result:**

- Nhận diện hai công việc riêng biệt.
- Tin 3 liên kết với công việc giao diện.
- Tin 4 liên kết với công việc API.
- Không cập nhật nhầm giữa hai công việc.

#### TC-06 – Không tạo task sai

**Input:** "Hôm nay trời đẹp quá."

**Expected Result:** Không tạo task.

#### TC-07 – Kiểm tra ACL

**Input:** Người dùng nhóm A yêu cầu AI truy xuất thông tin riêng của nhóm B mà không có quyền.

**Expected Result:**

- Tầng truy xuất từ chối cung cấp dữ liệu.
- LLM không nhận được nội dung trái quyền.
- Không rò rỉ thông tin qua tóm tắt, Task Inbox hoặc bằng chứng.

#### TC-08 – Phê duyệt reminder

**Input:** AI đề xuất tạo reminder cho công việc sắp đến hạn.

**Expected Result:**

- Trước phê duyệt: chưa có reminder hoạt động.
- Sau phê duyệt hợp lệ: reminder mới được tạo hoặc kích hoạt.

#### TC-09 – Truy vết nguồn

**Input:** Người dùng xem chi tiết công việc đã thay đổi deadline.

**Expected Result:**

- Xem được tin nhắn giao việc ban đầu.
- Xem được tin nhắn dẫn tới quyết định thay đổi.
- Xem được lịch sử giá trị trước và sau.
- Không hiển thị bằng chứng vượt quyền truy cập.

### 7.4. Đánh giá định lượng AI

**Các chỉ số được yêu cầu trong đầu ra cơ bản:**

| Chỉ số | Ý nghĩa |
|---|---|
| Precision | Tỷ lệ task AI phát hiện thực sự đúng |
| Recall | Tỷ lệ task thực tế được AI tìm thấy |
| F1 Score | Chỉ số cân bằng Precision và Recall |

**Chỉ số đề xuất bổ sung:**

| Chỉ số | Mục đích |
|---|---|
| Assignee Accuracy | Đánh giá xác định người phụ trách |
| Deadline Accuracy | Đánh giá xác định deadline |
| Update Detection F1 | Đánh giá phát hiện thay đổi công việc |
| Evidence Accuracy | Đánh giá liên kết nguồn |
| Thread Quality | Đánh giá tách luồng hội thoại |
| Temporal State Accuracy | Đánh giá trạng thái theo thời gian |
| Latency | Đo độ trễ xử lý |

**Phương pháp đánh giá:**

1. Chuẩn bị tập hội thoại có nhãn chuẩn.
2. Gắn nhãn task, assignee, deadline, thay đổi, luồng hội thoại và bằng chứng phù hợp.
3. Tách dữ liệu phát triển và dữ liệu kiểm thử.
4. Chạy hệ thống trên tập kiểm thử.
5. So sánh kết quả với nhãn chuẩn.
6. Tính Precision, Recall, F1 và các chỉ số bổ sung.
7. Ghi nhận và phân tích trường hợp AI xử lý sai.

**Lưu ý:** Đề bài không quy định ngưỡng Precision/Recall/F1 cụ thể. Nhóm phải thống nhất mục tiêu đánh giá dựa trên dữ liệu thực nghiệm.

### 7.5. Điều kiện nghiệm thu tổng thể

Sản phẩm đạt phạm vi đầu ra cơ bản khi:

- Có ứng dụng web được triển khai với ít nhất hai vai trò phân quyền.
- AI phát hiện và trích xuất task, assignee, deadline và trạng thái.
- Có Confirm/Edit và Human-in-the-Loop.
- Có Task Inbox.
- Phát hiện hoàn thành và các thay đổi công việc.
- Có reminder được phê duyệt trước khi kích hoạt.
- Truy vết được về đúng tin nhắn hoặc tài liệu nguồn.
- Có bộ đánh giá và báo cáo Precision, Recall, F1.
- Tuân thủ ACL tại tầng truy xuất.
- Không tự tạo task hoặc thực hiện hành động thiếu căn cứ.

---

## 8. MVP Scope – Phạm vi phiên bản đầu tiên

### 8.1. Mục tiêu MVP

Xây dựng một ứng dụng web tích hợp AI có khả năng tự động phát hiện, tổ chức và theo dõi công việc, cam kết phát sinh trong hội thoại nhóm.

MVP phải chứng minh được luồng cốt lõi:

**Hội thoại → Phát hiện Task → Trích xuất thông tin → Xác nhận/Chỉnh sửa → Task Inbox → Phát hiện thay đổi → Truy vết bằng chứng.**

### 8.2. In Scope – Chức năng thuộc MVP

| Mã | Chức năng | Ưu tiên |
|---|---|---|
| MVP-01 | Ứng dụng web được triển khai | Bắt buộc |
| MVP-02 | Đăng nhập và ít nhất hai vai trò phân quyền | Bắt buộc |
| MVP-03 | Tiếp nhận và phân tích dữ liệu hội thoại | Bắt buộc |
| MVP-04 | Trích xuất task, assignee, deadline, status | Bắt buộc |
| MVP-05 | Confirm/Edit | Bắt buộc |
| MVP-06 | Task Inbox | Bắt buộc |
| MVP-07 | Phát hiện thay đổi và hoàn thành công việc | Bắt buộc |
| MVP-08 | Reminder có phê duyệt | Bắt buộc |
| MVP-09 | Truy vết tin nhắn/tài liệu nguồn | Bắt buộc |
| MVP-10 | ACL tại tầng truy xuất | Bắt buộc |
| MVP-11 | Đánh giá Precision, Recall, F1 | Bắt buộc |
| MVP-12 | Xử lý hội thoại đan xen và thay đổi quyết định cơ bản | Năng lực nền tảng |

MVP-12 nhằm đáp ứng bản chất bài toán. Các mô hình phân luồng và theo dõi trạng thái phức tạp cùng benchmark chuyên sâu thuộc giai đoạn nâng cao.

### 8.3. Advanced Scope – Chức năng nâng cao

| Chức năng | Mô tả |
|---|---|
| Dependency Graph | Biểu diễn quan hệ phụ thuộc giữa công việc |
| Conflict Detection | Phát hiện thông tin hoặc quyết định mâu thuẫn |
| Uncertainty Score | Đánh giá mức độ không chắc chắn |
| Proactive Detection | Chủ động phát hiện công việc có nguy cơ bị bỏ sót |
| Workload Summary | Tổng hợp khối lượng công việc |
| Calendar Integration | Tích hợp lịch với cơ chế cấp quyền/phê duyệt |
| Advanced Thread Disentanglement | Tách luồng hội thoại phức tạp và đánh giá định lượng |
| Advanced Temporal State Tracking | Theo dõi chuỗi quyết định nhiều bước và đánh giá độ trung thực, độ trễ |

### 8.4. MVP User Flow – Luồng sử dụng

**Bước 1: Tiếp nhận hội thoại**

Hệ thống nhận các tin nhắn trong phạm vi dữ liệu được cấp quyền.

**Bước 2: Phân tích ngữ cảnh**

AI xác định chủ đề, các tin nhắn liên quan và nội dung có khả năng chứa nhiệm vụ hoặc cam kết.

**Bước 3: Trích xuất công việc**

AI nhận diện task, assignee, deadline, status và bằng chứng nguồn.

**Bước 4: Kiểm tra và xác nhận**

Hệ thống kiểm tra thông tin, xử lý các trường hợp mơ hồ và cung cấp Confirm/Edit.

**Bước 5: Quản lý công việc**

Task được ghi nhận vào Task Inbox theo quy tắc nghiệp vụ và quyền truy cập.

**Bước 6: Theo dõi thay đổi**

Khi có tin nhắn mới, AI xác định công việc liên quan và phát hiện hoàn thành, đổi deadline, đổi người phụ trách hoặc quyết định bị thay thế.

**Bước 7: Lưu lịch sử và bằng chứng**

Mỗi cập nhật được liên kết tới tin nhắn nguồn và lưu trong lịch sử.

**Bước 8: Reminder**

Chỉ tạo hoặc kích hoạt reminder sau khi có phê duyệt hợp lệ.

**Bước 9: Đánh giá AI**

Đánh giá trên dữ liệu có nhãn và báo cáo Precision, Recall, F1.

### 8.5. Những quyết định cần nhóm thống nhất

- Ứng dụng có hệ thống chat riêng hay tiếp nhận hội thoại từ nguồn khác.
- Cơ chế lấy và đồng bộ tin nhắn mới.
- Định dạng dữ liệu hỗ trợ trong MVP.
- Quyền xác nhận, chỉnh sửa task và phê duyệt reminder.
- Quy tắc cập nhật trạng thái khi bằng chứng rõ ràng.
- Quy trình xử lý các quyết định mâu thuẫn.
- Bộ dữ liệu đánh giá và các ngưỡng chất lượng.
- Cách đo độ trễ và các giới hạn triển khai.

### 8.6. Phạm vi bàn giao MVP

Sản phẩm cần bàn giao gồm:

1. Ứng dụng web có thể truy cập và sử dụng.
2. Chức năng xử lý hội thoại, trích xuất và quản lý task.
3. Cơ chế phân quyền, xác nhận và truy vết bằng chứng.
4. Chức năng reminder có phê duyệt.
5. Tập dữ liệu đánh giá có nhãn và báo cáo Precision/Recall/F1.
6. Tài liệu hướng dẫn triển khai, sử dụng và kiểm thử.

### 8.7. Definition of Done – Điều kiện hoàn thành MVP

MVP được xem là hoàn thành khi:

- Luồng cốt lõi từ hội thoại đến Task Inbox hoạt động đầu cuối.
- Có ít nhất hai vai trò và kiểm soát truy cập đúng quyền.
- AI phát hiện được công việc và các cập nhật.
- Người dùng có thể xác nhận hoặc chỉnh sửa kết quả AI.
- Các thay đổi có bằng chứng nguồn và lịch sử.
- Không tạo reminder/lịch trước khi phê duyệt.
- Có báo cáo đánh giá định lượng trên dữ liệu có nhãn.
- Ứng dụng web được triển khai và có thể trình diễn.

**Kết quả cuối cùng:** CHAT-22 phải chứng minh được khả năng chuyển thông tin công việc từ hội thoại thành dữ liệu có cấu trúc, cập nhật đúng theo thời gian, kiểm chứng được nguồn và không thực hiện hành động ngoài quyền hoặc chưa được phê duyệt.
