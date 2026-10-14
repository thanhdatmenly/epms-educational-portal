from django.db import models
from django.contrib.auth.models import AbstractUser

# ================= 1. BẢNG TÀI KHOẢN (Kế thừa User của Django) =================
class TaiKhoan(AbstractUser):
    VAI_TRO_CHOICES = (
        ('admin', 'Quản trị viên'),
        ('gv', 'Giáo viên'),
        ('hs', 'Học sinh'),
        ('ph', 'Phụ huynh'),
    )
    vai_tro = models.CharField(max_length=10, choices=VAI_TRO_CHOICES, default='hs')
    # Các trường username, password, is_active đã được AbstractUser hỗ trợ sẵn

# ================= 2. CÁC BẢNG NGƯỜI DÙNG =================
class GiaoVien(models.Model):
    tai_khoan = models.OneToOneField(TaiKhoan, on_delete=models.CASCADE, related_name='giao_vien')
    ho_ten = models.CharField(max_length=100)
    so_dien_thoai = models.CharField(max_length=15, blank=True, null=True)
    email = models.EmailField(blank=True, null=True)

    def __str__(self):
        return self.ho_ten

class LopHoc(models.Model):
    ten_lop = models.CharField(max_length=50)
    khoi = models.IntegerField()
    nam_hoc = models.CharField(max_length=20)
    giao_vien_cn = models.ForeignKey(GiaoVien, on_delete=models.SET_NULL, null=True, related_name='lop_chu_nhiem')
    
    # [NÂNG CẤP]: Gắn tổ hợp vào lớp học. Dùng chuỗi 'ToHop' để tránh lỗi vì bảng ToHop khai báo ở phần 3
    to_hop = models.ForeignKey('ToHop', on_delete=models.SET_NULL, null=True, blank=True)

    def __str__(self):
        # Hiển thị thêm tên ban để giáo viên dễ nhìn trên Admin
        return f"{self.ten_lop} ({self.to_hop.ten_to_hop if self.to_hop else 'Chưa phân ban'})"

class HocSinh(models.Model):
    tai_khoan = models.OneToOneField(TaiKhoan, on_delete=models.CASCADE, related_name='hoc_sinh')
    lop_hoc = models.ForeignKey(LopHoc, on_delete=models.SET_NULL, null=True, related_name='danh_sach_hs')
    ho_ten = models.CharField(max_length=100)
    ma_hoc_sinh = models.CharField(max_length=20, unique=True)
    ngay_sinh = models.DateField(blank=True, null=True)
    gioi_tinh = models.CharField(max_length=10, choices=[('Nam', 'Nam'), ('Nữ', 'Nữ')], null=True, blank=True)
    dia_chi = models.CharField(max_length=255, null=True, blank=True)
    def __str__(self):
        return f"{self.ma_hoc_sinh} - {self.ho_ten}"

class PhuHuynh(models.Model):
    tai_khoan = models.OneToOneField(TaiKhoan, on_delete=models.CASCADE, related_name='phu_huynh')
    ho_ten = models.CharField(max_length=100)
    so_dien_thoai = models.CharField(max_length=15, unique=True)

    def __str__(self):
        return self.ho_ten

class PhuHuynhHocSinh(models.Model):
    phu_huynh = models.ForeignKey(PhuHuynh, on_delete=models.CASCADE)
    hoc_sinh = models.ForeignKey(HocSinh, on_delete=models.CASCADE)
    la_lien_lac_chinh = models.BooleanField(default=True)
    quan_he = models.CharField(max_length=50) # Ví dụ: Cha, Mẹ, Ông, Bà...

# ================= 3. CÁC BẢNG NGHIỆP VỤ HỌC TẬP =================
class HocKy(models.Model):
    ten_nam_hoc = models.CharField(max_length=20)
    ky_hoc = models.CharField(max_length=10) # HK1, HK2
    ngay_bat_dau = models.DateField()
    ngay_ket_thuc = models.DateField()
    trang_thai = models.CharField(max_length=20, default='Dang_Hoc')

class MonHoc(models.Model):
    ma_mon_hoc = models.CharField(max_length=20, unique=True) # VD: TOAN, VAN, VATLY
    ten_mon_hoc = models.CharField(max_length=100)            # VD: Toán học, Vật lý
    loai_mon = models.CharField(max_length=50, default='Bắt buộc') # Bắt buộc / Lựa chọn
    so_tiet_ky = models.IntegerField(default=45)              # Số tiết / 1 học kỳ
    
    # [NÂNG CẤP]: Thêm trường phân nhóm môn học
    NHOM_CHOICES = (
        ('Chung', 'Môn Chung'),
        ('TuNhien', 'Tổ hợp Tự nhiên'),
        ('XaHoi', 'Tổ hợp Xã hội'),
    )
    nhom_mon = models.CharField(max_length=20, choices=NHOM_CHOICES, default='Chung')

    def __str__(self):
        return self.ten_mon_hoc

# [NÂNG CẤP]: BẢNG TỔ HỢP MỚI
class ToHop(models.Model):
    ten_to_hop = models.CharField(max_length=50) # VD: Tổ hợp Tự Nhiên, Tổ hợp Xã Hội
    # Dùng ManyToMany để kết nối 1 Tổ hợp với nhiều Môn học
    danh_sach_mon = models.ManyToManyField(MonHoc, related_name='thuoc_to_hop')

    def __str__(self):
        return self.ten_to_hop

class BangDiem(models.Model):
    hoc_sinh = models.ForeignKey(HocSinh, on_delete=models.CASCADE, related_name='diem_so')
    hoc_ky = models.ForeignKey(HocKy, on_delete=models.CASCADE)
    giao_vien_nhap = models.ForeignKey(GiaoVien, on_delete=models.SET_NULL, null=True)
    mon_hoc = models.ForeignKey(MonHoc, on_delete=models.CASCADE)
    diem_tx1 = models.FloatField(blank=True, null=True)
    diem_tx2 = models.FloatField(blank=True, null=True)
    diem_tx3 = models.FloatField(blank=True, null=True)
    diem_gk = models.FloatField(blank=True, null=True)
    diem_ck = models.FloatField(blank=True, null=True)
    diem_tb = models.FloatField(blank=True, null=True)
    # THÊM DÒNG NÀY ĐỂ LƯU HẠNH KIỂM:
    hanh_kiem = models.CharField(max_length=20, blank=True, null=True)

class DiemDanh(models.Model):
    hoc_sinh = models.ForeignKey(HocSinh, on_delete=models.CASCADE)
    giao_vien = models.ForeignKey(GiaoVien, on_delete=models.SET_NULL, null=True)
    ngay = models.DateField()
    buoi_hoc = models.CharField(max_length=20) # Sáng / Chiều
    trang_thai = models.CharField(max_length=20) # Co_mat, Vang_CP, Vang_KP

class XinNghiPhep(models.Model):
    hoc_sinh = models.ForeignKey(HocSinh, on_delete=models.CASCADE)
    phu_huynh = models.ForeignKey(PhuHuynh, on_delete=models.CASCADE)
    gv_duyet = models.ForeignKey(GiaoVien, on_delete=models.SET_NULL, null=True, blank=True)
    ngay_bat_dau = models.DateField()
    ngay_ket_thuc = models.DateField()
    ly_do = models.TextField()
    file_dinh_kem = models.FileField(upload_to='minh_chung_nghi/', blank=True, null=True)
    trang_thai = models.CharField(max_length=20, default='Cho_Duyet') # Cho_Duyet, Da_Duyet, Tu_Choi
    ly_do_tu_choi = models.TextField(blank=True, null=True)
    ngay_tao = models.DateTimeField(auto_now_add=True)
    minh_chung = models.ImageField(upload_to='don_xin_nghi/', null=True, blank=True)

# ================= 4. CÁC BẢNG LIÊN LẠC (MESSENGER) =================
class HoiThoai(models.Model):
    # CHỈ CHỈNH SỬA Ở ĐÂY: Thêm null=True, blank=True cho giao_vien
    giao_vien = models.ForeignKey(GiaoVien, on_delete=models.CASCADE, null=True, blank=True)
    phu_huynh = models.ForeignKey(PhuHuynh, on_delete=models.CASCADE)
    # THÊM MỚI: Cờ đánh dấu hộp thoại này là với Bot AI
    is_bot_chat = models.BooleanField(default=False) 
    thoi_gian_cuoi = models.DateTimeField(auto_now=True)

class TinNhan(models.Model):
    hoi_thoai = models.ForeignKey(HoiThoai, on_delete=models.CASCADE, related_name='tin_nhan')
    # CHỈ CHỈNH SỬA Ở ĐÂY: Thêm null=True, blank=True cho nguoi_gui
    nguoi_gui = models.ForeignKey(TaiKhoan, on_delete=models.CASCADE, null=True, blank=True) 
    # THÊM MỚI: Cờ đánh dấu tin nhắn do AI tự sinh ra
    is_bot = models.BooleanField(default=False) 
    noi_dung = models.TextField()
    da_doc = models.BooleanField(default=False)
    thoi_gian_gui = models.DateTimeField(auto_now_add=True)
# ================= 5. BẢNG THÔNG BÁO TỪ GIÁO VIÊN =================
class ThongBao(models.Model):
    giao_vien = models.ForeignKey(GiaoVien, on_delete=models.CASCADE)
    lop_hoc = models.ForeignKey(LopHoc, on_delete=models.CASCADE)
    tieu_de = models.CharField(max_length=200)
    noi_dung = models.TextField()
    loai_thong_bao = models.CharField(max_length=20, default='Thong_Thuong') # Quan_Trong hoặc Thong_Thuong
    ngay_gui = models.DateTimeField(auto_now_add=True)

# ================= 6. BẢNG TỔNG KẾT ĐIỂM (Lưu cứng ĐTB) =================
class TongKetMon(models.Model):
    hoc_sinh = models.ForeignKey(HocSinh, on_delete=models.CASCADE, related_name='tong_ket')
    mon_hoc = models.ForeignKey(MonHoc, on_delete=models.CASCADE)
    nam_hoc = models.CharField(max_length=20) # VD: 2024-2025
    
    # 3 CỘT ĐIỂM BÁC YÊU CẦU:
    dtb_hk1 = models.FloatField(blank=True, null=True)
    dtb_hk2 = models.FloatField(blank=True, null=True)
    dtb_ca_nam = models.FloatField(blank=True, null=True)
    
    class Meta:
        unique_together = ('hoc_sinh', 'mon_hoc', 'nam_hoc')

    def __str__(self):
        return f"[{self.lop_hoc.ten_lop}] {self.tieu_de}"