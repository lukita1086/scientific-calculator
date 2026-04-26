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
    content: {
      scrollHint: "Learn more",
      howToUseTitle: "How to Use This Calculator",
      howToUseP1: "This scientific calculator supports both basic arithmetic and advanced mathematical functions. Type directly using your keyboard or tap the buttons on screen. Press Enter or = to compute, and Escape to clear.",
      howToUseP2: "The calculator automatically closes unclosed parentheses when you press equals — so sin(45 will correctly compute as sin(45°). Use the ANS button to reuse the last result in a new calculation, and click any entry in the History panel to load it back.",
      howToUseP3: "Switch between DEG (degrees) and RAD (radians) using the mode button in the top-left of the display. The ⚙ settings panel lets you choose font size and how many decimal places to show.",
      trigTitle: "Trigonometry — sin, cos, tan",
      trigP1: "Trigonometric functions relate the angles of a triangle to the ratios of its sides. They are fundamental in physics, engineering, architecture, and many other fields. On this calculator you can use sin, cos, tan and their inverses asin, acos, atan.",
      trigP2: "By default the calculator works in degrees. Switch to radians for calculus and physics work — in radians a full circle is 2π ≈ 6.283. A quick reference of common angles:",
      tableAngle: "Angle (°)", tableRad: "Radians",
      logTitle: "Logarithms & Exponentials",
      logP1: "A logarithm answers: to what power must a base be raised to get a given number? log computes base-10, so log(100) = 2 because 10² = 100. ln computes the natural logarithm (base e ≈ 2.718), used in calculus, biology and finance.",
      logP2: "Logarithms and exponentials are inverse operations: 10^log(x) = x and e^ln(x) = x. Essential for solving equations where the unknown is an exponent — compound interest, population growth, radioactive decay, earthquake magnitude.",
      logP3: "Use xʸ to raise any number to a power, and √ for square roots. Fractional exponents also work: 27^(1/3) gives the cube root of 27 = 3.",
      tipsTitle: "Tips & Tricks",
      tip1Title: "Implicit Multiplication", tip1Body: "Omit the × sign before parentheses or constants. 2π, 3(4+1) and 2sin(30) all work as expected.",
      tip2Title: "Auto-close Parentheses",  tip2Body: "Forgot a closing parenthesis? Pressing = automatically closes any open ones. sin(45 → sin(45).",
      tip3Title: "Chain with ANS",           tip3Body: "Press ANS to insert the last result into a new expression. Great for multi-step calculations without retyping.",
      tip4Title: "Keyboard Shortcuts",       tip4Body: "Enter or = to calculate. Backspace to delete. Escape to clear. All digits and operators work from your keyboard.",
      tip5Title: "Decimal Precision",        tip5Body: "Open ⚙ Settings to fix decimal places shown — 0 to 15. Useful for money calculations needing 2 decimals.",
      tip6Title: "History",                  tip6Body: "Your last 50 calculations are saved automatically. Click any history entry to load that result back.",
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
    content: {
      scrollHint: "Saber más",
      howToUseTitle: "Cómo usar esta calculadora",
      howToUseP1: "Esta calculadora científica soporta aritmética básica y funciones matemáticas avanzadas. Escribí directamente con el teclado o tocá los botones en pantalla. Presioná Enter o = para calcular, y Escape para borrar.",
      howToUseP2: "La calculadora cierra automáticamente los paréntesis abiertos al presionar igual — así, sin(45 se calcula correctamente como sin(45°). Usá el botón ANS para reutilizar el último resultado, y hacé clic en cualquier entrada del historial para cargarla.",
      howToUseP3: "Cambiá entre GRAD (grados) y RAD (radianes) con el botón en la esquina superior izquierda de la pantalla. El panel ⚙ de configuración te permite elegir el tamaño de fuente y los decimales a mostrar.",
      trigTitle: "Trigonometría — sen, cos, tan",
      trigP1: "Las funciones trigonométricas relacionan los ángulos de un triángulo con las razones de sus lados. Son fundamentales en física, ingeniería, arquitectura y muchos otros campos. En esta calculadora podés usar sin, cos, tan y sus inversas asin, acos, atan.",
      trigP2: "Por defecto la calculadora trabaja en grados. Cambiá a radianes para cálculo y física — en radianes una vuelta completa es 2π ≈ 6.283. Referencia rápida de ángulos comunes:",
      tableAngle: "Ángulo (°)", tableRad: "Radianes",
      logTitle: "Logaritmos y Exponenciales",
      logP1: "Un logaritmo responde: ¿a qué potencia hay que elevar una base para obtener un número dado? log calcula el logaritmo en base 10, así log(100) = 2 porque 10² = 100. ln calcula el logaritmo natural (base e ≈ 2,718), usado en cálculo, biología y finanzas.",
      logP2: "Los logaritmos y exponenciales son operaciones inversas: 10^log(x) = x y e^ln(x) = x. Son esenciales para resolver ecuaciones donde la incógnita es un exponente — interés compuesto, crecimiento poblacional, decaimiento radiactivo, magnitud de terremotos.",
      logP3: "Usá xʸ para elevar cualquier número a una potencia, y √ para raíces cuadradas. Los exponentes fraccionarios también funcionan: 27^(1/3) da la raíz cúbica de 27 = 3.",
      tipsTitle: "Consejos y Trucos",
      tip1Title: "Multiplicación implícita",  tip1Body: "Podés omitir el signo × antes de paréntesis o constantes. 2π, 3(4+1) y 2sin(30) funcionan correctamente.",
      tip2Title: "Cierre automático",         tip2Body: "¿Olvidaste cerrar un paréntesis? Al presionar = se cierran automáticamente. sin(45 → sin(45).",
      tip3Title: "Encadenar con ANS",         tip3Body: "Presioná ANS para insertar el último resultado en una nueva expresión. Ideal para cálculos de varios pasos.",
      tip4Title: "Atajos de teclado",         tip4Body: "Enter o = para calcular. Retroceso para borrar. Escape para limpiar. Todos los dígitos y operadores funcionan desde el teclado.",
      tip5Title: "Precisión decimal",         tip5Body: "Abrí ⚙ Configuración para fijar los decimales mostrados — de 0 a 15. Útil para cálculos de dinero que requieren 2 decimales.",
      tip6Title: "Historial",                 tip6Body: "Tus últimos 50 cálculos se guardan automáticamente. Hacé clic en cualquier entrada para volver a cargarlo.",
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