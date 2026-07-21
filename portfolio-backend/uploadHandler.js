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
    const options = {
      folder: folderPath(folder),
      resource_type: isPdf ? "raw" : "auto",
      use_filename: true,
      unique_filename: true,
      overwrite: false,
    };
    // PDFs need an explicit format so Cloudinary keeps a real ".pdf" extension
    // on the delivered URL — without this, browsers often receive a generic
    // "application/octet-stream" content type and force-download the file
    // instead of previewing it inline (which is what an <iframe> needs).
    if (isPdf) options.format = "pdf";

    const stream = cloudinary.uploader.upload_stream(options, (err, result) => {
      if (err) return reject(err);
      resolve({
        url: result.secure_url,
        name: result.public_id,
        bytes: result.bytes,
        resourceType: result.resource_type,
      });
    });
    stream.end(buffer);
  });
}

// Cloudinary's resource listing is scoped per resource_type — "image" (which
// covers png/jpg/webp/gif/svg here) and "raw" (PDFs) have to be queried
// separately and merged, or raw files silently never show up.
async function listMedia(folder) {
  ensureConfigured();
  const prefix = folderPath(folder);

  const [imageResults, rawResults] = await Promise.all([
    cloudinary.api.resources({
      type: "upload",
      resource_type: "image",
      prefix,
      max_results: 100,
    }),
    cloudinary.api.resources({
      type: "upload",
      resource_type: "raw",
      prefix,
      max_results: 100,
    }),
  ]);

  const all = [
    ...(imageResults.resources || []),
    ...(rawResults.resources || []),
  ];
  return all
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .map((r) => ({
      name: r.public_id,
      url: r.secure_url,
      resourceType: r.resource_type,
    }));
}

// Since we don't track each file's resource_type separately in the app's
// data, try the common case (image) first and fall back to raw (PDFs) if
// that comes back "not found" — this covers both without needing a lookup.
async function deleteMedia(folder, publicId) {
  ensureConfigured();
  let result = await cloudinary.uploader.destroy(publicId, {
    resource_type: "image",
  });
  if (result.result === "not found") {
    result = await cloudinary.uploader.destroy(publicId, {
      resource_type: "raw",
    });
  }
  if (result.result !== "ok" && result.result !== "not found") {
    const err = new Error(`Cloudinary delete failed: ${result.result}`);
    err.status = 500;
    throw err;
  }
  return { deleted: true, publicId };
}

module.exports = { upload, uploadBuffer, listMedia, deleteMedia, FOLDERS };
