# core/rag_engine.py
import os
import chromadb
from google import genai
from dotenv import load_dotenv

# Tải biến môi trường (API Key)
load_dotenv()

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CHROMA_DB_DIR = os.path.join(BASE_DIR, 'data', 'chroma_db')

def tra_cuu_noi_quy_truong(cau_hoi: str) -> str:
    """
    Công cụ dùng để tra cứu thông tin về nội quy nhà trường, quy chế kỷ luật, 
    thời gian biểu, quy định đồng phục hoặc các hướng dẫn chung.
    """
    try:
        client_gemini = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))
        client_chroma = chromadb.PersistentClient(path=CHROMA_DB_DIR)
        
        # Nhúng câu hỏi của phụ huynh
        response = client_gemini.models.embed_content(
            model='gemini-embedding-001',
            contents=cau_hoi
        )
        query_embedding = response.embeddings[0].values
        
        # Tìm các đoạn văn bản (chunks) giống nhất trong database
        collection = client_chroma.get_collection("epms_knowledge")
        results = collection.query(
            query_embeddings=[query_embedding],
            n_results=3 # Thay đổi: Lấy ra 3 đoạn chunk sát nghĩa nhất thay vì 1
        )
        
        if results and results['documents'] and results['documents'][0]:
            # Thay đổi: Gộp 3 đoạn chunk lại với nhau, phân cách bằng dấu gạch ngang
            tai_lieu_gop = "\n---\n".join(results['documents'][0])
            return f"Tài liệu tham khảo từ nhà trường:\n{tai_lieu_gop}"
            
        return "Dạ, hiện tại không có quy định nào liên quan đến vấn đề này trong sổ tay nội quy."
        
    except Exception as e:
        return f"Lỗi truy xuất hệ thống tài liệu: {str(e)}"