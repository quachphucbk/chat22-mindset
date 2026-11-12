# CHAT-22 | TASKMIND
## AI quản lý công việc và cam kết từ hội thoại

---

## Bài toán

Trong chat doanh nghiệp, nhiều công việc được giao bằng ngôn ngữ tự nhiên như *"Mai gửi proposal nhé"* hoặc *"Phần này chờ Lan duyệt rồi Nam làm tiếp"*. Các cam kết này dễ bị trôi vì:
- Nhiều chủ đề đan xen trong cùng một cuộc hội thoại.
- Tiếng lóng, viết tắt, ngôn ngữ không chính thức.
- Quyết định ở tin nhắn sau có thể thay đổi hoặc phủ định tin nhắn trước.

## Vấn đề cốt lõi

Làm thế nào để AI:
1. Tự phát hiện **task / ngườii phụ trách / deadline / trạng thái** từ chat.
2. Nhận ra **task đã hoàn thành, đổi hạn, đổi ngườii** khi có tin nhắn mới.
3. **Tách luồng hội thoại đan xen** để không gán nhầm ngữ cảnh.
4. **Kết hợp suy luận ngữ cảnh với kiểm chứng bằng chứng** ngay trong chat.

## Giải pháp

**TaskMind** — AI agent nhúng vào chat doanh nghiệp, tự động:
- Trích xuất cam kết công việc từ hội thoại.
- Yêu cầu xác nhận khi thông tin chưa rõ.
- Theo dõi thay đổi trạng thái theo thờii gian.
- Liên kết mọi task về đúng tin nhắn nguồn.

## Target User

| Vai trò | Nhu cầu chính |
|---|---|
| Team Lead / PM | Theo dõi cam kết, đảm bảo không trôi việc |
| Thành viên nhóm | Nhận task rõ ràng, cập nhật tiến độ |
| Admin / Compliance | Kiểm soát quyền truy cập, audit log |

## Ràng buộc

- Không biến mọi câu nói thành task.
- Chưa rõ → yêu cầu xác nhận.
- Mọi cập nhật cần có message làm bằng chứng.
- Không tự tạo reminder/lịch khi chưa được duyệt.
- ACL tại tầng truy xuất.
- Mọi cam kết/cảnh báo phải liên kết ngược đúng tin nhắn nguồn.

## Tech Stack

| Lớp | Công nghệ |
|---|---|
| AI Agent | LangGraph + LangChain |
| LLM Structured Output | OpenAI GPT-4o-mini / Pydantic |
| Backend | FastAPI + Python 3.11 |
| Database | PostgreSQL |
| Cache / Queue | Redis + APScheduler |
| Optional Graph | Neo4j (nếu còn thờii gian) |
| Frontend | React + TypeScript |
| Observability | Langfuse |
| DevOps | Docker + GitHub Actions |

## Dữ liệu tham khảo

| Dataset | Mục đích | Cách lấy |
|---|---|---|
| SAMSum / DialogSum | Học pattern trích xuất từ hội thoại | `datasets.load_dataset()` |
| Ubuntu Chat Disentanglement | Benchmark tách luồng | HuggingFace / GitHub |
| MultiWOZ | Dialog state tracking | `datasets.load_dataset()` |
| ViHSD | Guardrail toxic tiếng Việt | GitHub VietAI |
| Chat Việt tự thu | Golden dataset chính | Team thu thập + anonymize |

## Success Metrics

| Metric | Mục tiêu |
|---|---|
| Task detection F1 | ≥ 0.80 |
| Slot filling accuracy (assignee + deadline) | ≥ 0.75 |
| State transition accuracy | ≥ 0.85 |
| Thread disentanglement score | ≥ 0.70 |
| HITL acceptance rate | ≥ 0.80 |
| P95 latency | < 5s |

## Scope 5 tuần

**Cơ bản (bắt buộc):**
- Extract task/assignee/deadline.
- HITL Confirm/Edit/Reject.
- Task inbox.
- Detect update/completion.
- Evidence linking.
- Precision/Recall/F1.
- ≥2 vai trò phân quyền + ACL.

**Nâng cao (chọn 3-4 phù hợp):**
- Thread disentanglement.
- Temporal state tracking.
- Uncertainty score.
- Workload summary dashboard.
