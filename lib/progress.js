// Tiny localStorage helper so learners can see which algorithms they've
// already grown 🌱. Everything is best-effort - if localStorage isn't
// available (SSR, privacy mode, etc.) we just quietly no-op.
const KEY = "algogarden.completed";

export function getCompleted() {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function isCompleted(slug) {
  return getCompleted().includes(slug);
}

export function markCompleted(slug) {
  if (typeof window === "undefined") return;
  try {
    const done = getCompleted();
    if (!done.includes(slug)) {
      window.localStorage.setItem(KEY, JSON.stringify([...done, slug]));
    }
  } catch {
    // ignore
  }
}
