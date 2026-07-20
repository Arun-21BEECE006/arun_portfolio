// Eagerly import every image in src/assets so components can reference
// images by plain filename string (as stored in data/portfolio.js) instead
// of needing a manual `import` statement per image.
const modules = import.meta.glob("../assets/*.{png,jpg,jpeg,svg,webp}", {
  eager: true,
  import: "default",
});

const map = {};
for (const path in modules) {
  const filename = path.split("/").pop();
  map[filename] = modules[path];
}

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "";

export function img(filename) {
  if (!filename) return "";
  if (/^https?:\/\//i.test(filename)) return filename;
  if (filename.startsWith("/uploads/")) return `${BACKEND_URL}${filename}`;
  return map[filename] || "";
}
