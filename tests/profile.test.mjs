import test from 'node:test';
import assert from 'node:assert/strict';
const profile = await import('../src/lib/profile.js').catch(() => ({}));
test('calculates age before and on a birthday', () => {
  assert.equal(typeof profile.calculateAge, 'function');
  assert.equal(profile.calculateAge('2000-10-09', new Date(2026, 9, 8)), 25);
  assert.equal(profile.calculateAge('2000-10-08', new Date(2026, 9, 8)), 26);
});
test('rejects impossible and future birth dates', () => {
  assert.equal(typeof profile.validateBirthDate, 'function');
  assert.ok(profile.validateBirthDate('2025-02-29', new Date(2026, 9, 8)));
  assert.ok(profile.validateBirthDate('2027-01-01', new Date(2026, 9, 8)));
  assert.equal(profile.validateBirthDate('2000-02-29', new Date(2026, 9, 8)), true);
  assert.notEqual(profile.validateBirthDate('2025-02-29', new Date(2026, 9, 8)), true);
  assert.notEqual(profile.validateBirthDate('2027-01-01', new Date(2026, 9, 8)), true);
});
test('accepts today and rejects an empty date', () => {
  assert.equal(typeof profile.validateBirthDate, 'function');
  assert.equal(profile.validateBirthDate('2026-10-08', new Date(2026, 9, 8)), true);
  assert.notEqual(profile.validateBirthDate('', new Date(2026, 9, 8)), true);
});
