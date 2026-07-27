const MONTHS = {
  jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5,
  jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11,
};

// Converts a free-text date string into a comparable number (higher =
// more recent), so sections can always display most-recent-first
// regardless of what order items were added in the admin panel.
//
// Handles every real date format used across the site:
//  - Range fields with "Present" (Experience's `period`, Project's `duration`):
//    e.g. "May 2026 – Present", "July 2025 – March 2026"
//  - Single free-text dates (Conference's `date`):
//    e.g. "7–8 March 2024", "27–28 December 2024", "12th & 13th March 2025"
//  - ISO-ish dates (Certification's `issueDate`): e.g. "2024-08"
//
// Unparseable or empty values sort to the bottom rather than crashing
// the sort or throwing anything off.
export function chronoValue(str) {
  if (!str) return -Infinity;
  const s = String(str).trim();
  if (/present/i.test(s)) return Infinity;

  // YYYY-MM, e.g. "2024-08"
  const ym = s.match(/^(\d{4})-(\d{1,2})$/);
  if (ym) return parseInt(ym[1], 10) * 12 + (parseInt(ym[2], 10) - 1);

  // Last "Month Year" occurrence anywhere in the string — correctly
  // ignores day numbers in ranges like "27–28 December 2024" and takes
  // the END month in ranges like "May 2026 – Present" / "July 2025 – March 2026".
  const monthYearMatches = [...s.matchAll(/([A-Za-z]{3,9})\.?,?\s+(\d{4})/g)];
  if (monthYearMatches.length) {
    const [, monthStr, yearStr] = monthYearMatches[monthYearMatches.length - 1];
    const m = MONTHS[monthStr.slice(0, 3).toLowerCase()];
    if (m !== undefined) return parseInt(yearStr, 10) * 12 + m;
  }

  // Last standalone 4-digit year as a fallback
  const years = [...s.matchAll(/\d{4}/g)];
  if (years.length) return parseInt(years[years.length - 1][0], 10) * 12;

  return -Infinity;
}

// Returns a new array sorted most-recent-first by the given date field.
export function sortByDateDesc(items, field) {
  return [...items].sort((a, b) => chronoValue(b[field]) - chronoValue(a[field]));
}