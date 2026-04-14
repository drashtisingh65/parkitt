/* ==========================================
   PARKIT – Smart Parking Uttar Pradesh
   app.js — Core JavaScript
   ========================================== */

/* ── FIREBASE INIT ── */
firebase.initializeApp({
  apiKey:            "AIzaSyD125N7kbyfdy5JC-flH85dGrClT7n0R1w",
  authDomain:        "parkit-9e035.firebaseapp.com",
  projectId:         "parkit-9e035",
  storageBucket:     "parkit-9e035.firebasestorage.app",
  messagingSenderId: "672621386685",
  appId:             "1:672621386685:web:a7354d99eda5adb597d0d4"
});
const auth = firebase.auth();
const db   = firebase.firestore();

/* ── CITY DATA ── */
const CITY_DB = {
  lucknow: {
    name: 'Lucknow', emoji: '🏛️', pop: '3.5M', tagline: 'The City of Nawabs',
    areas: ['All','Hazratganj','Gomti Nagar','Aliganj','Indira Nagar','Charbagh','Aminabad','Alambagh'],
    parking: [
      {id:101, name:'Hazratganj Central Parking',      area:'Hazratganj',   address:'MG Road, Hazratganj',             total:200, booked:140, price:30, rating:4.5, emoji:'🏛️'},
      {id:102, name:'Gomti Nagar Metro Parking',        area:'Gomti Nagar',  address:'Vipin Khand, Gomti Nagar',        total:350, booked:210, price:25, rating:4.3, emoji:'🚇'},
      {id:103, name:'Charbagh Station Parking',         area:'Charbagh',     address:'Lucknow Railway Station',         total:500, booked:380, price:20, rating:4.0, emoji:'🚂'},
      {id:104, name:'Phoenix Palassio Mall Parking',    area:'Gomti Nagar',  address:'Sultanpur Road, Lucknow',         total:800, booked:450, price:40, rating:4.6, emoji:'🏬'},
      {id:105, name:'Aminabad Market Parking',          area:'Aminabad',     address:'Aminabad Main Market',            total:150, booked:130, price:15, rating:3.8, emoji:'🛒'},
      {id:106, name:'Indira Nagar Sec-18 Parking',     area:'Indira Nagar', address:'Sector 18, Indira Nagar',         total:100, booked:45,  price:20, rating:4.1, emoji:'🏘️'},
      {id:107, name:'Alambagh Bus Terminal Parking',    area:'Alambagh',     address:'Alambagh UPSRTC Terminal',        total:250, booked:180, price:15, rating:3.9, emoji:'🚌'},
      {id:108, name:'Aliganj Fun Mall Parking',         area:'Aliganj',      address:'Sikander Bagh Chauraha',          total:300, booked:200, price:35, rating:4.4, emoji:'🎡'},
    ]
  },
  varanasi: {
    name: 'Varanasi', emoji: '🕌', pop: '1.5M', tagline: 'The Spiritual Capital',
    areas: ['All','Godaulia','Lanka','Sigra','Sarnath','Cantonment','Assi Ghat'],
    parking: [
      {id:201, name:'Kashi Vishwanath Corridor Parking', area:'Godaulia',    address:'Vishwanath Gali',           total:300, booked:250, price:30, rating:4.3, emoji:'🛕'},
      {id:202, name:'BHU Gate Parking',                  area:'Lanka',       address:'BHU Main Gate, Lanka',      total:400, booked:200, price:20, rating:4.4, emoji:'🎓'},
      {id:203, name:'Varanasi Junction Parking',         area:'Cantonment',  address:'Railway Station',           total:500, booked:380, price:25, rating:4.0, emoji:'🚂'},
      {id:204, name:'Sarnath Temple Parking',            area:'Sarnath',     address:'Dhamek Stupa Road',         total:200, booked:80,  price:15, rating:4.5, emoji:'☸️'},
    ]
  },
  agra: {
    name: 'Agra', emoji: '🗼', pop: '1.7M', tagline: 'City of the Taj Mahal',
    areas: ['All','Taj Ganj','Sadar Bazar','Fatehabad Road','Sikandra'],
    parking: [
      {id:501, name:'Taj Mahal East Gate Parking',   area:'Taj Ganj',       address:'Taj East Gate Road',        total:500, booked:380, price:50, rating:4.5, emoji:'🕌'},
      {id:502, name:'Fatehabad Road Hotel Parking',  area:'Fatehabad Road', address:'Fatehabad Road Strip',      total:200, booked:120, price:40, rating:4.3, emoji:'🏨'},
    ]
  },
  noida: {
    name: 'Noida', emoji: '🏙️', pop: '0.9M', tagline: 'The IT & Corporate Hub',
    areas: ['All','Sector 18','Sector 62','Film City'],
    parking: [
      {id:601, name:'DLF Mall of India Parking', area:'Sector 18', address:'DLF Mall, Sector 18',   total:800, booked:550, price:50, rating:4.6, emoji:'🏬'},
      {id:602, name:'Sector 62 IT Hub Parking',  area:'Sector 62', address:'IT Park, Sector 62',    total:400, booked:250, price:35, rating:4.4, emoji:'💻'},
    ]
  },
  prayagraj: {
    name: 'Prayagraj', emoji: '🏺', pop: '1.2M', tagline: 'The Sangam City',
    areas: ['All','Civil Lines','George Town','Allenganj'],
    parking: [
      {id:401, name:'Civil Lines Central Parking', area:'Civil Lines',  address:'MG Marg, Civil Lines', total:150, booked:90,  price:25, rating:4.2, emoji:'🏛️'},
      {id:402, name:'Triveni Sangam Parking',       area:'George Town', address:'Sangam Nose',          total:200, booked:120, price:15, rating:4.3, emoji:'🌊'},
    ]
  }
};

const PARKING_LOCATIONS = [
  {id:'p101', name:'Hazratganj Central Parking — Lucknow'},
  {id:'p102', name:'Gomti Nagar Metro Parking — Lucknow'},
  {id:'p103', name:'Charbagh Station Parking — Lucknow'},
  {id:'p104', name:'Phoenix Palassio Mall Parking — Lucknow'},
  {id:'p201', name:'Kashi Vishwanath Corridor Parking — Varanasi'},
  {id:'p202', name:'BHU Gate Parking — Varanasi'},
  {id:'p501', name:'Taj Mahal East Gate Parking — Agra'},
  {id:'p601', name:'DLF Mall of India Parking — Noida'},
  {id:'p401', name:'Civil Lines Central Parking — Prayagraj'},
];

/* ── APP STATE ── */
const bookedSlotsMap = {};
let state = {
  page: 'home', city: 'lucknow', citySearch: '', showCityDropdown: false,
  area: 'All', search: '', modal: null, modalStep: 1, selectedSlot: null,
  bookingData: {name:'', phone:'', email:'', date:'', time:'', duration:1},
  user: null, bookings: [], adminBookings: [], adminSlots: [],
  authMode: 'login', adminAuthMode: 'login', adminTab: 'overview',
  parkingData: [], confirmation: null, adminViewingAsUser: false
};

/* ── INIT CITY ── */
(function initCity() {
  state.parkingData = JSON.parse(JSON.stringify(CITY_DB[state.city].parking));
  state.parkingData.forEach(p => {
    const s = new Set();
    for (let i = 1; i <= p.booked && i <= p.total; i++) s.add(i);
    bookedSlotsMap[p.id] = s;
  });
})();

/* ── UTILS ── */
const V = {
  name:  v => v.trim().length >= 2,
  phone: v => /^[6-9]\d{9}$/.test(v.trim()),
  email: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()),
  pass:  v => v.length >= 6
};
const $ = id => document.getElementById(id);
const val    = id => $(id)?.value.trim()  || '';
const passVal = id => $(id)?.value        || '';

function getAvail(p) { return p.total - p.booked; }
function getStatus(p) {
  const r = p.booked / p.total;
  if (r >= 1)   return {label:'Full',      cls:'badge-full'};
  if (r >= 0.8) return {label:'Limited',   cls:'badge-limited'};
  return               {label:'Available', cls:'badge-available'};
}
function fmtINR(n) { return '₹' + n.toLocaleString('en-IN'); }
function genId()   { return 'PKT' + Math.random().toString(36).substr(2,6).toUpperCase(); }

function genSlots(p) {
  const bs = bookedSlotsMap[p.id] || new Set();
  return Array.from({length: p.total}, (_, i) => ({id: i+1, booked: bs.has(i+1)}));
}
function slotSz(t) {
  if (t <= 50)  return {cols:10, size:'36px', font:'10px'};
  if (t <= 150) return {cols:12, size:'32px', font:'9px'};
  if (t <= 400) return {cols:15, size:'28px', font:'8px'};
  return               {cols:20, size:'22px', font:'7px'};
}
function canCancel(b) {
  if (!b.date || !b.time) return false;
  return (new Date(b.date + 'T' + b.time) - new Date()) > 3600000;
}
function fbErr(code) {
  return ({
    'auth/email-already-in-use': 'This email is already registered. Please login instead.',
    'auth/invalid-email':        'Please enter a valid email address.',
    'auth/weak-password':        'Password must be at least 6 characters.',
    'auth/user-not-found':       'No account found with this email.',
    'auth/wrong-password':       'Incorrect password. Please try again.',
    'auth/invalid-credential':   'Invalid email or password.',
    'auth/too-many-requests':    'Too many attempts. Please wait a moment.',
    'permission-denied':         'Firestore permission denied. Check security rules.',
  }[code] || 'Something went wrong (' + code + '). Please try again.');
}
function toast(msg, type = 'info') {
  document.querySelector('.toast')?.remove();
  const t = document.createElement('div');
  t.className = 'toast ' + type;
  t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 3500);
}
function markErr(id, eid)  { $(id)?.classList.add('error');    $(eid)?.classList.add('show'); }
function clearErr(id, eid) { $(id)?.classList.remove('error'); $(eid)?.classList.remove('show'); }

/* ── FIREBASE AUTH LISTENER ── */
let adminUnsubs = [];

auth.onAuthStateChanged(async user => {
  if (user) {
    // Check if admin first
    const aDoc = await db.collection('admins').doc(user.uid).get();
    if (aDoc.exists) {
      const data = aDoc.data();
      state.user = {uid: user.uid, name: data.name, email: data.email,
                    isAdmin: true, parkingLocationId: data.parkingLocationId};
      subscribeAdminData(data.parkingLocationId);
      if (state.page !== 'admin') state.page = 'admin';
    } else {
      const uDoc = await db.collection('users').doc(user.uid).get();
      if (uDoc.exists) {
        const data = uDoc.data();
        state.user = {uid: user.uid, name: data.name, email: data.email, isAdmin: false};
        // Load user's bookings
        db.collection('bookings').where('userId','==',user.uid).onSnapshot(s => {
          state.bookings = s.docs.map(d => ({...d.data(), _docId: d.id}));
          render();
        });
      }
    }
  } else {
    state.user = null;
    adminUnsubs.forEach(f => f()); adminUnsubs = [];
    if (state.page === 'bookings' || state.page === 'admin') state.page = 'home';
  }
  render();
});

function subscribeAdminData(locId) {
  adminUnsubs.forEach(f => f()); adminUnsubs = [];
  if (!locId) return;
  adminUnsubs.push(
    db.collection('bookings').where('parkingLocationId','==',locId).onSnapshot(s => {
      state.adminBookings = s.docs.map(d => ({...d.data(), _docId: d.id})); render();
    }),
    db.collection('slots').where('parkingLocationId','==',locId).onSnapshot(s => {
      state.adminSlots = s.docs.map(d => ({...d.data(), _docId: d.id})); render();
    })
  );
}

/* ── AUTH ACTIONS ── */
window.doSignup = async function() {
  const name  = val('auth-name'), email = val('auth-email'),
        phone = val('auth-phone'), pass  = passVal('auth-pass');
  let ok = true;
  if (!V.name(name))  { markErr('auth-name',  'err-auth-name');  ok = false; }
  if (!V.email(email)){ markErr('auth-email', 'err-auth-email'); ok = false; }
  if (!V.phone(phone)){ markErr('auth-phone', 'err-auth-phone'); ok = false; }
  if (!V.pass(pass))  { markErr('auth-pass',  'err-auth-pass');  ok = false; }
  if (!ok) { toast('Please fix the errors above', 'error'); return; }
  const btn = $('auth-btn');
  if (btn) { btn.disabled = true; btn.textContent = 'Creating account…'; }
  try {
    const c = await auth.createUserWithEmailAndPassword(email, pass);
    await db.collection('users').doc(c.user.uid).set({
      name, email, phone, role: 'user', createdAt: new Date().toISOString()
    });
    toast('Welcome, ' + name.split(' ')[0] + '! 🎉', 'success');
    state.page = 'home';
  } catch(e) {
    toast(fbErr(e.code), 'error');
    if (btn) { btn.disabled = false; btn.textContent = 'Create Account'; }
  }
};

window.doLogin = async function() {
  const email = val('auth-email'), pass = passVal('auth-pass');
  if (!email) { markErr('auth-email', 'err-auth-email'); return; }
  if (!pass)  { markErr('auth-pass',  'err-auth-pass');  return; }
  const btn = $('auth-btn');
  if (btn) { btn.disabled = true; btn.textContent = 'Logging in…'; }
  try {
    await auth.signInWithEmailAndPassword(email, pass);
    toast('Welcome back! 👋', 'success');
    state.page = 'home';
  } catch(e) {
    toast(fbErr(e.code), 'error');
    if (btn) { btn.disabled = false; btn.textContent = 'Login'; }
  }
};

window.doAdminLogin = async function() {
  const email = val('adm-email'), pass = passVal('adm-pass');
  if (!email || !pass) { toast('Please enter email and password', 'error'); return; }
  const btn = $('adm-btn');
  if (btn) { btn.disabled = true; btn.textContent = 'Logging in…'; }
  try {
    const c = await auth.signInWithEmailAndPassword(email, pass);
    const aDoc = await db.collection('admins').doc(c.user.uid).get();
    if (!aDoc.exists) {
      await auth.signOut();
      toast('This is not an admin account. Use the regular Login page.', 'error');
      if (btn) { btn.disabled = false; btn.textContent = 'Admin Login'; }
      return;
    }
    toast('Welcome, Admin! 👋', 'success');
  } catch(e) {
    toast(fbErr(e.code), 'error');
    if (btn) { btn.disabled = false; btn.textContent = 'Admin Login'; }
  }
};

window.doAdminSignup = async function() {
  const name  = val('adm-name'), email = val('adm-email'),
        pass  = passVal('adm-pass'), locId = val('adm-location');
  if (!name || !email || !pass || !locId) { toast('All fields are required', 'error'); return; }
  if (!V.pass(pass)) { toast('Password must be at least 6 characters', 'error'); return; }
  const btn = $('adm-btn');
  if (btn) { btn.disabled = true; btn.textContent = 'Creating…'; }
  try {
    const c = await auth.createUserWithEmailAndPassword(email, pass);
    await db.collection('admins').doc(c.user.uid).set({
      name, email, parkingLocationId: locId, role: 'admin', createdAt: new Date().toISOString()
    });
    toast('Admin account created! 🎉', 'success');
  } catch(e) {
    toast(fbErr(e.code), 'error');
    if (btn) { btn.disabled = false; btn.textContent = 'Create Admin Account'; }
  }
};

window.doLogout = async function() {
  adminUnsubs.forEach(f => f()); adminUnsubs = [];
  await auth.signOut();
  state.user = null; state.bookings = []; state.adminBookings = []; state.adminSlots = [];
  state.adminViewingAsUser = false;
  state.page = 'home'; render();
  toast('Logged out successfully.');
};

/* ── ADMIN MODE SWITCH ── */
window.loginAsUser = function() {
  state.adminViewingAsUser = true;
  state.page = 'home'; render();
  toast('Now browsing as user. Your bookings are visible.', 'info');
};
window.exitUserMode = function() {
  state.adminViewingAsUser = false;
  state.page = 'admin'; render();
  toast('Back to Admin Dashboard.', 'success');
};

/* ── ADMIN SLOT ACTIONS ── */
window.adminAddSlot = async function() {
  if (!state.user?.isAdmin) return;
  const num  = parseInt($('slot-num')?.value) || 0;
  const type = $('slot-type')?.value || 'standard';
  if (num < 1) { toast('Enter a valid slot number', 'error'); return; }
  try {
    await db.collection('slots').add({
      slotNumber: num, type,
      parkingLocationId: state.user.parkingLocationId,
      status: 'available', addedAt: new Date().toISOString()
    });
    toast('Slot #' + num + ' added!', 'success');
    if ($('slot-num')) $('slot-num').value = '';
  } catch(e) { toast('Error: ' + fbErr(e.code), 'error'); }
};

window.adminDeleteSlot = async function(docId) {
  if (!confirm('Delete this slot?')) return;
  try { await db.collection('slots').doc(docId).delete(); toast('Slot deleted.', 'info'); }
  catch(e) { toast('Error: ' + fbErr(e.code), 'error'); }
};

window.adminToggleSlot = async function(docId, cur) {
  const next = cur === 'available' ? 'full' : 'available';
  try { await db.collection('slots').doc(docId).update({status: next}); toast('Slot marked as ' + next, 'success'); }
  catch(e) { toast('Error: ' + fbErr(e.code), 'error'); }
};

/* ── BOOKING ── */
window.processPayment = async function(pid, total) {
  const p  = state.parkingData.find(x => x.id === pid);
  const bd = state.bookingData;
  if (bd.date && bd.time && new Date(bd.date + 'T' + bd.time) <= new Date()) {
    toast('Please select a future time.', 'error'); state.modalStep = 3; render(); return;
  }
  if (bookedSlotsMap[pid]?.has(state.selectedSlot)) {
    toast('Slot just taken. Please choose another.', 'error');
    state.modalStep = 2; state.selectedSlot = null; render(); return;
  }
  const btn = $('pay-btn');
  if (btn) { btn.innerHTML = '<span class="spinner"></span> Processing...'; btn.disabled = true; }

  setTimeout(async () => {
    const id = genId(), locId = 'p' + pid;
    bookedSlotsMap[pid].add(state.selectedSlot);
    p.booked = Math.min(p.total, p.booked + 1);
    const bk = {
      id, parking: p.name, parkingId: pid, parkingLocationId: locId,
      slot: state.selectedSlot, city: CITY_DB[state.city].name,
      date: bd.date, time: bd.time, duration: bd.duration || 1, total,
      user: state.user?.email || 'guest', userId: state.user?.uid || null,
      name: bd.name, phone: bd.phone, email: bd.email || state.user?.email || '',
      status: 'Active', createdAt: new Date().toISOString()
    };
    state.bookings.push(bk);
    state.confirmation = {...bk};
    state.modalStep = 5; render();
    toast('Booking confirmed! 🎉', 'success');
    try { await db.collection('bookings').add(bk); }
    catch(e) { console.error('Firestore save error:', e); }
  }, 1500);
};

window.cancelBooking = async function(bid, docId) {
  const b = state.bookings.find(x => x.id === bid);
  if (!b) return;
  if (!canCancel(b)) { toast('Cancellation not allowed within 1 hour of booking time.', 'error'); return; }
  if (!confirm('Cancel booking ' + bid + '? This cannot be undone.')) return;
  if (docId) {
    try { await db.collection('bookings').doc(docId).update({status:'Cancelled', cancelledAt: new Date().toISOString()}); }
    catch(e) { toast('Error: ' + fbErr(e.code), 'error'); return; }
  }
  b.status = 'Cancelled';
  const pe = state.parkingData.find(x => x.id === b.parkingId);
  if (pe) { pe.booked = Math.max(0, pe.booked - 1); bookedSlotsMap[b.parkingId]?.delete(b.slot); }
  render(); toast('Booking cancelled.', 'info');
};

/* ── CITY ── */
function loadCity(slug) {
  if (!CITY_DB[slug]) return;
  state.city = slug; state.area = 'All'; state.search = '';
  state.modal = null; state.modalStep = 1; state.selectedSlot = null;
  state.parkingData = JSON.parse(JSON.stringify(CITY_DB[slug].parking));
  Object.keys(bookedSlotsMap).forEach(k => delete bookedSlotsMap[k]);
  state.parkingData.forEach(p => {
    const s = new Set();
    for (let i = 1; i <= p.booked && i <= p.total; i++) s.add(i);
    bookedSlotsMap[p.id] = s;
  });
  state.showCityDropdown = false; render();
  toast('Switched to ' + CITY_DB[slug].name + ' 📍', 'success');
}

/* ── GLOBAL ACTION DISPATCHERS ── */
window.switchCity         = slug => loadCity(slug);
window.toggleCityDropdown = ()  => { state.showCityDropdown = !state.showCityDropdown; state.citySearch = ''; render(); };
window.updateCitySearch   = v   => { state.citySearch = v; render(); };
window.goPage             = p   => { state.page = p; state.modal = null; state.showCityDropdown = false; render(); };
window.areaChange         = a   => { state.area = a; render(); };
window.searchChange       = v   => { state.search = v; render(); };
window.openModal          = id  => {
  if (!state.user) { toast('Please login to book.', 'error'); state.page = 'auth'; render(); return; }
  if (state.user.isAdmin && !state.adminViewingAsUser) { toast('Switch to User Mode to book a slot.', 'info'); return; }
  state.modal = id; state.modalStep = 1; state.selectedSlot = null; state.confirmation = null; render();
};
window.closeModal         = ()  => { state.modal = null; state.modalStep = 1; state.selectedSlot = null; state.bookingData = {name:'',phone:'',email:'',date:'',time:'',duration:1}; render(); };
window.closeModalOverlay  = e   => { if (e.target.classList.contains('modal-overlay')) closeModal(); };
window.nextStep           = ()  => { state.modalStep++; render(); };
window.prevStep           = ()  => { state.modalStep--; render(); };
window.selectSlot         = id  => { state.selectedSlot = id; render(); };
window.updateBooking      = (k,v) => { state.bookingData[k] = v; };
window.setAuthMode        = m   => { state.authMode = m; render(); };
window.setAdminTab        = t   => { state.adminTab = t; render(); };

/* ── VALIDATION FOR STEP 3 ── */
window.validateStep3 = function() {
  const bd = state.bookingData; let ok = true;
  if (!V.name(bd.name))  { markErr('bk-name',  'err-bk-name');  ok = false; }
  if (!V.phone(bd.phone)) { markErr('bk-phone', 'err-bk-phone'); ok = false; }
  if (!bd.date)           { markErr('bk-date',  'err-bk-date');  ok = false; }
  if (!bd.time)           { markErr('bk-time',  'err-bk-time');  ok = false; }
  if (bd.date && bd.time && new Date(bd.date + 'T' + bd.time) <= new Date()) {
    markErr('bk-time', 'err-bk-time'); toast('Please select a future time slot.', 'error'); ok = false;
  }
  if (!ok) { toast('Please fill all required fields.', 'error'); return; }
  nextStep();
};

/* ── CLOSE DROPDOWN ON OUTSIDE CLICK ── */
document.addEventListener('click', e => {
  if (state.showCityDropdown && !e.target.closest('.hero-city-wrapper')) {
    state.showCityDropdown = false; render();
  }
}, true);

/* ── NOTE: render() and build*() functions belong in index.html
         This file covers data, state, auth, and action logic.      ── */
