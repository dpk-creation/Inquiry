// inquiry.js - FINAL - Supabase Ready - Single Config - No Estimated Hours/Budget
const SUPABASE_URL = 'https://yessmvixkjnnywoitmtg.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_LKjdrZfu2b-G2CFsjOyFsw_m594Kk1P';

import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.39.0/+esm';

const finalUrl = localStorage.getItem('sb_url') || SUPABASE_URL;
const finalKey = localStorage.getItem('sb_key') || SUPABASE_ANON_KEY;
let supabase = null;
const isConfigured = !finalUrl.includes('YOUR_PROJECT') && finalUrl.includes('supabase.co') && finalUrl.startsWith('https://');
try { 
  if(isConfigured) {
    supabase = createClient(finalUrl, finalKey);
    console.log('✅ Supabase connected');
  } else {
    console.log('ℹ️ Supabase not configured - localStorage mode');
  }
} catch(e){ console.warn('Supabase init failed:', e.message); }

const form = document.getElementById('bookingForm');
const steps = document.querySelectorAll('.form-step');
const stepIndicators = document.querySelectorAll('.step');
const progressFill = document.getElementById('progressFill');
const nextBtn = document.getElementById('nextBtn');
const prevBtn = document.getElementById('prevBtn');
const submitBtn = document.getElementById('submitBtn');
const prefDate = document.getElementById('prefDate');
const altDate = document.getElementById('altDate');
const dateStatus = document.getElementById('dateStatus');

let currentStep = 1;
const totalSteps = 4;

const today = new Date().toISOString().split('T')[0];
if(prefDate) prefDate.min = today;
if(altDate) altDate.min = today;

window.addInventoryRow = function(){
  const list = document.getElementById('inventoryList');
  if(!list) return;
  const row = document.createElement('div');
  row.className = 'inv-row';
  row.innerHTML = `<input type="text" placeholder="Item (e.g., Sofa)" class="inv-name"><input type="number" placeholder="Qty" value="1" min="1" class="inv-qty"><label class="fragile-check"><input type="checkbox" class="inv-fragile"> Fragile</label><button type="button" class="btn-remove" onclick="this.parentElement.remove()"><i class="fa-solid fa-xmark"></i></button>`;
  list.appendChild(row);
}

async function checkDateConflict(date){
  if(!date) return {ok:true};
  let localCount = 0;
  try{
    const local = JSON.parse(localStorage.getItem('flexi_bookings')||'[]');
    localCount = local.filter(b=>b.preferred_date===date && b.status!=='cancelled').length;
  }catch(e){}
  let sbCount = 0;
  if(supabase){
    try{
      const {count} = await supabase.from('bookings').select('*', {count:'exact', head:true}).eq('preferred_date', date).neq('status','cancelled');
      sbCount = count||0;
    }catch(e){}
  }
  const total = isConfigured ? Math.max(localCount, sbCount) : localCount;
  const maxPerDay = parseInt(localStorage.getItem('max_per_day')||'3');
  if(total >= maxPerDay) return {ok:false, count:total, max:maxPerDay};
  return {ok:true, count:total, max:maxPerDay};
}

if(prefDate && dateStatus){
  prefDate.addEventListener('change', async (e)=>{
    const res = await checkDateConflict(e.target.value);
    if(!res.ok){
      dateStatus.className='date-status full';
      dateStatus.textContent = `⚠️ ${e.target.value} is fully booked (${res.count}/${res.max}). Please choose alternative date.`;
    } else {
      dateStatus.className='date-status ok';
      dateStatus.textContent = `✅ Available! ${res.count} booking(s) on this date, ${res.max - res.count} slots left.`;
    }
  });
}

function updateUI(){
  steps.forEach(s=>s.classList.toggle('active', parseInt(s.dataset.step)===currentStep));
  stepIndicators.forEach(s=>s.classList.toggle('active', parseInt(s.dataset.step)<=currentStep));
  if(progressFill) progressFill.style.width = `${(currentStep/totalSteps)*100}%`;
  if(prevBtn) prevBtn.style.display = currentStep===1 ? 'none' : 'inline-flex';
  if(nextBtn) nextBtn.style.display = currentStep===totalSteps ? 'none' : 'inline-flex';
  if(submitBtn) submitBtn.style.display = currentStep===totalSteps ? 'inline-flex' : 'none';
  window.scrollTo({top:0, behavior:'smooth'});
}

function validateStep(step){
  const active = document.querySelector(`.form-step[data-step="${step}"]`);
  if(!active) return true;
  const required = active.querySelectorAll('[required]');
  for(let el of required){
    if(!el.value.trim()){
      el.focus();
      el.style.borderColor='#dc2626';
      return false;
    }
    el.style.borderColor='#e5e7eb';
  }
  return true;
}

if(nextBtn) nextBtn.addEventListener('click', ()=>{
  if(!validateStep(currentStep)) return;
  if(currentStep < totalSteps){ currentStep++; updateUI(); }
});
if(prevBtn) prevBtn.addEventListener('click', ()=>{ if(currentStep>1){ currentStep--; updateUI(); } });

if(form){
form.addEventListener('submit', async (e)=>{
  e.preventDefault();
  if(!validateStep(4)) return;
  
  const conflict = await checkDateConflict(prefDate.value);
  if(!conflict.ok){
    if(!confirm(`Selected date is fully booked (${conflict.count}/${conflict.max}). Continue? Admin will contact for alternative.`)) return;
  }

  if(submitBtn){
    submitBtn.disabled=true;
    submitBtn.innerHTML='<i class="fa-solid fa-spinner fa-spin"></i> BOOKING...';
  }

  const invRows = document.querySelectorAll('.inv-row');
  const inventory = [];
  invRows.forEach(r=>{
    const name = r.querySelector('.inv-name')?.value?.trim();
    const qty = r.querySelector('.inv-qty')?.value||'1';
    const fragile = r.querySelector('.inv-fragile')?.checked||false;
    if(name) inventory.push({name, qty, fragile});
  });

  const services = Array.from(document.querySelectorAll('input[name="services"]:checked')).map(c=>c.value);
  const vehicleTypeEl = document.getElementById('vehicleType');
  const moversCountEl = document.getElementById('moversCount');
  const rate = vehicleTypeEl ? parseInt(vehicleTypeEl.options[vehicleTypeEl.selectedIndex]?.dataset.rate || 0) : 0;
  const movers = moversCountEl ? parseInt(moversCountEl.value) : 2;

  const bookingId = 'FM-' + Math.floor(1000+Math.random()*9000);
  const data = {
    booking_id: bookingId,
    full_name: form.full_name.value.trim(),
    email: form.email.value.trim(),
    phone: form.phone.value.trim(),
    alt_phone: form.alt_phone?.value?.trim()||null,
    move_type: form.move_type.value,
    bedrooms: parseInt(form.bedrooms?.value || 3),
    floor_access: form.floor_access?.value || null,
    pickup_address: form.pickup_address.value.trim(),
    delivery_address: form.delivery_address.value.trim(),
    access_notes: form.access_notes?.value?.trim()||null,
    inventory: inventory,
    vehicle_type: form.vehicle_type.value,
    vehicle_rate: rate,
    movers_count: movers,
    additional_services: services,
    preferred_date: form.preferred_date.value,
    alternative_date: form.alternative_date?.value || null,
    time_slot: form.time_slot.value,
    source: form.source?.value||null,
    special_instructions: form.special_instructions?.value?.trim()||null,
    status: 'pending',
    extra_data: {}
  };

  try{
    const local = JSON.parse(localStorage.getItem('flexi_bookings')||'[]');
    local.push({...data, created_at: new Date().toISOString()});
    localStorage.setItem('flexi_bookings', JSON.stringify(local));

    if(supabase){
      const { error } = await supabase.from('bookings').insert([data]);
      if(error){
        console.warn('Supabase insert failed:', error.message);
      } else {
        console.log('✅ Saved to Supabase:', bookingId);
      }
    }

    const idShow = document.getElementById('bookingIdShow');
    if(idShow) idShow.textContent = bookingId;
    const modal = document.getElementById('successModal');
    if(modal) modal.classList.add('active');
    form.reset();
    currentStep=1;
    updateUI();
  }catch(err){
    alert('Error: '+err.message);
  }finally{
    if(submitBtn){
      submitBtn.disabled=false;
      submitBtn.innerHTML='<i class="fa-solid fa-paper-plane"></i> CONFIRM BOOKING';
    }
  }
});
}

window.closeModal = function(){
  const modal = document.getElementById('successModal');
  if(modal) modal.classList.remove('active');
}
updateUI();
