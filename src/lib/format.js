export function inr(value, compact = false) {
  if (value === null || value === undefined || value === "") return "—";
  const num = Number(value);
  if (Number.isNaN(num)) return "—";

  if (compact) {
    if (num >= 10000000) return `₹${(num / 10000000).toFixed(2)} Cr`;
    if (num >= 100000) return `₹${(num / 100000).toFixed(2)} L`;
    if (num >= 1000) return `₹${(num / 1000).toFixed(1)}K`;
  }
  return `₹${num.toLocaleString("en-IN")}`;
}

export function formatDate(iso) {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return String(iso);
  return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

export function daysUntil(iso) {
  if (!iso) return 0;
  const today = Date.now();
  const target = new Date(iso).getTime();
  if (Number.isNaN(target)) return 0;
  return Math.round((target - today) / 86400000);
}

export function fileSize(kb) {
  if (!kb && kb !== 0) return "0 KB";
  const num = Number(kb);
  if (Number.isNaN(num)) return "0 KB";
  return num >= 1024 ? `${(num / 1024).toFixed(1)} MB` : `${num} KB`;
}

export function initials(name) {
  if (!name || typeof name !== "string") return "—";
  return name
    .trim()
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0].toUpperCase())
    .join("");
}
