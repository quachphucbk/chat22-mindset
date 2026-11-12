# GitHub Repo Setup — CHAT-22 TaskMind

---

## 1. Thư mục đề xuất

```text
chat22-taskmind/
├── .ai-log/                    # AI usage logs (auto)
├── .github/
│   ├── workflows/
│   │   ├── ci.yml
│   │   └── deploy.yml
│   └── hooks/                  # AI logging hooks
├── docs/
│   ├── architecture_diagram.md
│   ├── brief.md
│   ├── prd.md
│   ├── wireframe.md
│   ├── workflow-ipo.md         # Bài tập Chương 7
│   ├── edge-cases.md           # Bài tập Chương 7
│   ├── workflow-diagram.mmd    # Bài tập Chương 7
│   ├── adr/
│   │   ├── ADR-001-langgraph.md
│   │   ├── ADR-002-database.md
│   │   ├── ADR-003-structured-output.md
│   │   ├── ADR-004-hitl.md
│   │   └── ADR-005-acl.md
│   ├── evaluation.md
│   └── privacy/
│       └── pii_scan_report.md  # Bài tập Chương 11
├── eval/
│   ├── datasets/
│   │   └── golden.jsonl
│   ├── run_eval.py
│   ├── judge.py
│   ├── cost_benchmark.py
│   ├── thresholds.yaml
│   └── results/
│       └── report.md
├── prompts/
│   ├── system_prompt.md
│   ├── safeguards.md
│   ├── citation_rules.md
│   └── extraction_prompt.md
├── presentation/
│   ├── pitch_deck.pptx
│   ├── demo_script.md
│   └── video-demo.md
├── scripts/
│   ├── setup_hooks.sh
│   ├── seed_db.py
│   └── download_datasets.py
├── src/
│   ├── agents/
│   │   ├── graph.py
│   │   ├── state.py
│   │   ├── prompts.py
│   │   ├── nodes/
│   │   │   ├── sanitize_node.py
│   │   │   ├── disentangle_node.py
│   │   │   ├── extract_node.py
│   │   │   ├── match_node.py
│   │   │   ├── temporal_resolve_node.py
│   │   │   ├── uncertainty_node.py
│   │   │   ├── human_review_node.py
│   │   │   ├── persist_node.py
│   │   │   └── response_node.py
│   │   └── tools/
│   │       ├── search_task_tool.py
│   │       ├── create_task_tool.py
│   │       ├── update_task_tool.py
│   │       ├── link_evidence_tool.py
│   │       └── calendar_tool.py
│   ├── api/
│   │   ├── routes.py
│   │   ├── dependencies.py
│   │   └── middleware/
│   │       ├── acl_middleware.py
│   │       └── rate_limit_middleware.py
│   ├── models/
│   │   └── schemas.py
│   ├── services/
│   │   ├── acl_service.py
│   │   ├── audit_service.py
│   │   └── reminder_service.py
│   ├── db/
│   │   ├── models.py
│   │   ├── repository.py
│   │   └── neo4j_client.py
│   ├── config.py
│   └── main.py
├── tests/
│   ├── conftest.py
│   ├── test_api/
│   ├── test_agent/
│   ├── test_routing.py
│   └── test_eval.py
├── docker-compose.yml
├── Dockerfile
├── README.md
├── README_boilerplate.md
├── PROJECT_CONTEXT.md
├── JOURNAL.md
├── WORKLOG.md
├── SECURITY.md
├── .env.example
├── requirements.txt
├── ruff.toml
├── pytest.ini
└── Makefile
```

## 2. AI Usage Logging Setup

### Cài đặt hook

```bash
bash scripts/setup_hooks.sh
```

### Cơ chế

- 6 công cụ: Claude Code, Cursor, Codex CLI, Gemini CLI, GitHub Copilot, Antigravity.
- Log vào `.ai-log/session.jsonl`.
- Pre-push hook gửi lên grading server qua `AI_LOG_API_KEY`.
- `git push` không bao giờ bị chặn vì lỗi log.

## 3. Environment Variables

`.env.example`:

```bash
OPENAI_API_KEY=sk-...
AI_LOG_API_KEY=<phoenix-dashboard-key>
DATABASE_URL=postgresql://user:pass@localhost:5432/chat22
REDIS_URL=redis://localhost:6379
NEO4J_URI=bolt://localhost:7687
LANGFUSE_PUBLIC_KEY=...
LANGFUSE_SECRET_KEY=...
```

## 4. Makefile

```makefile
run:
	uvicorn src.main:app --reload --port 8000

test:
	pytest tests/ -v

lint:
	ruff check src tests

eval:
	python eval/run_eval.py

hooks:
	bash scripts/setup_hooks.sh

seed:
	python scripts/seed_db.py

download-data:
	python scripts/download_datasets.py
```

## 5. PROJECT_CONTEXT.md

```markdown
# PROJECT_CONTEXT.md (C5)

## 0. Quick Rehydrate
- **Project**: TaskMind — AI quản lý công việc và cam kết từ chat.
- **Stack**: Python 3.11 / FastAPI / LangGraph / LangChain / React.
- **Dev**: `uvicorn src.main:app --reload` (backend), `npm run dev` (frontend).
- **Test**: `make test`. **Eval**: `python eval/run_eval.py`.
- **Env**: copy `.env.example` → `.env`, thêm `OPENAI_API_KEY`.

## 0.1 Current Invariants
- **Source of truth kỹ thuật**: code trong `src/`. File `.md` chỉ tóm tắt — khi mâu thuẫn, **CODE WINS**.
- **Agent flow**: `src/agents/graph.py` (sanitize → disentangle → extract → match → temporal → uncertainty → HITL → persist → respond).
- **Prompts**: `prompts/*.md` (external, `{{placeholder}}`).
- **Safety**: guardrail 2 lớp ở `src/agents/nodes/sanitize_node.py`.

## 0.2 Known Ambiguities
- [team điền khi phát hiện mismatch]

## 1. Quyết định kỹ thuật
Xem `WORKLOG.md` mục ADR. Mỗi quyết định lớn ghi theo format:
`[ADR-XXX] Context / Options / Decision / Consequences`.

## 2. Cập nhật file này
Khi đổi stack/invariant → UPDATE FILE NÀY TRƯỚC, rồi mới sửa code.
```

## 6. ADRs

### ADR-001: Chọn LangGraph
- **Context**: Cần state machine với loop, conditional edges, interrupt HITL, persist state.
- **Options**: LangChain LCEL (chain tuyến tính), LangGraph (state machine).
- **Decision**: LangGraph.
- **Consequences**: Phức tạp hơn chain nhưng hỗ trợ HITL và temporal reasoning.

### ADR-002: SQLite dev, PostgreSQL prod
- **Context**: Cần lưu chat history, tasks, state history.
- **Options**: SQLite cả dev/prod, PostgreSQL cả hai, hybrid.
- **Decision**: SQLite dev, PostgreSQL prod.
- **Consequences**: Dễ setup local, dễ scale production.

### ADR-003: OpenAI Structured Outputs
- **Context**: Cần output đúng schema để lưu DB.
- **Options**: Regex, function calling, structured outputs.
- **Decision**: Structured outputs (Pydantic schema).
- **Consequences**: Ổn định hơn, dễ validate.

### ADR-004: HITL low-confidence gate
- **Context**: Không muốn auto-create sai task.
- **Options**: Auto-create tất cả, HITL tất cả, HITL khi confidence thấp.
- **Decision**: HITL khi confidence < threshold.
- **Consequences**: Cân bằng automation và accuracy.

### ADR-005: ACL tại repository layer
- **Context**: Yêu cầu kiểm tra quyền ngay tầng truy xuất.
- **Options**: ACL ở API layer, service layer, repository layer.
- **Decision**: Repository layer.
- **Consequences**: Khó quên kiểm tra quyền, dễ audit.

## 7. 10 Deliverables

| # | Deliverable | Vị trí |
|---|---|---|
| 1 | Source Code | `src/` |
| 2 | README.md | `README.md` |
| 3 | Architecture Diagram | `docs/architecture_diagram.md` |
| 4 | AI Logs | `.ai-log/` + Langfuse |
| 5 | Live URL | Render backend + Vercel frontend |
| 6 | Video Demo | `presentation/video-demo.md` |
| 7 | Pitch Deck | `presentation/pitch_deck.pptx` |
| 8 | Development Journal | `JOURNAL.md` |
| 9 | Worklog | `WORKLOG.md` |
| 10 | Evaluation Evidence | `eval/results/report.md` |

## 8. Mapping 6 tiêu chí Demo Day

| Tiêu chí | Cách đạt điểm cao |
|---|---|
| 1. Hoàn thiện sản phẩm | Happy path + 8 edge cases có test, demo account seed sẵn |
| 2. Kỹ thuật AI | LangGraph conditional edges, HITL interrupt, guardrail 2 lớp |
| 3. Đánh giá hiệu quả | Golden dataset 45+ case, pass@k/pass^k, LLM-judge, user feedback ≥5 |
| 4. UX/UI | Next.js responsive + dark mode, loading/error states |
| 5. Ý tưởng & ứng dụng | Phỏng vấn 5 user thật, competitor analysis |
| 6. Thuyết trình | Pitch deck 10 slide, video demo 3-5 phút, backup 3 tầng |

## 9. Lộ trình 5 tuần

| Tuần | Mục tiêu | Output |
|---|---|---|
| **1** | Setup + Data + Extraction MVP | Repo chạy `/health`, download datasets, API `/chat/ingest` trả draft task |
| **2** | HITL + Temporal tracking | Confirm/edit/reject, state history, detect update/completion |
| **3** | Thread disentanglement + UI | Cluster threads, task inbox, dashboard cơ bản |
| **4** | Eval + ACL + Polish | Golden dataset ≥45 case, pass@k/pass^k, ACL, audit log |
| **5** | Video + Pitch + Demo Day | Video 3-5 phút, pitch deck, seed showcase data |
