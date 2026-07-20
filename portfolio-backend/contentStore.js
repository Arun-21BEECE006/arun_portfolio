const fs = require("fs");
const path = require("path");
const { v2: cloudinary } = require("cloudinary");

// Content (projects, skills, experience, etc.) now lives on Cloudinary as a
// single JSON file, not on local disk. This is what makes live admin edits
// actually work and persist on Vercel — Cloudinary is external storage,
// completely independent of whether the request hit a read-only serverless
// function or your own machine. Local dev and production both read/write
// the exact same data now; there's no more "local vs. deployed" split.
const PUBLIC_ID = "portfolio/data/content";
const SEED_FILE = path.join(__dirname, "data", "content.json");

let configured = false;
function ensureConfigured() {
  if (configured) return;
  const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } =
    process.env;
  if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
    throw new Error(
      "Cloudinary is not configured. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in .env — these are required for content storage now, not just image uploads.",
    );
  }
  cloudinary.config({
    cloud_name: CLOUDINARY_CLOUD_NAME,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET,
    secure: true,
  });
  configured = true;
}

// In-memory cache so repeated reads within the same warm instance are
// instant and always reflect the most recent write, without waiting on
// Cloudinary's CDN cache to catch up.
let cache = null;

async function fetchFromCloudinary() {
  ensureConfigured();
  const url = cloudinary.url(PUBLIC_ID, { resource_type: "raw", secure: true });
  const res = await fetch(`${url}?t=${Date.now()}`); // cache-bust so we never read a stale CDN copy
  if (res.status === 404) return null; // nothing saved to Cloudinary yet
  if (!res.ok)
    throw new Error(
      `Could not fetch content from Cloudinary (HTTP ${res.status})`,
    );
  return res.json();
}

async function persistToCloudinary(content) {
  ensureConfigured();
  const buffer = Buffer.from(JSON.stringify(content, null, 2));
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        public_id: PUBLIC_ID,
        resource_type: "raw",
        overwrite: true,
        invalidate: true,
      },
      (err, result) => (err ? reject(err) : resolve(result)),
    );
    stream.end(buffer);
  });
}

async function readContent() {
  if (cache) return cache;
  let content = await fetchFromCloudinary();
  if (!content) {
    // First run ever (nothing saved to Cloudinary yet) — bootstrap from the
    // content.json already committed in this deployment, then persist it
    // to Cloudinary so it becomes the source of truth from now on.
    content = JSON.parse(fs.readFileSync(SEED_FILE, "utf-8"));
    await persistToCloudinary(content);
  }
  cache = content;
  return cache;
}

async function writeContent(content) {
  cache = content; // update immediately so the very next read is correct
  await persistToCloudinary(content);
}

// Generic helpers for the array-based collections (projects, skillOrbs,
// experience, certifications, achievements). `profile`, `conference`, and
// `resume` are singleton objects and are edited directly, not through these.
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

async function listItems(collection) {
  assertCollection(collection);
  const content = await readContent();
  return content[collection] || [];
}

async function createItem(collection, item) {
  assertCollection(collection);
  const content = await readContent();
  if (!content[collection]) content[collection] = [];
  const id = item.id || `${collection}-${Date.now()}`;
  const withId = { ...item, id };
  content[collection].push(withId);
  await writeContent(content);
  return withId;
}

async function updateItem(collection, id, patch) {
  assertCollection(collection);
  const content = await readContent();
  const list = content[collection] || [];
  const idx = list.findIndex((i) => String(i.id) === String(id));
  if (idx === -1) {
    const err = new Error("Item not found");
    err.status = 404;
    throw err;
  }
  list[idx] = { ...list[idx], ...patch, id: list[idx].id };
  content[collection] = list;
  await writeContent(content);
  return list[idx];
}

async function deleteItem(collection, id) {
  assertCollection(collection);
  const content = await readContent();
  const list = content[collection] || [];
  const next = list.filter((i) => String(i.id) !== String(id));
  if (next.length === list.length) {
    const err = new Error("Item not found");
    err.status = 404;
    throw err;
  }
  content[collection] = next;
  await writeContent(content);
  return { deleted: true, id };
}

async function updateSingleton(key, patch) {
  if (!["profile", "conference", "resume"].includes(key)) {
    const err = new Error(`Unknown singleton: ${key}`);
    err.status = 400;
    throw err;
  }
  const content = await readContent();
  content[key] = { ...content[key], ...patch };
  await writeContent(content);
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
