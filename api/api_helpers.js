function sanitize(s, max = 500) {
  if (typeof s !== 'string') return '';
  return s.trim().slice(0, max).replace(/[<>]/g,'');
}

// ملاحظة: للبيئة الفعلية اربطي مع نظام Auth للتحقق من الدور.
async function requireRole(req, roles) {
  // مثال تجريبي: يسمح دائمًا بدور admin أثناء التطوير
  return { role: 'admin' };
}

module.exports = { sanitize, requireRole };
