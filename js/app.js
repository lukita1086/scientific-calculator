// ─── app.js — UI orchestration, theme, keyboard, settings ───────────────────

document.addEventListener("DOMContentLoaded", () => {

  History.init();

  // ── DOM refs ───────────────────────────────────────────────────────────────
  const expressionEl  = document.getElementById("expression");
  const resultEl      = document.getElementById("result");
  const historyList   = document.getElementById("history-list");
  const historyPanel  = document.getElementById("history-panel");
  const historyToggle = document.getElementById("history-toggle");
  const clearHistBtn  = document.getElementById("clear-history");
  const copyBtn       = document.getElementById("copy-btn");
  const themeBtn      = document.getElementById("theme-btn");
  const langBtn       = document.getElementById("lang-btn");
  const angleModeBtn  = document.getElementById("angle-mode-btn");
  const settingsBtn   = document.getElementById("settings-btn");
  const settingsPanel = document.getElementById("settings-panel");
  const settingsOverlay = document.getElementById("settings-overlay");
  const decimalSelect = document.getElementById("decimal-select");
  const sizeBtns      = document.querySelectorAll(".size-btn");
  const allButtons    = document.querySelectorAll(".btn-grid [data-action]");
  const scrollHint     = document.getElementById("scroll-hint");
  const mathDrawer     = document.getElementById("math-drawer");
  const drawerBackdrop = document.getElementById("drawer-backdrop");
  const drawerClose    = document.getElementById("drawer-close");

  // ── Math drawer ───────────────────────────────────────────────────────────
  function openDrawer() {
    mathDrawer.classList.add("open");
    drawerBackdrop.classList.add("open");
    mathDrawer.setAttribute("aria-hidden", "false");
  }
  function closeDrawer() {
    mathDrawer.classList.remove("open");
    drawerBackdrop.classList.remove("open");
    mathDrawer.setAttribute("aria-hidden", "true");
  }
  if (scrollHint)     scrollHint.addEventListener("click", openDrawer);
  if (drawerClose)    drawerClose.addEventListener("click", closeDrawer);
  if (drawerBackdrop) drawerBackdrop.addEventListener("click", closeDrawer);

  // ── Test modal refs ────────────────────────────────────────────────────────
  const verifiedBadge  = document.getElementById("verified-badge");
  const modalBackdrop  = document.getElementById("modal-backdrop");
  const testModal      = document.getElementById("test-modal");
  const modalClose     = document.getElementById("modal-close");
  const testSummary    = document.getElementById("test-summary");
  const testBody       = document.getElementById("test-body");

  // ── Settings — decimal rounding ────────────────────────────────────────────
  let decimalPlaces = localStorage.getItem("calc-decimals") ?? "auto";
  decimalSelect.value = decimalPlaces;

  function applyRounding(value) {
    if (decimalPlaces === "auto") return Calculator.formatResult(value);
    const dp = parseInt(decimalPlaces, 10);
    // Round to dp decimal places, then strip trailing zeros if dp > 0
    const rounded = parseFloat(value.toFixed(dp));
    return dp === 0 ? rounded.toFixed(0) : rounded.toFixed(dp).replace(/\.?0+$/, "");
  }

  decimalSelect.addEventListener("change", () => {
    decimalPlaces = decimalSelect.value;
    localStorage.setItem("calc-decimals", decimalPlaces);
    updateDisplay(); // re-render current result with new rounding
  });

  // ── Settings — font size ───────────────────────────────────────────────────
  let fontSize = localStorage.getItem("calc-font-size") || "normal";
  applyFontSize(fontSize);

  function applyFontSize(size) {
    document.documentElement.setAttribute("data-font-size", size);
    sizeBtns.forEach(btn => {
      btn.classList.toggle("active", btn.dataset.size === size);
    });
  }

  sizeBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      fontSize = btn.dataset.size;
      localStorage.setItem("calc-font-size", fontSize);
      applyFontSize(fontSize);
    });
  });

  // ── Settings panel toggle ──────────────────────────────────────────────────
  function openSettings() {
    settingsPanel.classList.add("open");
    settingsOverlay.classList.add("active");
    settingsBtn.setAttribute("aria-expanded", "true");
    settingsPanel.setAttribute("aria-hidden", "false");
  }

  function closeSettings() {
    settingsPanel.classList.remove("open");
    settingsOverlay.classList.remove("active");
    settingsBtn.setAttribute("aria-expanded", "false");
    settingsPanel.setAttribute("aria-hidden", "true");
  }

  settingsBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    settingsPanel.classList.contains("open") ? closeSettings() : openSettings();
  });

  settingsOverlay.addEventListener("click", closeSettings);

  // Close on Escape
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && settingsPanel.classList.contains("open")) {
      closeSettings();
    }
    if (e.key === "Escape" && mathDrawer && mathDrawer.classList.contains("open")) {
      closeDrawer();
    }
  });

  // ── Test modal ────────────────────────────────────────────────────────────

  function openTestModal() {
    modalBackdrop.classList.add("open");
    testModal.classList.add("open");
    testModal.setAttribute("aria-hidden", "false");
    modalBackdrop.setAttribute("aria-hidden", "false");
    // Run tests asynchronously so the modal animates in first
    requestAnimationFrame(() => setTimeout(runAndRenderTests, 80));
  }

  function closeTestModal() {
    modalBackdrop.classList.remove("open");
    testModal.classList.remove("open");
    testModal.setAttribute("aria-hidden", "true");
    modalBackdrop.setAttribute("aria-hidden", "true");
  }

  verifiedBadge.addEventListener("click", openTestModal);
  modalClose.addEventListener("click", closeTestModal);
  modalBackdrop.addEventListener("click", closeTestModal);

  function formatExpected(expected) {
    if (expected && typeof expected === "object" && expected.error) {
      return "error: " + expected.error;
    }
    if (typeof expected === "number") {
      if (Math.abs(expected) > 1e10 || (expected !== 0 && Math.abs(expected) < 1e-4)) {
        return parseFloat(expected.toPrecision(8)).toString();
      }
      return parseFloat(expected.toPrecision(10)).toString();
    }
    return String(expected);
  }

  function formatGot(got) {
    if (got && typeof got === "object" && got.error) return "error: " + got.error;
    if (typeof got === "number") {
      if (Math.abs(got) > 1e10 || (got !== 0 && Math.abs(got) < 1e-4)) {
        return parseFloat(got.toPrecision(8)).toString();
      }
      return parseFloat(got.toPrecision(10)).toString();
    }
    return String(got);
  }

  function runAndRenderTests() {
    const results = TestRunner.run();

    // ── Summary ──
    const pct = Math.round((results.totalPassed / results.totalTests) * 100);
    const allOk = results.allPassed;
    testSummary.innerHTML = `
      <div class="summary-counts">
        <span class="summary-total ${allOk ? "" : "has-failures"}">
          ${results.totalPassed}/${results.totalTests}
        </span>
        <span class="summary-label">${allOk
          ? (i18n.getLang() === "es" ? "pruebas pasadas ✓" : "tests passed ✓")
          : (i18n.getLang() === "es" ? "pruebas pasadas" : "tests passed")
        }</span>
      </div>
      <div class="summary-bar">
        <div class="summary-bar-fill ${allOk ? "" : "has-failures"}"
             style="width:${pct}%"></div>
      </div>
    `;

    // ── Group rows ──
    testBody.innerHTML = results.groups.map((group, gi) => {
      const allPass = group.passed === group.total;
      const cases = group.tests.map(t => {
        const statusIcon = t.pass ? "✓" : "✗";
        const resultText = t.pass
          ? formatGot(t.got)
          : `got ${formatGot(t.got)} · exp ${formatExpected(t.expected)}`;
        return `
          <div class="test-case">
            <span class="test-case-status ${t.pass ? "pass" : "fail"}">${statusIcon}</span>
            <div class="test-case-info">
              <div class="test-case-label">${t.label}</div>
              <div class="test-case-expr">${t.expr}${t.mode === "rad" ? " · RAD" : ""}</div>
            </div>
            <span class="test-case-result ${t.pass ? "pass" : "fail"}">${resultText}</span>
          </div>
        `;
      }).join("");

      return `
        <div class="test-group" id="tg-${gi}">
          <div class="test-group-header" onclick="toggleGroup(${gi})">
            <div class="test-group-left">
              <span class="test-group-icon">${group.icon}</span>
              <span class="test-group-name">${group.name}</span>
            </div>
            <div class="test-group-right">
              <span class="test-group-score">${group.passed}/${group.total}</span>
              <span class="test-group-pill ${allPass ? "pass" : "fail"}">${allPass ? "PASS" : "FAIL"}</span>
              <span class="test-group-chevron">▶</span>
            </div>
          </div>
          <div class="test-cases">${cases}</div>
        </div>
      `;
    }).join("");

    // Update badge color to reflect real pass/fail state
    if (verifiedBadge) {
      verifiedBadge.classList.toggle("badge-fail", !results.allPassed);
    }

    // Auto-expand any failing group
    results.groups.forEach((group, gi) => {
      if (group.passed < group.total) toggleGroup(gi);
    });
  }

  // Exposed globally so inline onclick can call it
  window.toggleGroup = function(gi) {
    const el = document.getElementById("tg-" + gi);
    if (el) el.classList.toggle("expanded");
  };

  // ── Theme ──────────────────────────────────────────────────────────────────
  const savedTheme = localStorage.getItem("calc-theme") || "dark";
  document.documentElement.setAttribute("data-theme", savedTheme);
  updateThemeBtn(savedTheme);

  function updateThemeBtn(theme) {
    themeBtn.textContent = theme === "dark"
      ? i18n.t("themeToggle")
      : i18n.t("themeToggleDark");
  }

  themeBtn.addEventListener("click", () => {
    const current = document.documentElement.getAttribute("data-theme");
    const next = current === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("calc-theme", next);
    updateThemeBtn(next);
  });

  // ── Language ───────────────────────────────────────────────────────────────
  langBtn.textContent = i18n.t("langToggle");

  langBtn.addEventListener("click", () => {
    const lang = i18n.toggleLang();
    // Keep <html lang=""> in sync for screen readers and SEO crawlers
    document.documentElement.setAttribute("lang", lang);
    // Update canonical so Google sees the right URL for this language
    i18n.updateCanonical(lang);
    // Update the browser URL bar without reloading the page
    // EN → clean URL (no param), ES → ?lang=es
    const newUrl = i18n.langUrl(lang);
    window.history.replaceState({}, "", newUrl);
    applyTranslations();
    renderHistory();
  });

  function applyTranslations() {
    document.title = i18n.t("title");
    document.querySelector(".app-title").textContent = i18n.t("title");
    langBtn.textContent = i18n.t("langToggle");
    updateThemeBtn(document.documentElement.getAttribute("data-theme"));
    updateAngleModeBtn();
    document.getElementById("history-heading").textContent = i18n.t("historyTitle");
    clearHistBtn.textContent = i18n.t("historyClear");
    // Settings labels
    document.getElementById("font-size-label").textContent =
      i18n.getLang() === "es" ? "Tamaño de fuente" : "Font Size";
    document.getElementById("decimal-label").textContent =
      i18n.getLang() === "es" ? "Decimales" : "Decimal Places";
    updateCopyBtn(false);
    renderHistory();
    applyContentTranslations();
  }

  function applyContentTranslations() {
    const lang = i18n.getLang();
    const c = i18n.t.bind(i18n);
    // Scroll hint
    const scrollHintText = document.getElementById("scroll-hint-text");
    if (scrollHintText) scrollHintText.textContent = i18n.t("content.scrollHint");
    const drawerTitleEl = document.getElementById("drawer-title");
    if (drawerTitleEl) drawerTitleEl.textContent = i18n.getLang() === "es" ? "Guía Matemática" : "Math Guide";
    // All data-i18n elements in math content
    document.querySelectorAll("[data-i18n]").forEach(el => {
      const key = "content." + el.dataset.i18n.replace(/^content\./, "");
      const text = i18n.t(key);
      if (text && text !== key) el.textContent = text;
    });
    // Table headers (special — they use data-i18n directly)
    const tableAngle = document.querySelector("[data-i18n='tableAngle']");
    const tableRad   = document.querySelector("[data-i18n='tableRad']");
    if (tableAngle) tableAngle.textContent = i18n.t("content.tableAngle");
    if (tableRad)   tableRad.textContent   = i18n.t("content.tableRad");
  }

  // ── Angle mode ─────────────────────────────────────────────────────────────
  function updateAngleModeBtn() {
    const mode = Calculator.getAngleMode();
    angleModeBtn.textContent = mode === "deg" ? i18n.t("degMode") : i18n.t("radMode");
    angleModeBtn.setAttribute("data-active", mode === "rad" ? "true" : "false");
  }

  angleModeBtn.addEventListener("click", () => {
    Calculator.toggleAngleMode();
    updateAngleModeBtn();
  });

  updateAngleModeBtn();

  // ── Display ────────────────────────────────────────────────────────────────
  function updateDisplay() {
    const expr = Calculator.getExpression();
    const res  = Calculator.getResult();

    expressionEl.textContent = expr || "";
    // Apply decimal rounding to displayed result
    resultEl.textContent = res !== null ? applyRounding(res) : "";

    const len = (expr || "").length;
    expressionEl.style.fontSize = len > 24 ? "clamp(0.65rem, 1.2vw, 0.82rem)"
      : len > 16 ? "clamp(0.72rem, 1.4vw, 0.9rem)"
      : "";

    expressionEl.scrollLeft = expressionEl.scrollWidth;
  }

  function showError(errorKey) {
    resultEl.textContent = i18n.t(errorKey);
    resultEl.classList.add("error");
    expressionEl.classList.add("error");
    setTimeout(() => {
      resultEl.classList.remove("error");
      expressionEl.classList.remove("error");
    }, 1200);
  }

  // ── Copy button ────────────────────────────────────────────────────────────
  function updateCopyBtn(copied) {
    copyBtn.textContent = copied ? i18n.t("copiedBtn") : i18n.t("copyBtn");
    copyBtn.classList.toggle("copied", copied);
  }

  copyBtn.addEventListener("click", () => {
    const res  = Calculator.getResult();
    const expr = Calculator.getExpression();
    // Copy the rounded value if rounding is active, raw expression otherwise
    const text = res !== null ? applyRounding(res) : expr;
    if (!text) return;
    navigator.clipboard.writeText(text).then(() => {
      updateCopyBtn(true);
      setTimeout(() => updateCopyBtn(false), 1800);
    });
  });

  // ── History ────────────────────────────────────────────────────────────────
  function renderHistory() {
    const entries = History.getAll();
    if (entries.length === 0) {
      historyList.innerHTML = `<li class="history-empty">${i18n.t("historyEmpty")}</li>`;
      return;
    }
    historyList.innerHTML = entries.map(e => `
      <li class="history-entry" data-result="${e.result}">
        <span class="history-expr">${e.expression}</span>
        <span class="history-result">${e.result}</span>
        <span class="history-time">${e.timestamp}</span>
      </li>
    `).join("");

    historyList.querySelectorAll(".history-entry").forEach(li => {
      li.addEventListener("click", () => {
        const res = li.dataset.result;
        Calculator.clear();
        res.split("").forEach(c => Calculator.append(c));
        updateDisplay();
        if (window.innerWidth < 900) {
          historyPanel.classList.remove("open");
          historyToggle.setAttribute("aria-expanded", "false");
        }
      });
    });
  }

  History.onChange(() => renderHistory());
  renderHistory();

  clearHistBtn.addEventListener("click", () => History.clear());

  historyToggle.addEventListener("click", () => {
    const isOpen = historyPanel.classList.toggle("open");
    historyToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
  });

  // ── Button actions ─────────────────────────────────────────────────────────
  function handleAction(action, value) {
    switch (action) {
      case "digit":
      case "operator":
      case "func":
      case "constant":
        Calculator.append(value);
        break;
      case "paren-open":  Calculator.append("("); break;
      case "paren-close": Calculator.append(")"); break;
      case "dot":         Calculator.append("."); break;
      case "backspace":   Calculator.backspace(); break;
      case "clear":       Calculator.clear(); break;
      case "clear-entry": Calculator.clearEntry(); break;
      case "sign":        Calculator.toggleSign(); break;
      case "percent":     Calculator.percent(); break;
      case "ans":         Calculator.insertAns(); break;
      case "square": {
        const expr = Calculator.getExpression();
        if (expr) {
          const wrapped = `(${expr})^2`;
          Calculator.clear();
          wrapped.split("").forEach(c => Calculator.append(c));
        }
        break;
      }
      case "equals": {
        const res = Calculator.compute();
        if (res === null) return;
        if (!res.ok) {
          const errorMap = {
            divzero:  "errorDivZero",
            invalid:  "errorInvalid",
            domain:   "errorDomain",
            overflow: "errorOverflow",
          };
          showError(errorMap[res.error] || "errorInvalid");
          return;
        }
        if (res.fixedExpr) {
          expressionEl.textContent = res.fixedExpr;
        }
        History.add(res.entry.expression, res.entry.result);
        break;
      }
    }
    updateDisplay();
  }

  allButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      handleAction(btn.dataset.action, btn.dataset.value ?? "");
    });
  });

  // ── Keyboard ───────────────────────────────────────────────────────────────
  document.addEventListener("keydown", (e) => {
    // Don't intercept if settings select is focused
    if (e.target === decimalSelect) return;
    if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;

    const key = e.key;
    if (/^[0-9]$/.test(key))                       handleAction("digit", key);
    else if (key === ".")                           handleAction("dot");
    else if (["+","-","*","/","^"].includes(key))  handleAction("operator", key);
    else if (key === "(")                           handleAction("paren-open");
    else if (key === ")")                           handleAction("paren-close");
    else if (key === "%")                           handleAction("percent");
    else if (key === "Enter" || key === "=")       { e.preventDefault(); handleAction("equals"); }
    else if (key === "Backspace")                  handleAction("backspace");
    else if (key === "Escape" && !settingsPanel.classList.contains("open"))
                                                   handleAction("clear");
  });

  // ── Init ───────────────────────────────────────────────────────────────────
  // Sync lang attribute with detected/saved language
  const initLang = i18n.getLang();
  document.documentElement.setAttribute("lang", initLang);
  // Sync canonical URL to match current language
  i18n.updateCanonical(initLang);
  // If URL has ?lang= param, make sure the URL bar is clean for English
  if (initLang === "en") {
    const url = new URL(window.location.href);
    if (url.searchParams.has("lang")) {
      url.searchParams.delete("lang");
      window.history.replaceState({}, "", url.toString());
    }
  }
  applyTranslations();
  updateDisplay();
});