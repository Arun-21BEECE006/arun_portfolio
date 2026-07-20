import { useEffect, useRef, useState } from "react";
import {
  RiUploadCloud2Line,
  RiImageAddLine,
  RiLoader4Line,
  RiCloseLine,
} from "react-icons/ri";
import { api } from "../lib/api";
import { img } from "../utils/images";

export default function ImageUploadField({
  label,
  folder = "misc",
  value,
  onChange,
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [library, setLibrary] = useState([]);
  const [showLibrary, setShowLibrary] = useState(false);
  const inputRef = useRef(null);

  const loadLibrary = async () => {
    try {
      const { files } = await api.listMedia(folder);
      setLibrary(files);
    } catch {
      setLibrary([]);
    }
  };

  useEffect(() => {
    if (showLibrary) loadLibrary();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showLibrary]);

  const handleUpload = async (fileList) => {
    const file = fileList?.[0];
    if (!file) return;
    setUploading(true);
    setError("");
    try {
      const { url } = await api.uploadFile(file, folder);
      onChange(url);
    } catch (e) {
      setError(e.message);
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <div>
      <label className="block text-xs font-mono uppercase tracking-wider text-muted mb-1.5">
        {label}
      </label>

      <div className="flex items-center gap-3 mb-2">
        <div className="w-16 h-16 rounded-lg overflow-hidden border border-ink-600 bg-ink-900 shrink-0 grid place-items-center">
          {value ? (
            <img
              src={img(value)}
              alt=""
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-[10px] text-muted">None</span>
          )}
        </div>
        <div className="flex flex-col gap-1.5">
          <input
            type="text"
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            placeholder="filename in src/assets, or full https:// URL"
            className="w-full bg-ink-900 border border-ink-600 rounded-lg px-2.5 py-1.5 text-xs focus:border-teal-400 outline-none transition-colors"
          />
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={uploading}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-ink-600 text-[11px] hover:border-teal-400/40 hover:text-teal-300 transition-colors disabled:opacity-60"
            >
              {uploading ? (
                <RiLoader4Line className="animate-spin" />
              ) : (
                <RiUploadCloud2Line />
              )}
              {uploading ? "Uploading…" : "Upload"}
            </button>
            <button
              type="button"
              onClick={() => setShowLibrary((s) => !s)}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-ink-600 text-[11px] hover:border-amber-500/40 hover:text-amber-400 transition-colors"
            >
              <RiImageAddLine /> Library
            </button>
            {value && (
              <button
                type="button"
                onClick={() => onChange("")}
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-ink-600 text-[11px] hover:border-rose-400/40 hover:text-rose-400 transition-colors"
              >
                <RiCloseLine /> Clear
              </button>
            )}
          </div>
        </div>
        <input
          ref={inputRef}
          type="file"
          accept=".png,.jpg,.jpeg,.webp,.gif,.svg"
          className="hidden"
          onChange={(e) => handleUpload(e.target.files)}
        />
      </div>

      {error && <p className="text-xs text-rose-400 mb-2">{error}</p>}

      {showLibrary && (
        <div className="rounded-xl border border-ink-700 bg-ink-900 p-3 max-h-48 overflow-y-auto">
          {library.length === 0 ? (
            <p className="text-xs text-muted">
              No files uploaded to /{folder} yet.
            </p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {library.map((f) => (
                <button
                  key={f.url}
                  type="button"
                  onClick={() => {
                    onChange(f.url);
                    setShowLibrary(false);
                  }}
                  className="w-14 h-14 rounded-lg overflow-hidden border border-ink-600 hover:border-teal-400/50 transition-colors"
                  title={f.name}
                >
                  <img
                    src={img(f.url)}
                    alt={f.name}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
