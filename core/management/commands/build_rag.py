# core/management/commands/build_rag.py
import os
import chromadb
from django.core.management.base import BaseCommand
from google import genai
from dotenv import load_dotenv

load_dotenv()

# ================= HÀM CHUNKING =================
def chunk_text(text, max_length=800):
    """
    Băm nhỏ văn bản theo đoạn văn (\n\n). 
    Gộp các đoạn lại sao cho mỗi Chunk không vượt quá max_length ký tự.
    """
    paragraphs = text.split('\n\n')
    chunks = []
    current_chunk = ""

    for p in paragraphs:
        # Nếu cộng thêm đoạn mới mà vượt quá giới hạn, thì chốt chunk hiện tại
        if len(current_chunk) + len(p) > max_length and current_chunk:
            chunks.append(current_chunk.strip())
            current_chunk = p
        else:
            current_chunk += "\n\n" + p if current_chunk else p

    # Đẩy chunk cuối cùng vào mảng
    if current_chunk:
        chunks.append(current_chunk.strip())
        
    return chunks
# ================================================

class Command(BaseCommand):
    help = 'Nạp và Chunking dữ liệu từ data/ vào ChromaDB'

    def handle(self, *args, **kwargs):
        BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
        DATA_DIR = os.path.join(BASE_DIR, 'data')
        CHROMA_DB_DIR = os.path.join(DATA_DIR, 'chroma_db')

        if not os.path.exists(DATA_DIR):
            self.stdout.write(self.style.ERROR(f'Lỗi: Không tìm thấy thư mục {DATA_DIR}'))
            return

        documents = []
        ids = []
        
        # 1. Đọc và băm nhỏ (Chunking) tài liệu
        for filename in os.listdir(DATA_DIR):
            if filename.endswith(".txt"):
                with open(os.path.join(DATA_DIR, filename), 'r', encoding='utf-8') as f:
                    content = f.read().strip()
                    if content:
                        # Gọi hàm băm nhỏ văn bản
                        file_chunks = chunk_text(content)
                        for i, chunk in enumerate(file_chunks):
                            documents.append(chunk)
                            ids.append(f"{filename}_chunk_{i+1}") # VD: noi_quy_nha_truong.txt_chunk_1

        if not documents:
            self.stdout.write(self.style.WARNING('Thư mục data trống, không có gì để nạp.'))
            return

        # 2. Nhúng bằng Gemini
        self.stdout.write(f"Đã băm nhỏ thành {len(documents)} chunks. Đang nhúng bằng Gemini...")
        client_gemini = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))
        
        response = client_gemini.models.embed_content(
            model='gemini-embedding-001',
            contents=documents
        )
        embeddings = [e.values for e in response.embeddings]

        # 3. Lưu vào Vector DB
        self.stdout.write("Đang lưu vào ChromaDB...")
        client_chroma = chromadb.PersistentClient(path=CHROMA_DB_DIR)
        
        try:
            client_chroma.delete_collection("epms_knowledge")
        except:
            pass
        
        collection = client_chroma.create_collection("epms_knowledge")
        collection.add(
            embeddings=embeddings,
            documents=documents,
            ids=ids
        )
        
        self.stdout.write(self.style.SUCCESS(f'Thành công! Đã nạp {len(documents)} chunks vào ChromaDB.'))