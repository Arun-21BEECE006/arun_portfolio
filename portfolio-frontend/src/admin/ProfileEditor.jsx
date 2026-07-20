import { useRef, useState } from "react";
import {
  RiSaveLine,
  RiUploadCloud2Line,
  RiLoader4Line,
  RiUser3Line,
} from "react-icons/ri";
import { api } from "../lib/api";
import { img } from "../utils/images";
import DynamicForm from "./DynamicForm";
import { toFormValues, fromFormValues } from "./formUtils";
import { profileSchema } from "./schemas";

export default function ProfileEditor({ profile, onChanged }) {
  const [values, setValues] = useState(() =>
    toFormValues(profileSchema.fields, profile),
  );
  const [avatar, setAvatar] = useState(profile?.avatar || "");
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
      const { url } = await api.uploadFile(picked, "misc");
      setAvatar(url);
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
      const payload = {
        ...fromFormValues(profileSchema.fields, values),
        avatar,
      };
      await api.updateSingleton("profile", payload);
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
      <h2 className="font-display text-xl font-semibold mb-5">Profile</h2>
      <div className="max-w-xl">
        <label className="block text-xs font-mono uppercase tracking-wider text-muted mb-2">
          Profile Photo
        </label>
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full overflow-hidden border border-ink-600 bg-ink-800 shrink-0 grid place-items-center">
            {avatar ? (
              <img
                src={img(avatar)}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <RiUser3Line className="text-muted" size={24} />
            )}
          </div>
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-ink-600 text-xs hover:border-teal-400/40 hover:text-teal-300 transition-colors disabled:opacity-60"
          >
            {uploading ? (
              <RiLoader4Line className="animate-spin" />
            ) : (
              <RiUploadCloud2Line />
            )}
            {uploading
              ? "Uploading…"
              : avatar
                ? "Replace photo"
                : "Upload photo"}
          </button>
          <input
            ref={inputRef}
            type="file"
            accept=".png,.jpg,.jpeg,.webp"
            className="hidden"
            onChange={(e) => handleUpload(e.target.files)}
          />
        </div>
        <p className="text-[11px] text-muted/70 -mt-4 mb-6">
          Used in the Hero and About sections. Square images work best.
        </p>

        <DynamicForm
          fields={profileSchema.fields}
          values={values}
          onChange={setValues}
        />

        {error && <p className="mt-4 text-sm text-rose-400">{error}</p>}
        {saved && (
          <p className="mt-4 text-sm text-teal-300">
            Saved — changes are live now.
          </p>
        )}

        <button
          onClick={save}
          disabled={saving}
          className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-teal-400 text-ink-900 font-semibold text-sm hover:bg-teal-300 disabled:opacity-60 transition-colors"
        >
          <RiSaveLine /> {saving ? "Saving…" : "Save Profile"}
        </button>
      </div>
    </div>
  );
}
