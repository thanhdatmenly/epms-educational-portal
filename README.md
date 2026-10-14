# ePMS - Educational Portal & Messaging System with Agentic RAG

> **An AI-powered School-Parent Communication & Academic Portal built with Django, featuring a secure Gemini Agentic RAG assistant (ChromaDB & Automatic Function Calling) for real-time grade and attendance tracking.**

**ePMS (Educational Portal & Messaging System)** là nền tảng quản lý học vụ và giao tiếp đa chiều kết nối trực tiếp giữa **Nhà trường (Admin) - Giáo viên - Học sinh - Phụ huynh**. Điểm nhấn cốt lõi của hệ thống là việc tích hợp **Trợ lý ảo AI theo kiến trúc Agentic RAG**, kết hợp giữa truy xuất tri thức nội quy (Vector Database) và khả năng tự động gọi công cụ (Function Calling) truy vấn cơ sở dữ liệu thời gian thực với cơ chế bảo mật định danh tuyệt đối.

---

## Tính Năng Nổi Bật (Key Features)

### 1. Kiến trúc Trợ lý ảo Agentic RAG (AI Assistant)
* **Automatic Function Calling (`gemini-2.5-flash`):** AI tự động phân tích ngữ cảnh câu hỏi (bao gồm cả từ lóng như *"cúp học"*, *"trốn tiết"*) để chủ động lựa chọn và thực thi các hàm Python truy vấn điểm số hoặc điểm danh.
* **Semantic Search & Chunking (`ChromaDB` & `gemini-embedding-001`):** Văn bản nội quy và quy chế nhà trường được băm nhỏ theo đoạn (Paragraph Chunking) và nhúng vào cơ sở dữ liệu Vector, giúp AI trích xuất chính xác quy định mà không gặp hiện tượng ảo giác (Hallucination).
* **Zero-Hallucination Math:** Mọi phép tính điểm trung bình học kỳ và thống kê chuyên cần đều được xử lý hoàn toàn bằng Python tại tầng Backend trước khi trả kết quả về cho LLM tổng hợp phản hồi.
* **Bảo mật chống lỗ hổng IDOR (Factory Pattern):** Sử dụng lớp đóng gói `CongCuPhuHuynh` khóa chặt phiên truy vấn theo `request.user.phu_huynh`. AI hoàn toàn không nhận tham số ID học sinh từ phía người dùng, ngăn chặn tuyệt đối việc khai thác Prompt Injection để xem lén điểm của học sinh khác.
* **Bộ nhớ ngữ cảnh & Lối tắt tốc độ cao (Python Bypass):** Lưu trữ và làm sạch lịch sử hội thoại (loại bỏ thẻ HTML nhiễu), đồng thời tích hợp lối tắt phản hồi tức thì cho các tác vụ cố định nhằm tối ưu chi phí Token API.

### 2. Phân hệ Quản trị & Giáo vụ (Admin Portal)
* Quản lý toàn diện hồ sơ Giáo viên, Học sinh, Phụ huynh, Lớp học, Môn học, Tổ hợp môn và Học kỳ.
* Hỗ trợ **Import / Export hàng loạt qua Excel** (`pandas`, `openpyxl`) với định dạng biểu mẫu chuẩn tự động.
* Ràng buộc logic nghiệp vụ chặt chẽ (ví dụ: kiểm soát phân công 1 Giáo viên chủ nhiệm - 1 Lớp).
* Bảng điều khiển trực quan (Dashboard) thống kê tỷ lệ chuyên cần toàn trường theo ngày/tuần (Line Chart) và số lượng đơn từ chờ duyệt.

### 3. Phân hệ Giáo viên (Teacher Portal)
* **Quản lý Điểm số kép:** Nhập điểm trực tiếp trên giao diện hoặc đồng bộ từ file Excel. Hệ thống tự động tính điểm trung bình theo công thức chuẩn:
  $$\text{ĐTB}_{\text{HK}} = \frac{\sum \text{ĐTX} + 2 \times \text{ĐGK} + 3 \times \text{ĐCK}}{N_{\text{ĐTX}} + 5}$$
* **Điểm danh & Cảnh báo Tự động:** Ngay khi giáo viên lưu điểm danh có học sinh **Vắng không phép** hoặc cập nhật cột điểm mới, hệ thống tự động kích hoạt luồng tin nhắn cảnh báo riêng tư đến đúng hộp thư của Phụ huynh học sinh đó, đồng thời phát thông báo lên bảng tin lớp.
* **Phê duyệt Đơn xin nghỉ phép:** Xem chi tiết lý do, ảnh chụp minh chứng (giấy khám bệnh...) và thực hiện Duyệt / Từ chối đơn trực tuyến.

### 4. Phân hệ Phụ huynh & Học sinh (Parent & Student Portals)
* Theo dõi bảng điểm chi tiết từng học kỳ, điểm tổng kết cả năm, hạnh kiểm và biểu đồ chuyên cần trực quan.
* Đối chiếu lịch sử nghỉ học tự động đồng bộ trạng thái giữa bảng Điểm danh của giáo viên và Đơn xin phép của phụ huynh.
* Gửi đơn xin nghỉ học trực tuyến kèm hình ảnh minh chứng.
* Nhắn tin trực tiếp 1-1 với Giáo viên chủ nhiệm (có bộ đếm tin nhắn chưa đọc) hoặc trò chuyện 24/7 với Trợ lý AI nhà trường.

---

## Công Nghệ Sử Dụng (Tech Stack)

| Phân tầng | Công nghệ / Thư viện |
| :--- | :--- |
| **Backend Framework** | Python 3.10+, Django 4.x / 5.x |
| **LLM & Agent Engine** | Google GenAI SDK (`google-genai`), Model `gemini-2.5-flash` |
| **RAG & Vector DB** | `chromadb` (Persistent Client), Model `gemini-embedding-001` |
| **Xử lý Dữ liệu & Báo cáo** | `pandas`, `openpyxl` |
| **Cơ sở dữ liệu** | SQLite / MySQL / MariaDB |
| **Frontend** | HTML5, CSS3, JavaScript (Fetch API / AJAX), Chart.js |

---

## Cấu Trúc Thư Mục Dự Án (Project Structure)

```text
ePMS_Project/
├── core/
│   ├── management/
│   │   └── commands/
│   │       └── build_rag.py       # Script băm nhỏ văn bản (Chunking) và nạp Vector vào ChromaDB
│   ├── migrations/                # Lịch sử khởi tạo cấu trúc bảng CSDL
│   ├── static/                    # Tài nguyên tĩnh (CSS, JS, Hình ảnh cho từng phân hệ)
│   ├── templates/                 # Giao diện HTML (Admin, Teacher, Student, Parent, Login)
│   ├── admin.py                   # Cấu hình Django Admin
│   ├── models.py                  # Thiết kế CSDL (TaiKhoan, HocSinh, BangDiem, DiemDanh, HoiThoai...)
│   ├── rag_engine.py              # Động cơ truy xuất ngữ nghĩa nội quy từ ChromaDB
│   ├── tools.py                   # Bộ công cụ Python của AI Agent (Bảo mật IDOR, tính điểm, chuyên cần)
│   └── views.py                   # Bộ điều khiển trung tâm (Views, API AJAX & Agent Controller)
├── data/
│   ├── huong_dan_xin_nghi.txt     # Tài liệu gốc hướng dẫn quy trình cho RAG
│   └── noi_quy_nha_truong.txt     # Tài liệu gốc nội quy học sinh cho RAG
├── ePMS_Project/                  # Cấu hình lõi của dự án Django (settings.py, urls.py, wsgi.py)
├── .gitignore                     # Cấu hình loại trừ file nhạy cảm (.env, venv, chroma_db...)
├── manage.py                      # Công cụ dòng lệnh của Django
├── requirements.txt               # Danh sách các gói thư viện Python
└── seed.py                        # Kịch bản khởi tạo dữ liệu mẫu tự động
```

---

## Hướng Dẫn Cài Đặt & Khởi Chạy (Installation Guide)

### Bước 1: Clone mã nguồn và khởi tạo môi trường ảo
```bash
git clone <ĐƯỜNG_DẪN_REPO_CỦA_BẠN>
cd <TÊN_THƯ_MỤC_DỰ_ÁN>

# Tạo môi trường ảo
python -m venv venv

# Kích hoạt môi trường ảo (Windows PowerShell)
.\venv\Scripts\activate
```

### Bước 2: Cài đặt các thư viện phụ thuộc
```bash
python -m pip install -r requirements.txt
```

### Bước 3: Cấu hình biến môi trường (`.env`)
Tạo một file có tên `.env` nằm ngay tại thư mục gốc của dự án (ngang hàng với file `manage.py`) và điền khóa API Google Gemini của bạn vào:
```env
GEMINI_API_KEY=AIzaSyYourActualGeminiApiKeyHere...
```

### Bước 4: Khởi tạo Cơ sở dữ liệu và Dữ liệu mẫu
```bash
python manage.py makemigrations
python manage.py migrate

# (Tùy chọn) Chạy script tạo dữ liệu mẫu nếu có
python seed.py
```

### Bước 5: Xây dựng Cơ sở dữ liệu Vector cho RAG (Bắt buộc)
Chạy lệnh tùy chỉnh dưới đây để hệ thống tự động đọc các file `.txt` trong thư mục `data/`, tiến hành Chunking và nạp Vector vào `data/chroma_db/`:
```bash
python manage.py build_rag
```
*(Khi màn hình hiện thông báo màu xanh lá `Thành công! Đã nạp X chunks vào ChromaDB.` là bộ não tri thức của AI đã sẵn sàng).*

### Bước 6: Khởi động máy chủ phát triển
```bash
python manage.py runserver
```
Truy cập hệ thống trên trình duyệt tại địa chỉ: `http://127.0.0.1:8000/`

---

## Kịch Bản Kiểm Thử Trợ Lý AI (AI Agent Testing)

Sau khi đăng nhập vào cổng **Phụ huynh**, bạn có thể mở khung chat với **Trợ lý AI** và thử nghiệm các nhóm câu hỏi sau:
1. **Kiểm thử RAG (Tra cứu nội quy):** *"Học sinh đi học nhuộm tóc hoặc mang dép lê thì bị xử lý thế nào?"*, *"Mấy giờ trường đánh trống vào lớp?"*
2. **Kiểm thử Tool Điểm số & Chống IDOR:** *"Cho tôi xem điểm môn Toán của con"*, *"Điểm tất cả các môn của cháu thế nào?"*
3. **Kiểm thử Tool Chuyên cần & Hiểu từ lóng:** *"Hôm nay bé nhà tôi có đi học đầy đủ không?"*, *"Tuần trước cháu có trốn tiết hay cúp học buổi nào không?"*
4. **Kiểm thử Trí nhớ ngữ cảnh (Multi-turn Conversation):** Hỏi *"Điểm môn Toán của con là bao nhiêu?"*, sau đó hỏi tiếp *"Thế còn môn Ngữ Văn thì sao?"* để kiểm tra khả năng nhớ chủ thể của Agent.