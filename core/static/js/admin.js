const danhSachHS = [
    ['Lê Huỳnh Ngọc Ái','21/06/2011','0917712667'],
    ['Lê Quang Anh','23/11/2011','0933695934'],
    ['Nguyễn Hoàng Anh','27/02/2011','0908523987'],
    ['Trần Phương Anh','01/08/2011','0962932579'],
    ['Trương Ng.Mai Anh','16/02/2011','0939345609'],
    ['Nguyễn Thiên Ân','17/09/2011','0939121005'],
    ['Huỳnh Lương Sơn Bá','24/12/2011','0963429880'],
    ['Nguyễn Thế Bi','22/03/2011','0362561363'],
];

function switchTab(tabName) {
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    document.querySelectorAll('.menu-item').forEach(i => i.classList.remove('active'));
    
    // Xử lý active class cho menu (vì dùng base.html nên cần tìm theo href hoặc ID)
    document.querySelectorAll('.nav-link').forEach(i => i.classList.remove('active')); 

    const tab = document.getElementById('tab-' + tabName);
    const btn = document.getElementById('tab-' + tabName + '-btn');
    if (tab) tab.classList.add('active');
    if (btn) btn.classList.add('active');
}

const overlay = document.getElementById('modal-overlay');
function openModal(id) {
    overlay.style.display = 'flex';
    document.querySelectorAll('.modal-box').forEach(m => m.style.display = 'none');
    const box = document.getElementById(id);
    if (box) box.style.display = 'block';
}

function closeModal() { overlay.style.display = 'none'; }

if (overlay) {
    overlay.addEventListener('click', function(e) {
        if (e.target === overlay) closeModal();
    });
}

function showToast(msg, type='success') {
    const toast = document.getElementById('toast');
    const icon  = toast.querySelector('i');
    document.getElementById('toast-msg').textContent = msg;
    icon.style.color = type === 'success' ? '#10b981' : '#ef4444';
    icon.className   = type === 'success' ? 'fa-solid fa-circle-check' : 'fa-solid fa-circle-xmark';
    toast.style.transform = 'translateY(0)';
    toast.style.opacity = '1';
    setTimeout(() => {
        toast.style.transform = 'translateY(80px)';
        toast.style.opacity = '0';
    }, 2800);
}

function saveAndToast(msg) { closeModal(); setTimeout(() => showToast(msg), 150); }

document.addEventListener('DOMContentLoaded', function() {
    // Chart.js
    Chart.defaults.color = '#64748b';
    Chart.defaults.font.family = 'Inter';
    const lineChartElem = document.getElementById('lineChart');
    if (lineChartElem) {
        new Chart(lineChartElem.getContext('2d'), {
            type: 'line',
            data: {
                labels: ['Thứ 2','Thứ 3','Thứ 4','Thứ 5','Thứ 6','Thứ 7'],
                datasets: [{
                    label: 'Tỉ lệ đi học (%)', data: [98,95,96,92,94,90],
                    borderColor: '#3b82f6', backgroundColor: 'rgba(59,130,246,0.1)',
                    borderWidth: 3, tension: 0.3, fill: true, pointBackgroundColor: '#fff',
                    pointBorderColor: '#3b82f6', pointBorderWidth: 2, pointRadius: 4
                }]
            },
            options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { min:80, max:100, grid:{ color:'#f1f5f9' } }, x: { grid:{ display:false } } } }
        });
    }

    const doughnutChartElem = document.getElementById('doughnutChart');
    if (doughnutChartElem) {
        new Chart(doughnutChartElem.getContext('2d'), {
            type: 'doughnut',
            data: { labels: ['Có phép','Không phép'], datasets: [{ data:[65,35], backgroundColor:['#10b981','#ef4444'], borderWidth:0, hoverOffset:5 }] },
            options: { responsive: true, maintainAspectRatio: false, cutout:'75%', plugins: { legend: { position:'right', labels:{ color:'#334155', font:{size:13,weight:'500'}, boxWidth:12, usePointStyle:true, padding:20 } } } }
        });
    }

    bindBtn('tab-subjects', '.btn-primary', () => {
        document.getElementById('modal-subject-title').textContent = '➕ Thêm Môn học mới';
        document.getElementById('sub-ma').value = '';
        document.getElementById('sub-ten').value = '';
        openModal('modal-subject');
    });

    bindIconBtns('tab-subjects', 'fa-pen-to-square', (btn) => {
        const row = btn.closest('tr');
        const name = row.querySelector('.class-name')?.textContent || '';
        document.getElementById('modal-subject-title').textContent = '✏️ Sửa môn học: ' + name.trim();
        openModal('modal-subject');
    });

    bindIconBtns('tab-subjects', 'fa-lock', (btn) => {
        const row = btn.closest('tr');
        const name = row.querySelector('.class-name')?.textContent || 'môn học này';
        document.getElementById('modal-lock-title').textContent = '🔒 Khóa môn học';
        document.getElementById('modal-lock-msg').innerHTML = `Bạn có chắc muốn tạm ngưng áp dụng <strong>${name.trim()}</strong>?`;
        document.getElementById('modal-lock-btn').textContent = '🔒 Khóa';
        document.getElementById('modal-lock-btn').style.background = '#ef4444';
        openModal('modal-lock');
    });

    bindAction('tab-teachers', 'add-teacher', () => {
        document.getElementById('modal-gv-title').textContent = '➕ Thêm Giáo viên mới';
        document.getElementById('gv-ma').value = ''; document.getElementById('gv-ten').value = ''; document.getElementById('gv-sdt').value = ''; document.getElementById('gv-mk').value = '';
        openModal('modal-gv');
    });

    bindAction('tab-teachers', 'import-teachers', () => { document.getElementById('modal-import-title').textContent = '📥 Import Giáo viên từ Excel'; openModal('modal-import'); });

    bindIconBtns('tab-teachers', 'fa-pen-to-square', (btn) => {
        const row = btn.closest('tr');
        const name = row.querySelector('.person-name')?.textContent || '';
        const ma   = row.querySelector('.teacher-id')?.textContent || '';
        document.getElementById('modal-gv-title').textContent = '✏️ Sửa thông tin: ' + name;
        document.getElementById('gv-ma').value = ma.trim(); document.getElementById('gv-ten').value = name.trim();
        openModal('modal-gv');
    });

    bindIconBtns('tab-teachers', 'fa-key', (btn) => {
        const row = btn.closest('tr'); const name = row.querySelector('.person-name')?.textContent || 'tài khoản này';
        document.getElementById('resetpw-name').textContent = name.trim(); document.getElementById('resetpw-new').value = ''; document.getElementById('resetpw-confirm').value = '';
        openModal('modal-resetpw');
    });

    bindIconBtns('tab-teachers', 'fa-lock', (btn) => {
        const row = btn.closest('tr'); const name = row.querySelector('.person-name')?.textContent || 'tài khoản này';
        document.getElementById('modal-lock-title').textContent = '🔒 Khóa tài khoản';
        document.getElementById('modal-lock-msg').innerHTML = `Bạn có chắc muốn <strong>khóa</strong> tài khoản của <strong>${name.trim()}</strong>?<br><span style="color:#64748b;font-size:12px;margin-top:6px;display:block">Giáo viên sẽ không thể đăng nhập cho đến khi được mở khóa.</span>`;
        document.getElementById('modal-lock-btn').textContent = '🔒 Khóa tài khoản'; document.getElementById('modal-lock-btn').style.background = '#ef4444';
        openModal('modal-lock');
    });

    bindIconBtns('tab-teachers', 'fa-lock-open', (btn) => {
        const row = btn.closest('tr'); const name = row.querySelector('.person-name')?.textContent || 'tài khoản này';
        document.getElementById('modal-lock-title').textContent = '🔓 Mở khóa tài khoản';
        document.getElementById('modal-lock-msg').innerHTML = `Bạn có muốn <strong>mở khóa</strong> tài khoản của <strong>${name.trim()}</strong>?`;
        document.getElementById('modal-lock-btn').textContent = '🔓 Mở khóa'; document.getElementById('modal-lock-btn').style.background = '#10b981';
        openModal('modal-lock');
    });

    bindBtn('tab-students', '.btn-primary:last-child', () => { document.getElementById('modal-hs-title').textContent = '➕ Tạo tài khoản Học sinh'; openModal('modal-hs'); });
    bindBtnByText('tab-students', 'Reset mật khẩu loạt', () => openModal('modal-reset-bulk'));
    bindBtnByText('tab-students', 'Import từ Excel', () => { document.getElementById('modal-import-title').textContent = '📥 Import Học sinh từ Excel'; openModal('modal-import'); });

    bindIconBtns('tab-students', 'fa-pen-to-square', (btn) => {
        const row = btn.closest('tr'); const name = row.querySelector('.person-name')?.textContent || '';
        document.getElementById('modal-hs-title').textContent = '✏️ Sửa tài khoản: ' + name.trim();
        openModal('modal-hs');
    });

    bindIconBtns('tab-students', 'fa-key', (btn) => {
        const row = btn.closest('tr'); const name = row.querySelector('.person-name')?.textContent || 'học sinh này';
        document.getElementById('resetpw-name').textContent = name.trim();
        openModal('modal-resetpw');
    });

    bindIconBtns('tab-students', 'fa-lock', (btn) => {
        const row = btn.closest('tr'); const name = row.querySelector('.person-name')?.textContent || 'học sinh này';
        document.getElementById('modal-lock-title').textContent = '🔒 Khóa tài khoản';
        document.getElementById('modal-lock-msg').innerHTML = `Bạn có chắc muốn <strong>khóa</strong> tài khoản của <strong>${name.trim()}</strong>?`;
        document.getElementById('modal-lock-btn').textContent = '🔒 Khóa'; document.getElementById('modal-lock-btn').style.background = '#ef4444';
        openModal('modal-lock');
    });

    bindBtnByText('tab-parents', 'Thêm Phụ huynh', () => { document.getElementById('modal-ph-title').textContent = '➕ Thêm Phụ huynh'; openModal('modal-ph'); });
    bindBtnByText('tab-parents', 'Cập nhật từ Excel', () => { document.getElementById('modal-import-title').textContent = '📥 Cập nhật Phụ huynh từ Excel'; openModal('modal-import'); });
    bindIconBtns('tab-parents', 'fa-pen-to-square', () => { document.getElementById('modal-ph-title').textContent = '✏️ Sửa thông tin Phụ huynh'; openModal('modal-ph'); });
    bindIconBtns('tab-parents', 'fa-key', (btn) => {
        const row = btn.closest('tr'); const name = row.querySelector('.person-name')?.textContent || 'phụ huynh này';
        document.getElementById('resetpw-name').textContent = name.trim();
        openModal('modal-resetpw');
    });
    bindIconBtns('tab-parents', 'fa-lock', (btn) => {
        const row = btn.closest('tr'); const name = row.querySelector('.person-name')?.textContent || 'phụ huynh này';
        document.getElementById('modal-lock-title').textContent = '🔒 Khóa đăng nhập';
        document.getElementById('modal-lock-msg').innerHTML = `Bạn có chắc muốn <strong>khóa</strong> đăng nhập App của <strong>${name.trim()}</strong>?`;
        document.getElementById('modal-lock-btn').textContent = '🔒 Khóa'; document.getElementById('modal-lock-btn').style.background = '#ef4444';
        openModal('modal-lock');
    });

    bindBtnByText('tab-classes', 'Thêm Học kỳ', () => openModal('modal-hocky'));
    bindBtnByText('tab-classes', 'Tạo Lớp mới', () => { document.getElementById('modal-lop-title').textContent = '➕ Tạo Lớp mới'; openModal('modal-lop'); });
    bindBtnByText('tab-classes', 'Import Lớp', () => { document.getElementById('modal-import-title').textContent = '📥 Import Lớp từ Excel'; openModal('modal-import'); });

    bindIconBtns('tab-classes', 'fa-pen-to-square', (btn) => {
        const table = btn.closest('table'); const headers = table?.querySelector('th')?.textContent || '';
        if (headers.includes('Năm học')) { openModal('modal-hocky'); } else { openModal('modal-edit-lop'); }
    });

    bindIconBtns('tab-classes', 'fa-users-viewfinder', (btn) => {
        const row = btn.closest('tr'); const malop = row.querySelector('.class-name')?.textContent?.trim() || '8/1';
        document.getElementById('modal-list-lop').textContent = malop;
        const tbody = document.getElementById('modal-list-hs-body');
        tbody.innerHTML = danhSachHS.map((hs, i) => `<tr style="${i%2===0?'':'background:#f8fafc'}"><td style="padding:9px 14px;border-bottom:1px solid #f1f5f9;color:#64748b">${i+1}</td><td style="padding:9px 14px;border-bottom:1px solid #f1f5f9;font-weight:500">${hs[0]}</td><td style="padding:9px 14px;border-bottom:1px solid #f1f5f9;color:#64748b">${hs[1]}</td><td style="padding:9px 14px;border-bottom:1px solid #f1f5f9;color:#64748b">${hs[2]}</td></tr>`).join('');
        openModal('modal-list-hs');
    });

    document.querySelectorAll('#tab-assignments .btn-primary').forEach(btn => {
        btn.addEventListener('click', () => {
            const row = btn.closest('tr'); const malop = row.querySelectorAll('td')[1]?.textContent?.trim() || '';
            document.getElementById('assign-lop').innerHTML = `<option>${malop}</option>`; document.getElementById('assign-gv').value = '';
            openModal('modal-assign');
        });
    });

    document.querySelectorAll('#tab-assignments .btn-outline').forEach(btn => {
        if (btn.title?.includes('Đổi')) {
            btn.addEventListener('click', () => {
                const row = btn.closest('tr'); const malop = row.querySelectorAll('td')[1]?.textContent?.trim() || '';
                const gvName = row.querySelector('.person-name')?.textContent?.trim() || row.querySelectorAll('td')[3]?.textContent?.trim() || '';
                document.getElementById('modal-change-lop').textContent = malop; document.getElementById('modal-change-gv-cu').textContent = gvName;
                openModal('modal-change-gvcn');
            });
        }
    });

    bindBtnByText('tab-assignments', 'Xuất danh sách', () => showToast('Đã xuất danh sách phân công ra file Excel!'));
    document.querySelector('.btn-outline')?.addEventListener('click', () => showToast('Đang xuất báo cáo... Vui lòng chờ!'));
}); 

function bindBtn(tabId, selector, handler) { const tab = document.getElementById(tabId); if (!tab) return; const btn = tab.querySelector(selector); if (btn) btn.addEventListener('click', handler); }
function bindBtnByText(tabId, text, handler) { const tab = document.getElementById(tabId); if (!tab) return; tab.querySelectorAll('button').forEach(btn => { if (btn.textContent.trim().includes(text)) { btn.addEventListener('click', handler); } }); }
function bindIconBtns(tabId, iconClass, handler) { const tab = document.getElementById(tabId); if (!tab) return; tab.querySelectorAll(`.btn-icon`).forEach(btn => { if (btn.querySelector('.' + iconClass)) { btn.addEventListener('click', () => handler(btn)); } }); }
function bindAction(tabId, action, handler) { const tab = document.getElementById(tabId); if (!tab) return; const btn = tab.querySelector(`[data-action="${action}"]`); if (btn) btn.addEventListener('click', handler); }

document.addEventListener('submit', function(e) {
    const form = e.target;
    if (!form.classList.contains('ajax-loader-form')) return;

    e.preventDefault();
    const globalLoader = document.getElementById('cusc-global-loader');
    globalLoader.style.display = 'flex';
    requestAnimationFrame(() => globalLoader.classList.add('active'));

    fetch(form.getAttribute('action'), {
        method: 'POST',
        headers: { 'X-CSRFToken': form.querySelector('[name=csrfmiddlewaretoken]').value },
        body: new FormData(form)
    })
    .then(res => res.json())
    .then(data => {
        setTimeout(() => {
            globalLoader.classList.remove('active');
            setTimeout(() => globalLoader.style.display = 'none', 300);
            showToast(data.message, data.success ? 'success' : 'error');
            if (data.success) location.reload();
        }, 500);
    })
    .catch(() => {
        globalLoader.classList.remove('active');
        setTimeout(() => globalLoader.style.display = 'none', 300);
        showToast('Lỗi mạng, vui lòng thử lại!', 'error');
    });
});