// ── Navigation ──
function switchPage(id, element) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-link').forEach(n => n.classList.remove('active'));
  
  const pg = document.getElementById('page-' + id);
  if (pg) pg.classList.add('active');
  
  if (element) element.classList.add('active');
}

// ── Form toggle ──
function toggleForm() {
  const f = document.getElementById('form-panel');
  f.style.display = f.style.display === 'none' ? 'block' : 'none';
}
function submitForm() {
  toggleForm();
  showToast('Đơn xin nghỉ đã được gửi thành công!');
}

// ── Toast ──
function showToast(msg) {
  const t = document.getElementById('toast');
  document.getElementById('toast-msg').textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 3000);
}

// ── Modal data ──
const donData = {
  don1: { title:'Đơn xin nghỉ · 18/10/2024', ngay:'18/10/2024', lydo:'Việc gia đình', tt:'<span class="badge bg-green">Đã duyệt</span>', ghichu:'Chấp thuận', canReply:false },
  don2: { title:'Đơn xin nghỉ · 05/10/2024', ngay:'05/10/2024', lydo:'Nghỉ ốm', tt:'<span class="badge bg-green">Đã duyệt</span>', ghichu:'Có giấy bác sĩ, chấp thuận', canReply:false },
  don3: { title:'Đơn xin nghỉ · 20/09/2024 — Bị từ chối', ngay:'20/09/2024', lydo:'Khám sức khỏe định kỳ', tt:'<span class="badge bg-red">Từ chối</span>', ghichu:'Ngày có bài kiểm tra — không thể vắng', canReply:true },
  don4: { title:'Đơn xin nghỉ · 11/12/2024 — Đang chờ', ngay:'11/12/2024', lydo:'Nghỉ ốm tại nhà', tt:'<span class="badge bg-amber">Đang chờ</span>', ghichu:'—', canReply:false },
};
let currentDon = null;

function openModal(id) {
  const d = donData[id];
  if (!d) return;
  currentDon = id;
  document.getElementById('modal-title').textContent = d.title;
  document.getElementById('modal-ngay').innerHTML = `<span class="di-label">Ngày nghỉ</span><span class="di-val">${d.ngay}</span>`;
  document.getElementById('modal-lydo').innerHTML = `<span class="di-label">Lý do</span><span class="di-val">${d.lydo}</span>`;
  document.getElementById('modal-trangthai').innerHTML = `<span class="di-label">Trạng thái</span><span class="di-val">${d.tt}</span>`;
  document.getElementById('modal-ghichu').innerHTML = `<span class="di-label">GVCN ghi chú</span><span class="di-val">${d.ghichu}</span>`;
  const replySection = document.getElementById('modal-reply-section');
  const sendBtn = document.getElementById('modal-send-btn');
  document.getElementById('modal-reply-input').value = '';
  if (d.canReply) {
    replySection.style.display = 'block';
    sendBtn.style.display = 'inline-flex';
    document.getElementById('modal-reply-input').placeholder = `Nhập phản hồi về đơn ngày ${d.ngay}...\n\nTin nhắn sẽ kèm thông tin đơn để GVCN dễ theo dõi.`;
  } else {
    replySection.style.display = 'none';
    sendBtn.style.display = 'none';
  }
  document.getElementById('modal-overlay').classList.add('open');
}

function closeModal() {
  document.getElementById('modal-overlay').classList.remove('open');
  currentDon = null;
}
function closeModalOutside(e) {
  if (e.target === document.getElementById('modal-overlay')) closeModal();
}

function sendReply() {
  const txt = document.getElementById('modal-reply-input').value.trim();
  if (!txt) { document.getElementById('modal-reply-input').focus(); return; }
  const d = donData[currentDon];
  closeModal();
  
  const body = document.getElementById('chat-body');
  const div = document.createElement('div');
  div.className = 'cmsg me';
  div.innerHTML = `
    <div class="cmsg-bubble">
      <div class="reply-card">
        <div class="rc-label">📄 Đơn xin nghỉ · ${d.ngay} · ${d.lydo}</div>
        <div class="rc-text">GV ghi: ${d.ghichu}</div>
      </div>
      ${txt}
    </div>
    <div class="cmsg-time">${new Date().toLocaleTimeString('vi-VN',{hour:'2-digit',minute:'2-digit'})}</div>`;
  body.appendChild(div);
  body.scrollTop = body.scrollHeight;
  showToast('Phản hồi đã gửi thành công!');
  
  setTimeout(() => {
    switchPage('hop-thu', document.getElementById('tab-hop-thu-btn'));
  }, 1200);
}

// ── Messenger ──
const chatProfiles = {
  lan:    { name:'Cô Nguyễn Thị Lan', sub:'GVCN lớp 11A3 · <span style="color:#22c55e;">● Online</span>', av:'NL', color:'linear-gradient(135deg,#6366f1,#8b5cf6)' },
  minh:   { name:'Thầy Trần Văn Minh', sub:'GVCN lớp 10A3', av:'TM', color:'linear-gradient(135deg,#059669,#0891b2)' },
  bgh:    { name:'Ban Giám Hiệu', sub:'Thông báo chính thức từ trường', av:'BG', color:'linear-gradient(135deg,#d97706,#dc2626)' },
  'giao-vu': { name:'Phòng Giáo vụ', sub:'Hỗ trợ hành chính', av:'GV', color:'linear-gradient(135deg,#0891b2,#3b82f6)' },
};
const chatHistory = {
  lan: `<div class="chat-date-divider">Hôm nay</div>
    <div class="cmsg them"><div class="cmsg-sender">Cô Nguyễn Thị Lan</div><div class="cmsg-bubble">Chào phụ huynh, An có tình hình vắng học không phép ngày 03/11. Phụ huynh có biết lý do không ạ?</div><div class="cmsg-time">08:15</div></div>
    <div class="cmsg me"><div class="cmsg-bubble">Chào cô, gia đình xin lỗi. Hôm đó An bị mệt đột xuất nên chưa kịp báo cô.</div><div class="cmsg-time">08:32</div></div>
    <div class="cmsg them"><div class="cmsg-sender">Cô Nguyễn Thị Lan</div><div class="cmsg-bubble">Vâng, phụ huynh nộp đơn xin phép qua hệ thống nhé để mình ghi nhận ạ.</div><div class="cmsg-time">08:35</div></div>
    <div class="cmsg me"><div class="cmsg-bubble"><div class="reply-card"><div class="rc-label">📄 Đơn xin nghỉ · 20/09/2024 · Từ chối</div><div class="rc-text">GV ghi: Ngày có bài kiểm tra — không thể vắng</div></div>Cô ơi, hôm đó con An phải đi khám bác sĩ định kỳ ạ. Gia đình đã quên lịch kiểm tra. PH có thể gửi lại đơn kèm giấy hẹn không ạ?</div><div class="cmsg-time">09:10</div></div>
    <div class="cmsg them"><div class="cmsg-sender">Cô Nguyễn Thị Lan</div><div class="cmsg-bubble">Được ạ, phụ huynh gửi lại kèm giấy hẹn khám thì cô sẽ xem xét lại nhé.</div><div class="cmsg-time">09:22</div></div>`,
  minh: `<div class="chat-date-divider">Hôm qua</div>
    <div class="cmsg them"><div class="cmsg-sender">Thầy Trần Văn Minh</div><div class="cmsg-bubble">Chào phụ huynh, em Mai tiến bộ hơn rất nhiều tuần này! Điểm kiểm tra môn Toán đạt 9.0 ạ.</div><div class="cmsg-time">14:20</div></div>
    <div class="cmsg me"><div class="cmsg-bubble">Cảm ơn thầy đã thông báo ạ! Gia đình rất vui khi nghe tin này.</div><div class="cmsg-time">15:05</div></div>`,
  bgh: `<div class="chat-date-divider">2 ngày trước</div>
    <div class="cmsg them"><div class="cmsg-sender">Ban Giám Hiệu</div><div class="cmsg-bubble">Kính gửi quý phụ huynh, lịch thi HK1 chính thức từ 20/12 đến 28/12/2024. Học sinh cần mang đầy đủ thẻ dự thi.</div><div class="cmsg-time">08:00</div></div>`,
  'giao-vu': `<div class="chat-date-divider">3 ngày trước</div>
    <div class="cmsg them"><div class="cmsg-sender">Phòng Giáo vụ</div><div class="cmsg-bubble">Kính mời quý phụ huynh tham dự họp phụ huynh cuối HK1 — Thứ Bảy 21/12/2024, 8:00–10:00, phòng hội trường.</div><div class="cmsg-time">09:30</div></div>`,
};

function openChat(id) {
  document.querySelectorAll('.contact-item').forEach(c => c.classList.remove('active'));
  document.querySelector(`[onclick="openChat('${id}')"]`)?.classList.add('active');
  const p = chatProfiles[id];
  if (!p) return;
  document.getElementById('chat-avatar').textContent = p.av;
  document.getElementById('chat-avatar').style.background = p.color;
  document.getElementById('chat-name').textContent = p.name;
  document.getElementById('chat-sub').innerHTML = p.sub;
  document.getElementById('chat-body').innerHTML = chatHistory[id] || '<div class="empty-chat"><i class="ti ti-message-off"></i><p>Chưa có tin nhắn</p></div>';
  document.getElementById('chat-body').scrollTop = 9999;
  document.getElementById('chat-input').placeholder = `Nhắn tin với ${p.name}...`;
}

function sendMessage() {
  const inp = document.getElementById('chat-input');
  const txt = inp.value.trim();
  if (!txt) return;
  const body = document.getElementById('chat-body');
  const div = document.createElement('div');
  div.className = 'cmsg me';
  div.innerHTML = `<div class="cmsg-bubble">${txt}</div><div class="cmsg-time">${new Date().toLocaleTimeString('vi-VN',{hour:'2-digit',minute:'2-digit'})}</div>`;
  body.appendChild(div);
  body.scrollTop = body.scrollHeight;
  inp.value = '';
}
function handleKey(e) {
  if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
}

function filterContacts(q) {
  document.querySelectorAll('.contact-item').forEach(item => {
    const name = item.dataset.name?.toLowerCase() || '';
    item.style.display = name.includes(q.toLowerCase()) ? '' : 'none';
  });
}