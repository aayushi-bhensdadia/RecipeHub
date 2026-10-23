// "Paneer Butter Masala!" -> "paneer butter masala"
export const slug = (s) =>
  String(s ?? '')
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, '')
    .replace(/\s+/g, ' ')
    .trim();

// Turns an array into a clean list of non-empty trimmed strings.
export const lines = (v) =>
  (Array.isArray(v) ? v : []).map((x) => String(x).trim()).filter(Boolean);
