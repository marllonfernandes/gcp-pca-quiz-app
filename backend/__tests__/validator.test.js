const { sanitizeObjectKeys } = require('../utils/validator');

describe('Security Validator', () => {
  it('should allow valid objects within limit', () => {
    const input = { q1: 'A', q2: 'B' };
    const result = sanitizeObjectKeys(input, 5);
    expect(result).toEqual({ q1: 'A', q2: 'B' });
  });

  it('should truncate keys if exceeding limit', () => {
    const input = { a: 1, b: 2, c: 3 };
    const result = sanitizeObjectKeys(input, 2);
    // It should only keep the first 2 keys
    expect(Object.keys(result).length).toBe(2);
  });

  it('should reject deep objects', () => {
    const input = { a: { b: { c: 1 } } };
    const result = sanitizeObjectKeys(input, 10);
    // The nested object should be ignored/truncated
    expect(result.a).toEqual({});
  });

  it('should return empty object for invalid inputs', () => {
    expect(sanitizeObjectKeys(null)).toEqual({});
    expect(sanitizeObjectKeys(undefined)).toEqual({});
    expect(sanitizeObjectKeys("string")).toEqual({});
  });
});
