function parseDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value || '')) return null;
  const [year, month, day] = value.split('-').map(Number);
  if (year < 1) return null;
  const date = new Date(0);
  date.setFullYear(year, month - 1, day);
  date.setHours(0, 0, 0, 0);
  return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day
    ? date
    : null;
}
export function validateBirthDate(value, today = new Date()) {
  const birth = parseDate(value);
  if (!birth) return 'Informe uma data de nascimento válida.';
  const now = new Date(today);
  now.setHours(0, 0, 0, 0);
  return birth > now ? 'A data de nascimento não pode estar no futuro.' : true;
}
export function calculateAge(value, today = new Date()) {
  if (validateBirthDate(value, today) !== true) return null;
  const birth = parseDate(value);
  let age = today.getFullYear() - birth.getFullYear();
  if (
    today.getMonth() < birth.getMonth() ||
    (today.getMonth() === birth.getMonth() && today.getDate() < birth.getDate())
  )
    age--;
  return age;
}
export function localToday() {
  const now = new Date();
  return [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, '0'),
    String(now.getDate()).padStart(2, '0'),
  ].join('-');
}
