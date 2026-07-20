import { useRef, useState } from "react";
import { RiSaveLine, RiUploadCloud2Line, RiFilePdf2Line, RiLoader4Line } from "react-icons/ri";
import { api } from "../lib/api";
import { img } from "../utils/images";
import DynamicForm from "./DynamicForm";
import { toFormValues, fromFormValues } from "./formUtils";
import { resumeSchema } from "./schemas";

export default function ResumeEditor({ resume, onChanged }) {
  const [values, setValues] = useState(() => toFormValues(resumeSchema.fields, resume));
  const [file, setFile] = useState(resume?.file || "");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const inputRef = useRef(null);

  const handleUpload = async (fileList) => {
    const picked = fileList?.[0];
    if (!picked) return;
    setUploading(true);
    setError("");
    try {
      const { url } = await api.uploadFile(picked, "resume");
      setFile(url);
    } catch (e) {
      setError(e.message);
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const save = async () => {
    setSaving(true);
    setError("");
    setSaved(false);
    try {
      const payload = { ...fromFormValues(resumeSchema.fields, values), file };
      await api.updateSingleton("resume", payload);
      await onChanged();
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <h2 className="font-display text-xl font-semibold mb-5">Resume</h2>
      <div className="max-w-xl">
        <label className="block text-xs font-mono uppercase tracking-wider text-muted mb-1.5">
          Resume PDF
        </label>
        <div className="flex items-center gap-3 mb-4">
          {file ? (
            <a
              href={img(file)}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-ink-600 text-xs text-teal-300 hover:border-teal-400/40"
            >
              <RiFilePdf2Line /> {file.split("/").pop()}
            </a>
          ) : (
            <p className="text-xs text-muted">No file set.</p>
          )}
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-ink-600 text-xs hover:border-teal-400/40 hover:text-teal-300 transition-colors disabled:opacity-60"
          >
            {uploading ? <RiLoader4Line className="animate-spin" /> : <RiUploadCloud2Line />}
            {uploading ? "Uploading…" : "Upload new PDF"}
          </button>
          <input
            ref={inputRef}
            type="file"
            accept=".pdf"
            className="hidden"
            onChange={(e) => handleUpload(e.target.files)}
          />
        </div>

        <DynamicForm fields={resumeSchema.fields} values={values} onChange={setValues} />

        {error && <p className="mt-4 text-sm text-rose-400">{error}</p>}
        {saved && <p className="mt-4 text-sm text-teal-300">Saved — changes are live now.</p>}

        <button
          onClick={save}
          disabled={saving}
          className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-teal-400 text-ink-900 font-semibold text-sm hover:bg-teal-300 disabled:opacity-60 transition-colors"
        >
          <RiSaveLine /> {saving ? "Saving…" : "Save Resume"}
        </button>
      </div>
    </div>
  );
}
