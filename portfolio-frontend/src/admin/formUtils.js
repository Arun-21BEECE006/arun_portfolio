function getPath(obj, path) {
  return path.split(".").reduce((acc, key) => (acc == null ? acc : acc[key]), obj);
}

function setPath(obj, path, value) {
  const keys = path.split(".");
  const last = keys.pop();
  let cursor = obj;
  for (const key of keys) {
    if (typeof cursor[key] !== "object" || cursor[key] === null) cursor[key] = {};
    cursor = cursor[key];
  }
  cursor[last] = value;
}

// Turns a data item (nested) into a flat { fieldName: string } map the
// form's <input>/<textarea> elements can bind to directly.
export function toFormValues(fields, item = {}) {
  const values = {};
  fields.forEach((f) => {
    const raw = getPath(item, f.name);
    if (f.type === "gallery") {
      values[f.name] = Array.isArray(raw) ? raw : [];
    } else if (f.type === "boolean") {
      values[f.name] = raw ?? f.default ?? false;
    } else if (f.type === "list") {
      values[f.name] = Array.isArray(raw) ? raw.join(", ") : "";
    } else if (f.type === "lines") {
      values[f.name] = Array.isArray(raw) ? raw.join("\n") : "";
    } else if (f.type === "kvlines") {
      values[f.name] = Array.isArray(raw) ? raw.map((r) => `${r.label}: ${r.value}`).join("\n") : "";
    } else if (f.type === "pipelines") {
      values[f.name] = Array.isArray(raw) ? raw.map((r) => `${r.date} | ${r.milestone}`).join("\n") : "";
    } else {
      values[f.name] = raw ?? f.default ?? "";
    }
  });
  return values;
}

// Turns flat form values back into a nested data object ready to POST/PUT.
export function fromFormValues(fields, values) {
  const result = {};
  fields.forEach((f) => {
    const raw = values[f.name] ?? "";
    let parsed;
    if (f.type === "gallery") {
      parsed = Array.isArray(raw) ? raw : [];
    } else if (f.type === "boolean") {
      parsed = !!raw;
    } else if (f.type === "list") {
      parsed = raw
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
    } else if (f.type === "lines") {
      parsed = raw
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean);
    } else if (f.type === "kvlines") {
      parsed = raw
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean)
        .map((line) => {
          const [label, ...rest] = line.split(":");
          return { label: (label || "").trim(), value: rest.join(":").trim() };
        });
    } else if (f.type === "pipelines") {
      parsed = raw
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean)
        .map((line) => {
          const [date, ...rest] = line.split("|");
          return { date: (date || "").trim(), milestone: rest.join("|").trim() };
        });
    } else {
      parsed = raw;
    }
    setPath(result, f.name, parsed);
  });
  return result;
}
