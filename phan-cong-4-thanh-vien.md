# Phân công triển khai CommitChat AI — nhóm 4 thành viên

> Ngày lập: 15/11/2026. Căn cứ: [PRD](prd.md), [UI flow](<Wireframe-UI Flow.md>) và [review code](review-commitchat-ai.md).
> Điền tên vào TV1–TV4 trước khi bắt đầu. Đây là kế hoạch đề xuất; các đầu việc chưa được đánh dấu hoàn thành.

## 1. Mục tiêu và cách dùng bảng phân công

Cùng hoàn thành luồng thật: **đăng nhập → nhập hội thoại → AI đề xuất task có nguồn → người có quyền duyệt → lưu DB và hiển thị inbox → nhận diện cập nhật → lưu lịch sử → duyệt nhắc việc riêng**.

Code triển khai trong `commitchat-ai/`; tài liệu yêu cầu và kế hoạch trong `chat22-mindset/`. Project hiện có khung và giao diện mẫu, chưa có luồng CHAT-22 đầu cuối. Backend đã đạt 55 test và prototype đạt 48 kiểm tra tại lần review trước; đây là baseline tham khảo, không phải bằng chứng các việc dưới đây đã xong.

1. Điền tên, thống nhất người phụ trách và milestone.
2. Mỗi mã việc là một ticket; ghi nhánh/PR và kết quả kiểm tra khi bàn giao.
3. Hoàn thành theo từng mốc có demo chạy được; dùng cột phụ thuộc để tránh chờ nhau.
4. Chưa biết năng lực và lịch rảnh của từng người nên phân theo mảng; có thể đổi người trước khi nhận việc.

## 2. Bảng phân vai

| Thành viên | Điền tên | Vai trò chính | Sản phẩm chịu trách nhiệm |
|---|---|---|---|
| TV1 | … | Backend, dữ liệu và tích hợp | DB, auth/ACL, API nghiệp vụ, lưu task/revision/evidence |
| TV2 | … | AI agent và xử lý hội thoại | Trích xuất, làm rõ, tách luồng, phát hiện cập nhật |
| TV3 | … | Frontend và trải nghiệm sử dụng | UI thật nối API, inbox, duyệt, nguồn/lịch sử, nhắc việc |
| TV4 | … | Đánh giá AI, nhắc việc và vận hành | Dataset/scorer, worker nhắc trong app, CI/Docker, kiểm thử đầu cuối |

TV1 điều phối tích hợp kỹ thuật; TV4 tổng hợp bằng chứng nghiệm thu. Mỗi người tự viết kiểm thử cho phần mình; TV4 không nhận toàn bộ việc test của ba người còn lại. Nếu TV4 quá tải ở mốc cuối, TV1 hỗ trợ tích hợp reminder, TV2 hỗ trợ scorer và TV3 hỗ trợ kiểm thử trình duyệt.

## 3. Việc cần thống nhất trước khi chia nhánh — C0

**Chủ trì:** TV1. **Tham gia:** cả 4. **Đầu ra:** bản contract ngắn trong `commitchat-ai/docs/api-contract.md` và fixture JSON dùng chung. Đây là file cần tạo ở bước triển khai.

| Nội dung cần chốt | Người chuẩn bị | Quyết định cần ghi rõ |
|---|---|---|
| Định dạng message | TV1 + TV2 | ID, workspace/channel, sender, nội dung, thời gian có timezone, reply/thread reference |
| Output AI và đề xuất | TV2 + TV1 | Intent, fields chưa rõ, confidence, evidence IDs, target task và base version khi cập nhật |
| API/UI | TV1 + TV3 | URL/method, request/response, phân trang/lọc, mã lỗi, trạng thái loading/error |
| Confirm/Edit/Reject | TV1 + TV2 + TV3 | Manager duyệt; Member gửi phản hồi/đề nghị; mọi đề xuất AI chờ duyệt |
| Reminder | TV1 + TV4 + TV3 | Nháp → duyệt riêng → chờ gửi → đã gửi/hủy; sửa nội dung/người nhận/giờ phải duyệt lại |
| Eval | TV2 + TV4 | Nhãn chuẩn, tiêu chí ghép task một-một, cách chấm deadline/evidence, tập dev/test |

**C0 hoàn thành khi:** cả 4 dùng cùng một ví dụ hội thoại, proposal, task và revision; TV3 dựng UI bằng fixture, TV2 chạy agent trên fixture, TV4 viết scorer được mà không phải đợi backend hoàn tất.

Quy tắc xuyên suốt: không tự ghi task khi confidence cao; không tự bật nhắc sau duyệt task; kiểm tra quyền trước truy xuất/đưa dữ liệu vào LLM; deadline chưa rõ phải làm rõ. Neo4j graph, workload summary, calendar và connector Slack/Teams/Zalo để sau MVP.

## 4. TV1 — Backend, dữ liệu và API

**Phạm vi sở hữu:** `src/api/`, phần schema dùng chung trong `src/models/`, repository/services nghiệp vụ và migrations cần bổ sung. TV1 là đầu mối sửa schema chung sau khi thống nhất với người sử dụng.

| Mã | Việc cụ thể | Đầu ra và tiêu chí hoàn thành | Phụ thuộc |
|---|---|---|---|
| BE1 | Thiết kế DB và migration | Lưu users, membership, channel, message, proposal, task, revision, approval/audit; có seed hai vai trò và hai nhóm để test ACL; dữ liệu còn sau restart | C0 |
| BE2 | Xác thực và ACL | Login hoạt động; lấy danh tính từ auth; kiểm tra membership cho đọc/ghi/nguồn và phiên HITL nếu dùng; không tin user_id do client tự khai | BE1 |
| BE3 | API ingest và đề xuất | Validate text/JSON, lưu message, chống nhập trùng theo ID trong phạm vi nguồn; gọi interface agent TV2; lưu proposal chưa có hiệu lực; trả lỗi rõ ràng khi AI lỗi | BE1–BE2; interface từ AI1 |
| BE4 | API duyệt và inbox | Confirm/Edit/Reject đúng vai trò; confirm ghi task trong transaction; retry không tạo trùng; inbox/detail/evidence lọc đúng quyền và dùng dữ liệu DB | BE3; proposal từ AI2 |
| BE5 | Lưu cập nhật và revision | Duyệt đổi hạn/người/trạng thái có kiểm tra base version; cập nhật task và revision nguyên tử; giữ trước/sau, người duyệt, nguồn; chặn proposal lỗi thời | BE4 + AI4 |
| BE6 | API và dữ liệu reminder | Lưu nháp, duyệt riêng, sửa/hủy, danh sách thông báo trong app; kiểm tra quyền; thay đổi task/nguồn làm reminder cần rà soát; bàn giao service/repository cho TV4 | BE4; contract OP1 |

**Kiểm thử TV1 tự làm:** user nhóm A không đọc/duyệt nguồn nhóm B; Member không duyệt như Manager; nguồn không tồn tại bị từ chối; confirm lặp chỉ tạo một task; hai cập nhật cạnh tranh không ghi đè nhau; lưu task/revision thất bại thì rollback.

**Bàn giao cho:** TV3 OpenAPI và mẫu lỗi; TV2 context đã lọc quyền + interface gọi agent; TV4 seed, repository reminder và cách chạy migration. Liên quan FR01, FR02, FR05–FR09; AC-08, AC-09, AC-11, AC-12.

## 5. TV2 — AI agent và xử lý hội thoại

**Phạm vi sở hữu:** `src/agents/`, prompt domain trong `prompts/`, tests agent. Đề xuất sửa schema gửi TV1 để tránh hai người cùng sửa file chung.

| Mã | Việc cụ thể | Đầu ra và tiêu chí hoàn thành | Phụ thuộc |
|---|---|---|---|
| AI1 | Định nghĩa interface agent | Hàm nhận message/context đã lọc quyền, trả output có schema; có fixture cho create/update/no_task/uncertain/error; không tự ghi DB | C0 |
| AI2 | Trích xuất task và nối graph domain | Có intent create/update/complete/cancel/no_task; trích title, assignee, deadline, status, confidence, nguồn; trao đổi thường không tạo proposal task | AI1 |
| AI3 | Làm rõ và tách luồng cơ bản | Thiếu trường quan trọng hoặc confidence < 0,7 trả câu hỏi làm rõ; phân biệt tên Mai với ngày mai; dùng timestamp/timezone; hội thoại giao diện/API không gán chéo cập nhật | AI2 |
| AI4 | Phát hiện cập nhật theo thời gian | Tìm target task trong context được phép; phân biệt đề nghị với tin chốt; trả thay đổi trước/sau, evidence và base version; mâu thuẫn thì cần rà soát | AI2–AI3; context từ BE4 |
| AI5 | Guardrail, lỗi và truy vết | Không làm theo chỉ dẫn độc hại trong chat; evidence ID phải thuộc context; JSON sai/timeout không tạo dữ liệu chính thức; có test và trace đủ tái hiện lỗi | AI2; phối hợp BE3 |
| AI6 | Cải thiện theo eval và bàn giao cấu hình | Chạy với scorer TV4 trên dev; phân tích sai task/người/hạn/nguồn; ghi prompt/model/version và lỗi còn lại; chỉ dùng tập test cho lần nghiệm thu đã thống nhất | QA2–QA3 |

**Kiểm thử TV2 tự làm:** no_task, thiếu assignee, deadline mơ hồ, hai chủ đề đan xen, đổi hạn, đổi người, hoàn thành, hủy, quyết định bị phủ định, injection và output sai schema. Dùng mock để kiểm tra routing; kiểm tra LLM thật phải ghi rõ cấu hình và tách khỏi offline mock.

**Bàn giao cho:** TV1 interface và output có schema; TV3 ví dụ đề xuất/làm rõ; TV4 cách gọi inference và thông tin chạy eval. Liên quan FR03, FR04, FR07, FR08; AC-01–AC-07, AC-11.

## 6. TV3 — Frontend và UI flow

**Phạm vi sở hữu:** `frontend/`. Đọc `frontend/AGENTS.md` trước khi sửa code; dùng prototype làm tham chiếu hành vi.

| Mã | Việc cụ thể | Đầu ra và tiêu chí hoàn thành | Phụ thuộc |
|---|---|---|---|
| FE1 | Dọn khung và dựng API client | Sửa lỗi lint ThemeToggle/unused import; thống nhất base URL, auth và hiển thị lỗi; fixture tách rõ khỏi chế độ gọi API thật | C0 |
| FE2 | Đăng nhập và nhập hội thoại | Login gọi API; hiển thị workspace/vai trò; dán text/nhập JSON có preview; gửi ingest, hiển thị tiến trình và lỗi, retry không gửi trùng | FE1; API BE2–BE3 |
| FE3 | Danh sách đề xuất và duyệt | Nguồn cạnh title/người/hạn/confidence; Confirm/Edit/Reject/làm rõ; Member gửi phản hồi, Manager duyệt; submit xong đọc trạng thái từ backend | FE1; API BE4; fixture AI3 |
| FE4 | Inbox, detail, nguồn và lịch sử | Bỏ SAMPLE_TASKS trong luồng thật; filter mine/team/người/hạn/status đúng quyền; mở đúng message; tải lại trang vẫn thấy dữ liệu; lịch sử hiện trước/sau | FE2–FE3; API BE4–BE5 |
| FE5 | Duyệt cập nhật và nhắc việc | So sánh trước/sau; hiển thị proposal lỗi thời/cần rà soát; soạn/xem trước/duyệt/hủy nhắc riêng; hiển thị thông báo trong app và kết quả gửi từ server | BE5–BE6; OP1–OP2 |
| FE6 | QA giao diện và demo sử dụng | Desktop/tablet, bàn phím/focus, sáng/tối; trạng thái rỗng/lỗi/không quyền; lint/build đạt; bàn giao ảnh hoặc video luồng thật | FE2–FE5; QA4 |

**Kiểm thử TV3 tự làm:** nút mine/team thực sự đổi dữ liệu; không lộ nguồn trái quyền; bấm hai lần không tạo trùng; lỗi API không báo thành công giả; người dùng hiểu task đang chờ duyệt hay đã có hiệu lực. Backend vẫn phải kiểm tra ACL dù UI đã ẩn nút.

**Bàn giao cho:** TV1 lỗi contract/API thực tế; TV4 checklist trình duyệt và đường dẫn từng màn hình. Liên quan FR01, FR05–FR09; AC-08–AC-11, AC-14.

## 7. TV4 — Dataset, đánh giá, reminder và vận hành

**Phạm vi sở hữu:** `eval/`, `src/scheduler/`, kiểm thử tích hợp cần bổ sung, Docker và `.github/workflows/`. TV4 triển khai worker; TV1 sở hữu auth/API/transaction của reminder.

| Mã | Việc cụ thể | Đầu ra và tiêu chí hoàn thành | Phụ thuộc |
|---|---|---|---|
| QA1 | Lập test matrix và chuẩn nhãn | Map AC-01–AC-14 với ca kiểm tra; định nghĩa TP/FP/FN, matching và quy ước thời gian/nguồn; chỉ rõ test mock và LLM thật | C0 + AI1 |
| QA2 | Chuẩn bị dataset có nhãn | Mục tiêu tối thiểu 45 ca kiểm thử theo kế hoạch PRD; có no_task/mơ hồ/đan xen/update/phủ định/ACL; tách dev và test theo hội thoại; nhãn có message ID và timezone | QA1; mỗi TV góp dữ liệu |
| QA3 | Adapter và scorer CHAT-22 | Đọc conversation/expected_tasks/... thay vì ép vào runner generic; ghép task một-một; tính P/R/F1, nguồn, trạng thái và latency; có test scorer bằng dự đoán đúng/sai/trùng/bỏ sót | QA1–QA2; inference AI1 |
| OP1 | Sửa entrypoint scheduler và chốt delivery | `python -m ...` chạy được; định nghĩa contract đọc bản đã duyệt, claim job, retry và lưu notification trong app; thống nhất với BE6 | C0; có thể làm entrypoint ngay |
| OP2 | Worker nhắc việc trong app | Chỉ gửi reminder đã duyệt còn hiệu lực; hủy/rà soát không gửi; retry hoặc hai worker không nhân đôi notification; lưu sent_at/trạng thái/lỗi | OP1 + BE6 |
| OP3 | Docker, CI và môi trường | Cài mới được; migration/seed có hướng dẫn; Docker health được kiểm tra; CI thêm frontend lint/build bên cạnh Ruff/pytest; cấu hình không chứa key thật | FE1, BE1; phối hợp mọi TV |
| QA4 | Kiểm thử đầu cuối và report | Chạy UI → API → DB → agent và worker; kiểm tra ACL, restart/retry; xuất báo cáo có dataset/model/version/môi trường, số liệu thật và lỗi còn lại | BE5–BE6, AI4–AI6, FE5, OP2–OP3 |

**Kiểm thử TV4 tự làm:** scorer phạt dự đoán trùng; dataset không thiếu ID/timezone; reminder chưa duyệt không gửi; crash/retry không nhân đôi thông báo; tách số liệu offline khỏi chất lượng LLM thật. Báo cáo F1 ≥ 0,80 và p90 < 5 giây là mục tiêu đề xuất, phải ghi số đo thực tế kể cả khi chưa đạt.

**Bàn giao cho:** cả nhóm lệnh test/eval/deploy tái lập; báo cáo lỗi theo người sở hữu; checklist nghiệm thu. Liên quan FR09–FR10; AC-10, AC-12–AC-14.

## 8. Mốc phối hợp và phụ thuộc

Chưa có deadline cụ thể nên dùng mốc kết quả, không gán ngày giả định. Nhóm điền ngày sau khi ước lượng từng ticket.

| Mốc | TV1 | TV2 | TV3 | TV4 | Điều kiện chốt mốc |
|---|---|---|---|---|---|
| M0 — Chốt contract | Chủ trì C0 | Fixture AI1 | Layout/API client FE1 | QA1, sửa entrypoint OP1 | Dùng chung schema và ví dụ; mỗi người chạy được phần của mình |
| M1 — Tạo task đầu tiên | BE1–BE4 | AI2, phần làm rõ AI3 | FE2–FE3, inbox cơ bản | Dataset/scorer bản đầu, OP3 phần CI | Login → ingest → proposal có nguồn → Manager duyệt → DB → inbox; restart không mất task |
| M2 — Theo dõi thay đổi | BE5 | Hoàn thiện AI3–AI5 | FE4, duyệt update FE5 | QA2–QA3, chuẩn bị OP2 | Hội thoại đan xen cập nhật đúng task; revision có nguồn; chặn duyệt lỗi thời và sai quyền |
| M3 — Nhắc việc và chất lượng | BE6, hỗ trợ tích hợp | AI6 | Hoàn thiện FE5–FE6 | OP2–OP3, QA4 | Reminder duyệt riêng hoạt động; eval thật tái lập; lint/test/build và demo có bằng chứng |

**Có thể làm song song ngay sau C0:** TV1 auth/DB; TV2 extraction trên fixture; TV3 màn hình trên fixture; TV4 dataset/scorer, entrypoint và CI. Fixture chỉ giúp phát triển; các mốc nghiệm thu phải dùng API/DB thật.

**Các lần bàn giao bắt buộc:**

1. TV1 + TV2 ghép BE3/AI2 trước khi TV3 bỏ mock ingest.
2. TV1 + TV3 kiểm tra Confirm/Edit/Reject và quyền Member/Manager trước khi chốt M1.
3. TV1 + TV2 + TV3 kiểm tra update/version/evidence trước khi chốt M2.
4. TV1 + TV4 ghép reminder API/worker; TV3 nối UI sau khi contract ổn định.
5. Cả nhóm cùng chạy QA4 và xem báo cáo trước khi chốt M3.

## 9. Phân chia dữ liệu và tài liệu bàn giao

| Hạng mục | Chủ trì | Phần từng người phải đóng góp |
|---|---|---|
| Dataset | TV4 | TV1: 10 ca quyền/trùng/nguồn; TV2: 15 ca trích xuất/mơ hồ/đan xen; TV3: 10 ca theo luồng người dùng; TV4: 10 ca temporal/reminder và rà soát nhãn |
| Review nhãn | TV2 + TV4 | Khử ca trùng, chốt nhãn bất đồng, tách dev/test; 45 ca đóng góp ban đầu không tự động là 45 ca test hợp lệ |
| Kiến trúc và API | TV1 | TV2 thêm graph; TV3 thêm UI flow; TV4 thêm worker/deploy |
| Hướng dẫn chạy | TV4 | Mỗi TV cung cấp lệnh, env cần thiết và lỗi thường gặp của phần mình |
| Report eval | TV4 | TV2 ghi prompt/model và phân tích lỗi; TV1/TV3 hỗ trợ trace lỗi đầu cuối |
| Video demo tối đa 5 phút | TV3 | Mỗi TV chuẩn bị một phần chạy thật; TV4 kiểm chứng số liệu sử dụng trong video |
| Pitch deck | TV3 tổng hợp | TV1 kiến trúc; TV2 giải pháp AI; TV4 số liệu/giới hạn; cả nhóm thống nhất problem và scope |
| Worklog/journal và AI logs | Mỗi TV | Cập nhật việc mình làm; dùng cơ chế log của repo, xác minh bằng chứng khi bàn giao |

45 ca là mục tiêu chuẩn bị ban đầu; nếu loại ca trùng hoặc dành một phần cho dev thì cần bổ sung để đạt quy mô tập test đã thống nhất trong PRD.

## 10. Cách làm Git và review chéo

- Mỗi ticket dùng một nhánh, ví dụ `codex/be1-database`, `codex/ai2-extraction`, `codex/fe3-review`, `codex/qa3-scorer`.
- Trước khi bắt đầu, kiểm tra `git status`: commitchat-ai đang có nhiều file staged từ khung project ở lần review trước. Cả nhóm cần thống nhất baseline, không đưa thay đổi của người khác vào PR của mình.
- TV1 giữ đầu mối schema/API/migrations; TV2 sửa graph/prompts; TV3 sửa frontend; TV4 sửa eval/scheduler/CI. Sửa ngoài phạm vi cần báo người sở hữu trước để giảm xung đột.
- Ghép code thường xuyên theo từng ticket nhỏ; PR ghi mục tiêu, cách chạy kiểm tra, ví dụ input/output và phần chưa xong.
- Review chéo: TV1 ↔ TV2 cho backend/agent; TV3 ↔ TV4 cho UI/test/vận hành. Người có API tích hợp liên quan cùng xem contract.
- Mỗi ngày cập nhật ngắn: đã xong mã nào, đang làm mã nào, bị chặn bởi mã nào; báo blocker bằng ID việc và dữ liệu còn thiếu.

## 11. Mẫu ticket để copy

```text
Mã việc: BE1 / AI2 / FE3 / QA3 ...
Tên việc:
Người phụ trách:
Người review:
Mốc: M0 / M1 / M2 / M3
Ngày dự kiến:
Input/phụ thuộc:
File/module dự kiến:
Đầu ra:
Tiêu chí hoàn thành:
Lệnh kiểm tra và kết quả:
Bằng chứng: PR/commit/ảnh/report
Trạng thái: Chưa làm / Đang làm / Chờ phụ thuộc / Chờ review / Hoàn thành
```

Một ticket chỉ được ghi hoàn thành khi có đầu ra kiểm tra được và người nhận bàn giao sử dụng được. “Có màn hình”, “có schema” hay “có Dockerfile” chưa đủ thay cho luồng chạy thật.

## 12. Checklist nghiệm thu chung

- [ ] M0: contract và fixture dùng chung đã chốt, có tên phụ trách từng ticket.
- [ ] M1: tạo task từ hội thoại qua UI/API/DB thật, có duyệt và evidence.
- [ ] M2: hội thoại đan xen/cập nhật đúng task, lịch sử và kiểm tra version đúng.
- [ ] ACL: hai vai trò và hai nhóm; backend chặn đọc, ghi, nguồn và resume trái quyền.
- [ ] M3: reminder chỉ gửi sau phê duyệt riêng; sửa/hủy/retry đúng.
- [ ] Không tạo trùng task, revision hoặc notification khi gửi lại cùng yêu cầu.
- [ ] Dataset và scorer tái lập; số đo thật, lỗi còn lại và cấu hình được ghi rõ.
- [ ] Backend Ruff/pytest và frontend lint/build đạt trên môi trường bàn giao.
- [ ] Docker/server, trình duyệt và restart được kiểm tra với bằng chứng.
- [ ] README, kiến trúc, worklog/journal, AI Log, video và slide có người hoàn tất.
