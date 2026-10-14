# core/tools.py
from datetime import datetime
from .models import PhuHuynhHocSinh, BangDiem, DiemDanh

class CongCuPhuHuynh:
    def __init__(self, phu_huynh):
        self.phu_huynh = phu_huynh
        # Lấy danh sách con hợp lệ của phụ huynh này để chống IDOR
        self.danh_sach_con = PhuHuynhHocSinh.objects.filter(phu_huynh=phu_huynh).select_related('hoc_sinh')
        self.so_luong_con = self.danh_sach_con.count()

    def _xac_dinh_hoc_sinh(self, ten_goi_nho=""):
        """Hàm nội bộ: Xác định chính xác học sinh đang được hỏi, khóa chặt theo phụ huynh."""
        if self.so_luong_con == 0:
            return None, "Lỗi: Tài khoản của Phụ huynh chưa được liên kết với học sinh nào trên hệ thống."
        
        if self.so_luong_con == 1:
            return self.danh_sach_con.first().hoc_sinh, None
        
        # Xử lý trường hợp phụ huynh có nhiều con học cùng trường
        if not ten_goi_nho:
            danh_sach_ten = ", ".join([phhs.hoc_sinh.ho_ten for phhs in self.danh_sach_con])
            return None, f"Dạ, Phụ huynh có {self.so_luong_con} bé đang theo học ({danh_sach_ten}). Phụ huynh muốn tra cứu thông tin cho bé nào ạ?"
        
        for phhs in self.danh_sach_con:
            # So sánh tên tương đối (VD: hỏi "Đạt" sẽ khớp "Phạm Thành Đạt")
            if ten_goi_nho.lower() in phhs.hoc_sinh.ho_ten.lower():
                return phhs.hoc_sinh, None
        
        return None, f"Dạ, hệ thống không tìm thấy bé nào tên '{ten_goi_nho}' trong danh sách con của Phụ huynh."

    def lay_diem_hoc_sinh(self, ten_goi_nho_hoc_sinh: str = "", ten_mon_hoc: str = "") -> str:
        """
        Công cụ tra cứu điểm số. Trả về điểm chi tiết và tự động tính điểm Trung bình theo Thông tư 22.
        """
        hs, error = self._xac_dinh_hoc_sinh(ten_goi_nho_hoc_sinh)
        if error: return error

        query = BangDiem.objects.filter(hoc_sinh=hs).select_related('mon_hoc', 'hoc_ky')
        if ten_mon_hoc:
            query = query.filter(mon_hoc__ten_mon_hoc__icontains=ten_mon_hoc)
        
        if not query.exists():
            if ten_mon_hoc:
                return f"Dạ, hiện tại chưa có dữ liệu điểm môn {ten_mon_hoc} của bé {hs.ho_ten}."
            return f"Dạ, hiện tại hệ thống chưa ghi nhận bảng điểm của bé {hs.ho_ten}."

        gom_diem = {}
        for d in query:
            ten_mon = d.mon_hoc.ten_mon_hoc
            # Xác định học kỳ dựa trên tên kỳ học (VD: "Học kỳ 1", "HK1")
            ky_so = 1 if '1' in str(d.hoc_ky.ky_hoc) else 2 
            
            if ten_mon not in gom_diem:
                gom_diem[ten_mon] = {'hk1_tx': [], 'hk1_gk': None, 'hk1_ck': None, 'dtb1': None,
                                     'hk2_tx': [], 'hk2_gk': None, 'hk2_ck': None, 'dtb2': None}
            
            # Gom điểm thường xuyên
            tx_list = [x for x in [d.diem_tx1, d.diem_tx2, d.diem_tx3] if x is not None]
            
            # Tính ĐTB Môn theo đúng công thức TT22: (Tổng TX + GK*2 + CK*3) / (Số cột TX + 5)
            dtb = None
            if d.diem_gk is not None and d.diem_ck is not None:
                tong = sum(tx_list) + (d.diem_gk * 2) + (d.diem_ck * 3)
                dtb = round(tong / (len(tx_list) + 5), 1)

            key_prefix = f"hk{ky_so}"
            gom_diem[ten_mon][f'{key_prefix}_tx'] = tx_list
            gom_diem[ten_mon][f'{key_prefix}_gk'] = d.diem_gk
            gom_diem[ten_mon][f'{key_prefix}_ck'] = d.diem_ck
            gom_diem[ten_mon][f'dtb{ky_so}'] = dtb

        ket_qua = [f"BẢNG ĐIỂM CỦA HỌC SINH {hs.ho_ten.upper()}:"]
        
        for mon, data in gom_diem.items():
            ket_qua.append(f"\n- MÔN {mon.upper()}:")
            
            # Format xuất kết quả HK1
            tx1_str = ", ".join(map(str, data['hk1_tx'])) if data['hk1_tx'] else "Chưa có"
            gk1_str = data['hk1_gk'] if data['hk1_gk'] is not None else "Chưa có"
            ck1_str = data['hk1_ck'] if data['hk1_ck'] is not None else "Chưa có"
            dtb1_str = data['dtb1'] if data['dtb1'] is not None else "Chưa có"
            ket_qua.append(f"  - [Học kỳ 1] TX: {tx1_str} | GK: {gk1_str} | CK: {ck1_str} => ĐTB: {dtb1_str}")
            
            # Format xuất kết quả HK2
            tx2_str = ", ".join(map(str, data['hk2_tx'])) if data['hk2_tx'] else "Chưa có"
            gk2_str = data['hk2_gk'] if data['hk2_gk'] is not None else "Chưa có"
            ck2_str = data['hk2_ck'] if data['hk2_ck'] is not None else "Chưa có"
            dtb2_str = data['dtb2'] if data['dtb2'] is not None else "Chưa có"
            ket_qua.append(f"  - [Học kỳ 2] TX: {tx2_str} | GK: {gk2_str} | CK: {ck2_str} => ĐTB: {dtb2_str}")
            
            # Tính ĐTB Cả năm
            if data['dtb1'] is not None and data['dtb2'] is not None:
                dcn = round((data['dtb1'] + data['dtb2'] * 2) / 3, 1)
                ket_qua.append(f"  => TỔNG KẾT CẢ NĂM: {dcn}")
        
        return "\n".join(ket_qua)

    def kiem_tra_chuyen_can(self, ten_goi_nho_hoc_sinh: str = "", ngay_cu_the: str = "") -> str:
        """
        Công cụ kiểm tra chuyên cần. Hỗ trợ tra cứu theo ngày hoặc tổng hợp số ngày vắng.
        """
        hs, error = self._xac_dinh_hoc_sinh(ten_goi_nho_hoc_sinh)
        if error: return error

        diem_danh_qs = DiemDanh.objects.filter(hoc_sinh=hs).order_by('-ngay', 'buoi_hoc')
        
        if ngay_cu_the:
            dd_ngay = diem_danh_qs.filter(ngay=ngay_cu_the)
            if not dd_ngay.exists():
                return f"Dạ, ngày {ngay_cu_the} bé {hs.ho_ten} không có lịch học hoặc giáo viên chưa chốt điểm danh."
            
            trang_thai = []
            for dd in dd_ngay:
                if dd.trang_thai == 'Co_mat':
                    nhan = 'CÓ MẶT'
                elif dd.trang_thai == 'Vang_CP':
                    nhan = 'VẮNG CÓ PHÉP'
                else:
                    nhan = 'VẮNG KHÔNG PHÉP'
                trang_thai.append(f"Buổi {dd.buoi_hoc}: {nhan}")
                
            return f"Kết quả điểm danh ngày {ngay_cu_the} của {hs.ho_ten}:\n- " + "\n- ".join(trang_thai)
            
        else:
            # Tra cứu tổng quát
            tong_cp = diem_danh_qs.filter(trang_thai='Vang_CP').count()
            tong_kp = diem_danh_qs.filter(trang_thai='Vang_KP').count()
            
            ket_qua = f"Từ đầu năm đến nay, bé {hs.ho_ten} đã vắng tổng cộng {tong_cp + tong_kp} buổi (Trong đó: {tong_cp} buổi có phép, {tong_kp} buổi không phép)."
            
            # Lấy 5 ngày vắng gần nhất (nếu có)
            cac_ngay_vang = diem_danh_qs.filter(trang_thai__in=['Vang_CP', 'Vang_KP'])[:5]
            if cac_ngay_vang.exists():
                ket_qua += "\nChi tiết các ngày vắng gần nhất:\n"
                for dd in cac_ngay_vang:
                    nhan = 'Có phép' if dd.trang_thai == 'Vang_CP' else 'Không phép'
                    ket_qua += f"- Ngày {dd.ngay.strftime('%d/%m/%Y')} (Buổi {dd.buoi_hoc}): Vắng {nhan}\n"
                    
            return ket_qua
    
    def tra_mau_don_xin_nghi(self) -> str:
        """Trả về khối HTML chứa giao diện hướng dẫn xin nghỉ phép."""
        return """<b>Bước 1:</b> Ở danh mục bên trái màn hình, bấm vào mục <b>Đơn xin nghỉ học</b>.<br>
<div style='background:#f8fafc; padding:8px 12px; border:1px solid #e2e8f0; border-radius:6px; margin:6px 0 16px 0; width:fit-content; color:#0f172a; font-weight:600; box-shadow:0 1px 2px rgba(0,0,0,0.02);'><i class='ti ti-file-text' style='color:#64748b; font-size:16px; margin-right:6px;'></i> Đơn xin nghỉ học</div>
<b>Bước 2:</b> Nhìn lên góc trên bên phải màn hình, bấm vào nút <b>Tạo đơn mới</b> màu xanh.<br>
<div style='background:#3b82f6; color:#fff; padding:6px 12px; border-radius:6px; margin:6px 0 16px 0; width:fit-content; font-weight:700; font-size:12px; box-shadow:0 2px 4px rgba(59,130,246,0.3);'><i class='ti ti-plus' style='margin-right:4px;'></i> Tạo đơn mới</div>
<b>Bước 3:</b> Chọn <b>Ngày bắt đầu</b>, <b>Ngày kết thúc</b> và nhập <b>Lý do</b> (bắt buộc). Bấm nút <b>Gửi đơn</b> để hoàn tất.<br>
<div style='background:#3b82f6; color:#fff; padding:6px 12px; border-radius:6px; margin:6px 0 0 0; width:fit-content; font-weight:700; font-size:12px; box-shadow:0 2px 4px rgba(59,130,246,0.3);'><i class='ti ti-send' style='margin-right:4px;'></i> Gửi đơn</div>"""