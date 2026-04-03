/* =============================================
   EduStream — script.js
   =============================================
   HOW TO ADD LESSONS:
   Add objects to the `lessons` array below.
   Each lesson needs:
     title       : string
     description : string
     videoSrc    : "assets/videos/intro.mp4"  (or "" to upload via modal)
     thumb       : "assets/images/thumb1.jpg" (or "" to upload via modal)
   ============================================= */

const lessons = [
  {
    id: 1,
    title: "Introduction to HTML",
    description: "Learn the fundamental building blocks of every web page. We cover tags, attributes, semantic elements, and how browsers parse HTML documents.",
    videoSrc: "assets/videos/intro.mp4",
    thumb:    "assets/images/thumb1.jpg",
    completed: false
  },
  {
    id: 2,
    title: "Styling with CSS",
    description: "Discover how to transform plain HTML into visually stunning pages using selectors, the box model, Flexbox, Grid, and responsive design.",
    videoSrc: "assets/videos/css-basics.mp4",
    thumb:    "assets/images/thumb2.jpg",
    completed: false
  },
  {
    id: 3,
    title: "JavaScript Basics",
    description: "Make your web pages interactive. We cover variables, functions, DOM manipulation, events, and how to connect your scripts to your HTML.",
    videoSrc: "assets/videos/js-basics.mp4",
    thumb:    "assets/images/thumb3.jpg",
    completed: false
  }
];

/* ---- Asset store: uploaded files stored as Object URLs ---- */
const assetStore = { video: [], image: [], icon: [] };

let currentIndex = 0;

/* =============================================
   INIT
   ============================================= */
function init() {
  renderPlaylist();
  renderCourseCards();
  loadLesson(0);
  updateProgress();
}

/* =============================================
   PLAYLIST
   ============================================= */
function renderPlaylist() {
  const list = document.getElementById('playlist');
  list.innerHTML = '';
  lessons.forEach((lesson, i) => {
    const li = document.createElement('li');
    li.className = i === currentIndex ? 'active' : '';
    li.onclick = () => loadLesson(i);
    const thumbSrc = lesson._thumbUrl || lesson.thumb;
    li.innerHTML = `
      <img src="${thumbSrc}" class="lesson-thumb" alt="" onerror="this.style.visibility='hidden'" />
      <span class="lesson-num">${i + 1}.</span>
      <span class="lesson-name">${lesson.title}</span>
      <span class="status-icon">${lesson.completed ? '&#10003;' : ''}</span>`;
    list.appendChild(li);
  });
}

/* =============================================
   COURSE CARDS
   ============================================= */
function renderCourseCards() {
  const grid = document.getElementById('courses-grid');
  const hint = document.getElementById('empty-hint');
  grid.innerHTML = '';
  if (!lessons.length) { hint.style.display = 'block'; return; }
  hint.style.display = 'none';
  lessons.forEach((lesson, i) => {
    const card = document.createElement('div');
    card.className = 'course-card' + (i === currentIndex ? ' active-card' : '');
    card.onclick = () => loadLesson(i);
    const thumbSrc = lesson._thumbUrl || lesson.thumb;
    card.innerHTML = `
      <img class="course-card-thumb" src="${thumbSrc}" alt="${lesson.title}"
           onerror="this.style.display='none'; this.nextElementSibling.style.display='flex'" />
      <div class="course-card-thumb-placeholder" style="display:none">&#127909;</div>
      <div class="course-card-body">
        <p>${lesson.title}</p>
        <span>${lesson.completed ? '&#10003; Completed' : 'Not started'}</span>
      </div>`;
    grid.appendChild(card);
  });
}

/* =============================================
   LOAD LESSON
   ============================================= */
function loadLesson(index) {
  currentIndex = index;
  const lesson = lessons[index];
  renderPlaylist();
  renderCourseCards();

  document.getElementById('lesson-title').textContent = lesson.title;
  document.getElementById('lesson-meta').textContent  = `Lesson ${index + 1} of ${lessons.length}`;
  document.getElementById('lesson-desc').textContent  = lesson.description;

  const video       = document.getElementById('main-video');
  const placeholder = document.getElementById('video-placeholder');
  const src         = lesson._videoUrl || lesson.videoSrc;

  if (src) {
    video.style.display = 'block';
    placeholder.style.display = 'none';
    video.src = src;
    video.load();
  } else {
    video.style.display = 'none';
    placeholder.style.display = 'flex';
  }

  const btn = document.getElementById('btn-complete');
  if (lesson.completed) {
    btn.innerHTML  = '&#10003; Completed';
    btn.classList.add('done');
    btn.disabled   = true;
  } else {
    btn.innerHTML  = '&#10003; Mark Complete';
    btn.classList.remove('done');
    btn.disabled   = false;
  }

  const sidebar = document.getElementById('sidebar');
  if (sidebar.classList.contains('open')) toggleSidebar();
}

/* =============================================
   MARK COMPLETE
   ============================================= */
function markComplete() {
  lessons[currentIndex].completed = true;
  renderPlaylist();
  renderCourseCards();
  updateProgress();
  const btn = document.getElementById('btn-complete');
  btn.innerHTML = '&#10003; Completed';
  btn.classList.add('done');
  btn.disabled = true;
}

/* =============================================
   PROGRESS BAR
   ============================================= */
function updateProgress() {
  const done = lessons.filter(l => l.completed).length;
  const pct  = lessons.length ? Math.round((done / lessons.length) * 100) : 0;
  document.getElementById('progress-bar').style.width   = pct + '%';
  document.getElementById('progress-label').textContent = pct + '% complete';
}

/* =============================================
   SIDEBAR TOGGLE (mobile)
   ============================================= */
function toggleSidebar() {
  document.getElementById('sidebar').classList.toggle('open');
  document.getElementById('sidebar-overlay').classList.toggle('open');
}

/* =============================================
   UPLOAD MODAL
   ============================================= */
function openUploadModal() {
  document.getElementById('upload-modal').classList.add('open');
  document.getElementById('modal-overlay').classList.add('open');
}
function closeUploadModal() {
  document.getElementById('upload-modal').classList.remove('open');
  document.getElementById('modal-overlay').classList.remove('open');
}

function switchTab(name, btn) {
  document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  document.getElementById('tab-' + name).classList.add('active');
  btn.classList.add('active');
}

/* Drag & drop */
function dragOver(e)  { e.preventDefault(); e.currentTarget.classList.add('drag-over'); }
function dragLeave(e) { e.currentTarget.classList.remove('drag-over'); }
function dropFile(e, type) {
  e.preventDefault();
  e.currentTarget.classList.remove('drag-over');
  processFiles(Array.from(e.dataTransfer.files), type);
}
function handleFileInput(e, type) {
  processFiles(Array.from(e.target.files), type);
  e.target.value = '';
}

/* Core processor */
function processFiles(files, type) {
  files.forEach(file => {
    const url  = URL.createObjectURL(file);
    assetStore[type].push({ name: file.name, url, size: formatSize(file.size) });
    renderAssetList(type);
    setStatus('Uploaded: ' + file.name);
  });
}

function formatSize(bytes) {
  if (bytes < 1024)    return bytes + ' B';
  if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / 1048576).toFixed(1) + ' MB';
}

function setStatus(msg) {
  const el = document.getElementById('modal-status');
  el.textContent = msg;
  setTimeout(() => { el.textContent = ''; }, 3500);
}

/* Render asset list */
function renderAssetList(type) {
  const container = document.getElementById('asset-list-' + type + 's');
  container.innerHTML = '';
  assetStore[type].forEach((asset, i) => {
    const item = document.createElement('div');
    item.className = 'asset-item';
    let thumbHtml = '';
    if (type === 'image' || type === 'icon')
      thumbHtml = `<img src="${asset.url}" class="asset-item-thumb" alt="" />`;
    else if (type === 'video')
      thumbHtml = `<video src="${asset.url}" class="asset-item-thumb" muted></video>`;

    const assignBtn = (type === 'video' || type === 'image')
      ? `<button class="asset-item-assign" onclick="assignToLesson(${i},'${type}')">Assign → Lesson ${currentIndex + 1}</button>`
      : '';

    item.innerHTML = `
      ${thumbHtml}
      <span class="asset-item-name" title="${asset.name}">${asset.name}</span>
      <span class="asset-item-size">${asset.size}</span>
      ${assignBtn}
      <button class="asset-item-del" onclick="removeAsset(${i},'${type}')" title="Remove">&#10005;</button>`;
    container.appendChild(item);
  });
}

/* Assign to lesson */
function assignToLesson(assetIndex, type) {
  const asset  = assetStore[type][assetIndex];
  const lesson = lessons[currentIndex];
  if (type === 'video') {
    lesson._videoUrl = asset.url;
    setStatus(`Video "${asset.name}" assigned to Lesson ${currentIndex + 1}`);
  } else {
    lesson._thumbUrl = asset.url;
    setStatus(`Thumbnail "${asset.name}" assigned to Lesson ${currentIndex + 1}`);
  }
  loadLesson(currentIndex);
}

/* Remove asset */
function removeAsset(i, type) {
  URL.revokeObjectURL(assetStore[type][i].url);
  assetStore[type].splice(i, 1);
  renderAssetList(type);
}

/* =============================================
   START
   ============================================= */
document.addEventListener('DOMContentLoaded', init);