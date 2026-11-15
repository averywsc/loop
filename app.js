const $ = s => document.querySelector(s);
const audio = new Audio(), dec = new OfflineAudioContext(1, 1, 44100);
audio.preservesPitch = true;
let dur = 0, peaks = [], track = '', url = null, loop = { a: 0, b: 0, on: false }, secs = [], drag = null;

const fmt = t => Math.floor(t / 60) + ':' + (t % 60).toFixed(1).padStart(4, '0');
const esc = s => s.replace(/[&<>"]/g, c => '&#' + c.charCodeAt(0) + ';');
const toast = m => { const t = $('#toast'); t.textContent = m; t.classList.add('show'); clearTimeout(toast.h); toast.h = setTimeout(() => t.classList.remove('show'), 2400); };

async function load(name, bytes) {
  const ab = bytes instanceof ArrayBuffer ? bytes : bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength);
  let buf;
  try { buf = await dec.decodeAudioData(ab.slice(0)); } catch (e) { return toast('That file could not be read as audio'); }
  audio.pause(); if (url) URL.revokeObjectURL(url);
  url = URL.createObjectURL(new Blob([ab])); audio.src = url; audio.playbackRate = $('#speed').value / 100;
  dur = buf.duration; track = name;
  const d = buf.getChannelData(0), N = 1600, step = Math.max(1, Math.floor(d.length / N)); peaks = [];
  for (let i = 0; i < N; i++) { let m = 0; for (let j = i * step; j < (i + 1) * step && j < d.length; j += Math.max(1, step >> 6)) m = Math.max(m, Math.abs(d[j])); peaks.push(m); }
  const top = Math.max(...peaks) || 1; peaks = peaks.map(p => p / top);
  loop = { a: 0, b: 0, on: false };
  try { secs = JSON.parse(localStorage.getItem('loop:' + name) || '[]'); } catch (e) { secs = []; }
  $('#track').textContent = name; $('#dur').textContent = fmt(dur); $('#drop').style.display = 'none';
  draw(true); renderSecs(); sync();
}

function draw(anim) {
  if (!dur) return;
  const c = $('#wave'), r = c.getBoundingClientRect(), dpr = devicePixelRatio || 1;
  c.width = r.width * dpr; c.height = r.height * dpr;
  const g = c.getContext('2d'); g.scale(dpr, dpr);
  const w = r.width, h = r.height, bw = w / peaks.length; g.fillStyle = 'rgba(255,255,255,.92)';
  peaks.forEach((p, i) => { const hh = Math.max(1, p * h * .46); g.fillRect(i * bw, h / 2 - hh, Math.max(1, bw - .4), hh * 2); });
  const st = [1, 2, 5, 10, 15, 30, 60, 120, 300, 600].find(s => (w / dur) * s >= 70) || 600; let html = '';
  for (let t = 0; t <= dur; t += st) html += `<span style="left:${t / dur * 100}%">${Math.floor(t / 60)}:${String(Math.floor(t % 60)).padStart(2, '0')}</span>`;
  $('#ruler').innerHTML = html;
  if (anim) { c.classList.remove('grow'); void c.offsetWidth; c.classList.add('grow'); }
}
new ResizeObserver(() => draw(false)).observe($('#tl'));

function sync() {
  const R = $('#region'), has = loop.b > loop.a;
  R.style.opacity = has ? 1 : 0;
  if (dur) { R.style.left = loop.a / dur * 100 + '%'; R.style.width = (loop.b - loop.a) / dur * 100 + '%'; }
  R.classList.toggle('on', loop.on); $('#loopBtn').classList.toggle('lit', loop.on && has);
  $('#range').textContent = has ? `Loop ${fmt(loop.a)} – ${fmt(loop.b)}` : 'No loop selected';
  $('#spd').textContent = '×' + audio.playbackRate.toFixed(2);
}

(function tick() {
  if (dur) {
    const t = audio.currentTime;
    if (loop.on && loop.b > loop.a && t >= loop.b && t < loop.b + .5) audio.currentTime = loop.a;
    $('#head').style.left = audio.currentTime / dur * 100 + '%'; $('#time').textContent = fmt(audio.currentTime);
  }
  requestAnimationFrame(tick);
})();

/* waveform: drag = set loop, click = seek */
const tl = $('#tl'), at = e => { const r = tl.getBoundingClientRect(); return Math.min(dur, Math.max(0, (e.clientX - r.left) / r.width * dur)); };
tl.onpointerdown = e => { if (!dur) return; tl.setPointerCapture(e.pointerId); drag = { s: at(e), x: e.clientX, m: false }; };
tl.onpointermove = e => {
  if (!drag) return; if (Math.abs(e.clientX - drag.x) > 4) drag.m = true;
  if (drag.m) { const t = at(e); loop.a = Math.min(drag.s, t); loop.b = Math.max(drag.s, t); loop.on = true; sync(); }
};
tl.onpointerup = () => { if (drag && !drag.m) audio.currentTime = drag.s; drag = null; };

/* controls */
const play = () => { if (dur) audio.paused ? audio.play() : audio.pause(); };
const toggleLoop = () => { if (loop.b > loop.a) { loop.on = !loop.on; sync(); } else toast('Drag across the waveform to select a loop'); };
const setSpeed = d => { const s = $('#speed'); s.value = +s.value + d; s.dispatchEvent(new Event('input')); };
audio.onplay = audio.onpause = () => $('#play').classList.toggle('playing', !audio.paused);
$('#play').onclick = play; $('#loopBtn').onclick = toggleLoop;
$('#back').onclick = () => { audio.currentTime = loop.b > loop.a ? loop.a : 0; };
$('#speed').oninput = e => { audio.playbackRate = e.target.value / 100; sync(); };
$('#open').onclick = async () => { const r = await api.open(); if (r) load(r.name, r.data); };
$('#save').onclick = saveSec;
document.addEventListener('click', e => { const b = e.target.closest('button'); if (b) b.blur(); });
addEventListener('dragover', e => e.preventDefault());
addEventListener('drop', async e => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) load(f.name, await f.arrayBuffer()); });
addEventListener('keydown', e => {
  if (e.target.isContentEditable) return;
  if (e.code === 'Space') play(); else if (e.key === 'l') toggleLoop(); else if (e.key === 's') saveSec();
  else if (e.key === 'ArrowLeft') audio.currentTime -= 2; else if (e.key === 'ArrowRight') audio.currentTime += 2;
  else if (e.key === '[') setSpeed(-5); else if (e.key === ']') setSpeed(5); else if (e.key === 'Home') $('#back').click(); else return;
  e.preventDefault();
});

/* saved loops */
const persist = () => localStorage.setItem('loop:' + track, JSON.stringify(secs));
function saveSec() {
  if (!(loop.b > loop.a)) return toast('Select a loop first');
  secs.push({ id: Date.now(), name: 'Loop ' + (secs.length + 1), a: loop.a, b: loop.b }); persist(); renderSecs();
}
function renderSecs() {
  $('#secs').innerHTML = secs.length ? secs.map(s => `<li data-id="${s.id}"><span class="nm">${esc(s.name)}</span><button class="x" aria-label="Delete"><svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/></svg></button><small>${fmt(s.a)} – ${fmt(s.b)}</small></li>`).join('') : '<li class="none">Saved loops appear here.</li>';
}
const secOf = e => { const li = e.target.closest('li[data-id]'); return li && secs.find(s => s.id == li.dataset.id); };
$('#secs').onclick = e => {
  const s = secOf(e); if (!s) return;
  if (e.target.closest('.x')) { secs = secs.filter(x => x !== s); persist(); renderSecs(); }
  else if (!e.target.classList.contains('nm')) { loop = { a: s.a, b: s.b, on: true }; audio.currentTime = s.a; audio.play(); sync(); }
};
$('#secs').ondblclick = e => { if (e.target.classList.contains('nm')) { e.target.contentEditable = true; e.target.focus(); } };
$('#secs').onfocusout = e => { const s = secOf(e); if (s && e.target.classList.contains('nm')) { e.target.contentEditable = false; s.name = e.target.textContent.trim() || s.name; persist(); renderSecs(); } };
$('#secs').onkeydown = e => { if (e.key === 'Enter') { e.preventDefault(); e.target.blur(); } };

/* guided tour */
const TOUR = [
  ['#open', 'Open a song', 'Click Open audio, or drag a song into the window. MP3, WAV, FLAC, OGG, M4A, AAC and Opus all work.'],
  ['#tl', 'Pick a section', 'Drag across the waveform to select the part you are practising. It loops automatically. Click once to jump to a spot.'],
  ['#speed', 'Slow it down', 'Lower the Speed slider to learn fast passages slowly. The pitch stays the same.'],
  ['#save', 'Save your loops', 'Click Save loop to keep a section. Click it in the list to jump back in. Double-click a name to rename it.'],
  ['.hint', 'Use the keyboard', 'Space plays and pauses, L turns the loop on or off, S saves, and [ and ] change the speed.']
];
function tour(n = 0) {
  const t = $('#tour'); document.querySelectorAll('.spot').forEach(e => e.classList.remove('spot'));
  if (n >= TOUR.length) { t.innerHTML = ''; localStorage.setItem('loop-toured', '1'); return; }
  const [sel, h, p] = TOUR[n]; $(sel).classList.add('spot');
  t.innerHTML = `<div class="veil"></div><div class="tourcard"><small>Step ${n + 1} of ${TOUR.length}</small><h3>${h}</h3><p>${p}</p><div class="acts"><button class="key" data-s="skip">Skip</button><button class="key lit" data-s="next">${n === TOUR.length - 1 ? 'Done' : 'Next'}</button></div></div>`;
  t.onclick = e => { const s = e.target.dataset.s; if (s === 'skip') tour(99); else if (s === 'next') tour(n + 1); };
}
$('#help').onclick = () => tour();
if (!localStorage.getItem('loop-toured')) tour();
