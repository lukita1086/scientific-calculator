// ─── i18n.js — Language detection & translations ───────────────────────────

const TRANSLATIONS = {
  en: {
    title: "Scientific Calculator",
    themeToggle: "Light Mode",
    themeToggleDark: "Dark Mode",
    langToggle: "ES",
    degMode: "DEG",
    radMode: "RAD",
    historyTitle: "History",
    historyClear: "Clear",
    historyEmpty: "No calculations yet.",
    copyBtn: "Copy",
    copiedBtn: "Copied!",
    errorDivZero: "Division by zero",
    errorInvalid: "Invalid expression",
    errorDomain: "Math domain error",
    errorOverflow: "Overflow",
    angleMode: "Angle",
    operators: {
      sin: "sin",
      cos: "cos",
      tan: "tan",
      log: "log",
      ln: "ln",
      sqrt: "√",
      square: "x²",
      power: "xʸ",
      inv: "1/x",
      fact: "n!",
      abs: "|x|",
      pi: "π",
      e: "e",
      ans: "ANS",
    },
    buttons: {
      clear: "C",
      clearEntry: "CE",
      sign: "±",
      percent: "%",
      backspace: "⌫",
      equals: "=",
      openParen: "(",
      closeParen: ")",
      dot: ".",
    },
  },
  es: {
    title: "Calculadora Científica",
    themeToggle: "Modo Claro",
    themeToggleDark: "Modo Oscuro",
    langToggle: "EN",
    degMode: "GRAD",
    radMode: "RAD",
    historyTitle: "Historial",
    historyClear: "Borrar",
    historyEmpty: "Sin cálculos aún.",
    copyBtn: "Copiar",
    copiedBtn: "¡Copiado!",
    errorDivZero: "División por cero",
    errorInvalid: "Expresión inválida",
    errorDomain: "Error de dominio",
    errorOverflow: "Desbordamiento",
    angleMode: "Ángulo",
    operators: {
      sin: "sin",
      cos: "cos",
      tan: "tan",
      log: "log",
      ln: "ln",
      sqrt: "√",
      square: "x²",
      power: "xʸ",
      inv: "1/x",
      fact: "n!",
      abs: "|x|",
      pi: "π",
      e: "e",
      ans: "ANS",
    },
    buttons: {
      clear: "C",
      clearEntry: "CE",
      sign: "±",
      percent: "%",
      backspace: "⌫",
      equals: "=",
      openParen: "(",
      closeParen: ")",
      dot: ".",
    },
  },
};

// ─── Language detection ──────────────────────────────────────────────────────

function detectLanguage() {
  // 1. URL param — highest priority (?lang=es makes hreflang work correctly)
  //    Also handles ?lang=es-AR → strips to "es"
  const urlParam = new URLSearchParams(window.location.search)
    .get("lang")?.toLowerCase().split("-")[0];
  if (urlParam && TRANSLATIONS[urlParam]) {
    // Persist so refreshing without the param keeps the language
    localStorage.setItem("calc-lang", urlParam);
    return urlParam;
  }

  // 2. localStorage — returning visitor preference
  const stored = localStorage.getItem("calc-lang");
  if (stored && TRANSLATIONS[stored]) return stored;

  // 3. Browser language — first-time visitor fallback
  const browserLang = (navigator.language || navigator.userLanguage || "en")
    .toLowerCase()
    .split("-")[0];

  return TRANSLATIONS[browserLang] ? browserLang : "en";
}

// ─── URL helpers ─────────────────────────────────────────────────────────────

// Build a clean URL for a given language (used for canonical + hreflang)
function langUrl(lang, base) {
  const url = new URL(base || window.location.href);
  if (lang === "en") {
    url.searchParams.delete("lang"); // English is the default — no param needed
  } else {
    url.searchParams.set("lang", lang);
  }
  return url.toString();
}

// Update the <link rel="canonical"> tag dynamically so Google sees
// the right canonical per language on each page load
function updateCanonical(lang) {
  const canonical = document.querySelector('link[rel="canonical"]');
  if (canonical) {
    canonical.href = langUrl(lang);
  }
}

// ─── i18n API ────────────────────────────────────────────────────────────────

const i18n = (() => {
  let currentLang = detectLanguage();

  function t(key) {
    const keys = key.split(".");
    let result = TRANSLATIONS[currentLang];
    for (const k of keys) {
      result = result?.[k];
    }
    return result ?? key;
  }

  function getLang() {
    return currentLang;
  }

  function setLang(lang) {
    if (!TRANSLATIONS[lang]) return;
    currentLang = lang;
    localStorage.setItem("calc-lang", lang);
  }

  function toggleLang() {
    const next = currentLang === "en" ? "es" : "en";
    setLang(next);
    return next;
  }

  function getAvailableLangs() {
    return Object.keys(TRANSLATIONS);
  }

  return { t, getLang, setLang, toggleLang, getAvailableLangs, langUrl, updateCanonical };
})();