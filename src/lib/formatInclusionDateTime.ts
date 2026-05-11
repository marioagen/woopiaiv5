/** Normaliza YYYY-MM-DD para meio-dia local, evitando deslocamento de dia em UTC. */
function normalizeInclusionInput(value: string): string {
  const v = value.trim();
  return /^\d{4}-\d{2}-\d{2}$/.test(v) ? `${v}T12:00:00` : v;
}

/** Formato DD/MM/AAAA HH:mm (pt-BR). */
export function formatInclusionDateTime(value: string): string {
  const d = new Date(normalizeInclusionInput(value));
  if (Number.isNaN(d.getTime())) return '—';
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const yyyy = d.getFullYear();
  const hh = String(d.getHours()).padStart(2, '0');
  const min = String(d.getMinutes()).padStart(2, '0');
  return `${dd}/${mm}/${yyyy} ${hh}:${min}`;
}

export function inclusionDateToMillis(value: string): number {
  return new Date(normalizeInclusionInput(value)).getTime();
}
