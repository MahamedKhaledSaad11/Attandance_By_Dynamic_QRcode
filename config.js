// إعدادات المادة المخصصة لهذا الجهاز
// يمكنك ضبط الرابط واسم المادة هنا أو من داخل زر "⚙️ الإعدادات" في البرنامج

const APP_CONFIG = {
  // رابط Google Form الخاص بالحضور (ضعه هنا أو من داخل البرنامج)
  formUrl: "https://docs.google.com/forms/d/e/1FAIpQLSc_EXAMPLE/viewform",

  // رابط بوابة فحص الـ 5 ثوانٍ لحظر تصوير الشاشة (مرفوعة على GitHub Pages)
  gateUrl: "https://mahamedkhaledsaad11.github.io/Attandance_By_Dynamic_QRcode/gate.html",

  // اسم المادة أو السيكشن (اختياري - سيظهر فقط إذا تمت كتابته)
  courseName: "ذكاء اصطناعي",

  // اسم حقل الكود لتعبئته تلقائياً في الفورم (اختياري مثل: entry.123456789)
  prefillParam: "",

  // مدة تغيير الـ QR بالثواني (افتراضياً 5 ثوانٍ)
  intervalSeconds: 5,

  // طول كود التحقق (4 أو 6 أرقام)
  codeLength: 6
};
