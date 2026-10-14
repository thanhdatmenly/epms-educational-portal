function switchRole(roleId, btnElement) {
    // Ẩn tất cả form và bỏ active nút
    document.querySelectorAll('.form-area').forEach(f => f.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    
    // Hiện form tương ứng
    document.getElementById('form-' + roleId).classList.add('active');
    btnElement.classList.add('active');
}