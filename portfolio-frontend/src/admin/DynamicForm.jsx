export default function DynamicForm({ fields, values, onChange }) {
  const set = (name, value) => onChange({ ...values, [name]: value });

  return (
    <div className="space-y-4">
      {fields.map((f) => {
        if (f.type === "gallery" || f.type === "imageUpload") return null; // rendered separately by the caller
        return (
          <div key={f.name}>
            <label className="block text-xs font-mono uppercase tracking-wider text-muted mb-1.5">
              {f.label}
              {f.required && <span className="text-amber-400"> *</span>}
            </label>
            {(f.type === "kvlines" || f.type === "pipelines") && (
              <p className="text-[11px] text-muted/70 mb-1">
                {f.type === "kvlines"
                  ? "One per line: Label: Value"
                  : "One per line: Date | Milestone"}
              </p>
            )}

            {f.type === "boolean" ? (
              <label className="inline-flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={!!values[f.name]}
                  onChange={(e) => set(f.name, e.target.checked)}
                  className="w-4 h-4 accent-teal-400"
                />
                <span className="text-sm text-paper/80">
                  {values[f.name] ? "Yes" : "No"}
                </span>
              </label>
            ) : f.type === "textarea" ||
              f.type === "lines" ||
              f.type === "kvlines" ||
              f.type === "pipelines" ? (
              <textarea
                rows={f.type === "textarea" ? 3 : 4}
                value={values[f.name] ?? ""}
                onChange={(e) => set(f.name, e.target.value)}
                className="w-full bg-ink-900 border border-ink-600 rounded-xl px-3 py-2.5 text-sm focus:border-teal-400 outline-none transition-colors resize-y"
              />
            ) : f.type === "select" ? (
              <select
                value={values[f.name] ?? f.default ?? ""}
                onChange={(e) => set(f.name, e.target.value)}
                className="w-full bg-ink-900 border border-ink-600 rounded-xl px-3 py-2.5 text-sm focus:border-teal-400 outline-none transition-colors"
              >
                {f.options.map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type={f.type === "url" ? "url" : "text"}
                value={values[f.name] ?? ""}
                onChange={(e) => set(f.name, e.target.value)}
                className="w-full bg-ink-900 border border-ink-600 rounded-xl px-3 py-2.5 text-sm focus:border-teal-400 outline-none transition-colors"
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
