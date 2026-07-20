const fs = require("fs");
const path = require("path");

// In production, set DATA_DIR to a mounted persistent disk (e.g. Render's
// "Disk" feature, a Railway volume, or any real folder on a VPS) so your
// content survives restarts and redeploys. Defaults to an in-repo folder,
// which is fine for local development but NOT durable on most hosts.
const DATA_DIR = process.env.DATA_DIR || path.join(__dirname, "data");
const DATA_FILE = path.join(DATA_DIR, "content.json");
const SEED_FILE = path.join(__dirname, "seed", "content.json");

// First boot on a fresh persistent disk: DATA_DIR exists but is empty.
// Seed it from the bundled default content so the site isn't blank.
function ensureSeeded() {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(DATA_FILE) && fs.existsSync(SEED_FILE)) {
    fs.copyFileSync(SEED_FILE, DATA_FILE);
  }
}
ensureSeeded();

function readContent() {
  const raw = fs.readFileSync(DATA_FILE, "utf-8");
  return JSON.parse(raw);
}

function writeContent(content) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(content, null, 2), "utf-8");
}

// Generic helpers for the array-based collections (projects, skillOrbs,
// experience, certifications, achievements). `profile` and `conference`
// are singleton objects and are edited directly, not through these.
const COLLECTIONS = [
  "projects",
  "skillOrbs",
  "experience",
  "certifications",
  "achievements",
  "conferences",
];

function assertCollection(name) {
  if (!COLLECTIONS.includes(name)) {
    const err = new Error(`Unknown collection: ${name}`);
    err.status = 400;
    throw err;
  }
}

function listItems(collection) {
  assertCollection(collection);
  const content = readContent();
  return content[collection] || [];
}

function createItem(collection, item) {
  assertCollection(collection);
  const content = readContent();
  if (!content[collection]) content[collection] = [];
  const id = item.id || `${collection}-${Date.now()}`;
  const withId = { ...item, id };
  content[collection].push(withId);
  writeContent(content);
  return withId;
}

function updateItem(collection, id, patch) {
  assertCollection(collection);
  const content = readContent();
  const list = content[collection] || [];
  const idx = list.findIndex((i) => String(i.id) === String(id));
  if (idx === -1) {
    const err = new Error("Item not found");
    err.status = 404;
    throw err;
  }
  list[idx] = { ...list[idx], ...patch, id: list[idx].id };
  content[collection] = list;
  writeContent(content);
  return list[idx];
}

function deleteItem(collection, id) {
  assertCollection(collection);
  const content = readContent();
  const list = content[collection] || [];
  const next = list.filter((i) => String(i.id) !== String(id));
  if (next.length === list.length) {
    const err = new Error("Item not found");
    err.status = 404;
    throw err;
  }
  content[collection] = next;
  writeContent(content);
  return { deleted: true, id };
}

function updateSingleton(key, patch) {
  if (!["profile", "conference", "resume"].includes(key)) {
    const err = new Error(`Unknown singleton: ${key}`);
    err.status = 400;
    throw err;
  }
  const content = readContent();
  content[key] = { ...content[key], ...patch };
  writeContent(content);
  return content[key];
}

module.exports = {
  readContent,
  writeContent,
  listItems,
  createItem,
  updateItem,
  deleteItem,
  updateSingleton,
  COLLECTIONS,
};
