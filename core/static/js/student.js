const pages = {
    'diem':      'Kết quả học tập',
    'chuyen-can':'Chuyên cần',
    'thong-bao': 'Thông báo',
    'tai-khoan': 'Tài khoản',
};
  
function switchPage(id, element) {
    // Ẩn tất cả nội dung
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    // Xóa active ở tất cả các nút trên menu
    document.querySelectorAll('.nav-link').forEach(n => n.classList.remove('active'));
    
    // Hiển thị nội dung được chọn
    const pg = document.getElementById('page-' + id);
    if (pg) pg.classList.add('active');
    
    // Đánh dấu active cho nút vừa bấm
    if (element) element.classList.add('active');
    
    // Cập nhật tiêu đề (nếu có thẻ tiêu đề dùng ID này)
    const titleEl = document.getElementById('topbar-title');
    if (titleEl) titleEl.textContent = pages[id] || id;
}