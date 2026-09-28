function sanitizeObjectKeys(obj, maxKeys = 1000) {
  if (!obj || typeof obj !== 'object' || Array.isArray(obj)) return {};
  const keys = Object.keys(obj).slice(0, maxKeys);
  const sanitized = {};
  keys.forEach(k => {
    if (typeof k === 'string' && k.length < 50) {
      const val = obj[k];
      if (typeof val === 'string' || typeof val === 'number' || typeof val === 'boolean') {
        sanitized[k] = val;
      } else if (Array.isArray(val)) {
        // limit arrays to 100 simple items
        sanitized[k] = val.filter(i => typeof i === 'string' || typeof i === 'number').slice(0, 100);
      } else if (typeof val === 'object' && val !== null) {
         // allow 1 level of nesting safely
         const nestedKeys = Object.keys(val).slice(0, 50);
         const nested = {};
         nestedKeys.forEach(nk => {
            if (typeof nk === 'string' && nk.length < 50 && (typeof val[nk] === 'string' || typeof val[nk] === 'number' || typeof val[nk] === 'boolean')) {
                nested[nk] = val[nk];
            }
         });
         sanitized[k] = nested;
      }
    }
  });
  return sanitized;
}

module.exports = {
  sanitizeObjectKeys
};
