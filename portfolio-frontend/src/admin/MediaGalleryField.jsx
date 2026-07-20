import { useEffect, useRef, useState } from "react";
import { RiUploadCloud2Line, RiCloseLine, RiImageAddLine, RiLoader4Line } from "react-icons/ri";
import { api } from "../lib/api";
import { img } from "../utils/images";

export default function MediaGalleryField({ label, folder = "projects", value = [], onChange }) {
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

  const handleFiles = async (fileList) => {
    const files = Array.from(fileList || []);
    if (files.length === 0) return;
    setUploading(true);
    setError("");
    const uploaded = [];
    try {
      for (const file of files) {
        const { url } = await api.uploadFile(file, folder);
        uploaded.push(url);
      }
      onChange([...value, ...uploaded]);
    } catch (e) {
      setError(e.message);
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const remove = (url) => onChange(value.filter((v) => v !== url));
  const addFromLibrary = (url) => {
    if (!value.includes(url)) onChange([...value, url]);
  };

  return (
    <div>
      <label className="block text-xs font-mono uppercase tracking-wider text-muted mb-1.5">
        {label} ({value.length} image{value.length === 1 ? "" : "s"})
      </label>

      {value.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {value.map((url) => (
            <div key={url} className="relative w-20 h-20 rounded-lg overflow-hidden border border-ink-600 group">
              <img src={img(url)} alt="" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => remove(url)}
                className="absolute inset-0 bg-ink-950/70 opacity-0 group-hover:opacity-100 grid place-items-center transition-opacity"
                aria-label="Remove image"
              >
                <RiCloseLine className="text-rose-400" size={18} />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-ink-600 text-xs hover:border-teal-400/40 hover:text-teal-300 transition-colors disabled:opacity-60"
        >
          {uploading ? <RiLoader4Line className="animate-spin" /> : <RiUploadCloud2Line />}
          {uploading ? "Uploading…" : "Upload images (multi-select OK)"}
        </button>
        <input
          ref={inputRef}
          type="file"
          multiple
          accept=".png,.jpg,.jpeg,.webp,.gif,.svg"
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
        <button
          type="button"
          onClick={() => setShowLibrary((s) => !s)}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-ink-600 text-xs hover:border-amber-500/40 hover:text-amber-400 transition-colors"
        >
          <RiImageAddLine /> Choose from library
        </button>
      </div>

      {error && <p className="text-xs text-rose-400 mt-2">{error}</p>}

      {showLibrary && (
        <div className="mt-3 rounded-xl border border-ink-700 bg-ink-900 p-3 max-h-56 overflow-y-auto">
          {library.length === 0 ? (
            <p className="text-xs text-muted">No files uploaded to /{folder} yet.</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {library.map((f) => (
                <button
                  key={f.url}
                  type="button"
                  onClick={() => addFromLibrary(f.url)}
                  className="w-16 h-16 rounded-lg overflow-hidden border border-ink-600 hover:border-teal-400/50 transition-colors"
                  title={f.name}
                >
                  <img src={img(f.url)} alt={f.name} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
