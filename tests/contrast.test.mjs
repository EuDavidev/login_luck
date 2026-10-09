import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
const css = readFileSync(new URL('../src/app/globals.css', import.meta.url), 'utf8').replace(
  /\s+/g,
  '',
);
function luminance(hex) {
  const channels = hex
    .replace('#', '')
    .match(/../g)
    .map((value) => parseInt(value, 16) / 255)
    .map((value) => (value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4));
  return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722;
}
function token(name) {
  const value = css.match(new RegExp('--' + name + ':(#[0-9a-f]{6}|#[0-9a-f]{3})[;}]', 'i'))?.[1];
  assert.ok(value, 'Missing color token ' + name);
  return value.length === 4
    ? '#' +
        value
          .slice(1)
          .split('')
          .map((char) => char + char)
          .join('')
    : value;
}
test('default input boundaries have at least 3:1 contrast against their surface', () => {
  const borderToken = css.match(/\.ui-input\{[^}]*border:1pxsolidvar\(--([a-z-]+)\)/)?.[1];
  assert.ok(borderToken);
  const a = luminance(token(borderToken)),
    b = luminance(token('card'));
  assert.ok(
    (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05) >= 3,
    'Default input borders must have at least 3:1 contrast',
  );
});
