/* ============================================================
   BMA Map — app.js
   All application logic (Map, Filter, Buffer, Route, etc.)
   ============================================================ */

'use strict';

// ── i18n ─────────────────────────────────────────────────────
const T = {
  th: {
    'app.title':         'BMA Map',
    'search.placeholder':'ค้นหาสถานที่...',
    'filter.title':      'ประเภทสถานที่',
    'filter.library':    '📚 ห้องสมุด',
    'filter.coworking':  '💻 Co-Working',
    'filter.museum':     '🧒 พิพิธภัณฑ์เด็ก',
    'filter.recreation': '🏃 ศูนย์นันทนาการ',
    'filter.sports':     '⚽ ศูนย์กีฬา',
    'buffer.title':      'ค้นหาในระยะ',
    'buffer.unit':       ' กม.',
    'btn.locate':        '📍 ตำแหน่งของฉัน',
    'btn.clickpoint':    'คลิกเพื่อตั้งจุด',
    'btn.clearbuffer':   '✕ ล้างวงกลม',
    'btn.theme':         'โหมดแผนที่',
    'btn.heatmap':       'ความนิยม',
    'btn.favorites':     'รายการโปรด',
    'btn.share':         'แชร์',
    'btn.navigate':      'นำทาง',
    'btn.clearroute':    'ล้างเส้นทาง',
    'btn.addfav':        '★ เพิ่มรายการโปรด',
    'btn.removefav':     '★ ในรายการโปรด',
    'detail.visitors':   '👥 ผู้ใช้บริการ Co-Working รายเดือน',
    'detail.crowdedness':'⏰ ช่วงเวลาคึกคัก',
    'detail.pool':       '🏊 ข้อมูลสระว่ายน้ำ',
    'favorites.title':   'รายการโปรด',
    'favorites.empty':   'ยังไม่มีรายการโปรด\nคลิก ★ เพื่อบันทึกสถานที่',
    'status.locating':   '🔍 กำลังหาตำแหน่ง...',
    'status.located':    '✓ พบตำแหน่งของคุณแล้ว',
    'status.loc_error':  '⚠ ไม่สามารถหาตำแหน่งได้',
    'status.clickmap':   '👆 คลิกบนแผนที่เพื่อตั้งจุดค้นหา',
    'status.routing':    '🔄 กำลังโหลดเส้นทาง...',
    'status.no_location':'⚠ กรุณาตั้งตำแหน่งก่อนนำทาง',
    'status.route_error':'⚠ ไม่สามารถโหลดเส้นทางได้',
    'status.found':      '✓ พบ %d สถานที่ในรัศมี %s กม.',
    'status.share_ok':   '✓ คัดลอกลิงก์แล้ว',
    'open.now':          'เปิดอยู่ขณะนี้',
    'closed.now':        'ปิดแล้ว',
    'type.library':      'ห้องสมุด',
    'type.coworking':    'ห้องสมุด + Co-Working',
    'type.museum':       'พิพิธภัณฑ์เด็ก',
    'type.recreation':   'ศูนย์นันทนาการ',
    'type.sports':       'ศูนย์กีฬา',
    'total.visitors':    'รวม %d คน',
    'pool.size':         'ขนาดสระ: %s',
    'pool.busy':         'ช่วงคึกคัก: %s',
    'pool.close':        'ปิดทำความสะอาด: %s',
  },
  en: {
    'app.title':         'BMA Map',
    'search.placeholder':'Search venues...',
    'filter.title':      'Venue Types',
    'filter.library':    '📚 Library',
    'filter.coworking':  '💻 Co-Working',
    'filter.museum':     '🧒 Children\'s Museum',
    'filter.recreation': '🏃 Recreation Center',
    'filter.sports':     '⚽ Sports Center',
    'buffer.title':      'Search Nearby',
    'buffer.unit':       ' km',
    'btn.locate':        '📍 My Location',
    'btn.clickpoint':    'Click to Set Point',
    'btn.clearbuffer':   '✕ Clear Circle',
    'btn.theme':         'Map Mode',
    'btn.heatmap':       'Popularity',
    'btn.favorites':     'Favorites',
    'btn.share':         'Share',
    'btn.navigate':      'Navigate',
    'btn.clearroute':    'Clear Route',
    'btn.addfav':        '★ Add to Favorites',
    'btn.removefav':     '★ In Favorites',
    'detail.visitors':   '👥 Monthly Co-Working Visitors',
    'detail.crowdedness':'⏰ Peak Hours',
    'detail.pool':       '🏊 Pool Information',
    'favorites.title':   'Favorites',
    'favorites.empty':   'No favorites yet.\nClick ★ to save a venue.',
    'status.locating':   '🔍 Finding your location...',
    'status.located':    '✓ Location found',
    'status.loc_error':  '⚠ Could not find your location',
    'status.clickmap':   '👆 Click the map to set a search point',
    'status.routing':    '🔄 Loading route...',
    'status.no_location':'⚠ Please set a location first',
    'status.route_error':'⚠ Could not load route',
    'status.found':      '✓ Found %d venues within %s km',
    'status.share_ok':   '✓ Link copied!',
    'open.now':          'Open Now',
    'closed.now':        'Closed',
    'type.library':      'Library',
    'type.coworking':    'Library + Co-Working',
    'type.museum':       'Children\'s Museum',
    'type.recreation':   'Recreation Center',
    'type.sports':       'Sports Center',
    'total.visitors':    'Total %d visitors',
    'pool.size':         'Pool: %s',
    'pool.busy':         'Peak hours: %s',
    'pool.close':        'Cleaning day: %s',
  }
};

let lang = 'th';
function t(key, ...args) {
  let str = (T[lang][key] || T.th[key] || key);
  args.forEach(a => { str = str.replace('%d', a).replace('%s', a); });
  return str;
}

window.setLang = function(l) {
  lang = l;
  document.getElementById('btn-lang-th').classList.toggle('active', l === 'th');
  document.getElementById('btn-lang-en').classList.toggle('active', l === 'en');
  applyI18n();
  if (state.selectedVenue) showDetail(state.selectedVenue);
  renderFavorites();
  updateFilterCounts();
  updateBufferStatus();
};

function applyI18n() {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (key) el.textContent = t(key);
  });
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    if (key) el.placeholder = t(key);
  });
}

// ── State ─────────────────────────────────────────────────────
const state = {
  venues:        [],
  activeTypes:   new Set(['library', 'coworking', 'museum', 'recreation', 'sports']),
  markers:       {},          // id → L.Marker
  clusterGroup:  null,
  heatLayer:     null,
  heatEnabled:   false,
  bufferCircle:  null,
  bufferPoint:   null,        // {lat, lng}
  bufferRadius:  1.0,         // km
  clickMode:     false,
  locationMarker:null,
  routeLayer:    null,
  visitorChart:  null,
  selectedVenue: null,
  mapTheme:      'dark',     // 'dark' or 'light'
  favorites:     new Set(JSON.parse(localStorage.getItem('bma_favs') || '[]')),
};

// ── Map Init ──────────────────────────────────────────────────
const map = L.map('map', {
  center: [13.7563, 100.5018],
  zoom: 12,
  zoomControl: false,
  attributionControl: true,
});
map.getContainer().classList.add('map-dark');

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© <a href="https://www.openstreetmap.org/">OpenStreetMap</a>',
  maxZoom: 19,
}).addTo(map);

// ── Marker Icons ──────────────────────────────────────────────
const ICONS = {
  library:     { emoji: '📚', cls: 'marker-library'    },
  coworking:   { emoji: '💻', cls: 'marker-coworking'   },
  museum:      { emoji: '🧒', cls: 'marker-museum'      },
  recreation:  { emoji: '🏃', cls: 'marker-recreation'  },
  sports:      { emoji: '⚽', cls: 'marker-sports'      },
};

function venueIcon(venue) {
  const type = venue.types.includes('coworking') ? 'coworking'
             : venue.types.includes('museum')    ? 'museum'
             : venue.types.includes('recreation')? 'recreation'
             : venue.types.includes('sports')    ? 'sports'
             : 'library';
  const ic = ICONS[type];
  return L.divIcon({
    html: `<div class="custom-marker ${ic.cls}"><span>${ic.emoji}</span></div>`,
    className: '',
    iconSize:   [32, 32],
    iconAnchor: [16, 32],
    popupAnchor:[0, -34],
  });
}

function venueType(venue) {
  if (venue.types.includes('coworking')) return 'coworking';
  if (venue.types.includes('museum'))    return 'museum';
  if (venue.types.includes('recreation'))return 'recreation';
  if (venue.types.includes('sports'))    return 'sports';
  return 'library';
}

// ── Load Venues ───────────────────────────────────────────────
async function loadVenues() {
  const res  = await fetch('data/venues.json');
  const data = await res.json();
  state.venues = data.venues;
  state.meta   = data.meta;
  state.clusterGroup = L.markerClusterGroup({
    maxClusterRadius: 50,
    disableClusteringAtZoom: 15,
    iconCreateFunction: cluster => {
      const count = cluster.getChildCount();
      return L.divIcon({
        html: `<div style="
          width:36px;height:36px;border-radius:50%;
          background:rgba(17,24,39,0.9);
          border:2px solid rgba(79,158,255,0.5);
          display:flex;align-items:center;justify-content:center;
          color:#f0f4ff;font-size:12px;font-weight:700;
          box-shadow:0 2px 12px rgba(0,0,0,0.5);">${count}</div>`,
        className: '',
        iconSize: [36, 36],
        iconAnchor: [18, 18],
      });
    }
  });
  map.addLayer(state.clusterGroup);
  renderMarkers();
  updateFilterCounts();
  buildHeatLayer();
}

function renderMarkers() {
  state.clusterGroup.clearLayers();
  Object.keys(state.markers).forEach(id => { state.markers[id] = null; });
  state.markers = {};

  const visible = visibleVenues();
  visible.forEach(venue => {
    const marker = L.marker([venue.lat, venue.lng], { icon: venueIcon(venue) });
    marker.on('click', () => selectVenue(venue));
    state.markers[venue.id] = marker;
    state.clusterGroup.addLayer(marker);
  });
}

function visibleVenues() {
  return state.venues.filter(v => {
    // category filter
    const hasActive = v.types.some(tp => state.activeTypes.has(tp));
    if (!hasActive) return false;
    // buffer filter
    if (state.bufferCircle && state.bufferPoint) {
      const from = turf.point([v.lng, v.lat]);
      const to   = turf.point([state.bufferPoint.lng, state.bufferPoint.lat]);
      const dist = turf.distance(from, to, { units: 'kilometers' });
      if (dist > state.bufferRadius) return false;
    }
    return true;
  });
}

// ── Filter ────────────────────────────────────────────────────
document.getElementById('category-filter').addEventListener('change', e => {
  const cb = e.target;
  if (cb.type !== 'checkbox') return;
  if (cb.checked) state.activeTypes.add(cb.value);
  else state.activeTypes.delete(cb.value);
  renderMarkers();
  updateFilterCounts();
  buildHeatLayer();
});

function updateFilterCounts() {
  ['library','coworking','museum','recreation','sports'].forEach(tp => {
    const count = state.venues.filter(v => v.types.some(t => t === tp)).length;
    const el = document.getElementById('count-' + tp);
    if (el) el.textContent = count;
  });
}

// ── Buffer + Location ─────────────────────────────────────────
const slider     = document.getElementById('buffer-slider');
const bufferKmEl = document.getElementById('buffer-km');

slider.addEventListener('input', e => {
  const v = parseFloat(e.target.value);
  state.bufferRadius = v;
  bufferKmEl.textContent = v.toFixed(1);
  updateSliderFill(e.target);
  if (state.bufferPoint) drawBuffer(state.bufferPoint);
});

function updateSliderFill(el) {
  const min = parseFloat(el.min);
  const max = parseFloat(el.max);
  const val = parseFloat(el.value);
  const pct = ((val - min) / (max - min)) * 100;
  el.style.setProperty('--fill', pct + '%');
}
updateSliderFill(slider);

document.getElementById('btn-locate').addEventListener('click', () => {
  if (!navigator.geolocation) {
    setBufferStatus(t('status.loc_error'));
    return;
  }
  setBufferStatus(t('status.locating'));
  navigator.geolocation.getCurrentPosition(
    pos => {
      const pt = { lat: pos.coords.latitude, lng: pos.coords.longitude };
      placeLocationMarker(pt);
      drawBuffer(pt);
      map.setView([pt.lat, pt.lng], 14);
      setBufferStatus(t('status.located'));
    },
    () => setBufferStatus(t('status.loc_error')),
    { timeout: 10000, enableHighAccuracy: true }
  );
});

document.getElementById('btn-click-point').addEventListener('click', () => {
  state.clickMode = !state.clickMode;
  document.getElementById('btn-click-point').classList.toggle('active', state.clickMode);
  if (state.clickMode) {
    setBufferStatus(t('status.clickmap'));
    map.getContainer().style.cursor = 'crosshair';
  } else {
    setBufferStatus('');
    map.getContainer().style.cursor = '';
  }
});

map.on('click', e => {
  if (!state.clickMode) return;
  const pt = { lat: e.latlng.lat, lng: e.latlng.lng };
  placeLocationMarker(pt);
  drawBuffer(pt);
  state.clickMode = false;
  document.getElementById('btn-click-point').classList.remove('active');
  map.getContainer().style.cursor = '';
});

document.getElementById('btn-clear-buffer').addEventListener('click', clearBuffer);

function placeLocationMarker(pt) {
  if (state.locationMarker) map.removeLayer(state.locationMarker);
  state.locationMarker = L.marker([pt.lat, pt.lng], {
    icon: L.divIcon({
      html: '<div class="location-pulse"></div>',
      className: '',
      iconSize: [16, 16],
      iconAnchor: [8, 8],
    }),
    zIndexOffset: 1000,
  }).addTo(map);
}

function drawBuffer(pt) {
  state.bufferPoint = pt;
  if (state.bufferCircle) map.removeLayer(state.bufferCircle);
  state.bufferCircle = L.circle([pt.lat, pt.lng], {
    radius: state.bufferRadius * 1000,
    color: '#4f9eff',
    fillColor: '#4f9eff',
    fillOpacity: 0.07,
    weight: 1.5,
    dashArray: '4 4',
    className: 'buffer-circle',
  }).addTo(map);
  document.getElementById('btn-clear-buffer').classList.remove('hidden');
  renderMarkers();
  updateBufferStatus();
}

function clearBuffer() {
  if (state.bufferCircle) { map.removeLayer(state.bufferCircle); state.bufferCircle = null; }
  if (state.locationMarker) { map.removeLayer(state.locationMarker); state.locationMarker = null; }
  state.bufferPoint = null;
  document.getElementById('btn-clear-buffer').classList.add('hidden');
  setBufferStatus('');
  renderMarkers();
}

function setBufferStatus(msg) {
  const el = document.getElementById('buffer-status');
  el.textContent = msg;
}

function updateBufferStatus() {
  if (!state.bufferPoint) return;
  const count = visibleVenues().length;
  setBufferStatus(t('status.found', count, state.bufferRadius.toFixed(1)));
}

// ── Venue Selection & Detail Panel ───────────────────────────
function selectVenue(venue) {
  state.selectedVenue = venue;
  // Fly to venue
  map.flyTo([venue.lat, venue.lng], Math.max(map.getZoom(), 15), { duration: 0.8 });
  showDetail(venue);
  // Close favorites if open
  document.getElementById('favorites-panel').classList.add('hidden');
}

function showDetail(venue) {
  const panel = document.getElementById('detail-panel');
  panel.classList.remove('hidden');

  // Type badge
  const typeKey = venueType(venue);
  const badge = document.getElementById('detail-type-badge');
  badge.className = typeKey;
  badge.textContent = t('type.' + typeKey);

  // Name
  document.getElementById('detail-name').textContent =
    lang === 'th' ? venue.name_th : venue.name_en;

  // Open now indicator
  const openBadge = document.getElementById('detail-open-badge');
  const isOpen    = checkOpenNow(venue);
  if (isOpen === null) {
    openBadge.style.display = 'none';
  } else {
    openBadge.style.display = '';
    openBadge.className = isOpen ? 'open' : 'closed';
    openBadge.textContent = isOpen ? t('open.now') : t('closed.now');
  }

  // Address
  document.getElementById('detail-address').textContent =
    lang === 'th' ? venue.address_th : venue.address_en;
  document.getElementById('detail-address-row').style.display =
    venue.address_th ? '' : 'none';

  // Phone
  const phoneEl = document.getElementById('detail-phone');
  phoneEl.textContent = venue.phone || '—';
  document.getElementById('detail-phone-row').style.display =
    venue.phone ? '' : 'none';

  // Hours
  document.getElementById('detail-hours').textContent =
    lang === 'th' ? venue.hours_th : venue.hours_en;

  // Pool info
  const poolRow = document.getElementById('detail-pool-row');
  if (venue.pool_size) {
    poolRow.style.display = '';
    document.getElementById('detail-pool-info').innerHTML = `
      <strong>${t('detail.pool')}</strong><br>
      ${t('pool.size', venue.pool_size)}<br>
      ${venue.pool_busy_hours ? t('pool.busy', venue.pool_busy_hours) : ''}<br>
      ${venue.pool_close_day ? t('pool.close', venue.pool_close_day) : ''}
    `;
  } else {
    poolRow.style.display = 'none';
  }

  // Monthly visitor chart OR Simulated Weekly/Hourly Chart (Option A)
  const chartSection = document.getElementById('detail-chart-section');
  chartSection.classList.remove('hidden');
  renderSimulatedOrMonthlyChart(venue);

  // Crowdedness (recreation centers with pool_busy_hours)
  const crowdSection = document.getElementById('detail-crowdedness');
  if (venue.pool_busy_hours && venue.types.includes('recreation')) {
    crowdSection.classList.remove('hidden');
    renderCrowdedness(venue.pool_busy_hours);
  } else {
    crowdSection.classList.add('hidden');
  }

  // Favorite button
  updateFavBtn(venue);

  // Navigate button
  document.getElementById('btn-navigate').onclick = () => navigateTo(venue);
}

function checkOpenNow(venue) {
  if (!venue.schedule) return null;
  const now = new Date();
  const day = String(now.getDay());
  const slot = venue.schedule[day];
  if (!slot) return false;
  const [oh, om] = slot.o.split(':').map(Number);
  const [ch, cm] = slot.c.split(':').map(Number);
  const cur = now.getHours() * 60 + now.getMinutes();
  const open = oh * 60 + om;
  const close = ch * 60 + cm;
  return cur >= open && cur < close;
}

document.getElementById('btn-close-detail').addEventListener('click', () => {
  document.getElementById('detail-panel').classList.add('hidden');
  state.selectedVenue = null;
});

// ── Visitor & Simulated Chart (Option A) ──────────────────────
function renderSimulatedOrMonthlyChart(venue) {
  if (state.visitorChart) { state.visitorChart.destroy(); state.visitorChart = null; }
  const ctx = document.getElementById('visitors-chart').getContext('2d');

  if (venue.monthly_coworking) {
    // Show actual monthly visitors
    const months = lang === 'th' ? state.meta.months_label : state.meta.months_label_en;
    const data   = venue.monthly_coworking;
    const total  = data.reduce((a, b) => a + b, 0);
    document.getElementById('chart-total-badge').textContent = t('total.visitors', total.toLocaleString());

    state.visitorChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: months,
        datasets: [{
          data,
          backgroundColor: 'rgba(167,139,250,0.5)',
          borderColor: 'rgba(167,139,250,0.9)',
          borderWidth: 1,
          borderRadius: 4,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { color: '#64748b', font: { size: 10 } } },
          y: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { color: '#64748b', font: { size: 10 } } },
        }
      }
    });
  } else {
    // Option A: Simulated Usage Rate (%) based on current day/busy hours
    const currentDay = new Date().getDay(); // 0 = Sun, 1 = Mon ...
    const isWeekend = (currentDay === 0 || currentDay === 6);
    document.getElementById('chart-total-badge').textContent = isWeekend
      ? (lang === 'th' ? 'จำลอง: คนค่อนข้างหนาแน่น' : 'Simulated: Moderately Busy')
      : (lang === 'th' ? 'จำลอง: ระดับปกติ' : 'Simulated: Normal');

    // Generate simulated occupancy pattern (10:00 - 20:00)
    const hoursLabels = ['10:00','12:00','14:00','16:00','18:00','20:00'];
    const simulatedData = [25, 45, 60, 85, 90, 30]; // default pattern

    // If venue has specific busy hours, boost those slots
    if (venue.pool_busy_hours) {
      if (venue.pool_busy_hours.includes('10:00')) simulatedData[0] = 95;
      if (venue.pool_busy_hours.includes('12:00')) simulatedData[1] = 95;
      if (venue.pool_busy_hours.includes('13:00') || venue.pool_busy_hours.includes('14:00')) simulatedData[2] = 95;
      if (venue.pool_busy_hours.includes('16:00')) simulatedData[3] = 95;
      if (venue.pool_busy_hours.includes('18:00')) simulatedData[4] = 95;
    } else if (isWeekend) {
      // weekends peak earlier
      simulatedData[1] = 80;
      simulatedData[2] = 85;
      simulatedData[3] = 75;
    }

    state.visitorChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: hoursLabels,
        datasets: [{
          label: lang === 'th' ? 'ความหนาแน่น (%)' : 'Occupancy (%)',
          data: simulatedData,
          backgroundColor: 'rgba(79, 158, 255, 0.15)',
          borderColor: 'rgba(79, 158, 255, 0.85)',
          borderWidth: 2,
          fill: true,
          tension: 0.4,
          pointBackgroundColor: 'rgba(79, 158, 255, 1)'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { color: '#64748b', font: { size: 10 } } },
          y: { 
            min: 0, max: 100,
            grid: { color: 'rgba(255,255,255,0.04)' }, 
            ticks: { 
              color: '#64748b', font: { size: 10 },
              callback: v => v + '%'
            } 
          },
        }
      }
    });
  }
}

// ── Crowdedness Indicator ────────────────────────────────────
function renderCrowdedness(busyHoursStr) {
  const container = document.getElementById('crowdedness-bars');
  const slots = busyHoursStr.split(',').map(s => s.trim());
  const hours = [
    '06–08','08–10','10–12','12–14','14–16','16–18','18–20','20–21'
  ];
  // Map busy hours to crowd percentage
  const crowdMap = {};
  slots.forEach(slot => {
    const match = slot.match(/(\d+):00/g);
    if (!match || match.length < 2) return;
    const h = parseInt(match[0]);
    const label = `${String(h).padStart(2,'0')}–${String(h+2).padStart(2,'0')}`;
    crowdMap[label] = 90 + Math.floor(Math.random() * 10);
  });

  container.innerHTML = hours.map(h => {
    const pct = crowdMap[h] || (15 + Math.floor(Math.random() * 25));
    const color = pct > 70 ? '#f59e0b' : pct > 40 ? '#34d399' : '#4f9eff';
    return `<div class="crowd-row">
      <span style="width:54px;color:#64748b;font-size:10px">${h}</span>
      <div class="crowd-bar-bg">
        <div class="crowd-bar-fill" style="width:${pct}%;background:${color}"></div>
      </div>
      <span style="width:32px;text-align:right;color:#64748b;font-size:10px">${pct}%</span>
    </div>`;
  }).join('');
}

// ── Heatmap ───────────────────────────────────────────────────
document.getElementById('btn-theme').addEventListener('click', () => {
  const container = map.getContainer();
  if (state.mapTheme === 'dark') {
    state.mapTheme = 'light';
    container.classList.remove('map-dark');
    container.classList.add('map-light');
    document.getElementById('theme-sun').classList.remove('hidden');
    document.getElementById('theme-moon').classList.add('hidden');
  } else {
    state.mapTheme = 'dark';
    container.classList.remove('map-light');
    container.classList.add('map-dark');
    document.getElementById('theme-sun').classList.add('hidden');
    document.getElementById('theme-moon').classList.remove('hidden');
  }
});

function buildHeatLayer() {
  if (state.heatLayer) { map.removeLayer(state.heatLayer); state.heatLayer = null; }
  const pts = state.venues.map(v => {
    const weight = v.monthly_coworking
      ? v.monthly_coworking.reduce((a, b) => a + b, 0) / 800
      : 0.3;
    return [v.lat, v.lng, Math.min(weight, 1.0)];
  });
  state.heatLayer = L.heatLayer(pts, {
    radius: 40, blur: 25, maxZoom: 14,
    gradient: { 0.2: '#4f9eff', 0.5: '#a78bfa', 0.8: '#f59e0b', 1.0: '#f87171' }
  });
  if (state.heatEnabled) state.heatLayer.addTo(map);
}

document.getElementById('btn-heatmap').addEventListener('click', () => {
  state.heatEnabled = !state.heatEnabled;
  document.getElementById('btn-heatmap').classList.toggle('active', state.heatEnabled);
  if (state.heatEnabled && state.heatLayer) state.heatLayer.addTo(map);
  else if (state.heatLayer) map.removeLayer(state.heatLayer);
});

// ── Routing ───────────────────────────────────────────────────
async function navigateTo(venue) {
  if (!state.bufferPoint && !state.locationMarker) {
    setRouteStatus(t('status.no_location'));
    showToast(t('status.no_location'));
    return;
  }
  const from = state.bufferPoint ||
    { lat: state.locationMarker.getLatLng().lat, lng: state.locationMarker.getLatLng().lng };

  setRouteStatus(t('status.routing'));
  document.getElementById('route-status').classList.remove('hidden');

  if (state.routeLayer) { map.removeLayer(state.routeLayer); state.routeLayer = null; }

  try {
    const url = `https://router.project-osrm.org/route/v1/driving/`
      + `${from.lng},${from.lat};${venue.lng},${venue.lat}`
      + `?overview=full&geometries=geojson`;
    const res  = await fetch(url);
    const data = await res.json();
    if (!data.routes?.length) throw new Error('no route');

    const geojson = data.routes[0].geometry;
    state.routeLayer = L.geoJSON(geojson, {
      style: { color: '#4f9eff', weight: 4, opacity: 0.85, dashArray: '8 4' }
    }).addTo(map);
    map.fitBounds(state.routeLayer.getBounds(), { padding: [40, 40] });

    const dist = (data.routes[0].distance / 1000).toFixed(1);
    const mins = Math.round(data.routes[0].duration / 60);
    setRouteStatus(`🚗 ${dist} km · ~${mins} นาที`);
    document.getElementById('btn-clear-route').classList.remove('hidden');
  } catch {
    setRouteStatus(t('status.route_error'));
  }
}

function setRouteStatus(msg) {
  const el = document.getElementById('route-status');
  el.textContent = msg;
  el.classList.remove('hidden');
}

document.getElementById('btn-clear-route').addEventListener('click', () => {
  if (state.routeLayer) { map.removeLayer(state.routeLayer); state.routeLayer = null; }
  document.getElementById('btn-clear-route').classList.add('hidden');
  document.getElementById('route-status').classList.add('hidden');
});

// ── Favorites ─────────────────────────────────────────────────
function saveFavorites() {
  localStorage.setItem('bma_favs', JSON.stringify([...state.favorites]));
}

function toggleFavorite(venue) {
  if (state.favorites.has(venue.id)) state.favorites.delete(venue.id);
  else state.favorites.add(venue.id);
  saveFavorites();
  updateFavBtn(venue);
  renderFavorites();
}

function updateFavBtn(venue) {
  const btn = document.getElementById('btn-favorite-venue');
  const isFav = state.favorites.has(venue.id);
  btn.classList.toggle('is-fav', isFav);
  document.getElementById('fav-btn-text').textContent =
    isFav ? t('btn.removefav') : t('btn.addfav');
  btn.onclick = () => toggleFavorite(venue);
}

function renderFavorites() {
  const list = document.getElementById('favorites-list');
  const empty = document.getElementById('favorites-empty');
  const favVenues = state.venues.filter(v => state.favorites.has(v.id));
  if (favVenues.length === 0) {
    list.innerHTML = '';
    empty.classList.remove('hidden');
    return;
  }
  empty.classList.add('hidden');
  list.innerHTML = favVenues.map(v => {
    const icon = v.types.includes('coworking') ? '💻'
               : v.types.includes('museum')    ? '🧒'
               : v.types.includes('recreation')? '🏃'
               : '📚';
    const name = lang === 'th' ? v.name_th : v.name_en;
    const dist = lang === 'th' ? v.district_th : v.district_en;
    return `<div class="fav-item" data-id="${v.id}">
      <span class="fav-item-icon">${icon}</span>
      <div class="fav-item-info">
        <div class="fav-item-name" title="${name}">${name}</div>
        <div class="fav-item-district">${dist}</div>
      </div>
      <button class="fav-item-remove" data-remove="${v.id}" title="Remove">✕</button>
    </div>`;
  }).join('');

  list.querySelectorAll('.fav-item').forEach(el => {
    el.addEventListener('click', e => {
      if (e.target.hasAttribute('data-remove')) return;
      const venue = state.venues.find(v => v.id === el.dataset.id);
      if (venue) selectVenue(venue);
    });
  });

  list.querySelectorAll('[data-remove]').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      state.favorites.delete(btn.dataset.remove);
      saveFavorites();
      if (state.selectedVenue && state.selectedVenue.id === btn.dataset.remove) {
        updateFavBtn(state.selectedVenue);
      }
      renderFavorites();
    });
  });
}

document.getElementById('btn-favorites').addEventListener('click', () => {
  const panel = document.getElementById('favorites-panel');
  const isOpen = !panel.classList.contains('hidden');
  panel.classList.toggle('hidden', isOpen);
  document.getElementById('btn-favorites').classList.toggle('active', !isOpen);
  if (!isOpen) { renderFavorites(); document.getElementById('detail-panel').classList.add('hidden'); }
});

document.getElementById('btn-close-favorites').addEventListener('click', () => {
  document.getElementById('favorites-panel').classList.add('hidden');
  document.getElementById('btn-favorites').classList.remove('active');
});

// ── Share ─────────────────────────────────────────────────────
document.getElementById('btn-share').addEventListener('click', () => {
  const c   = map.getCenter();
  const z   = map.getZoom();
  const sel = state.selectedVenue ? state.selectedVenue.id : '';
  const hash = `#map=${z}/${c.lat.toFixed(4)}/${c.lng.toFixed(4)}&venue=${sel}&lang=${lang}`;
  const url  = location.origin + location.pathname + hash;
  navigator.clipboard.writeText(url).then(() => {
    showToast(t('status.share_ok'));
    document.getElementById('btn-share').classList.add('active');
    setTimeout(() => document.getElementById('btn-share').classList.remove('active'), 2000);
  });
});

function restoreFromHash() {
  const hash = location.hash;
  if (!hash) return;
  const params = {};
  hash.slice(1).split('&').forEach(part => {
    const [k, v] = part.split('=');
    params[k] = v;
  });
  if (params.lang) { lang = params.lang; document.getElementById('btn-lang-' + lang).click(); }
  if (params.map) {
    const [z, lat, lng] = params.map.split('/');
    map.setView([parseFloat(lat), parseFloat(lng)], parseInt(z));
  }
  if (params.venue && params.venue !== '') {
    const venue = state.venues.find(v => v.id === params.venue);
    if (venue) setTimeout(() => selectVenue(venue), 800);
  }
}

// ── Search ────────────────────────────────────────────────────
const searchInput = document.getElementById('search-input');
const searchResults = document.getElementById('search-results');

searchInput.addEventListener('input', () => {
  const q = searchInput.value.trim().toLowerCase();
  document.getElementById('search-clear').classList.toggle('hidden', !q);
  if (!q) { searchResults.classList.add('hidden'); return; }

  const matches = state.venues.filter(v => {
    return v.name_th.toLowerCase().includes(q) ||
           v.name_en.toLowerCase().includes(q) ||
           v.district_th.includes(q) ||
           v.district_en.toLowerCase().includes(q);
  }).slice(0, 8);

  if (!matches.length) { searchResults.classList.add('hidden'); return; }

  searchResults.innerHTML = matches.map(v => {
    const icon = v.types.includes('coworking') ? '💻'
               : v.types.includes('museum')    ? '🧒'
               : v.types.includes('recreation')? '🏃'
               : '📚';
    const name = lang === 'th' ? v.name_th : v.name_en;
    const dist = lang === 'th' ? v.district_th : v.district_en;
    return `<div class="search-result-item" data-id="${v.id}">
      <span class="result-icon">${icon}</span>
      <div>
        <div class="result-name">${name}</div>
        <div class="result-district">${dist}</div>
      </div>
    </div>`;
  }).join('');
  searchResults.classList.remove('hidden');

  searchResults.querySelectorAll('.search-result-item').forEach(el => {
    el.addEventListener('click', () => {
      const venue = state.venues.find(v => v.id === el.dataset.id);
      if (!venue) return;
      searchInput.value = lang === 'th' ? venue.name_th : venue.name_en;
      searchResults.classList.add('hidden');
      document.getElementById('search-clear').classList.remove('hidden');
      selectVenue(venue);
    });
  });
});

document.getElementById('search-clear').addEventListener('click', () => {
  searchInput.value = '';
  document.getElementById('search-clear').classList.add('hidden');
  searchResults.classList.add('hidden');
});

document.addEventListener('click', e => {
  if (!searchInput.contains(e.target) && !searchResults.contains(e.target)) {
    searchResults.classList.add('hidden');
  }
});

// ── Map Controls ──────────────────────────────────────────────
document.getElementById('btn-zoom-in').addEventListener('click',  () => map.zoomIn());
document.getElementById('btn-zoom-out').addEventListener('click', () => map.zoomOut());
document.getElementById('btn-fit-bkk').addEventListener('click',  () =>
  map.setView([13.7563, 100.5018], 12, { animate: true, duration: 0.8 })
);

// ── Sidebar Toggle ────────────────────────────────────────────
document.getElementById('sidebar-toggle').addEventListener('click', () => {
  document.getElementById('sidebar').classList.toggle('collapsed');
  setTimeout(() => map.invalidateSize(), 350);
});

// ── Toast ─────────────────────────────────────────────────────
let toastTimer;
function showToast(msg) {
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.classList.remove('hidden');
  requestAnimationFrame(() => el.classList.add('show'));
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    el.classList.remove('show');
    setTimeout(() => el.classList.add('hidden'), 350);
  }, 2500);
}

// ── Boot ──────────────────────────────────────────────────────
loadVenues().then(() => {
  restoreFromHash();
  applyI18n();
});
