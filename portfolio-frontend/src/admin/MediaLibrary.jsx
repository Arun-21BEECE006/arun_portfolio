import { useEffect, useRef, useState } from "react";
import {
  RiUploadCloud2Line,
  RiLoader4Line,
  RiFileTextLine,
  RiCloseLine,
  RiDeleteBinLine,
} from "react-icons/ri";
import { api } from "../lib/api";
import { img } from "../utils/images";
import ConfirmDialog from "./ConfirmDialog";

const FOLDERS = ["projects", "certifications", "conferences", "resume", "misc"];
const IMG_EXT = /\.(png|jpe?g|webp|gif|svg)$/i;

export default function MediaLibrary() {
  const [folder, setFolder] = useState("misc");
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState("");
  const [deletingUrl, setDeletingUrl] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const inputRef = useRef(null);

  const load = async () => {
    try {
      const { files } = await api.listMedia(folder);
      setFiles(files);
    } catch (e) {
      setError(e.message);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [folder]);

  const handleFiles = async (fileList) => {
    const list = Array.from(fileList || []);
    if (list.length === 0) return;
    setUploading(true);
    setError("");
    try {
      for (const f of list) await api.uploadFile(f, folder);
      await load();
    } catch (e) {
      setError(e.message);
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const copy = (url) => {
    navigator.clipboard.writeText(`${img(url)}`);
    setCopied(url);
    setTimeout(() => setCopied(""), 1500);
  };

  const confirmRemove = async () => {
    if (!deleteTarget) return;
    setDeletingUrl(deleteTarget.url);
    try {
      await api.deleteMedia(folder, deleteTarget.name);
      await load();
      setDeleteTarget(null);
    } catch (e) {
      setError(e.message);
      setDeleteTarget(null);
    } finally {
      setDeletingUrl("");
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between flex-wrap gap-3 mb-5">
        <h2 className="font-display text-xl font-semibold">Media Library</h2>
        <select
          value={folder}
          onChange={(e) => setFolder(e.target.value)}
          className="w-full sm:w-auto bg-ink-900 border border-ink-600 rounded-xl px-3 py-2 text-sm"
        >
          {FOLDERS.map((f) => (
            <option key={f} value={f}>
              /uploads/{f}
            </option>
          ))}
        </select>
      </div>

      <div
        onClick={() => inputRef.current?.click()}
        className="mb-6 flex flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-ink-600 py-8 sm:py-10 px-4 cursor-pointer hover:border-teal-400/40 transition-colors"
      >
        {uploading ? (
          <RiLoader4Line className="animate-spin text-teal-300" size={22} />
        ) : (
          <RiUploadCloud2Line className="text-teal-300" size={22} />
        )}
        <p className="text-sm text-center">
          {uploading ? "Uploading…" : "Tap to upload (multiple files OK)"}
        </p>
        <p className="text-xs text-muted text-center">
          png, jpg, webp, gif, svg, pdf, mp4 — up to 25MB each
        </p>
        <input
          ref={inputRef}
          type="file"
          multiple
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
      </div>

      {error && (
        <p className="mb-4 flex items-center gap-2 text-sm text-rose-400">
          <RiCloseLine /> {error}
        </p>
      )}

      <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
        {files.map((f) => (
          <div
            key={f.url}
            className="group relative aspect-square rounded-xl overflow-hidden border border-ink-600 hover:border-teal-400/50 transition-colors"
          >
            <button
              onClick={() => copy(f.url)}
              title="Click to copy URL"
              className="w-full h-full block"
            >
              {IMG_EXT.test(f.url) ? (
                <img
                  src={img(f.url)}
                  alt={f.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full grid place-items-center bg-ink-800">
                  <RiFileTextLine className="text-muted" size={22} />
                </div>
              )}
            </button>
            <span
              onClick={() => copy(f.url)}
              className="absolute inset-0 bg-ink-950/70 opacity-0 group-hover:opacity-100 sm:flex items-center justify-center text-[10px] px-1 text-center transition-opacity pointer-events-none group-hover:pointer-events-auto hidden"
            >
              {copied === f.url ? "Copied!" : "Copy URL"}
            </span>
            <button
              onClick={() => setDeleteTarget(f)}
              disabled={deletingUrl === f.url}
              aria-label={`Delete ${f.name}`}
              className="absolute top-1 right-1 w-6 h-6 grid place-items-center rounded-full bg-ink-950/80 border border-ink-600 text-rose-400 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity disabled:opacity-60"
            >
              {deletingUrl === f.url ? (
                <RiLoader4Line className="animate-spin" size={12} />
              ) : (
                <RiDeleteBinLine size={12} />
              )}
            </button>
          </div>
        ))}
      </div>

      {files.length === 0 && (
        <p className="text-sm text-muted">No files in /{folder} yet.</p>
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        title={`Delete "${deleteTarget?.name || ""}"?`}
        message="Any project, certificate, or conference still referencing this image will show a broken image after this."
        confirmLabel="Delete"
        onConfirm={confirmRemove}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
