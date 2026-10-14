"""
URL configuration for ePMS_Project project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""

from django.contrib import admin
from django.urls import path
from core import views  # Nhập các hàm từ file views của bạn
from django.conf import settings             # Bác thêm dòng này
from django.conf.urls.static import static   # Bác thêm dòng này
urlpatterns = [
    # TRANG CHỦ MẶC ĐỊNH LÀ ĐĂNG NHẬP
    path("", views.login_view, name="login"),
    # 1. Trang quản trị ngầm (Database) của Django
    path("admin-django/", admin.site.urls),
    # 2. GIAO DIỆN ADMIN (DO BẠN THIẾT KẾ)
    path("quan-tri/", views.admin_dashboard, name="admin_dashboard"),
    # 3. GIAO DIỆN GIÁO VIÊN (DÒNG BẠN BỊ THIẾU ĐÂY NÈ)
    path("giao-vien/", views.teacher_dashboard, name="teacher_dashboard"),
    # 4.GIAO DIỆN HỌC SINH
    path("hoc-sinh/", views.student_dashboard, name="student_dashboard"),
    # THÊM MỚI: Đường dẫn cho Phụ huynh
    path("phu-huynh/", views.parent_dashboard, name="parent_dashboard"),
    #thêm giao viên
    path('admin-panel/them-gv/', views.them_giao_vien, name='them_giao_vien'),
    #thêm năm học và lớp
    path('admin-panel/them-lop/', views.them_lop_hoc, name='them_lop_hoc'),
    #Thêm học sinh
    path('admin-panel/them-hs/', views.them_hoc_sinh, name='them_hoc_sinh'),
    #Thêm phụ huynh
    path('admin-panel/them-ph/', views.them_phu_huynh, name='them_phu_huynh'),
    #Thêm học kỳ 
    path('quan-tri/them-hoc-ky/', views.them_hoc_ky, name='them_hoc_ky'),
    #thêm môn học
    path('quan-tri/them-mon-hoc/', views.them_mon_hoc, name='them_mon_hoc'),
    #phân công chủ nhiệm
    path('quan-tri/phan-cong-cn/', views.phan_cong_chu_nhiem, name='phan_cong_chu_nhiem'),
    #sửa học kỳ
    path('quan-tri/sua-hoc-ky/', views.sua_hoc_ky, name='sua_hoc_ky'),
    #sửa lớp học
    path('quan-tri/sua-lop-hoc/', views.sua_lop_hoc, name='sua_lop_hoc'),
    #sửa môn học    
    path('quan-tri/sua-mon-hoc/', views.sua_mon_hoc, name='sua_mon_hoc'),
    #sửa giáo viên
    path('quan-tri/sua-gv/', views.sua_giao_vien, name='sua_giao_vien'),
    #reset mật khẩu
    path('quan-tri/reset-mk-gv/', views.reset_mk_giao_vien, name='reset_mk_giao_vien'),
    #khóa tài khoản giảo viên
    path('quan-tri/khoa-gv/', views.khoa_giao_vien, name='khoa_giao_vien'),
    #sửa học sinh
    path('quan-tri/sua-hs/', views.sua_hoc_sinh, name='sua_hoc_sinh'),
    #reset mật khẩu
    path('quan-tri/reset-mk-hs/', views.reset_mk_hoc_sinh, name='reset_mk_hoc_sinh'),
    #khóa mật khẩu
    path('quan-tri/khoa-hs/', views.khoa_hoc_sinh, name='khoa_hoc_sinh'),
    #sửa phụ huynh
    path('quan-tri/sua-ph/', views.sua_phu_huynh, name='sua_phu_huynh'),
    path('admin/reset-mk-ph/', views.reset_mk_phu_huynh, name='reset_mk_phu_huynh'),
    path('admin/khoa-ph/', views.khoa_phu_huynh, name='khoa_phu_huynh'),
    # Import Lớp học
    path('quan-tri/import-lop/', views.import_lop_hoc, name='import_lop_hoc'),
    # Import Giáo viên
    path('quan-tri/import-gv/', views.import_gv_excel, name='import_gv_excel'),
    # Import học sinh
    path('quan-tri/import-hs/', views.import_hs_excel, name='import_hs_excel'),
    ## Import phụ huynh
    path('quan-tri/import-ph/', views.import_ph_excel, name='import_ph_excel'),
    # THÊM DÒNG NÀY VÀO CUỐI:
    path('dang-xuat/', views.dang_xuat, name='dang_xuat'),

    path('giao-vien/duyet-don/', views.duyet_don_nghi_phep, name='duyet_don_nghi_phep'),

    # THÊM DÒNG NÀY ĐỂ MỞ ĐƯỜNG CHO AJAX CHẠY VÀO
    path('giao-vien/luu-diem-danh/', views.luu_diem_danh, name='luu_diem_danh'),

    # THÊM 2 DÒNG MỚI NÀY VÀO TRƯỚC DẤU ] ĐÓNG:
    path('giao-vien/api-lich-su-diem-danh/', views.api_lich_su_diem_danh, name='api_lich_su'),
    path('giao-vien/api-tong-ket-diem-danh/', views.api_tong_ket_diem_danh, name='api_tong_ket'),
    #thêm môn học
    path('quan-tri/them-mon-hoc/', views.them_mon_hoc, name='them_mon_hoc'),
    
    # THÊM DÒNG NÀY VÀO ĐỂ NHẬN DỮ LIỆU TẠO TỔ HỢP:
    path('quan-tri/them-to-hop/', views.them_to_hop, name='them_to_hop'),
    #sửa môn học    
    path('quan-tri/sua-mon-hoc/', views.sua_mon_hoc, name='sua_mon_hoc'),
    # Xóa môn học (THÊM DÒNG NÀY VÀO)
    path('quan-tri/xoa-mon-hoc/', views.xoa_mon_hoc, name='xoa_mon_hoc'),
    path('quan-tri/xoa-hoc-ky/', views.xoa_hoc_ky, name='xoa_hoc_ky'),
    path('giao-vien/import-diem/', views.import_diem_excel, name='import_diem_excel'),
    path('giao-vien/api-lay-diem/', views.api_lay_diem_lop, name='api_lay_diem_lop'),
    path('giao-vien/api-luu-diem-thu-cong/', views.api_luu_diem_thu_cong, name='api_luu_diem_thu_cong'),
    path('giao-vien/api-thong-tin-ph/', views.api_thong_tin_ph, name='api_thong_tin_ph'),
    path('giao-vien/gui-thong-bao/', views.gui_thong_bao_lop, name='gui_thong_bao_lop'),
# CHỈ DÁN ĐÚNG 1 DÒNG NÀY VÀO THÔI NHÉ BÁC:
    path('api/nop-don-xin-nghi/', views.api_nop_don_xin_nghi, name='api_nop_don'),
    path('api/duyet-don-nghi-phep/', views.duyet_don_nghi_phep, name='duyet_don_nghi_phep'),
    path('api/lay-tin-nhan/', views.api_lay_tin_nhan, name='api_lay_tin_nhan'),
    path('api/gui-tin-nhan/', views.api_gui_tin_nhan, name='api_gui_tin_nhan'),
    path('giao-vien/xuat-file-mau/', views.xuat_file_mau_excel, name='xuat_file_mau_excel'),
    path('admin/xuat-file-mau-gv/', views.xuat_file_mau_gv, name='xuat_file_mau_gv'),
    path('admin/xuat-file-mau-hs/', views.xuat_file_mau_hs, name='xuat_file_mau_hs'),
    path('admin/xuat-file-mau-ph/', views.xuat_file_mau_ph, name='xuat_file_mau_ph'),
]
# THÊM ĐOẠN NÀY XUỐNG DƯỚI CÙNG
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)