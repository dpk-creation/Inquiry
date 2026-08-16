// admin.js - ULTIMATE FINAL WITH DATE-WISE DRIVER STATUS & AUTO UPDATE
// =============================================================================
// SUPABASE CONFIG
// =============================================================================
const SUPABASE_URL = 'https://yessmvixkjnnywoitmtg.supabase.co'; 
const SUPABASE_ANON_KEY = 'sb_publishable_LKjdrZfu2b-G2CFsjOyFsw_m594Kk1P'; 
// =============================================================================

import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.39.0/+esm';

const finalUrl = localStorage.getItem('sb_url') || SUPABASE_URL;
const finalKey = localStorage.getItem('sb_key') || SUPABASE_ANON_KEY;
let supabase = null;
const isConfigured = !finalUrl.includes('YOUR_PROJECT') && finalUrl.includes('supabase.co') && finalUrl.startsWith('https://');
try { 
  if(isConfigured) {
    supabase = createClient(finalUrl, finalKey);
    console.log('✅ Supabase connected:', finalUrl);
  } else {
    console.log('ℹ️ Supabase not configured - localStorage mode');
  }
} catch(e){ console.warn('Supabase init failed:', e.message); }

const loginScreen = document.getElementById('loginScreen');
const adminApp = document.getElementById('adminApp');
const loginForm = document.getElementById('loginForm');

/* =========================================================
   PROFESSIONAL CENTERED POPUP SYSTEM - REPLACES alert/confirm/prompt
   ========================================================= */
function getProElements(){
  return {
    alertModal: document.getElementById('proAlertModal'),
    alertIcon: document.getElementById('proAlertIcon'),
    alertTitle: document.getElementById('proAlertTitle'),
    alertMsg: document.getElementById('proAlertMessage'),
    alertOk: document.getElementById('proAlertOk'),
    confirmModal: document.getElementById('proConfirmModal'),
    confirmIcon: document.getElementById('proConfirmIcon'),
    confirmTitle: document.getElementById('proConfirmTitle'),
    confirmMsg: document.getElementById('proConfirmMessage'),
    confirmOk: document.getElementById('proConfirmOk'),
    confirmCancel: document.getElementById('proConfirmCancel'),
    promptModal: document.getElementById('proPromptModal'),
    promptTitle: document.getElementById('proPromptTitle'),
    promptMsg: document.getElementById('proPromptMessage'),
    promptInput: document.getElementById('proPromptInput'),
    promptOk: document.getElementById('proPromptOk'),
    promptCancel: document.getElementById('proPromptCancel'),
  };
}

function detectType(msg){
  const m = (msg||'').toLowerCase();
  if(m.includes('✅')||m.includes('success')||m.includes('saved')||m.includes('updated')||m.includes('confirmed')||m.includes('assigned')) return 'success';
  if(m.includes('❌')||m.includes('failed')||m.includes('error')||m.includes('not found')||m.includes('incorrect')) return 'error';
  if(m.includes('⚠️')||m.includes('warning')||m.includes('delete')||m.includes('cannot')||m.includes('required')||m.includes('full')) return 'warning';
  return 'info';
}
function iconForType(type, isConfirm=false){
  if(type==='success') return '<i class="fa-solid fa-check"></i>';
  if(type==='error') return '<i class="fa-solid fa-xmark"></i>';
  if(type==='warning') return '<i class="fa-solid fa-triangle-exclamation"></i>';
  if(isConfirm) return '<i class="fa-solid fa-circle-question"></i>';
  return '<i class="fa-solid fa-circle-info"></i>';
}
function cleanMsg(msg){
  return (msg||'').replace(/✅|❌|⚠️|\u2705|\u274C/g,'').trim();
}

window.proAlert = function(message, title=''){
  return new Promise(resolve=>{
    const el = getProElements();
    if(!el.alertModal){ alert(message); resolve(); return; }
    const type = detectType(message);
    const cleaned = cleanMsg(message);
    el.alertIcon.className = 'pro-icon '+type;
    el.alertIcon.innerHTML = iconForType(type);
    el.alertTitle.textContent = title || (type==='success'?'Success': type==='error'?'Oops!': type==='warning'?'Attention':'Notice');
    el.alertMsg.textContent = cleaned || message;
    el.alertModal.classList.add('active');
    const close = ()=>{ el.alertModal.classList.remove('active'); el.alertOk.removeEventListener('click', close); el.alertModal.removeEventListener('click', onBg); document.removeEventListener('keydown', onKey); resolve(); };
    const onBg = (e)=>{ if(e.target===el.alertModal) close(); };
    const onKey = (e)=>{ if(e.key==='Escape') close(); if(e.key==='Enter') close(); };
    el.alertOk.onclick = close;
    el.alertModal.addEventListener('click', onBg);
    document.addEventListener('keydown', onKey);
    el.alertOk.focus();
  });
};

window.proConfirm = function(message, title='Are you sure?', okText='Confirm', cancelText='Cancel', isDanger=false){
  return new Promise(resolve=>{
    const el = getProElements();
    if(!el.confirmModal){ resolve(confirm(message)); return; }
    const type = detectType(message);
    const cleaned = cleanMsg(message);
    el.confirmIcon.className = 'pro-icon '+(isDanger||type==='error'?'error': type==='warning'?'warning':'info');
    el.confirmIcon.innerHTML = type==='warning'||message.toLowerCase().includes('delete') ? '<i class="fa-solid fa-triangle-exclamation"></i>' : '<i class="fa-solid fa-circle-question"></i>';
    el.confirmTitle.textContent = title;
    el.confirmMsg.textContent = cleaned || message;
    el.confirmOk.textContent = okText;
    el.confirmCancel.textContent = cancelText;
    el.confirmOk.className = 'pro-btn primary '+(isDanger?'danger':'');
    el.confirmModal.classList.add('active');
    const close = (val)=>{ el.confirmModal.classList.remove('active'); el.confirmOk.removeEventListener('click', onOk); el.confirmCancel.removeEventListener('click', onCancel); el.confirmModal.removeEventListener('click', onBg); document.removeEventListener('keydown', onKey); resolve(val); };
    const onOk = ()=> close(true);
    const onCancel = ()=> close(false);
    const onBg = (e)=>{ if(e.target===el.confirmModal) close(false); };
    const onKey = (e)=>{ if(e.key==='Escape') close(false); if(e.key==='Enter') close(true); };
    el.confirmOk.onclick = onOk;
    el.confirmCancel.onclick = onCancel;
    el.confirmModal.addEventListener('click', onBg);
    document.addEventListener('keydown', onKey);
    el.confirmOk.focus();
  });
};

window.proPrompt = function(message, title='Input Required', placeholder='', isPassword=false, defaultValue=''){
  return new Promise(resolve=>{
    const el = getProElements();
    if(!el.promptModal){ resolve(prompt(message)); return; }
    el.promptTitle.textContent = title;
    el.promptMsg.textContent = cleanMsg(message);
    el.promptInput.type = isPassword ? 'password' : 'text';
    el.promptInput.placeholder = placeholder;
    el.promptInput.value = defaultValue||'';
    el.promptModal.classList.add('active');
    setTimeout(()=> el.promptInput.focus(), 100);
    const close = (val)=>{ el.promptModal.classList.remove('active'); el.promptOk.removeEventListener('click', onOk); el.promptCancel.removeEventListener('click', onCancel); el.promptModal.removeEventListener('click', onBg); document.removeEventListener('keydown', onKey); resolve(val); };
    const onOk = ()=> close(el.promptInput.value);
    const onCancel = ()=> close(null);
    const onBg = (e)=>{ if(e.target===el.promptModal) close(null); };
    const onKey = (e)=>{ if(e.key==='Escape') close(null); if(e.key==='Enter') onOk(); };
    el.promptOk.onclick = onOk;
    el.promptCancel.onclick = onCancel;
    el.promptModal.addEventListener('click', onBg);
    document.addEventListener('keydown', onKey);
  });
};

const _nativeAlert = window.alert;
window.alert = function(msg){ window.proAlert(msg); return true; };

window.showToast = function(msg, type='success'){
  const cont = document.getElementById('toastContainer');
  if(!cont) return;
  const t = document.createElement('div');
  t.className = 'pro-toast '+type;
  t.innerHTML = `<i class="fa-solid ${type==='success'?'fa-check-circle':'fa-circle-info'}"></i> <span>${cleanMsg(msg)}</span>`;
  cont.appendChild(t);
  setTimeout(()=>{ t.classList.add('hide'); setTimeout(()=> t.remove(), 250); }, 2800);
};

let currentCalDate = new Date();

function checkLogin(){ 
  if(!supabase) return;
  supabase.auth.getSession().then(({data})=>{ if(data?.session) showApp(); });
}
checkLogin();

if(loginForm){
  loginForm.addEventListener('submit', async (e)=>{
    e.preventDefault();
    const email = document.getElementById('adminEmail').value.trim();
    const pass = document.getElementById('password').value;
    const err = document.getElementById('loginError');
    if(err) err.textContent='';
    if(!supabase){
      if(err) err.textContent='Supabase not connected. Set up Supabase config below first.';
      return;
    }
    const submitBtn = loginForm.querySelector('button[type="submit"]');
    if(submitBtn){ submitBtn.disabled=true; submitBtn.textContent='Logging in...'; }
    const { error } = await supabase.auth.signInWithPassword({ email, password: pass });
    if(submitBtn){ submitBtn.disabled=false; submitBtn.innerHTML='<i class="fa-solid fa-right-to-bracket"></i> Login'; }
    if(error){
      if(err) err.textContent='Invalid email or password';
      return;
    }
    showApp();
  });
}

window.saveConfig = async function(){
  const url = document.getElementById('cfgUrl')?.value.trim();
  const key = document.getElementById('cfgKey')?.value.trim();
  if(url && key){
    localStorage.setItem('sb_url', url);
    localStorage.setItem('sb_key', key);
    await proAlert('Configuration saved! Reloading...', 'Saved'); 
    location.reload();
  } else await proAlert('Please enter both URL and Key', 'Missing Info');
}

function showApp(){
  if(!loginScreen || !adminApp) return;
  loginScreen.style.display='none';
  adminApp.style.display='flex';
  const todayEl = document.getElementById('todayDate');
  if(todayEl) todayEl.textContent = new Date().toLocaleDateString('en-NZ', {weekday:'short', day:'numeric', month:'short'});
  loadDashboard();
  loadBookings();
  loadDriversForAdmin();
  renderCalendar();
  renderCapacityOverview();
}

const togglePassword = document.querySelector('#togglePassword');
const password = document.querySelector('#password');
if(togglePassword && password){
  togglePassword.addEventListener('click', function (e) {
      const type = password.getAttribute('type') === 'password' ? 'text' : 'password';
      password.setAttribute('type', type);
      this.classList.toggle('fa-eye-slash');
  });
}

window.logout = async function() {
  try {
    if (supabase) {
      await supabase.auth.signOut();
    }
  } catch (e) {
    console.warn('Logout error:', e.message);
  } finally {
    localStorage.removeItem('sb_url');
    localStorage.removeItem('sb_key');
    window.location.href = window.location.pathname + '?logout=' + Date.now();
  }
}

window.changePassword = async function(){
  if(!supabase){ await proAlert('Supabase not connected.', 'Error'); return; }
  const current = await proPrompt('Enter your current password to confirm', 'Verify Identity', 'Current password', true);
  if(!current) return;
  const { data: sessionData } = await supabase.auth.getSession();
  const email = sessionData?.session?.user?.email;
  if(!email){ await proAlert('Not logged in.', 'Error'); return; }
  const { error: checkErr } = await supabase.auth.signInWithPassword({ email, password: current });
  if(checkErr){ await proAlert('Current password is incorrect.', 'Authentication Failed'); return; }
  const newPass = await proPrompt('Enter your NEW password (min 6 characters)', 'New Password', 'At least 6 characters', true);
  if(!newPass || newPass.length < 6){ await proAlert('Password must be at least 6 characters.', 'Validation'); return; }
  const confirmPass = await proPrompt('Confirm your NEW password', 'Confirm Password', 'Re-enter new password', true);
  if(newPass !== confirmPass){ await proAlert('Passwords did not match.', 'Validation Error'); return; }
  const { error } = await supabase.auth.updateUser({ password: newPass });
  if(error){ await proAlert('Failed to update password: ' + error.message, 'Error'); return; }
  await proAlert('✅ Password updated successfully.', 'Success');
}

// Navigation
document.querySelectorAll('.nav-btn').forEach(btn=>{
  btn.addEventListener('click', ()=>{
    document.querySelectorAll('.nav-btn').forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
    const page = btn.dataset.page;
    document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));
    const target = document.getElementById('page-'+page);
    if(target) target.classList.add('active');
    const titleEl = document.getElementById('pageTitle');
    if(titleEl) titleEl.textContent = page.charAt(0).toUpperCase()+page.slice(1);
    const subEl = document.getElementById('pageSub');
    if(subEl){
      const subs = {
        dashboard: 'Overview of your moving business',
        bookings: 'Manage all bookings and confirm orders',
        calendar: 'Date conflict check and scheduling',
        drivers: 'Driver management and daily schedule',
        capacity: 'Set booking limits per day and time slot'
      };
      subEl.textContent = subs[page]||'';
    }
    if(page==='calendar') renderCalendar();
    if(page==='drivers'){ loadDriversForAdmin(); loadDriverSchedule(); }
    if(page==='capacity') renderCapacityOverview();
  });
});

async function getBookings(){
  let bookings = [];
  try{
    const local = JSON.parse(localStorage.getItem('flexi_bookings')||'[]');
    bookings = [...local];
  }catch(e){ bookings=[]; }
  if(supabase){
    try{
      const {data} = await supabase.from('bookings').select('*').order('created_at',{ascending:false});
      if(data && data.length) {
        const ids = new Set(bookings.map(b=>b.booking_id));
        data.forEach(d=>{ if(!ids.has(d.booking_id)) bookings.push(d); });
      }
    }catch(e){ console.warn('Supabase fetch failed:', e.message); }
  }
  return bookings.sort((a,b)=> new Date(b.created_at||0) - new Date(a.created_at||0));
}

function getDrivers(){
  try{
    const local = JSON.parse(localStorage.getItem('flexi_drivers')||'[]');
    if(local.length) return local;
  }catch(e){}
  const defaults = [
    {id:'1', name:'Mike Johnson', phone:'021 111 2222', license:'DL12345', vehicle:'20m³ Truck', status:'available', off_dates: []},
    {id:'2', name:'Sarah Lee', phone:'021 333 4444', license:'DL67890', vehicle:'15m³ Van', status:'available', off_dates: []},
    {id:'3', name:'David Smith', phone:'021 555 6666', license:'DL11223', vehicle:'Small Van', status:'available', off_dates: []}
  ];
  localStorage.setItem('flexi_drivers', JSON.stringify(defaults));
  return defaults;
}

function saveDrivers(drivers){
  localStorage.setItem('flexi_drivers', JSON.stringify(drivers));
  if(supabase){
    try{
      supabase.from('drivers').upsert(drivers.map(d=>({
        id:d.id, 
        name:d.name, 
        phone:d.phone, 
        license_no:d.license, 
        vehicle_assigned:d.vehicle, 
        status:d.status,
        off_dates: d.off_dates || []
      }))).then(()=>{});
    }catch(e){}
  }
}

async function loadDashboard(){
  const bookings = await getBookings();
  const total = bookings.length;
  const pending = bookings.filter(b=>b.status==='pending').length;
  const confirmed = bookings.filter(b=>b.status==='confirmed').length;
  const today = new Date().toISOString().split('T')[0];
  const todayMoves = bookings.filter(b=>b.preferred_date===today).length;

  const set = (id,val)=>{ const el=document.getElementById(id); if(el) el.textContent=val; };
  set('statTotal', total);
  set('statPending', pending);
  set('statConfirmed', confirmed);
  set('statToday', todayMoves);

  const recent = bookings.slice(0,5);
  const recentEl = document.getElementById('recentList');
  if(recentEl){
    recentEl.innerHTML = recent.length ? recent.map(b=>`<div class="recent-item"><div style="min-width:0"><strong>${b.full_name||'No name'}</strong><br><span style="font-size:11px;color:#6b7280">${b.booking_id} • ${b.move_type||''} • ${b.preferred_date||''}</span></div><span class="badge ${b.status||'pending'}">${b.status||'pending'}</span></div>`).join('') : '<p style="font-size:13px;color:#6b7280">No bookings yet. Submit via inquiry.html</p>';
  }

  const chartEl = document.getElementById('weeklyChart');
  if(chartEl){
    const days = [];
    for(let i=6;i>=0;i--){ const d=new Date(); d.setDate(d.getDate()-i); days.push(d.toISOString().split('T')[0]); }
    const counts = days.map(d=>bookings.filter(b=>b.preferred_date===d || (b.created_at||'').startsWith(d)).length);
    const max = Math.max(1, ...counts);
    chartEl.innerHTML = counts.map((c,i)=>{
      const h = (c/max)*100;
      const label = new Date(days[i]).toLocaleDateString('en-NZ',{weekday:'short'});
      return `<div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:4px;min-width:0"><div class="bar" style="height:${h}%;width:100%"><span>${c}</span></div><small style="font-size:10px">${label}</small></div>`;
    }).join('');
  }

  const serviceEl = document.getElementById('serviceBreakdown');
  if(serviceEl){
    const types = {};
    bookings.forEach(b=>{ const t=b.move_type||'Unknown'; types[t] = (types[t]||0)+1; });
    const totalTypes = Object.values(types).reduce((a,b)=>a+b,0) || 1;
    serviceEl.innerHTML = Object.entries(types).map(([k,v])=>{
      const pct = Math.round(v/totalTypes*100);
      return `<div class="service-bar"><span style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${k}</span><div class="track"><div class="fill" style="width:${pct}%"></div></div><span>${v}</span></div>`;
    }).join('') || '<p style="font-size:12px;color:#6b7280">No data yet</p>';
  }
}

let allBookingsCache = [];

async function loadBookings(){
  const bookings = await getBookings();
  allBookingsCache = bookings;
  renderBookingsTable(bookings);
  
  const search = document.getElementById('searchBookings');
  const filter = document.getElementById('filterStatus');
  
  if(search && !search.dataset.bound){
    search.dataset.bound='1';
    search.addEventListener('input', (e)=>{
      const q = e.target.value.toLowerCase();
      const filtered = allBookingsCache.filter(b=> 
        (b.full_name||'').toLowerCase().includes(q) || 
        (b.phone||'').includes(q) || 
        (b.booking_id||'').toLowerCase().includes(q) || 
        (b.move_type||'').toLowerCase().includes(q) ||
        (b.email||'').toLowerCase().includes(q)
      );
      renderBookingsTable(filtered);
    });
  }
  if(filter && !filter.dataset.bound){
    filter.dataset.bound='1';
    filter.addEventListener('change', (e)=>{
      const v = e.target.value;
      const filtered = v ? allBookingsCache.filter(b=>b.status===v) : allBookingsCache;
      renderBookingsTable(filtered);
    });
  }
}

function renderBookingsTable(list){
  const tbody = document.getElementById('bookingsTableBody');
  if(!tbody) return;
  if(!list.length){
    tbody.innerHTML='<tr><td colspan="7" style="text-align:center;padding:20px;color:#6b7280">No bookings found - submit via inquiry.html to test</td></tr>';
    return;
  }
  tbody.innerHTML = list.map(b=>{
    const conflict = checkConflictSync(b.preferred_date, b.booking_id);
    const isOverdue = b.preferred_date && new Date(b.preferred_date) < new Date(new Date().setHours(0,0,0,0)) && b.status==='pending';
    return `<tr style="${conflict.isConflict ? 'background:#fef2f2' : isOverdue ? 'background:#fffbeb' : ''}">
      <td><strong>${b.booking_id}</strong>${conflict.isConflict?'<br><small style="color:#dc2626;font-weight:700">⚠️ FULL</small>':''}${isOverdue?'<br><small style="color:#d97706">⏰ Overdue</small>':''}</td>
      <td><span style="font-weight:600">${b.full_name||''}</span><br><small style="color:#6b7280;font-size:11px">${b.email||''}</small></td>
      <td><a href="tel:${b.phone||''}" style="color:#111827;text-decoration:none">${b.phone||''}</a></td>
      <td>${b.preferred_date||''}<br><small style="color:#6b7280">${b.time_slot||''}</small></td>
      <td>${b.move_type||''}<br><small style="color:#6b7280">${b.vehicle_type||''} • ${b.bedrooms||''}Bed</small></td>
      <td><span class="badge ${b.status||'pending'}">${b.status||'pending'}</span>${b.driver_name?`<br><small style="font-size:11px">👤 ${b.driver_name}</small>`:''}</td>
      <td><div style="display:flex;gap:4px;flex-wrap:wrap"><button class="btn-sm" onclick="viewBooking('${b.booking_id}')">View</button><button class="btn-sm green" onclick="confirmOrder('${b.booking_id}')">Confirm</button></div></td>
    </tr>`;
  }).join('');
}

function checkConflictSync(date, excludeId){
  if(!date) return {isConflict:false};
  const max = parseInt(localStorage.getItem('max_per_day')||'3');
  const count = allBookingsCache.filter(b=>b.preferred_date===date && b.booking_id!==excludeId && b.status!=='cancelled').length;
  return {isConflict: count>=max, count, max};
}

// ==================== BOOKING ACTIONS ====================

window.viewBooking = async function(id){
  const bookings = await getBookings();
  const b = bookings.find(x=>x.booking_id===id);
  if(!b) return await proAlert('Booking not found', 'Error');
  const conflict = checkConflictSync(b.preferred_date, id);
  const modal = document.getElementById('detailModal');
  const body = document.getElementById('detailBody');
  if(!modal || !body) return;
  
  body.innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:12px">
      <div><h3 style="font-size:18px;margin:0">${b.booking_id} - ${b.full_name||''}</h3><small style="color:#6b7280">Created: ${new Date(b.created_at||Date.now()).toLocaleString('en-NZ')}</small></div>
      <span class="badge ${b.status||'pending'}" style="font-size:12px;padding:6px 12px">${b.status||'pending'}</span>
    </div>
    ${conflict.isConflict?`<div style="background:#fef2f2;border:1px solid #fecaca;padding:10px 14px;border-radius:10px;margin:14px 0;font-size:12px;color:#991b1b"><strong>⚠️ Date Conflict:</strong> ${b.preferred_date} has ${conflict.count}/${conflict.max} bookings (FULL). You can still confirm with warning.</div>`:''}
    <div style="margin-top:16px;display:grid;gap:10px;font-size:13px;line-height:1.5">
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
        <p><strong>📞 Phone:</strong> ${b.phone||''} ${b.alt_phone?`/ ${b.alt_phone}`:''}<br><a href="tel:${b.phone||''}" style="color:#15803d;font-weight:600;margin-right:10px">Call</a><a href="https://wa.me/${(b.phone||'').replace(/[^0-9]/g,'')}" target="_blank" style="color:#25D366;font-weight:600">WhatsApp</a></p>
        <p><strong>✉️ Email:</strong> ${b.email||''}</p>
      </div>
      <p><strong>🏠 Move:</strong> ${b.move_type||''} - ${b.bedrooms||''} Bed - ${b.floor_access||''}</p>
      <p><strong>📍 From:</strong> ${b.pickup_address||''}</p>
      <p><strong>📍 To:</strong> ${b.delivery_address||''}</p>
      <p><strong>📅 Date:</strong> ${b.preferred_date||''} (${b.time_slot||''}) ${b.alternative_date?`• Alt: ${b.alternative_date}`:''}</p>
      <p><strong>🚚 Vehicle:</strong> ${b.vehicle_type||''} - ${b.movers_count||''} movers ${b.driver_name?`• <strong>Driver: ${b.driver_name}</strong>`:''}</p>
      <p><strong>🔧 Services:</strong> ${(b.additional_services||[]).join(', ')||'None'}</p>
      <p><strong>📦 Inventory:</strong> ${(b.inventory||[]).map(i=>`${i.name} x${i.qty}${i.fragile?' (Fragile)':''}`).join(', ')||'Not provided'}</p>
      <p><strong>📝 Notes:</strong> ${b.special_instructions||''} ${b.access_notes?`<br><small>Access: ${b.access_notes}</small>`:''}</p>
      <div style="background:#f9fafb;border:1px solid #f3f4f6;border-radius:10px;padding:12px;margin-top:8px">
        <strong>Source:</strong> ${b.source||'N/A'} • <strong>ID:</strong> ${b.booking_id}
      </div>
      <div style="margin-top:16px;display:flex;gap:8px;flex-wrap:wrap">
        <button class="btn-sm green" onclick="confirmOrder('${b.booking_id}')" style="padding:8px 14px"><i class="fa-solid fa-check"></i> Confirm Order</button>
        <button class="btn-sm" onclick="editBooking('${b.booking_id}')" style="padding:8px 14px"><i class="fa-solid fa-pen"></i> Edit</button>
        <button class="btn-sm" onclick="openDriverSelect('${b.booking_id}')" style="padding:8px 14px"><i class="fa-solid fa-user-check"></i> Assign Driver</button>
        <button class="btn-sm" onclick="updateStatus('${b.booking_id}','completed')" style="padding:8px 14px"><i class="fa-solid fa-circle-check"></i> Complete</button>
        <button class="btn-sm" style="color:#dc2626;border-color:#fecaca;padding:8px 14px" onclick="updateStatus('${b.booking_id}','cancelled')"><i class="fa-solid fa-xmark"></i> Cancel</button>
        <button class="btn-sm" style="color:#dc2626;padding:8px 14px" onclick="deleteBooking('${b.booking_id}')"><i class="fa-solid fa-trash"></i> Delete</button>
      </div>
    </div>
  `;
  modal.classList.add('active');
}

window.editBooking = async function(id){
  const detailModal = document.getElementById('detailModal');
  if(detailModal) detailModal.classList.remove('active');
  
  const bookings = await getBookings();
  const b = bookings.find(x=>x.booking_id===id);
  if(!b) return;
  
  const setVal = (eid,val)=>{ const e=document.getElementById(eid); if(e) e.value=val||''; };
  setVal('editBookingId', id);
  setVal('editName', b.full_name);
  setVal('editPhone', b.phone);
  setVal('editEmail', b.email);
  setVal('editMoveType', b.move_type);
  setVal('editDate', b.preferred_date);
  setVal('editSlot', b.time_slot);
  setVal('editVehicle', b.vehicle_type);
  setVal('editStatus', b.status);
  setVal('editPickup', b.pickup_address);
  setVal('editDelivery', b.delivery_address);
  setVal('editNotes', (b.special_instructions||'') + ' ' + (b.access_notes||''));
  
  const modal = document.getElementById('editModal');
  if(modal) modal.classList.add('active');
}

window.closeEdit = function(){
  const m=document.getElementById('editModal');
  if(m) m.classList.remove('active');
}

window.closeDetail = function(){
  const m=document.getElementById('detailModal');
  if(m) m.classList.remove('active');
}

const editForm = document.getElementById('editForm');
if(editForm){
  editForm.addEventListener('submit', async (e)=>{
    e.preventDefault();
    const id = document.getElementById('editBookingId').value;
    let bookings = JSON.parse(localStorage.getItem('flexi_bookings')||'[]');
    bookings = bookings.map(b=>{
      if(b.booking_id!==id) return b;
      return {
        ...b,
        full_name: document.getElementById('editName').value,
        phone: document.getElementById('editPhone').value,
        email: document.getElementById('editEmail').value,
        move_type: document.getElementById('editMoveType').value,
        preferred_date: document.getElementById('editDate').value,
        time_slot: document.getElementById('editSlot').value,
        vehicle_type: document.getElementById('editVehicle').value,
        status: document.getElementById('editStatus').value,
        pickup_address: document.getElementById('editPickup').value,
        delivery_address: document.getElementById('editDelivery').value,
        special_instructions: document.getElementById('editNotes').value,
        updated_at: new Date().toISOString()
      };
    });
    localStorage.setItem('flexi_bookings', JSON.stringify(bookings));
    if(supabase){
      try{
        await supabase.from('bookings').update({
          full_name: document.getElementById('editName').value,
          phone: document.getElementById('editPhone').value,
          email: document.getElementById('editEmail').value,
          move_type: document.getElementById('editMoveType').value,
          status: document.getElementById('editStatus').value,
          preferred_date: document.getElementById('editDate').value,
          time_slot: document.getElementById('editSlot').value,
          vehicle_type: document.getElementById('editVehicle').value,
          pickup_address: document.getElementById('editPickup').value,
          delivery_address: document.getElementById('editDelivery').value
        }).eq('booking_id', id);
      }catch(e){ console.warn(e.message); }
    }
    closeEdit();
    loadDashboard();
    loadBookings();
    loadDriverSchedule();
    await proAlert('✅ Updated '+id, 'Updated');
  });
}

window.updateStatus = async function(id, status){
  let bookings = JSON.parse(localStorage.getItem('flexi_bookings')||'[]');
  bookings = bookings.map(x=> x.booking_id===id ? {...x, status, updated_at: new Date().toISOString()} : x);
  localStorage.setItem('flexi_bookings', JSON.stringify(bookings));
  
  if(supabase){
    try{ await supabase.from('bookings').update({status}).eq('booking_id', id); }catch(e){}
  }
  closeDetail();
  loadDashboard();
  loadBookings();
  loadDriversForAdmin();
  loadDriverSchedule();
}

window.deleteBooking = async function(id){
  if(!(await proConfirm('Delete '+id+'? This cannot be undone.', 'Delete Booking?', 'Delete', 'Cancel', true))) return;
  let bookings = JSON.parse(localStorage.getItem('flexi_bookings')||'[]');
  bookings = bookings.filter(b=>b.booking_id!==id);
  localStorage.setItem('flexi_bookings', JSON.stringify(bookings));
  if(supabase){
    try{ await supabase.from('bookings').delete().eq('booking_id', id); }catch(e){}
  }
  closeDetail();
  loadDashboard();
  loadBookings();
  loadDriverSchedule();
}

// ==================== DRIVER SELECTION & AUTO UPDATE ====================

let selectedDriverId = null;
let currentAssignBookingId = null;

window.openDriverSelect = async function(bookingId){
  currentAssignBookingId = bookingId;
  selectedDriverId = null;
  const bookings = await getBookings();
  const b = bookings.find(x=>x.booking_id===bookingId);
  const targetDate = b?.preferred_date;
  const drivers = getDrivers();
  
  const modal = document.getElementById('driverSelectModal');
  const listEl = document.getElementById('driverSelectList');
  const titleEl = document.getElementById('driverSelectTitle');
  if(!modal || !listEl) return await proAlert('Driver modal not found', 'Error');
  
  if(titleEl) titleEl.innerHTML = `<i class="fa-solid fa-user-check"></i> Assign Driver to ${bookingId} - ${b?.full_name||''}`;
  
  if(!drivers.length){
    listEl.innerHTML = '<div style="padding:30px;text-align:center;color:#6b7280"><i class="fa-solid fa-users" style="font-size:24px;margin-bottom:8px;display:block"></i>No drivers available.<br><small>Add drivers in Drivers page.</small></div>';
  } else {
    listEl.innerHTML = drivers.map(d=>{
      // Date-wise Status check for display inside modal
      const isOff = d.off_dates && d.off_dates.includes(targetDate);
      const isJobAssigned = bookings.some(x => x.preferred_date === targetDate && (x.driver_id === d.id || x.driver_name === d.name) && x.status === 'confirmed');
      const dateStatus = isOff ? 'off' : isJobAssigned ? 'on_job' : 'available';

      return `
        <div class="driver-option" data-id="${d.id}" onclick="selectDriver('${d.id}')">
          <div class="drv-info">
            <div class="drv-avatar"><i class="fa-solid fa-user"></i></div>
            <div style="min-width:0">
              <div class="drv-name">${d.name}</div>
              <div class="drv-meta">${d.phone} • ${d.vehicle}</div>
            </div>
          </div>
          <div style="display:flex;align-items:center;gap:8px;flex-shrink:0">
            <div class="drv-status ${dateStatus}">${dateStatus==='available'?'Available':dateStatus==='on_job'?'On Job':'Off Duty'}</div>
            <i class="fa-solid fa-chevron-right" style="color:#9ca3af;font-size:12px"></i>
          </div>
        </div>
      `;
    }).join('');
  }
  modal.classList.add('active');
  const detailModal = document.getElementById('detailModal');
  if(detailModal) detailModal.classList.remove('active');
}

window.selectDriver = function(id){
  selectedDriverId = id;
  document.querySelectorAll('.driver-option').forEach(el=>el.classList.remove('selected'));
  const selected = document.querySelector(`.driver-option[data-id="${id}"]`);
  if(selected) selected.classList.add('selected');
}

// Order Assign & Auto Update Logic
window.confirmDriverAssign = async function(){
  if(!selectedDriverId){
    await proAlert('⚠️ Please select a driver first', 'Attention');
    return;
  }
  if(!currentAssignBookingId){
    await proAlert('No booking selected', 'Error');
    return;
  }
  const drivers = getDrivers();
  const driver = drivers.find(d=>d.id===selectedDriverId);
  if(!driver) return await proAlert('Driver not found', 'Error');
  
  let bookings = JSON.parse(localStorage.getItem('flexi_bookings')||'[]');
  
  // Update order with driver info and auto-confirm status
  bookings = bookings.map(b=> b.booking_id===currentAssignBookingId ? {
    ...b, 
    driver_id: driver.id, 
    driver_name: driver.name, 
    status: 'confirmed', // Auto Update Order Status
    updated_at: new Date().toISOString()
  } : b);
  localStorage.setItem('flexi_bookings', JSON.stringify(bookings));
  
  if(supabase){
    try{
      await supabase.from('bookings').update({
        driver_id: driver.id, 
        driver_name: driver.name,
        status: 'confirmed'
      }).eq('booking_id', currentAssignBookingId);
    }catch(e){ console.warn(e.message); }
  }
  
  closeDriverSelect();
  showToast(`✅ Driver ${driver.name} assigned & Order Confirmed!`, 'success');
  
  // Refresh UI Components
  loadBookings();
  loadDashboard();
  loadDriversForAdmin();
  loadDriverSchedule(); 
}

window.closeDriverSelect = function(){
  const m=document.getElementById('driverSelectModal');
  if(m) m.classList.remove('active');
  selectedDriverId=null;
  currentAssignBookingId=null;
}

window.confirmOrder = async function(id){
  const bookings = await getBookings();
  const b = bookings.find(x=>x.booking_id===id);
  if(!b) return await proAlert('Booking not found: '+id, 'Error');
  
  const conflict = checkConflictSync(b.preferred_date, id);
  if(conflict.isConflict){
    if(!(await proConfirm(`Date ${b.preferred_date} has ${conflict.count}/${conflict.max} bookings (FULL).\nStill confirm ${id}?`, 'Date Full - Confirm Anyway?', 'Yes, Confirm', 'Cancel', false))) return;
  }
  
  let bookingsLocal = JSON.parse(localStorage.getItem('flexi_bookings')||'[]');
  bookingsLocal = bookingsLocal.map(x=> x.booking_id===id ? {...x, status:'confirmed', confirmed_at: new Date().toISOString()} : x);
  localStorage.setItem('flexi_bookings', JSON.stringify(bookingsLocal));
  
  if(supabase){
    try{ await supabase.from('bookings').update({status:'confirmed'}).eq('booking_id', id); }catch(e){}
  }
  
  closeDetail();
  loadDashboard();
  loadBookings();
  loadDriverSchedule();
  
  if(await proConfirm(`${id} Confirmed!\nDo you want to assign a driver now?`, 'Booking Confirmed', 'Assign Driver', 'Later')){
    openDriverSelect(id);
  } else {
    await proAlert(`✅ ${id} Confirmed successfully!`, 'Confirmed');
  }
}

// ==================== CALENDAR & CAPACITY ====================

window.changeMonth = function(dir){
  currentCalDate.setMonth(currentCalDate.getMonth()+dir);
  renderCalendar();
}

function getCapacitySettings(){
  return {
    maxPerDay: parseInt(localStorage.getItem('max_per_day')||'3'),
    morning: parseInt(localStorage.getItem('cap_morning')||'2'),
    midday: parseInt(localStorage.getItem('cap_midday')||'2'),
    afternoon: parseInt(localStorage.getItem('cap_afternoon')||'2'),
    flexible: parseInt(localStorage.getItem('cap_flexible')||'3')
  };
}

window.saveCapacity = async function(){
  const getV = (id)=>document.getElementById(id)?.value||'3';
  localStorage.setItem('max_per_day', getV('maxPerDay'));
  localStorage.setItem('cap_morning', getV('capMorning'));
  localStorage.setItem('cap_midday', getV('capMidday'));
  localStorage.setItem('cap_afternoon', getV('capAfternoon'));
  localStorage.setItem('cap_flexible', getV('capFlexible'));
  await proAlert('✅ Capacity settings saved!', 'Success');
  renderCalendar();
  renderCapacityOverview();
}

function renderCapacityOverview(){
  const overviewEl = document.getElementById('capacityOverview');
  if(!overviewEl) return;
  const cap = getCapacitySettings();
  getBookings().then(bookings=>{
    let html = '';
    for(let i=0;i<14;i++){
      const d = new Date();
      d.setDate(d.getDate()+i);
      const dateStr = d.toISOString().split('T')[0];
      const dayBookings = bookings.filter(b=>b.preferred_date===dateStr && b.status!=='cancelled');
      const pct = Math.min(100, Math.round(dayBookings.length/cap.maxPerDay*100));
      const isFull = dayBookings.length>=cap.maxPerDay;
      const isAlmost = dayBookings.length===cap.maxPerDay-1;
      html+=`<div style="display:grid;grid-template-columns:80px 1fr 50px;gap:8px;align-items:center;font-size:12px;padding:8px;background:${isFull?'#fef2f2':isAlmost?'#fefce8':'#f9fafb'};border-radius:8px;border:1px solid ${isFull?'#fecaca':isAlmost?'#fde68a':'#f3f4f6'}"><span><strong>${d.toLocaleDateString('en-NZ',{month:'short', day:'numeric'})}</strong><br><small>${d.toLocaleDateString('en-NZ',{weekday:'short'})}</small></span><div><div style="height:8px;background:#e5e7eb;border-radius:999px;overflow:hidden"><div style="height:100%;width:${pct}%;background:${isFull?'#dc2626':isAlmost?'#eab308':'#15803d'}"></div></div><small>${dayBookings.length}/${cap.maxPerDay} bookings</small></div><span style="font-weight:700;color:${isFull?'#dc2626':isAlmost?'#a16207':'#15803d'}">${isFull?'FULL':isAlmost?'ALMOST':pct+'%'}</span></div>`;
    }
    overviewEl.innerHTML = html;
  });
}

function renderCalendar(){
  const grid = document.getElementById('calendarGrid');
  const monthYearEl = document.getElementById('calMonthYear');
  if(!grid) return;
  const year = currentCalDate.getFullYear(), month = currentCalDate.getMonth();
  if(monthYearEl) monthYearEl.textContent = currentCalDate.toLocaleDateString('en-NZ',{month:'long', year:'numeric'});
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month+1, 0).getDate();
  let html = '';
  const dayNames = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  html += dayNames.map(d=>`<div style="font-size:11px;font-weight:700;text-align:center;padding:8px;color:#6b7280;background:#f9fafb;border-radius:6px">${d}</div>`).join('');
  for(let i=0;i<firstDay;i++) html+=`<div class="calendar-cell" style="background:#f9fafb;border:1px dashed #e5e7eb"></div>`;
  getBookings().then(bookings=>{
    const cap = getCapacitySettings();
    for(let d=1; d<=daysInMonth; d++){
      const dateStr = `${year}-${String(month+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
      const dayBookings = bookings.filter(b=>b.preferred_date===dateStr && b.status!=='cancelled');
      const pending = dayBookings.filter(b=>b.status==='pending').length;
      const confirmed = dayBookings.filter(b=>b.status==='confirmed').length;
      const isFull = dayBookings.length>=cap.maxPerDay;
      const isAlmost = dayBookings.length===cap.maxPerDay-1 && !isFull;
      const isToday = dateStr===new Date().toISOString().split('T')[0];
      const isPast = new Date(dateStr) < new Date(new Date().setHours(0,0,0,0));
      html+=`<div class="calendar-cell ${isToday?'today':''}" style="${isFull?'background:#fef2f2;border-color:#fecaca':isAlmost?'background:#fefce8;border-color:#fde68a':''}${isPast?';opacity:.5':''};cursor:pointer" onclick="showDayDetail('${dateStr}')"><div class="day" style="display:flex;justify-content:space-between;align-items:center"><span>${d}</span> ${isFull?'<span style="font-size:7px;background:#dc2626;color:#fff;padding:1px 4px;border-radius:999px">FULL</span>':isAlmost?'<span style="font-size:7px;background:#eab308;color:#fff;padding:1px 4px;border-radius:999px">ALMOST</span>':''}</div>${dayBookings.length?`<div style="font-size:10px;font-weight:600;margin-top:2px;color:${isFull?'#991b1b':isAlmost?'#854d0e':'#374151'}">${dayBookings.length}/${cap.maxPerDay}</div>`:''}<div class="dots" style="margin-top:4px">${dayBookings.slice(0,6).map(b=>`<span class="dot-book" style="background:${b.status==='confirmed'?'#15803d':b.status==='pending'?'#eab308':'#6b7280'}" title="${b.booking_id}"></span>`).join('')}${dayBookings.length>6?`<span style="font-size:9px">+${dayBookings.length-6}</span>`:''}</div>${dayBookings.length?`<div style="font-size:9px;margin-top:2px"><span style="color:#15803d">${confirmed}C</span> <span style="color:#eab308">${pending}P</span></div>`:''}</div>`;
    }
    grid.innerHTML = html;
    renderCapacityOverview();
    const capSettings = getCapacitySettings();
    const setVal = (id,val)=>{ const el=document.getElementById(id); if(el) el.value=val; };
    setVal('maxPerDay', capSettings.maxPerDay);
    setVal('capMorning', capSettings.morning);
    setVal('capMidday', capSettings.midday);
    setVal('capAfternoon', capSettings.afternoon);
    setVal('capFlexible', capSettings.flexible);
  });
}

window.showDayDetail = async function(dateStr){
  const bookings = await getBookings();
  const dayBookings = bookings.filter(b=>b.preferred_date===dateStr);
  const detailEl = document.getElementById('calendarDayDetail');
  if(!detailEl) return;
  detailEl.style.display='block';
  if(!dayBookings.length){
    detailEl.innerHTML = `<h4>${dateStr} - No bookings</h4><p style="font-size:12px;color:#6b7280">No moves scheduled. Capacity available.</p><button class="btn-sm" onclick="this.parentElement.style.display='none'">Close</button>`;
    return;
  }
  detailEl.innerHTML = `<div style="display:flex;justify-content:space-between;align-items:center"><h4>${dateStr} - ${dayBookings.length} booking(s)</h4><button class="btn-sm" onclick="this.closest('#calendarDayDetail').style.display='none'">Close</button></div><div style="margin-top:12px;display:grid;gap:8px">${dayBookings.map(b=>`<div style="border:1px solid #e5e7eb;border-radius:8px;padding:10px;display:flex;justify-content:space-between;align-items:center"><div><strong>${b.booking_id}</strong> - ${b.full_name||''}<br><small>${b.move_type||''} • ${b.time_slot||''} • <span class="badge ${b.status||'pending'}">${b.status||'pending'}</span></small></div><button class="btn-sm" onclick="viewBooking('${b.booking_id}')">View</button></div>`).join('')}</div>`;
  detailEl.scrollIntoView({behavior:'smooth', block:'nearest'});
}

// ==================== DRIVER MANAGEMENT & DATE-WISE SCHEDULE ====================

function loadDriversForAdmin(){
  const drivers = getDrivers();
  const el = document.getElementById('driversList');
  const statsEl = document.getElementById('driverStats');
  if(el){
    el.innerHTML = drivers.length ? drivers.map(d=>`
      <div style="background:#fff;border:1px solid #e5e7eb;border-radius:12px;padding:14px;display:flex;justify-content:space-between;align-items:center">
        <div style="display:flex;gap:12px;align-items:center;min-width:0">
          <div style="width:44px;height:44px;background:#f0fdf4;color:#15803d;border-radius:10px;display:flex;align-items:center;justify-content:center;flex-shrink:0"><i class="fa-solid fa-user"></i></div>
          <div style="min-width:0"><strong style="font-size:14px">${d.name}</strong><br><small style="color:#6b7280;font-size:11px;word-break:break-all">${d.phone} • ${d.vehicle} • ${d.license||''}</small></div>
        </div>
        <div style="display:flex;flex-direction:column;gap:6px;flex-shrink:0">
          <button class="btn-sm" onclick="editDriver('${d.id}')">Edit</button>
          <button class="btn-sm" style="color:#dc2626" onclick="deleteDriver('${d.id}')">Delete</button>
        </div>
      </div>
    `).join('') : '<p style="font-size:13px;color:#6b7280">No drivers - Add one with Add Driver button</p>';
  }
  if(statsEl){
    statsEl.innerHTML = `<div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:10px;padding:12px;text-align:center"><strong style="font-size:20px;color:#15803d">${drivers.length}</strong><br><small style="font-size:11px">Total Drivers</small></div>`;
  }
  const dateInput = document.getElementById('driverScheduleDate');
  if(dateInput && !dateInput.value) dateInput.value = new Date().toISOString().split('T')[0];
}

// Date-wise Driver Schedule with Dynamic Auto-Update & Select
window.loadDriverSchedule = async function(){
  const dateEl = document.getElementById('driverScheduleDate');
  const viewEl = document.getElementById('driverScheduleView');
  if(!dateEl || !viewEl) return;
  const date = dateEl.value || new Date().toISOString().split('T')[0];
  const bookings = await getBookings();
  const dayBookings = bookings.filter(b=>b.preferred_date===date && b.status!=='cancelled');
  const drivers = getDrivers();
  
  if(!drivers.length){
    viewEl.innerHTML = `<p style="font-size:12px;color:#6b7280;padding:12px;background:#f9fafb;border-radius:8px">No drivers found.</p>`;
    return;
  }
  
  viewEl.innerHTML = drivers.map(d=>{
    const myJobs = dayBookings.filter(b=> (b.driver_id===d.id || b.driver_name===d.name) && b.status==='confirmed');
    const offDates = d.off_dates || [];
    let dateStatus = 'available';
    
    if(offDates.includes(date)){
      dateStatus = 'off';
    } else if(myJobs.length > 0){
      dateStatus = 'on_job'; // Auto updated status based on confirmed orders for this date
    }

    const bgClr = dateStatus==='available'?'#f0fdf4':dateStatus==='on_job'?'#fefce8':'#fef2f2';
    const txtClr = dateStatus==='available'?'#15803d':dateStatus==='on_job'?'#a16207':'#dc2626';

    return `
      <div style="border:1px solid #e5e7eb;border-radius:10px;padding:12px;background:#fff;margin-bottom:8px">
        <div style="display:flex;justify-content:space-between;align-items:center">
          <div>
            <strong style="font-size:13px">${d.name}</strong>
            <br><small style="color:#6b7280">${d.vehicle} • ${d.phone}</small>
          </div>
          <select onchange="updateDriverDateStatus('${d.id}', '${date}', this.value)" 
                  style="padding:4px 8px;border-radius:6px;font-size:11px;font-weight:600;background:${bgClr};color:${txtClr};border:1px solid #e5e7eb;outline:none;cursor:pointer">
            <option value="available" ${dateStatus==='available'?'selected':''}>Available</option>
            <option value="on_job" ${dateStatus==='on_job'?'selected':''}>On Job</option>
            <option value="off" ${dateStatus==='off'?'selected':''}>Off Duty</option>
          </select>
        </div>
        <div style="margin-top:8px;font-size:12px">
          ${myJobs.length ? myJobs.map(j=>`
            <div style="padding:6px 10px;background:#f0fdf4;border:1px solid #bbf7d0;border-radius:6px;margin-top:4px;font-size:11px;color:#15803d">
              <strong>⏰ ${j.time_slot||''}</strong> - ${j.booking_id} (${j.full_name||''})
            </div>
          `).join('') : '<span style="font-size:11px;color:#9ca3af">No confirmed jobs assigned for this date</span>'}
        </div>
      </div>
    `;
  }).join('');
}

// Update driver status for a specific date
window.updateDriverDateStatus = async function(driverId, dateStr, newStatus){
  let drivers = getDrivers();
  drivers = drivers.map(d=>{
    if(d.id === driverId){
      let offDates = d.off_dates || [];
      if(newStatus === 'off'){
        if(!offDates.includes(dateStr)) offDates.push(dateStr);
      } else {
        offDates = offDates.filter(dt => dt !== dateStr);
      }
      return { ...d, off_dates: offDates };
    }
    return d;
  });

  saveDrivers(drivers);
  showToast(`Driver status updated for ${dateStr}`, 'success');
  loadDriverSchedule();
  loadDriversForAdmin();
}

window.openAddDriver = function(){
  const idEl=document.getElementById('driverEditId');
  if(idEl) idEl.value='';
  const form=document.getElementById('driverForm');
  if(form) form.reset();
  const m=document.getElementById('addDriverModal');
  if(m) m.classList.add('active');
}

window.closeAddDriver = function(){
  const m=document.getElementById('addDriverModal');
  if(m) m.classList.remove('active');
}

window.editDriver = function(id){
  const drivers = getDrivers();
  const d = drivers.find(x=>x.id===id);
  if(!d) return;
  const setV = (eid,val)=>{ const e=document.getElementById(eid); if(e) e.value=val||''; };
  setV('driverEditId', id);
  setV('drvName', d.name);
  setV('drvPhone', d.phone);
  setV('drvLicense', d.license);
  setV('drvVehicle', d.vehicle);
  const m=document.getElementById('addDriverModal');
  if(m) m.classList.add('active');
}

window.deleteDriver = async function(id){
  if(!(await proConfirm('Delete driver? This will not affect bookings.', 'Delete Driver?', 'Delete', 'Cancel', true))) return;
  let drivers = getDrivers();
  drivers = drivers.filter(d=>d.id!==id);
  saveDrivers(drivers);
  loadDriversForAdmin();
  loadDriverSchedule();
}

const driverForm = document.getElementById('driverForm');
if(driverForm){
  driverForm.addEventListener('submit', async (e)=>{
    e.preventDefault();
    const editId = document.getElementById('driverEditId')?.value;
    const name = document.getElementById('drvName')?.value||'';
    const phone = document.getElementById('drvPhone')?.value||'';
    const license = document.getElementById('drvLicense')?.value||'';
    const vehicle = document.getElementById('drvVehicle')?.value||'';
    if(!name || !phone){ await proAlert('Name & Phone required', 'Validation'); return; }
    let drivers = getDrivers();
    if(editId){
      drivers = drivers.map(d=> d.id===editId ? {...d, name, phone, license, vehicle} : d);
    } else {
      drivers.push({id: Date.now().toString(), name, phone, license, vehicle, status:'available', off_dates:[]});
    }
    saveDrivers(drivers);
    closeAddDriver();
    loadDriversForAdmin();
    loadDriverSchedule();
  });
}

window.exportCSV = async function(){
  if(!allBookingsCache.length){ await proAlert('No data to export', 'No Data'); return; }
  const headers = ['booking_id','full_name','phone','email','move_type','pickup','delivery','date','time_slot','vehicle','status','driver'];
  const rows = allBookingsCache.map(b=> [b.booking_id, `"${(b.full_name||'').replace(/"/g,'')}"`, b.phone||'', b.email||'', b.move_type||'', `"${(b.pickup_address||'').replace(/"/g,'')}"`, `"${(b.delivery_address||'').replace(/"/g,'')}"`, b.preferred_date||'', b.time_slot||'', b.vehicle_type||'', b.status||'', b.driver_name||''].join(','));
  const csv = [headers.join(','), ...rows].join('\n');
  const blob = new Blob([csv], {type:'text/csv'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href=url;
  a.download=`flexi-bookings-${new Date().toISOString().split('T')[0]}.csv`;
  a.click();
}

setTimeout(()=>{
  const header = document.querySelector('#page-bookings .card-header');
  if(header && !document.getElementById('exportBtn')){
    const btn = document.createElement('button');
    btn.id='exportBtn';
    btn.textContent='Export CSV';
    btn.className='btn-sm green';
    btn.style.marginLeft='auto';
    btn.onclick=()=>window.exportCSV();
    header.appendChild(btn);
  }
}, 1000);

document.addEventListener('DOMContentLoaded', () => {
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    ['click', 'touchend'].forEach(evt => {
      logoutBtn.addEventListener(evt, (e) => {
        e.preventDefault();
        window.logout();
      }, { passive: false });
    });
  }
});
