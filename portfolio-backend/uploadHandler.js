const multer = require("multer");
const { v2: cloudinary } = require("cloudinary");

const FOLDERS = ["projects", "certifications", "conferences", "resume", "misc"];
const ALLOWED_EXT = new Set([
  "png",
  "jpg",
  "jpeg",
  "webp",
  "gif",
  "svg",
  "pdf",
  "mp4",
]);
const MAX_SIZE = 25 * 1024 * 1024; // 25MB

let configured = false;
function ensureConfigured() {
  if (configured) return;
  const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } =
    process.env;
  if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
    throw new Error(
      "Cloudinary is not configured. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in .env (see .env.example).",
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

// Keep the file in memory only — nothing touches local disk, so this works
// identically on a real server or a Vercel serverless function.
const storage = multer.memoryStorage();

function fileFilter(req, file, cb) {
  const ext = (file.originalname.split(".").pop() || "").toLowerCase();
  if (!ALLOWED_EXT.has(ext)) return cb(new Error("File type not allowed"));
  cb(null, true);
}

const upload = multer({ storage, fileFilter, limits: { fileSize: MAX_SIZE } });

function folderPath(folder) {
  const safeFolder = FOLDERS.includes(folder) ? folder : "misc";
  return `portfolio/${safeFolder}`;
}

// Uploads a buffer (from multer memoryStorage) to Cloudinary and returns
// { url, name } in the same shape the rest of the app already expects.
function uploadBuffer(buffer, folder, originalname) {
  ensureConfigured();
  return new Promise((resolve, reject) => {
    const isPdf = /\.pdf$/i.test(originalname);
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: folderPath(folder),
        resource_type: isPdf ? "raw" : "auto",
        use_filename: true,
        unique_filename: true,
        overwrite: false,
      },
      (err, result) => {
        if (err) return reject(err);
        resolve({
          url: result.secure_url,
          name: result.public_id,
          bytes: result.bytes,
        });
      },
    );
    stream.end(buffer);
  });
}

async function listMedia(folder) {
  ensureConfigured();
  const prefix = folderPath(folder);
  const results = await cloudinary.api.resources({
    type: "upload",
    prefix,
    max_results: 100,
  });
  return (results.resources || [])
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .map((r) => ({ name: r.public_id, url: r.secure_url }));
}

async function deleteMedia(folder, publicId) {
  ensureConfigured();
  // publicId comes back from listMedia/upload as the Cloudinary public_id
  // (e.g. "portfolio/projects/abc123"), so no extra folder-prefixing needed.
  const result = await cloudinary.uploader.destroy(publicId, {
    resource_type: "image",
  });
  if (result.result !== "ok" && result.result !== "not found") {
    const err = new Error(`Cloudinary delete failed: ${result.result}`);
    err.status = 500;
    throw err;
  }
  return { deleted: true, publicId };
}

module.exports = { upload, uploadBuffer, listMedia, deleteMedia, FOLDERS };
