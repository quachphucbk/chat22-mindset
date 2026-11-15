# GITHUB REPO & AI LOG SETUP

**Dự án:** CHAT-22 — AI quản lý công việc và cam kết từ hội thoại  
**Ngày báo cáo:** 15/11/2026  
**Trạng thái:** Hoàn thành thiết lập local; còn bước xác minh trên GitHub và Phoenix.

## 1. Thông tin repository

- **Repository:** [AI20K-Build-Phase-Cohort-5/P-139](https://github.com/AI20K-Build-Phase-Cohort-5/P-139)
- **Nhánh:** `main`, theo dõi `origin/main`.
- **Thư mục local:** `C:\Users\Admin\Desktop\lab\P-139`.
- Giữ nguyên code và cấu trúc template VinUni.
- Chưa commit hoặc push các thay đổi setup.
- **Chưa xác minh P-139 là repo được cấp cho CHAT-22 trên Phoenix.**

## 2. Kết quả thiết lập

| Hạng mục | Kết quả |
|---|---|
| Môi trường Python | `.venv` riêng, Python 3.11.9 |
| Dependencies | Đã cài theo `requirements.txt`, gồm FastAPI, Uvicorn, LangGraph |
| Kiểm thử | **55/55 test đạt**, Ruff đạt, không phát hiện xung đột dependencies |
| Server | `/health` và `/docs` trả HTTP 200 |
| CI | Có sẵn GitHub Actions chạy Python 3.11, Ruff và pytest |
| AI Log hooks | Có cấu hình Codex và Git pre-push hook |
| Ghi log local | Đã ghi và kiểm tra bản ghi JSON gắn với repo P-139, nhánh main |
| Bảo vệ dữ liệu | `.env` và nội dung log local được Git bỏ qua |

## 3. Các file thay đổi

| File | Nội dung |
|---|---|
| `.gitignore` | Bổ sung bỏ qua cache pytest |
| `scripts/_pyrun.cmd` | Ưu tiên `.venv` và UTF-8 trên Windows |
| `scripts/_pyrun.sh` | Ưu tiên `.venv` và UTF-8 khi chạy qua Bash |
| `scripts/run_local.ps1` | Thêm lệnh chạy server đúng thư mục và môi trường |
| `docs/LOCAL_SETUP_REPORT.md` | Ghi kết quả kiểm tra môi trường |
| `docs/GITHUB_AI_LOG_SETUP.md` | Hướng dẫn sử dụng và xác minh AI Log |

**Lưu ý:** CI và cấu hình hook đã có từ template; phần setup này kiểm tra và cải thiện bộ chạy hook.

## 4. Cơ chế AI Log

```text
Sử dụng AI → Ghi log local → Pre-push hook gửi log → Phoenix tiếp nhận
```

Có thể ghi log thủ công khi công cụ không tự kích hoạt hook. Nội dung ghi nhận gồm công cụ AI, yêu cầu, kết quả và thông tin repo/nhánh.

**Đã kiểm chứng:** ghi log local thành công.  
**Chưa kiểm chứng:** desktop tự kích hoạt hook và Phoenix nhận log. `AI_LOG_API_KEY` hiện chưa có giá trị hợp lệ.

## 5. Công việc và bằng chứng còn thiếu

| Việc cần hoàn tất | Bằng chứng cần bổ sung |
|---|---|
| Xác nhận repo đúng đội CHAT-22 | Thông tin repo trên trang đội Phoenix |
| Cấu hình khóa Phoenix cá nhân và gửi log | Ảnh dashboard Phoenix nhận log |
| Kiểm chứng hook tự ghi log | Bản ghi phát sinh từ một phiên sử dụng thực tế |
| Commit/push sau khi xác nhận repo và nhánh | Link commit setup |
| Kiểm chứng CI trên GitHub | Link hoặc ảnh GitHub Actions thành công |

Không đưa API key, file `.env` hoặc nội dung nhạy cảm vào bằng chứng bàn giao.