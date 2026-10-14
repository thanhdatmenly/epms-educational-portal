import os
import django

# 1. Thiết lập môi trường để Script này kết nối được với Django và MariaDB
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "ePMS_Project.settings")
django.setup()

# 2. Gọi các bảng dữ liệu từ models vào
from core.models import TaiKhoan, GiaoVien, LopHoc, HocSinh, PhuHuynh, PhuHuynhHocSinh


def bom_du_lieu():
    print("🧹 Lớp móng đã sạch! Đang dọn dẹp dữ liệu cũ...")
    # Xóa sạch tài khoản cũ để không bị trùng lặp khi chạy lại nhiều lần
    TaiKhoan.objects.all().delete()
    LopHoc.objects.all().delete()

    print("👑 Đang tạo tài khoản Admin (Quản trị viên)...")
    TaiKhoan.objects.create_superuser(username="admin", password="123", vai_tro="admin")

    print("👩‍🏫 Đang gieo dữ liệu Giáo viên...")
    gv_tk = TaiKhoan.objects.create_user(username="gv01", password="123", vai_tro="gv")
    gv = GiaoVien.objects.create(
        tai_khoan=gv_tk, ho_ten="Nguyễn Thị Lan", email="lan.nt@truong.edu.vn"
    )

    print("🏫 Đang tạo Lớp học và phân công Giáo viên chủ nhiệm...")
    lop_11a3 = LopHoc.objects.create(
        ten_lop="11A3", khoi=11, nam_hoc="2024-2025", giao_vien_cn=gv
    )

    print("👨‍💼 Đang gieo dữ liệu Phụ huynh...")
    ph_tk = TaiKhoan.objects.create_user(
        username="0987654321", password="123", vai_tro="ph"
    )
    ph = PhuHuynh.objects.create(
        tai_khoan=ph_tk, ho_ten="Nguyễn Văn Bình", so_dien_thoai="0987654321"
    )

    print("👦 Đang gieo dữ liệu Học sinh vào đúng lớp 11A3...")
    hs_tk = TaiKhoan.objects.create_user(
        username="HS2024001", password="123", vai_tro="hs"
    )
    hs = HocSinh.objects.create(
        tai_khoan=hs_tk,
        lop_hoc=lop_11a3,
        ho_ten="Nguyễn Văn An",
        ma_hoc_sinh="HS2024001",
    )

    print("🔗 Đang thiết lập mối quan hệ liên lạc giữa Cha và Con...")
    PhuHuynhHocSinh.objects.create(
        phu_huynh=ph, hoc_sinh=hs, la_lien_lac_chinh=True, quan_he="Cha"
    )

    print("\n🎉 BƠM DỮ LIỆU MẪU XONG RỒI BA! CÁC TÀI KHOẢN ĐÃ SẴN SÀNG:")
    print("=" * 60)
    print("🔑 MẬT KHẨU ĐĂNG NHẬP CHUNG LÀ: 123")
    print("=" * 60)
    print("👉 Tab Học sinh  -> Tài khoản: HS2024001")
    print("👉 Tab Phụ huynh -> Tài khoản: 0987654321")
    print("👉 Tab Giáo viên -> Tài khoản: gv01")
    print("👉 Link ẩn Admin -> Tài khoản: admin")
    print("=" * 60)


if __name__ == "__main__":
    bom_du_lieu()
