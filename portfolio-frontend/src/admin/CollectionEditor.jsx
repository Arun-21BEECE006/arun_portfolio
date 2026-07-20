import { useState } from "react";
import {
  RiAddLine,
  RiEditLine,
  RiDeleteBinLine,
  RiCloseLine,
  RiSaveLine,
} from "react-icons/ri";
import { api } from "../lib/api";
import DynamicForm from "./DynamicForm";
import MediaGalleryField from "./MediaGalleryField";
import ImageUploadField from "./ImageUploadField";
import ConfirmDialog from "./ConfirmDialog";
import { toFormValues, fromFormValues } from "./formUtils";

export default function CollectionEditor({
  collectionKey,
  schema,
  items,
  onChanged,
}) {
  const [editing, setEditing] = useState(null); // item object, or {} for new, or null for closed
  const [values, setValues] = useState({});
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteError, setDeleteError] = useState("");

  const openNew = () => {
    setValues(toFormValues(schema.fields, {}));
    setEditing({ isNew: true });
    setError("");
  };

  const openEdit = (item) => {
    setValues(toFormValues(schema.fields, item));
    setEditing(item);
    setError("");
  };

  const close = () => {
    setEditing(null);
    setError("");
  };

  const save = async () => {
    setSaving(true);
    setError("");
    try {
      const payload = fromFormValues(schema.fields, values);
      if (editing.isNew) {
        await api.create(collectionKey, payload);
      } else {
        await api.update(collectionKey, editing.id, payload);
      }
      await onChanged();
      close();
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleteError("");
    try {
      await api.remove(collectionKey, deleteTarget.id);
      await onChanged();
      setDeleteTarget(null);
    } catch (e) {
      setDeleteError(e.message);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h2 className="font-display text-xl font-semibold">{schema.label}</h2>
        <button
          onClick={openNew}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-teal-400 text-ink-900 text-sm font-semibold hover:bg-teal-300 transition-colors"
        >
          <RiAddLine /> Add New
        </button>
      </div>

      <div className="space-y-2">
        {items.length === 0 && (
          <p className="text-sm text-muted border border-ink-700 rounded-xl p-6 text-center">
            Nothing here yet — click "Add New" to create the first one.
          </p>
        )}
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between gap-3 rounded-xl border border-ink-700 bg-ink-800/40 px-4 py-3"
          >
            <div className="min-w-0">
              <p className="font-medium text-sm truncate">
                {item.title || item.label || item.name || item.id}
              </p>
              {(item.subtitle || item.company || item.issuer) && (
                <p className="text-xs text-muted truncate">
                  {item.subtitle || item.company || item.issuer}
                </p>
              )}
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => openEdit(item)}
                className="w-9 h-9 grid place-items-center rounded-full border border-ink-600 text-muted hover:text-teal-300 hover:border-teal-400/40 transition-colors"
                aria-label="Edit"
              >
                <RiEditLine size={16} />
              </button>
              <button
                onClick={() => setDeleteTarget(item)}
                className="w-9 h-9 grid place-items-center rounded-full border border-ink-600 text-muted hover:text-rose-400 hover:border-rose-400/40 transition-colors"
                aria-label="Delete"
              >
                <RiDeleteBinLine size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 bg-ink-950/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-6">
          <div className="w-full sm:max-w-lg max-h-[90vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl border border-ink-600 bg-ink-900 p-6 sm:p-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-display text-lg font-semibold">
                {editing.isNew
                  ? `Add ${schema.label.slice(0, -1) || schema.label}`
                  : `Edit`}
              </h3>
              <button onClick={close} className="text-muted hover:text-paper">
                <RiCloseLine size={22} />
              </button>
            </div>

            <DynamicForm
              fields={schema.fields}
              values={values}
              onChange={setValues}
            />

            {schema.fields.some(
              (f) => f.type === "gallery" || f.type === "imageUpload",
            ) && (
              <div className="mt-6 pt-5 border-t border-ink-700 space-y-5">
                <p className="font-mono text-[11px] uppercase tracking-wider text-muted">
                  Images
                </p>
                {schema.fields
                  .filter((f) => f.type === "imageUpload")
                  .map((f) => (
                    <ImageUploadField
                      key={f.name}
                      label={f.label}
                      folder={f.folder || "misc"}
                      value={values[f.name]}
                      onChange={(next) =>
                        setValues((v) => ({ ...v, [f.name]: next }))
                      }
                    />
                  ))}
                {schema.fields
                  .filter((f) => f.type === "gallery")
                  .map((f) => (
                    <MediaGalleryField
                      key={f.name}
                      label={f.label}
                      folder={f.folder || "misc"}
                      value={values[f.name] || []}
                      onChange={(next) =>
                        setValues((v) => ({ ...v, [f.name]: next }))
                      }
                    />
                  ))}
              </div>
            )}

            {error && <p className="mt-4 text-sm text-rose-400">{error}</p>}

            <div className="flex gap-3 mt-6">
              <button
                onClick={save}
                disabled={saving}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-teal-400 text-ink-900 font-semibold text-sm hover:bg-teal-300 disabled:opacity-60 transition-colors"
              >
                <RiSaveLine /> {saving ? "Saving…" : "Save"}
              </button>
              <button
                onClick={close}
                className="px-5 py-2.5 rounded-full border border-ink-600 text-sm hover:border-ink-500 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        title={`Delete "${deleteTarget?.title || deleteTarget?.label || deleteTarget?.name || deleteTarget?.id || ""}"?`}
        message={deleteError || "This can't be undone."}
        confirmLabel="Delete"
        onConfirm={confirmDelete}
        onCancel={() => {
          setDeleteTarget(null);
          setDeleteError("");
        }}
      />
    </div>
  );
}
