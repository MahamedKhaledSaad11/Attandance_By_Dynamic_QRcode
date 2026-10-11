const state = {
  isRunning: false,
  intervalSeconds: 5,
  codeLength: 6,
  courseName: '',
  formUrl: '',
  gateUrl: '',
  prefillParam: '',
  currentCode: '',
  animationFrameId: null,
  timeRemainingMs: 5000,
  lastTickTime: null,
  history: [],
  sessionStartTime: null,
  totalGenerated: 0,
  qrCodeInstance: null
};

// DOM Elements - Main Screen
const toggleBtn = document.getElementById('toggleBtn');
const toggleIcon = document.getElementById('toggleIcon');
const toggleText = document.getElementById('toggleText');
const resetBtn = document.getElementById('resetBtn');
const fullscreenBtn = document.getElementById('fullscreenBtn');

const qrcodeContainer = document.getElementById('qrcode');
const qrOverlay = document.getElementById('qrOverlay');
const overlayMessage = document.getElementById('overlayMessage');
const timerProgress = document.getElementById('timerProgress');
const secondsRemaining = document.getElementById('secondsRemaining');
const currentCodeDisplay = document.getElementById('currentCodeDisplay');
const statusIndicator = document.getElementById('statusIndicator');
const statusText = document.getElementById('statusText');
const totalGeneratedCount = document.getElementById('totalGeneratedCount');
const sessionStartTimeDisplay = document.getElementById('sessionStartTime');
const exportCsvBtn = document.getElementById('exportCsvBtn');

const lectureBadge = document.getElementById('lectureBadge');
const activeCourseTitle = document.getElementById('activeCourseTitle');

// DOM Elements - Settings Modal
const openSettingsBtn = document.getElementById('openSettingsBtn');
const closeSettingsBtn = document.getElementById('closeSettingsBtn');
const cancelSettingsBtn = document.getElementById('cancelSettingsBtn');
const saveSettingsBtn = document.getElementById('saveSettingsBtn');
const settingsModal = document.getElementById('settingsModal');

const formUrlInput = document.getElementById('formUrlInput');
const courseNameInput = document.getElementById('courseNameInput');
const intervalInput = document.getElementById('intervalInput');
const codeLengthInput = document.getElementById('codeLengthInput');
const prefillParamInput = document.getElementById('prefillParamInput');
const gateUrlInput = document.getElementById('gateUrlInput');
const saveToast = document.getElementById('saveToast');

// SVG Circumference: 2 * Math.PI * 45 ≈ 282.74
const CIRCUMFERENCE = 2 * Math.PI * 45;
if (timerProgress) {
  timerProgress.style.strokeDasharray = `${CIRCUMFERENCE}`;
  timerProgress.style.strokeDashoffset = '0';
}

// 1. تحميل الإعدادات (الأولوية لـ localStorage ثم ملف config.js)
function loadConfiguration() {
  const localData = localStorage.getItem('doctor_attendance_config');
  let config = {};

  if (localData) {
    try {
      config = JSON.parse(localData);
    } catch (e) {
      console.error('Error parsing local storage config', e);
    }
  }

  // الافتراضيات من config.js إن وجدت
  const defaultConf = (typeof APP_CONFIG !== 'undefined') ? APP_CONFIG : {};

  state.courseName = config.courseName ?? defaultConf.courseName ?? '';
  state.formUrl = config.formUrl ?? defaultConf.formUrl ?? '';
  state.gateUrl = config.gateUrl ?? defaultConf.gateUrl ?? '';
  state.prefillParam = config.prefillParam ?? defaultConf.prefillParam ?? '';
  state.intervalSeconds = parseInt(config.intervalSeconds ?? defaultConf.intervalSeconds ?? 5);
  state.codeLength = parseInt(config.codeLength ?? defaultConf.codeLength ?? 6);

  // تحديث حقول المودال
  formUrlInput.value = state.formUrl;
  courseNameInput.value = state.courseName;
  if (gateUrlInput) gateUrlInput.value = state.gateUrl;
  prefillParamInput.value = state.prefillParam;
  intervalInput.value = state.intervalSeconds;
  codeLengthInput.value = state.codeLength;

  updateDisplayView();
}

// 2. تحديث الشاشة الرئيسية للدكتور
function updateDisplayView() {
  if (state.courseName && state.courseName.trim()) {
    activeCourseTitle.textContent = state.courseName.trim();
    lectureBadge.style.display = 'inline-flex';
  } else {
    lectureBadge.style.display = 'none';
  }

  if (overlayMessage) {
    if (!state.formUrl) {
      overlayMessage.innerHTML = 'يرجى وضع رابط Google Form أولاً عبر الضغط على <strong>⚙️ الإعدادات</strong> بالأعلى';
    } else {
      overlayMessage.textContent = 'اضغط "بدء توليد كود الحضور" بالأسفل لعرض الـ QR';
    }
  }
}

// 3. إدارة نافذة الإعدادات
function openModal() {
  saveToast.classList.add('hidden');
  settingsModal.classList.add('active');
}

function closeModal() {
  settingsModal.classList.remove('active');
}

function saveConfiguration() {
  const url = formUrlInput.value.trim();
  if (!url) {
    alert('يرجى إدخال رابط Google Form قبل الحفظ!');
    formUrlInput.focus();
    return;
  }

  state.formUrl = url;
  state.courseName = courseNameInput.value.trim();
  state.gateUrl = gateUrlInput ? gateUrlInput.value.trim() : '';
  state.prefillParam = prefillParamInput.value.trim();
  state.intervalSeconds = Math.max(2, parseInt(intervalInput.value) || 5);
  state.codeLength = parseInt(codeLengthInput.value) || 6;

  const toSave = {
    formUrl: state.formUrl,
    courseName: state.courseName,
    gateUrl: state.gateUrl,
    prefillParam: state.prefillParam,
    intervalSeconds: state.intervalSeconds,
    codeLength: state.codeLength
  };

  localStorage.setItem('doctor_attendance_config', JSON.stringify(toSave));
  updateDisplayView();

  saveToast.classList.remove('hidden');
  setTimeout(() => {
    closeModal();
    saveToast.classList.add('hidden');
  }, 1200);

  if (state.isRunning) {
    updateQRCodeAndDisplay();
  }
}

// 4. تهيئة الـ QR Code
function initQRCode() {
  qrcodeContainer.innerHTML = '';
  const isFullscreen = document.body.classList.contains('fullscreen-mode');
  const size = isFullscreen ? 500 : 360;

  state.qrCodeInstance = new QRCode(qrcodeContainer, {
    text: state.formUrl || "https://docs.google.com/forms",
    width: size,
    height: size,
    colorDark: "#050b14",
    colorLight: "#ffffff",
    correctLevel: QRCode.CorrectLevel.M
  });
}

// 5. توليد كود عشوائي
function generateCode(length) {
  if (length === 8) {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }
  const min = Math.pow(10, length - 1);
  const max = Math.pow(10, length) - 1;
  return Math.floor(min + Math.random() * (max - min + 1)).toString();
}

// تحديد رابط بوابة الفحص gate.html
function getEffectiveGateUrl() {
  if (state.gateUrl && state.gateUrl.trim()) {
    return state.gateUrl.trim();
  }
  // إذا كان الموقع مرفوعاً على GitHub Pages أو خادم ويب (http / https)
  if (window.location.protocol === 'http:' || window.location.protocol === 'https:') {
    const basePath = window.location.pathname.replace(/\/[^\/]*$/, '');
    return `${window.location.origin}${basePath}/gate.html`;
  }
  // في حال التشغيل المحلي كملف file:///، نستخدم رابط البوابة المرفوعة على GitHub Pages
  if (typeof APP_CONFIG !== 'undefined' && APP_CONFIG.gateUrl) {
    return APP_CONFIG.gateUrl;
  }
  return 'https://mahamedkhaledsaad11.github.io/Attandance_By_Dynamic_QRcode/gate.html';
}

// 6. تجهيز الرابط النهائي مع الكود وبوابة فحص الصلاحية
function buildTargetUrl(rawUrl, code) {
  let urlStr = rawUrl ? rawUrl.trim() : 'https://docs.google.com/forms';

  try {
    const url = new URL(urlStr);
    const paramKey = state.prefillParam.trim();

    if (paramKey) {
      url.searchParams.set(paramKey, code);
    } else {
      let matchedEntry = false;
      for (const key of url.searchParams.keys()) {
        if (key.startsWith('entry.')) {
          url.searchParams.set(key, code);
          matchedEntry = true;
          break;
        }
      }
      if (!matchedEntry) {
        url.searchParams.set('code', code);
        url.searchParams.set('t', Date.now());
      }
    }
    urlStr = url.toString();
  } catch (e) {
    const separator = urlStr.includes('?') ? '&' : '?';
    urlStr = `${urlStr}${separator}code=${code}&t=${Date.now()}`;
  }

  // توجيه الرابط عبر بوابة gate.html لفحص مدة الـ 5 ثوانٍ وحظر الاسكرين شوت
  const gate = getEffectiveGateUrl();
  if (gate) {
    const encodedForm = btoa(encodeURIComponent(urlStr));
    const now = Date.now();
    return `${gate}?url=${encodedForm}&t=${now}&c=${code}`;
  }

  return urlStr;
}

// 7. تحديث الـ QR والشاشة
function updateQRCodeAndDisplay() {
  state.currentCode = generateCode(state.codeLength);
  const targetUrl = buildTargetUrl(state.formUrl, state.currentCode);

  if (state.qrCodeInstance) {
    state.qrCodeInstance.makeCode(targetUrl);
  }

  if (currentCodeDisplay) {
    currentCodeDisplay.textContent = state.currentCode;
  }
  state.totalGenerated++;
  if (totalGeneratedCount) {
    totalGeneratedCount.textContent = state.totalGenerated;
  }

  addToHistory(state.currentCode, targetUrl);

  state.timeRemainingMs = state.intervalSeconds * 1000;
  state.lastTickTime = performance.now();
}

// 8. العداد الزمني السلس
function animationLoop(timestamp) {
  if (!state.isRunning) return;

  if (!state.lastTickTime) {
    state.lastTickTime = timestamp;
  }

  const elapsed = timestamp - state.lastTickTime;
  state.lastTickTime = timestamp;
  state.timeRemainingMs -= elapsed;

  if (state.timeRemainingMs <= 0) {
    updateQRCodeAndDisplay();
  }

  if (timerProgress) {
    const fraction = Math.max(0, state.timeRemainingMs / (state.intervalSeconds * 1000));
    const offset = CIRCUMFERENCE * (1 - fraction);
    timerProgress.style.strokeDashoffset = `${offset}`;

    if (fraction < 0.25) {
      timerProgress.style.stroke = 'var(--accent-red)';
    } else {
      timerProgress.style.stroke = 'var(--accent-cyan)';
    }
  }

  if (secondsRemaining) {
    const secondsDisplay = Math.ceil(Math.max(0, state.timeRemainingMs) / 1000);
    secondsRemaining.textContent = secondsDisplay;
  }

  state.animationFrameId = requestAnimationFrame(animationLoop);
}

// 9. سجل الأكواد
function addToHistory(code, url) {
  const now = new Date();
  const timeStr = now.toLocaleTimeString('ar-EG', { hour12: false });

  state.history.unshift({ time: timeStr, code, url });
  if (state.history.length > 50) state.history.pop();
}

// 10. التحكم في الجلسة (بدء / إيقاف)
function startSession() {
  if (!state.formUrl) {
    alert('يرجى إدخال وحفظ رابط Google Form أولاً عبر زر "⚙️ الإعدادات" بالأعلى.');
    openModal();
    return;
  }

  state.isRunning = true;
  toggleBtn.classList.add('is-running');
  toggleIcon.textContent = '⏸';
  toggleText.textContent = 'إيقاف مؤقت';

  statusIndicator.classList.remove('stopped');
  statusText.textContent = 'مباشر (يتم التحديث)';
  qrOverlay.classList.add('hidden');

  if (!state.sessionStartTime) {
    const now = new Date();
    state.sessionStartTime = now.toLocaleTimeString('ar-EG', { hour12: false });
    sessionStartTimeDisplay.textContent = state.sessionStartTime;
  }

  updateQRCodeAndDisplay();
  state.lastTickTime = performance.now();
  state.animationFrameId = requestAnimationFrame(animationLoop);
}

function pauseSession() {
  state.isRunning = false;
  if (state.animationFrameId) {
    cancelAnimationFrame(state.animationFrameId);
  }

  toggleBtn.classList.remove('is-running');
  toggleIcon.textContent = '▶';
  toggleText.textContent = 'استئناف التوليد';

  statusIndicator.classList.add('stopped');
  statusText.textContent = 'متوقف مؤقتاً';
}

function resetSession() {
  pauseSession();
  state.history = [];
  state.totalGenerated = 0;
  state.sessionStartTime = null;
  if (totalGeneratedCount) totalGeneratedCount.textContent = '0';
  if (sessionStartTimeDisplay) sessionStartTimeDisplay.textContent = '--:--';
  if (currentCodeDisplay) currentCodeDisplay.textContent = '------';
  if (secondsRemaining) secondsRemaining.textContent = state.intervalSeconds;
  if (timerProgress) timerProgress.style.strokeDashoffset = '0';
  qrOverlay.classList.remove('hidden');
  statusText.textContent = 'جاهز للبدء';
}

// 11. وضع شاشة العرض (البروجيكتور)
function toggleFullscreen() {
  document.body.classList.toggle('fullscreen-mode');
  const isFullscreen = document.body.classList.contains('fullscreen-mode');

  setTimeout(initQRCode, 50);

  if (isFullscreen) {
    fullscreenBtn.innerHTML = '<span class="icon">✕</span> خروج من العرض';
    if (document.documentElement.requestFullscreen && !document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    }
  } else {
    fullscreenBtn.innerHTML = '<span class="icon">⛶</span> شاشة العرض (البروجيكتور)';
    if (document.exitFullscreen && document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    }
  }

  if (state.isRunning && state.currentCode) {
    setTimeout(() => {
      const targetUrl = buildTargetUrl(state.formUrl, state.currentCode);
      state.qrCodeInstance.makeCode(targetUrl);
    }, 100);
  }
}

// 12. تصدير CSV
function exportHistoryCsv() {
  if (state.history.length === 0) {
    alert('لا يوجد سجل بعد لتصديره!');
    return;
  }

  let csvContent = "data:text/csv;charset=utf-8,\uFEFF";
  csvContent += "الوقت,كود التحقق,الرابط المسجل\n";

  state.history.forEach(row => {
    csvContent += `"${row.time}","${row.code}","${row.url}"\n`;
  });

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `سجل_حضور_${state.courseName || 'المحاضرة'}_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Event Listeners
openSettingsBtn.addEventListener('click', openModal);
closeSettingsBtn.addEventListener('click', closeModal);
cancelSettingsBtn.addEventListener('click', closeModal);
saveSettingsBtn.addEventListener('click', saveConfiguration);

settingsModal.addEventListener('click', (e) => {
  if (e.target === settingsModal) closeModal();
});

toggleBtn.addEventListener('click', () => {
  if (state.isRunning) {
    pauseSession();
  } else {
    startSession();
  }
});

resetBtn.addEventListener('click', resetSession);
fullscreenBtn.addEventListener('click', toggleFullscreen);
exportCsvBtn.addEventListener('click', exportHistoryCsv);

// اختصارات الكيبورد
window.addEventListener('keydown', (e) => {
  if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT') return;

  if (e.code === 'Space') {
    e.preventDefault();
    toggleBtn.click();
  } else if (e.code === 'KeyF') {
    e.preventDefault();
    toggleFullscreen();
  } else if (e.code === 'Escape') {
    if (settingsModal.classList.contains('active')) {
      closeModal();
    } else if (document.body.classList.contains('fullscreen-mode')) {
      toggleFullscreen();
    }
  }
});

// بدء التشغيل
loadConfiguration();
initQRCode();
