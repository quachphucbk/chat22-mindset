# Review khung project commitchat-ai

> Ngày: 15/11/2026. Phạm vi: đọc docs P-139, đối chiếu mã nguồn local commitchat-ai và kiểm tra hiện có. Chưa xác minh GitHub, Phoenix, triển khai Docker hoặc chất lượng LLM thật.

## 1. Kết luận

Project có nền tảng phù hợp để phát triển CHAT-22: FastAPI, LangGraph có guardrail/HITL, schema domain, giao diện Next.js, Compose, CI và eval harness. Tuy nhiên, hiện trạng là **khung ứng dụng**. Chưa có luồng hội thoại → đề xuất task → duyệt → lưu → inbox → cập nhật có bằng chứng chạy đầu cuối.

Các file Python trong `commitchat-ai/src/` trùng nội dung với các file tương ứng của `P-139/src/` tại thời điểm review. Việc kế thừa template không chứng minh các yêu cầu CHAT-22 đã được triển khai.

## 2. Nguồn đối chiếu

- P-139: `product/brief.md`, `product/prd.md`, `product/wireframe_ui_flow.md`, `PROJECT_CONTEXT.md`, `ARCHITECTURE.md`, `README.md`, `docs/guide/deliverables/checklist.md`.
- commitchat-ai: `src/`, `frontend/src/`, `frontend/package.json`, `docker-compose.yml`, `requirements.txt`, `.github/workflows/ci.yml`, `eval/`, `tests/`.
- chat22-mindset: PRD, brief, wireframe và prototype hiện có. Giữ nguyên các ID US01–US14, FR01–FR16, BR01–BR14, AC-01–AC-14 để truy vết.

Đường dẫn bằng chứng dưới đây tính từ root commitchat-ai. Ưu tiên code khi xác định hiện trạng; dùng docs để xác định mục tiêu. Không lấy checklist đã đánh dấu trong README làm kết quả nghiệm thu.

## 3. Phát hiện cần xử lý

| Mức | Phát hiện và bằng chứng | Ảnh hưởng / hướng xử lý |
|---|---|---|
| P1 | `src/api/routes.py:41,57,68` chỉ khai báo `/chat`, `/chat/resume`, `/status`; prefix tại `src/main.py:34` là `/api/v1`. `/health` nằm ở root. | API auth/workspace/messages/tasks/metrics trong docs chưa tồn tại. Xây lát cắt domain trước khi demo chức năng thật. |
| P1 | `src/agents/graph.py:125–132` nối entry/guardrail/reason/act/HITL/assess/finalize; chưa nối thread disentangle/extract/confidence gate/save revision. | HITL hiện tại duyệt tool rủi ro, không phải Confirm/Edit task. Schema `ExtractedTask` chưa đồng nghĩa pipeline hoạt động. |
| P1 | Chưa có repository, migrations, auth middleware hoặc kiểm tra membership trong route chat; state dùng `MemorySaver` (`graph.py:150`). | Chưa có lưu task bền vững và ACL theo workspace/user. Cần xác thực, kiểm tra quyền trước truy xuất và kiểm tra chủ sở hữu phiên HITL. |
| P1 | `docker-compose.yml:82` chạy `python -m src.scheduler`; package thiếu `__main__.py`. `src/scheduler/main.py:18` vẫn TODO. | Scheduler thoát ngay khi chạy lệnh hiện tại; sửa entrypoint hoặc thêm `__main__.py`, sau đó mới xây queue và kiểm tra phê duyệt. |
| P1 | `eval/run_eval.py:47` mặc định dùng `golden_sample.jsonl`; runner dùng `case['id']`, `case['query']`, báo cáo dùng `category`. `golden_chat_task_vi.jsonl` gồm 5 ca dạng `conversation/expected_tasks/...`, không theo schema runner. | Không thể dùng trực tiếp dataset CHAT-22 để suy ra P/R/F1 với runner hiện tại. Cần adapter, matching task, nhãn nguồn/thời gian và scorer riêng. |
| P2 | `frontend/src/app/login/page.tsx:12` còn TODO; `chat/page.tsx:20` dùng phản hồi `setTimeout`; `tasks/page.tsx:13` dùng `SAMPLE_TASKS`. | Giao diện chưa gọi API domain. Bộ lọc mine/team chỉ đổi state nút; danh sách ở `tasks/page.tsx:45` chỉ lọc status. Cần kết nối API và test phạm vi theo vai trò. |
| P2 | `frontend/src/components/ThemeToggle.tsx:12` gọi `setMounted(true)` trong effect, bị ESLint hiện tại chặn. | `npm run lint` thất bại. CI hiện chỉ chạy Ruff/pytest backend nên không phát hiện lỗi frontend. |
| P2 | Docs ghi Next.js 15/FastAPI 0.115/LangGraph 0.3; manifest ghi Next.js 16.4.6 và requirements dùng FastAPI ≥0.141.0/LangGraph ≥1.2.0. | Đồng bộ hướng dẫn theo manifest và pin môi trường tái lập trước nghiệm thu; không hạ phiên bản theo docs cũ. |

P1: thiếu chức năng nền tảng hoặc chặn luồng chạy. P2: lỗi giao diện, kiểm chứng hoặc tài liệu cần hoàn thiện trước bàn giao.

## 4. Kết quả kiểm tra thực tế

Chạy từ root commitchat-ai, dùng Python của `.venv` P-139 có sẵn để tránh cài/chỉnh môi trường project. Kết quả không chứng minh cài mới từ `requirements.txt` thành công.

| Kiểm tra | Kết quả |
|---|---|
| `PYTHONDONTWRITEBYTECODE=1 APP_ENV=test OPENAI_API_KEY=test-key ../P-139/.venv/bin/python -m pytest tests -q -p no:cacheprovider` | **55 passed**; có cảnh báo cấu hình asyncio fixture scope |
| `../P-139/.venv/bin/python -m ruff check --no-cache src/ tests/` | **All checks passed** |
| `cd frontend && npm run lint` | **Fail:** 1 error `react-hooks/set-state-in-effect` tại ThemeToggle:12; 1 warning unused `CheckCircle` tại `src/app/page.tsx:2` |
| `PYTHONDONTWRITEBYTECODE=1 ../P-139/.venv/bin/python -m src.scheduler` | **Fail:** thiếu `src.scheduler.__main__` |
| Từ chat22-mindset: `node prototype/prototype.test.mjs` | **48/48 pass**, kiểm tra logic + render DOM giả lập |

Không chạy eval có API thật, build frontend, Docker full stack, CI từ xa hoặc kiểm tra trình duyệt. `eval/results/report.md` hiện là báo cáo offline template ngày 18/09/2026, 10/10 case; không phải F1 của CHAT-22. Không suy ra “MVP đạt” từ 55 test backend hoặc 48 test prototype.

## 5. Lộ trình khắc phục đề xuất

1. Chốt contract ingest/proposal/confirm/inbox và dữ liệu evidence; triển khai xác thực, membership và repository có ACL; migration PostgreSQL.
2. Nối pipeline trích xuất có cấu trúc, `no_task`, confidence gate, làm rõ và Confirm/Edit/Reject. Mọi ghi task có nguồn và transaction/idempotency.
3. Nối giao diện với API; bỏ phản hồi giả trong luồng thật; thêm inbox theo vai trò và mở nguồn đúng quyền.
4. Thêm tách luồng cơ bản, phân loại cập nhật, kiểm tra version trước duyệt và revision có bằng chứng; chống ghi đè quyết định mới.
5. Sửa scheduler entrypoint; triển khai nhắc trong app sau phê duyệt riêng, hủy và chống gửi trùng.
6. Xây scorer CHAT-22; tách tập dev/test, đo P/R/F1, nguồn, trạng thái và p90; sửa lint và thêm kiểm tra frontend vào CI.

Neo4j dependency graph, workload summary, calendar và connector chat để sau luồng MVP. Compose có service Neo4j không làm các tính năng đó trở thành yêu cầu bắt buộc ở lát cắt đầu.

## 6. Điều kiện chuyển từ khung sang MVP

- [ ] Gửi hội thoại qua UI tạo đề xuất từ backend và lưu dữ liệu bền vững.
- [ ] Người có quyền xác nhận/sửa/bác bỏ; thành viên không duyệt vượt quyền.
- [ ] Inbox và bằng chứng đọc từ DB, không dùng dữ liệu hardcode.
- [ ] Tin nhắn mới tạo đề xuất cập nhật; duyệt tạo revision, không mất lịch sử.
- [ ] Retry không nhân đôi task, revision hoặc nhắc việc.
- [ ] Không truy xuất/đưa dữ liệu vượt quyền vào LLM; kiểm tra cả resume HITL.
- [ ] Scheduler chạy được và chỉ xử lý nhắc có phê duyệt hợp lệ.
- [ ] Có báo cáo P/R/F1 CHAT-22 tái lập, môi trường/dataset được ghi rõ.
- [ ] Backend checks và frontend lint/build đạt; có kiểm tra trình duyệt và bằng chứng triển khai.
