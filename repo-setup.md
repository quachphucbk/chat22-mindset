# Repository, local setup và AI Log — CHAT-22

> Cập nhật: 15/11/2026. Hiện trạng theo mã nguồn local và các lệnh đã chạy trong [báo cáo review](review-commitchat-ai.md).

## 1. Phân biệt các thư mục

| Thư mục | Vai trò |
|---|---|
| `P-139/` | Nguồn docs/khung tham chiếu. Repo được tài liệu cũ nhắc tới: [P-139](https://github.com/AI20K-Build-Phase-Cohort-5/P-139); chưa xác minh quyền sở hữu hoặc ánh xạ đội trên Phoenix. |
| `commitchat-ai/` | Project triển khai cơ bản được review. Chưa cấu hình remote trong Git local tại thời điểm kiểm tra; nhiều file đang staged, `PROJECT_CONTEXT.md` còn có thay đổi unstaged. |
| `chat22-mindset/` | Bộ tài liệu sản phẩm và prototype. Remote local: [chat22-mindset](https://github.com/quachphucbk/chat22-mindset). |

Các thư mục trên nằm dưới `/Users/phucqn/Documents/Default Project/` trên máy được review. Báo cáo Windows trước đây không đại diện môi trường hiện tại. Không coi trạng thái staged là bằng chứng đã commit/push.

## 2. Kết quả đã kiểm chứng

- commitchat-ai: **55/55 backend test pass**, Ruff pass qua môi trường Python 3.12 có sẵn tại `P-139/.venv`.
- Frontend: `npm run lint` fail với 1 error và 1 warning; chưa xác minh build.
- Scheduler: lệnh Compose `python -m src.scheduler` fail do thiếu `__main__.py`.
- chat22-mindset: **48/48** kiểm tra prototype pass qua Node.js; chưa xác minh trình duyệt thật.
- Chưa chạy HTTP server, Docker full stack, GitHub Actions hoặc gửi log Phoenix trong đợt review này.

Chi tiết lệnh, lỗi và giới hạn: [review kỹ thuật](review-commitchat-ai.md).

## 3. Hướng dẫn dựng môi trường riêng

Các lệnh sau là hướng dẫn cần kiểm chứng trên môi trường mới; không phải nhật ký đã cài thành công.

```sh
cd "/Users/phucqn/Documents/Default Project/commitchat-ai"
python3 -m venv .venv
source .venv/bin/activate
python -m pip install -r requirements.txt
cp .env.example .env
python -m uvicorn src.main:app --reload --port 8000
```

Ở terminal khác:

```sh
cd "/Users/phucqn/Documents/Default Project/commitchat-ai/frontend"
npm ci
npm run dev
```

- Backend: [health](http://localhost:8000/health), [OpenAPI](http://localhost:8000/docs).
- Frontend: [trang chủ](http://localhost:3000), `/login`, `/chat`, `/tasks`.
- API hiện có: `POST /api/v1/chat`, `POST /api/v1/chat/resume`, `GET /api/v1/status`, `GET /health`.
- Login/chat/inbox trên frontend còn dùng placeholder; các API domain trong PRD là đích phát triển.
- Không có API key thì eval mẫu có offline stub riêng; điều đó không bảo đảm route `/chat` dùng LLM thật chạy được khi thiếu key.

## 4. Kiểm tra trước bàn giao

```sh
# Từ root commitchat-ai, sau khi activate .venv
APP_ENV=test OPENAI_API_KEY=test-key python -m pytest tests -q
python -m ruff check src/ tests/
# Frontend
cd frontend
npm run lint
npm run build
```

`docker compose up -d --build` là hướng dẫn triển khai dự kiến. Trước khi dùng cần sửa scheduler entrypoint (ví dụ `python -m src.scheduler.main`), hiện thực nghiệp vụ scheduler và xác minh health các service. PostgreSQL/Neo4j/Redis có trong Compose nhưng backend chưa có repository nghiệp vụ nối tới chúng. Không ghi “full stack hoạt động” chỉ vì có file Compose.

## 5. AI Log và CI

Repo có cấu hình hook cho nhiều công cụ và các script setup. Khi cần thiết lập lần đầu, dùng hướng dẫn trong repo:

```sh
bash scripts/setup_hooks.sh
```

Luồng dự kiến: **công cụ kích hoạt hook → ghi log local → pre-push submit → Phoenix tiếp nhận**. Có file cấu hình không chứng minh runtime đã tự gọi hook hoặc Phoenix đã nhận log. Đợt review này không cài hook, ghi log thủ công hoặc gửi dữ liệu.

CI trong `.github/workflows/ci.yml` hiện chạy Python 3.11, Ruff và pytest. Chưa có job lint/build frontend; chưa kiểm chứng lượt chạy GitHub Actions của project này.

## 6. Bằng chứng còn thiếu

| Hạng mục | Bằng chứng cần bổ sung |
|---|---|
| Repo được cấp cho đội CHAT-22 | Ánh xạ đội/repo trên Phoenix |
| Cài mới và chạy server | Phiên bản môi trường, kết quả health/OpenAPI |
| Frontend và Docker | Lint/build pass, health service, luồng nghiệp vụ hoạt động |
| AI Log tự động | Bản ghi từ phiên thực tế và xác nhận Phoenix tiếp nhận |
| Commit/push và CI | Link commit cùng lượt GitHub Actions tương ứng |
| Eval CHAT-22 | Dataset/version, lệnh scorer và report P/R/F1 |

Chỉ cập nhật trạng thái “đã hoàn thành” khi có kết quả tương ứng. API key cấu hình local theo `.env.example`; không đưa giá trị key vào tài liệu bàn giao.
