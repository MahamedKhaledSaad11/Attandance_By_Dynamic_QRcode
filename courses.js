// قائمة المواد الـ 18 المدمجة مسبقاً في النظام
// يمكنك تعديل أسماء المواد والروابط من هنا مباشرة أو من داخل واجهة البرنامج بزر "⚙️ تعديل المواد"

const DEFAULT_COURSES = [
  {
    id: 1,
    name: "مادة 1: الذكاء الاصطناعي",
    code: "CS-401",
    formUrl: "https://docs.google.com/forms/d/e/1FAIpQLSc_EXAMPLE_AI/viewform",
    prefillParam: ""
  },
  {
    id: 2,
    name: "مادة 2: هندسة البرمجيات",
    code: "SE-302",
    formUrl: "https://docs.google.com/forms/d/e/1FAIpQLSc_EXAMPLE_SE/viewform",
    prefillParam: ""
  },
  {
    id: 3,
    name: "مادة 3: نظم قواعد البيانات",
    code: "DB-201",
    formUrl: "https://docs.google.com/forms/d/e/1FAIpQLSc_EXAMPLE_DB/viewform",
    prefillParam: ""
  },
  {
    id: 4,
    name: "مادة 4: شبكات الحاسب",
    code: "NET-301",
    formUrl: "https://docs.google.com/forms/d/e/1FAIpQLSc_EXAMPLE_NET/viewform",
    prefillParam: ""
  },
  {
    id: 5,
    name: "مادة 5: هياكل البيانات والخوارزميات",
    code: "DS-202",
    formUrl: "https://docs.google.com/forms/d/e/1FAIpQLSc_EXAMPLE_DS/viewform",
    prefillParam: ""
  },
  {
    id: 6,
    name: "مادة 6: نظم التشغيل",
    code: "OS-303",
    formUrl: "https://docs.google.com/forms/d/e/1FAIpQLSc_EXAMPLE_OS/viewform",
    prefillParam: ""
  },
  {
    id: 7,
    name: "مادة 7: أمن المعلومات والسيبراني",
    code: "SEC-402",
    formUrl: "https://docs.google.com/forms/d/e/1FAIpQLSc_EXAMPLE_SEC/viewform",
    prefillParam: ""
  },
  {
    id: 8,
    name: "مادة 8: تطوير تطبيقات الويب",
    code: "WEB-205",
    formUrl: "https://docs.google.com/forms/d/e/1FAIpQLSc_EXAMPLE_WEB/viewform",
    prefillParam: ""
  },
  {
    id: 9,
    name: "مادة 9: تعلم الآلة",
    code: "ML-405",
    formUrl: "https://docs.google.com/forms/d/e/1FAIpQLSc_EXAMPLE_ML/viewform",
    prefillParam: ""
  },
  {
    id: 10,
    name: "مادة 10: الحوسبة السحابية",
    code: "CLOUD-403",
    formUrl: "https://docs.google.com/forms/d/e/1FAIpQLSc_EXAMPLE_CLOUD/viewform",
    prefillParam: ""
  },
  {
    id: 11,
    name: "مادة 11: تحليل وتصميم النظم",
    code: "SAD-304",
    formUrl: "https://docs.google.com/forms/d/e/1FAIpQLSc_EXAMPLE_SAD/viewform",
    prefillParam: ""
  },
  {
    id: 12,
    name: "مادة 12: برمجة الكائنات (OOP)",
    code: "OOP-102",
    formUrl: "https://docs.google.com/forms/d/e/1FAIpQLSc_EXAMPLE_OOP/viewform",
    prefillParam: ""
  },
  {
    id: 13,
    name: "مادة 13: معمارية وتنظيم الحاسب",
    code: "ARCH-204",
    formUrl: "https://docs.google.com/forms/d/e/1FAIpQLSc_EXAMPLE_ARCH/viewform",
    prefillParam: ""
  },
  {
    id: 14,
    name: "مادة 14: تفاعل الإنسان والحاسوب (HCI)",
    code: "HCI-305",
    formUrl: "https://docs.google.com/forms/d/e/1FAIpQLSc_EXAMPLE_HCI/viewform",
    prefillParam: ""
  },
  {
    id: 15,
    name: "مادة 15: معالجة الصور الرقمية",
    code: "DIP-404",
    formUrl: "https://docs.google.com/forms/d/e/1FAIpQLSc_EXAMPLE_DIP/viewform",
    prefillParam: ""
  },
  {
    id: 16,
    name: "مادة 16: تنقيب البيانات (Data Mining)",
    code: "DM-406",
    formUrl: "https://docs.google.com/forms/d/e/1FAIpQLSc_EXAMPLE_DM/viewform",
    prefillParam: ""
  },
  {
    id: 17,
    name: "مادة 17: الرسوميات بالحاسوب",
    code: "CG-306",
    formUrl: "https://docs.google.com/forms/d/e/1FAIpQLSc_EXAMPLE_CG/viewform",
    prefillParam: ""
  },
  {
    id: 18,
    name: "مادة 18: إدارة مشاريع البرمجيات",
    code: "SPM-407",
    formUrl: "https://docs.google.com/forms/d/e/1FAIpQLSc_EXAMPLE_SPM/viewform",
    prefillParam: ""
  }
];
