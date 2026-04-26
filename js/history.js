// ─── history.js — History log management ────────────────────────────────────

const History = (() => {
  const MAX_ENTRIES = 50;
  const STORAGE_KEY = "calc-history";

  let entries = [];
  let onChangeCallback = null;

  // ── Persistence ────────────────────────────────────────────────────────────
  function load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) entries = JSON.parse(raw);
    } catch (_) {
      entries = [];
    }
  }

  function save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
    } catch (_) { /* storage full — ignore */ }
  }

  // ── Notify listeners ───────────────────────────────────────────────────────
  function notify() {
    if (typeof onChangeCallback === "function") {
      onChangeCallback([...entries]);
    }
  }

  // ── Public API ─────────────────────────────────────────────────────────────
  return {
    init() {
      load();
    },

    onChange(fn) {
      onChangeCallback = fn;
    },

    add(expression, result) {
      const entry = {
        id: Date.now(),
        expression,
        result,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      entries.unshift(entry); // newest first
      if (entries.length > MAX_ENTRIES) entries.pop();
      save();
      notify();
      return entry;
    },

    clear() {
      entries = [];
      save();
      notify();
    },

    getAll() {
      return [...entries];
    },

    count() {
      return entries.length;
    },
  };
})();
