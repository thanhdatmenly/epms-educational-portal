// ===== CÁC HÀM CƠ BẢN =====
function showToast(msg){ const t=document.getElementById('toast'); t.innerText=msg; t.style.display='block'; setTimeout(()=>t.style.display='none',2500); }
function openModal(title,body,footer=''){
  document.getElementById('modalTitle').innerHTML=title; document.getElementById('modalBody').innerHTML=body;
  document.getElementById('modalFooter').innerHTML=footer||'<button class="btn btn-outline-secondary" onclick="closeModal()">Đóng</button>';
  document.getElementById('globalModal').classList.add('show');
}
function closeModal(){ document.getElementById('globalModal').classList.remove('show'); setTimeout(() => { document.querySelector('.modal-box-custom').style.width = '440px'; }, 300); }
function switchTab(name,el){
  document.querySelectorAll('.tab-content').forEach(t=>t.classList.remove('active'));
  document.querySelectorAll('.nav-link').forEach(m=>m.classList.remove('active'));
  document.getElementById('tab-'+name).classList.add('active'); if(el)el.classList.add('active');
}

// Dùng dữ liệu thật từ Django (đã được inject trong template)
const students = (typeof DANH_SACH_HS !== 'undefined' ? DANH_SACH_HS : []).map(hs => ({
    id:      hs.id,
    name:    hs.ho_ten,
    dob:     '',
    address: '',
    totalCp: 0,
    totalKp: 0,
    tx:      [0, 0, 0],
    gk:      0,
    ck:      0,
    hk:      'Tốt',
    color:   '#2563eb',
    ph:      { name: '', phone: '', email: '', rel: '', contactId: hs.id }
}));
const hkOpts=['Tốt','Khá','Trung bình','Yếu']; const hkColors={'Tốt':'bp-green','Khá':'bp-blue','Trung bình':'bp-yellow','Yếu':'bp-red'};

// ===== LOGIC ĐIỂM DANH =====
const ddStates = {}; students.forEach(s=>ddStates[s.id]='present');
let ddLocked = false;
function renderScores(){
  const isDisabled = ddLocked ? 'disabled' : ''; const rowStyle = ddLocked ? 'pointer-events:none; opacity:0.6; background-color:#f8fafc;' : '';
  document.getElementById('dd-body').innerHTML=students.map((s,i)=>{
    const st=ddStates[s.id]; let note='<span class="text-muted">—</span>';
    if(st==='kp') note='<span class="text-danger" style="font-size:11px"><i class="fa-solid fa-bell"></i> Sẽ nhắn PH</span>';
    if(st==='cp') note='<span class="text-success" style="font-size:11px">Có phép</span>';
    return`<tr style="${rowStyle}">
      <td>${i+1}</td><td><span class="stu-name-link" onclick="showPhPopup(${s.id}, event)">${s.name}</span></td>
      <td class="t-center"><input type="radio" name="dd${s.id}" value="present" ${st==='present'?'checked':''} ${isDisabled} onchange="ddStates[${s.id}]=this.value;renderDD()"></td>
      <td class="t-center"><input type="radio" name="dd${s.id}" value="cp" ${st==='cp'?'checked':''} ${isDisabled} onchange="ddStates[${s.id}]=this.value;renderDD()"></td>
      <td class="t-center"><input type="radio" name="dd${s.id}" value="kp" ${st==='kp'?'checked':''} ${isDisabled} onchange="ddStates[${s.id}]=this.value;renderDD()"></td>
      <td>${note}</td></tr>`;
  }).join('');
}

// ===== LOGIC QUẢN LÝ ĐIỂM =====
function calcAvg(tx,gk,ck){return(((tx[0]+tx[1]+tx[2])/3*1+gk*2+ck*3)/6).toFixed(1)}
function getHL(avg){
  if(avg>=8) return'<span class="badge-pill bp-green">Giỏi</span>'; if(avg>=6.5)return'<span class="badge-pill bp-blue">Khá</span>';
  if(avg>=5) return'<span class="badge-pill bp-yellow">Trung bình</span>'; return'<span class="badge-pill bp-red">Yếu</span>';
}
function renderScores(){
  document.getElementById('score-body').innerHTML=students.map((s,i)=>{
    const avg=calcAvg(s.tx,s.gk,s.ck);
    return`<tr>
      <td>${i+1}</td><td><span class="stu-name-link" onclick="showPhPopup(${s.id}, event)">${s.name}</span></td>
      ${s.tx.map((v,idx)=>`<td class="t-center"><input class="score-input" type="number" value="${v}" min="0" max="10" onchange="recalcRow(this,${s.id})"></td>`).join('')}
      <td class="t-center"><input class="score-input" type="number" value="${s.gk}" onchange="recalcRow(this,${s.id})"></td>
      <td class="t-center"><input class="score-input" type="number" value="${s.ck}" onchange="recalcRow(this,${s.id})"></td>
      <td class="t-center score-avg">${avg}</td><td class="t-center" id="hl-${s.id}">${getHL(avg)}</td>
      <td class="t-center"><select class="conduct-sel">${hkOpts.map(o=>`<option value="${o}" ${s.hk===o?'selected':''}>${o}</option>`).join('')}</select></td>
    </tr>`;
  }).join('');
}
function recalcRow(input, sid){
  const row=input.closest('tr'); const inputs=[...row.querySelectorAll('.score-input')];
  const avg=calcAvg([+inputs[0].value,+inputs[1].value,+inputs[2].value], +inputs[3].value, +inputs[4].value);
  row.querySelector('.score-avg').innerText=avg; row.querySelector('[id^="hl-"]').innerHTML=getHL(avg);
}

// ===== POPUP HỌC SINH =====
let currentPopupStuId = null;
function showPhPopup(sid, event){
  event.stopPropagation(); const s = students.find(x=>x.id===sid); if(!s) return; currentPopupStuId = sid;
  const av = document.getElementById('pp-stu-avatar'); av.style.background = s.color+'33'; av.style.color = s.color; av.innerText = s.name.split(' ').slice(-1)[0][0];
  document.getElementById('pp-stu-name').innerText = s.name; document.getElementById('pp-stu-class').innerText = 'Lớp 10A1 · Mã HS: HS00'+s.id;
  document.getElementById('ph-popup-body-content').innerHTML = `
    <div style="display:flex; justify-content:space-between; margin-bottom:10px; border-bottom:1px solid #eee; padding-bottom:10px;">
        <span class="text-muted" style="font-size:11px;">Phụ huynh:</span><span class="fw-bold" style="font-size:13px;">${s.ph.name} (${s.ph.rel})</span>
    </div>
    <div style="display:flex; justify-content:space-between; margin-bottom:10px; border-bottom:1px solid #eee; padding-bottom:10px;">
        <span class="text-muted" style="font-size:11px;">Điện thoại:</span><span class="fw-bold text-success" style="font-size:13px;">${s.ph.phone}</span>
    </div>
  `;
  const popup = document.getElementById('phPopup'); popup.style.display = 'block';
  document.getElementById('phPopupOverlay').classList.add('show');
}
function closePhPopup(){ document.getElementById('phPopup').style.display = 'none'; document.getElementById('phPopupOverlay').classList.remove('show'); }
function callPhone(){ showToast('Đang kết nối cuộc gọi...'); closePhPopup(); }
function goToChat(){ closePhPopup(); switchTab('thongbao'); setTimeout(()=>openChat(students.find(x=>x.id===currentPopupStuId).ph.contactId), 100); }

const contacts = (typeof DANH_SACH_HS !== 'undefined' ? DANH_SACH_HS : []).map(hs => ({
    id:      hs.id,
    name:    hs.ho_ten,
    student: hs.ho_ten + ' (' + (typeof GV_INFO !== 'undefined' ? GV_INFO.lop_chinh_ten : '') + ')',
    phone:   '',
    color:   '#2563eb',
    online:  false,
    unread:  0,
    messages: []
}));
let activeContactId = null;
function renderContacts(){
  document.getElementById('msg-contact-list').innerHTML=contacts.map(c=>`
    <div class="msg-contact ${activeContactId===c.id?'active':''}" onclick="openChat(${c.id})">
      <div class="msg-avatar" style="background:${c.color}22;color:${c.color}">${c.name.split(' ').slice(-1)[0][0]}</div>
      <div style="flex:1; min-width:0;">
        <div style="display:flex; justify-content:space-between; font-size:13px;"><span class="fw-bold text-dark">${c.name}</span><span style="font-size:10px;color:gray">${c.messages[c.messages.length-1]?.time}</span></div>
        <div style="font-size:11px; color:gray; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${c.messages[c.messages.length-1]?.text}</div>
      </div>
    </div>`).join('');
}
function openChat(cid){
  activeContactId=cid; const c=contacts.find(x=>x.id===cid); if(!c)return; c.unread=0; renderContacts();
  document.getElementById('msg-chat-panel').style.display='none'; const p=document.getElementById('msg-chat-active'); p.style.display='flex';
  document.getElementById('chat-avatar').innerHTML=c.name.split(' ').slice(-1)[0][0]; document.getElementById('chat-avatar').style.background=c.color+'22'; document.getElementById('chat-avatar').style.color=c.color;
  document.getElementById('chat-name').innerText=c.name; document.getElementById('chat-sub').innerText=c.student;
  document.getElementById('chat-messages').innerHTML=c.messages.map(m=>`
    <div style="display:flex; justify-content:${m.from==='gv'?'flex-end':'flex-start'}">
      <div style="background:${m.from==='gv'?'var(--primary)':'#fff'}; color:${m.from==='gv'?'#fff':'#333'}; padding:8px 12px; border-radius:12px; font-size:13px; border:1px solid #eee; max-width:70%">${m.text}</div>
    </div>`).join('');
}
function sendMsg(){
  const input=document.getElementById('msg-input-box'); const text=input.value.trim(); if(!text || !activeContactId)return;
  contacts.find(x=>x.id===activeContactId).messages.push({from:'gv',text,time:'Bây giờ'}); input.value=''; openChat(activeContactId);
}

// ===== EVENT CLICKS (TỔNG HỢP) =====
document.addEventListener('click', e => {
  // if(e.target.closest('#btn-save-dd')){ ddLocked=true; renderDD(); document.getElementById('btn-save-dd').classList.add('disabled'); showToast('Đã chốt sổ điểm danh!'); }
  if(e.target.closest('#btn-tongket-dd')){
    openModal('Tổng kết điểm danh', `<table class="table"><tr><th>Tên</th><th>Vắng CP</th><th>Vắng KP</th></tr>${students.map(s=>`<tr><td>${s.name}</td><td>${s.totalCp}</td><td>${s.totalKp}</td></tr>`).join('')}</table>`);
    document.querySelector('.modal-box-custom').style.width = '600px';
  }
  
});

// ===== KHỞI TẠO BIỂU ĐỒ =====
document.addEventListener('DOMContentLoaded', () => {
  renderContacts();
  // ===== KHỞI TẠO BIỂU ĐỒ ĐƯỜNG (REALTIME) =====
  new Chart(document.getElementById('lineChart').getContext('2d'), { 
      type:'line', 
      data:{ 
          labels:['Thứ 2','Thứ 3','Thứ 4','Thứ 5','Thứ 6','Thứ 7'], 
          datasets:[{
              label: 'Tỉ lệ đi học (%)',
              data: TY_LE_DI_HOC, // <--- ĐỔI CHỖ NÀY THÀNH BIẾN THẬT
              borderColor: '#3b82f6',
              tension: 0.3,
              fill: true,
              backgroundColor: 'rgba(59,130,246,0.1)',
              pointBackgroundColor: '#fff',
              pointBorderColor: '#3b82f6',
              pointBorderWidth: 2,
              pointRadius: 4
          }]
      }, 
      options:{
          responsive:true,
          maintainAspectRatio:false,
          plugins:{ legend:{ display:false } },
          scales:{ 
              // Sửa lại thành suggestedMin: 50 để biểu đồ có không gian rớt xuống mà không lủng đáy
              y:{ suggestedMin: 50, max: 100, ticks:{ stepSize: 10 } }, 
              x:{ grid:{ display:false } } 
          }
      }
  });
  // ===== VẼ BIỂU ĐỒ PHÂN BỔ VẮNG BẰNG SỐ THẬT =====
  // Lấy 2 biến toàn cục đã khai báo ở file HTML
  let bieuDoVang_DuLieu = [TONG_VANG_CP, TONG_VANG_KP];
  let bieuDoVang_MauSac = ['#10b981', '#ef4444'];
  let bieuDoVang_Nhan = ['Có phép', 'Không phép'];

  // Nếu cả lớp đi học đầy đủ (Số vắng = 0)
  if (TONG_VANG_CP === 0 && TONG_VANG_KP === 0) {
      bieuDoVang_DuLieu = [1];
      bieuDoVang_MauSac = ['#e2e8f0']; // Màu xám nhạt
      bieuDoVang_Nhan = ['Lớp đi học đầy đủ 100%'];
  }

  // Vẽ biểu đồ
  const bangDoughnut = document.getElementById('doughnutChart');
  if (bangDoughnut) {
      new Chart(bangDoughnut.getContext('2d'), { 
          type: 'doughnut', 
          data: { 
              labels: bieuDoVang_Nhan, 
              datasets: [{
                  data: bieuDoVang_DuLieu,
                  backgroundColor: bieuDoVang_MauSac,
                  borderWidth: 0,
                  hoverOffset: 4
              }]
          }, 
          options: {
              responsive: true,
              maintainAspectRatio: false,
              cutout: '70%',
              plugins: {
                  legend: { 
                      display: true, 
                      position: 'right' // Đẩy chú thích sang bên phải cho đẹp
                  },
                  tooltip: {
                      callbacks: {
                          label: function(context) {
                              if (TONG_VANG_CP === 0 && TONG_VANG_KP === 0) return ' Tuyệt vời! Chưa có lượt vắng nào.';
                              return ' ' + context.parsed + ' buổi';
                          }
                      }
                  }
              }
          } 
      });
  }
});
