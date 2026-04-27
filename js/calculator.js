// ─── calculator.js — Math engine & expression evaluator ─────────────────────

const Calculator = (() => {
  // ── State ──────────────────────────────────────────────────────────────────
  let expression = "";
  let result = null;
  let angleMode = "deg"; // "deg" | "rad"
  let lastAns = 0;
  let hasError = false;

  // ── Angle conversion ───────────────────────────────────────────────────────
  function toRad(x) {
    return angleMode === "deg" ? (x * Math.PI) / 180 : x;
  }

  // ── Factorial ──────────────────────────────────────────────────────────────
  function factorial(n) {
    n = Math.round(n);
    if (n < 0) throw new Error("domain");
    if (n > 170) throw new Error("overflow");
    if (n === 0 || n === 1) return 1;
    let r = 1;
    for (let i = 2; i <= n; i++) r *= i;
    return r;
  }

  // ── Tokenizer ──────────────────────────────────────────────────────────────
  // Converts raw expression string into tokens
  function tokenize(expr) {
    const tokens = [];
    let i = 0;
    while (i < expr.length) {
      const ch = expr[i];

      // Skip whitespace
      if (/\s/.test(ch)) { i++; continue; }

      // Numbers (including decimals and scientific notation)
      if (/[0-9.]/.test(ch)) {
        let num = "";
        while (i < expr.length && /[0-9.]/.test(expr[i])) {
          num += expr[i++];
        }
        tokens.push({ type: "number", value: parseFloat(num) });
        continue;
      }

      // Named tokens (functions, constants)
      const named = [
        "asin", "acos", "atan",
        "sin", "cos", "tan",
        "log10", "log2", "log", "ln",
        "sqrt", "abs",
        "pi", "ans", "e",
      ];
      let matched = false;
      for (const name of named) {
        if (expr.slice(i).startsWith(name)) {
          tokens.push({ type: "name", value: name });
          i += name.length;
          matched = true;
          break;
        }
      }
      if (matched) continue;

      // Operators & punctuation
      const ops = ["**", "+", "-", "*", "/", "^", "%", "!", "(", ")"];
      let opMatched = false;
      for (const op of ops) {
        if (expr.slice(i).startsWith(op)) {
          tokens.push({ type: "op", value: op });
          i += op.length;
          opMatched = true;
          break;
        }
      }
      if (opMatched) continue;

      throw new Error("invalid");
    }
    return tokens;
  }

  // ── Parser (Pratt / recursive descent) ────────────────────────────────────
  function parse(tokens) {
    let pos = 0;

    function peek() { return tokens[pos]; }
    function consume() { return tokens[pos++]; }
    function expect(type, value) {
      const t = consume();
      if (!t || (type && t.type !== type) || (value && t.value !== value))
        throw new Error("invalid");
      return t;
    }

    // Precedence levels
    function parseExpr(minPrec = 0) {
      let left = parseUnary();

      while (true) {
        const t = peek();
        if (!t || t.type !== "op") break;
        const prec = getPrec(t.value);
        if (prec < minPrec) break;
        const op = consume().value;
        const right = parseExpr(prec + (isRightAssoc(op) ? 0 : 1));
        left = applyBinOp(op, left, right);
      }
      return left;
    }

    function getPrec(op) {
      const table = { "+": 1, "-": 1, "*": 2, "/": 2, "%": 2, "^": 3, "**": 3 };
      return table[op] ?? -1;
    }

    function isRightAssoc(op) {
      return op === "^" || op === "**";
    }

    function applyBinOp(op, a, b) {
      switch (op) {
        case "+": return a + b;
        case "-": return a - b;
        case "*": return a * b;
        case "/":
          if (b === 0) throw new Error("divzero");
          return a / b;
        case "%": return a % b;
        case "^":
        case "**": return Math.pow(a, b);
        default: throw new Error("invalid");
      }
    }

    function parseUnary() {
      const t = peek();
      if (t && t.type === "op" && t.value === "-") {
        consume();
        return -parseUnary();
      }
      if (t && t.type === "op" && t.value === "+") {
        consume();
        return parseUnary();
      }
      return parsePostfix();
    }

    function parsePostfix() {
      let val = parsePrimary();
      while (peek()?.value === "!") {
        consume();
        val = factorial(val);
      }
      return val;
    }

    function parsePrimary() {
      const t = peek();
      if (!t) throw new Error("invalid");

      // Number literal
      if (t.type === "number") {
        consume();
        // Implicit multiplication: 2π, 2(3+1), etc.
        if (peek()?.type === "name" || peek()?.value === "(") {
          return t.value * parsePrimary();
        }
        return t.value;
      }

      // Parenthesised expression
      if (t.type === "op" && t.value === "(") {
        consume();
        const val = parseExpr();
        expect("op", ")");
        // Implicit multiplication after closing paren: (2+3)(4)
        if (peek()?.value === "(") {
          return val * parsePrimary();
        }
        return val;
      }

      // Named tokens (functions / constants)
      if (t.type === "name") {
        consume();
        switch (t.value) {
          case "pi": {
            const v = Math.PI;
            return peek()?.value === "(" ? v * parsePrimary() : v;
          }
          case "e": {
            const v = Math.E;
            return peek()?.value === "(" ? v * parsePrimary() : v;
          }
          case "ans": return lastAns;

          // Trig
          case "sin": return Math.sin(toRad(parseFunctionArg()));
          case "cos": return Math.cos(toRad(parseFunctionArg()));
          case "tan": {
            const arg = toRad(parseFunctionArg());
            const r = Math.tan(arg);
            if (!isFinite(r)) throw new Error("domain");
            return r;
          }
          case "asin": {
            const a = parseFunctionArg();
            if (a < -1 || a > 1) throw new Error("domain");
            const r = Math.asin(a);
            return angleMode === "deg" ? (r * 180) / Math.PI : r;
          }
          case "acos": {
            const a = parseFunctionArg();
            if (a < -1 || a > 1) throw new Error("domain");
            const r = Math.acos(a);
            return angleMode === "deg" ? (r * 180) / Math.PI : r;
          }
          case "atan": {
            const r = Math.atan(parseFunctionArg());
            return angleMode === "deg" ? (r * 180) / Math.PI : r;
          }

          // Logs
          case "log":
          case "log10": {
            const a = parseFunctionArg();
            if (a <= 0) throw new Error("domain");
            return Math.log10(a);
          }
          case "log2": {
            const a = parseFunctionArg();
            if (a <= 0) throw new Error("domain");
            return Math.log2(a);
          }
          case "ln": {
            const a = parseFunctionArg();
            if (a <= 0) throw new Error("domain");
            return Math.log(a);
          }

          // Other
          case "sqrt": {
            const a = parseFunctionArg();
            if (a < 0) throw new Error("domain");
            return Math.sqrt(a);
          }
          case "abs": return Math.abs(parseFunctionArg());

          default: throw new Error("invalid");
        }
      }

      throw new Error("invalid");
    }

    function parseFunctionArg() {
      expect("op", "(");
      const val = parseExpr();
      expect("op", ")");
      return val;
    }

    const value = parseExpr();
    if (pos < tokens.length) throw new Error("invalid");
    return value;
  }

  // ── Auto-fix expression ────────────────────────────────────────────────────
  function autoFix(expr) {
    let fixed = expr.trim();
    // Strip trailing binary operator (e.g. "3+" → "3")
    fixed = fixed.replace(/[+\-*/^%]+$/, "");
    // Count unmatched open parens and auto-close them
    let depth = 0;
    for (const ch of fixed) {
      if (ch === "(") depth++;
      else if (ch === ")") depth = Math.max(0, depth - 1);
    }
    fixed += ")".repeat(depth);
    return fixed;
  }

  // ── Evaluate ───────────────────────────────────────────────────────────────
  function evaluate(expr) {
    try {
      const fixed = autoFix(expr);
      const tokens = tokenize(fixed);
      if (tokens.length === 0) throw new Error("invalid");
      const value = parse(tokens);
      if (!isFinite(value) && !isNaN(value)) throw new Error("overflow");
      if (isNaN(value)) throw new Error("invalid");
      // Return the fixed expression so the display can reflect what was computed
      return { ok: true, value, fixedExpr: fixed !== expr.trim() ? fixed : null };
    } catch (err) {
      return { ok: false, error: err.message };
    }
  }

  // ── Format number for display ──────────────────────────────────────────────
  function formatResult(value) {
    if (Number.isInteger(value) && Math.abs(value) < 1e15) {
      return value.toString();
    }
    // Use toPrecision to avoid float noise, then strip trailing zeros
    const str = parseFloat(value.toPrecision(12)).toString();
    return str;
  }

  // ── Public API ─────────────────────────────────────────────────────────────
  return {
    getExpression: () => expression,
    getResult: () => result,
    getAngleMode: () => angleMode,
    hasError: () => hasError,

    setAngleMode(mode) {
      angleMode = mode;
    },

    toggleAngleMode() {
      angleMode = angleMode === "deg" ? "rad" : "deg";
      return angleMode;
    },

    // Append a character/string to the expression
    append(char) {
      if (hasError) {
        expression = "";
        result = null;
        hasError = false;
      }
      // If we just computed a result and user types a digit, start fresh
      if (result !== null && /^[0-9.]$/.test(char)) {
        expression = char;
        result = null;
        return;
      }
      // If we just computed a result and user types an operator, use result as base
      if (result !== null && /^[+\-*/^%]$/.test(char)) {
        expression = formatResult(result) + char;
        result = null;
        return;
      }
      expression += char;
      result = null;
    },

    // Delete last character
    backspace() {
      if (hasError) {
        this.clear();
        return;
      }
      // Remove last function token if applicable
      const funcMatch = expression.match(/(asin|acos|atan|sin|cos|tan|log10|log2|log|sqrt|abs|ln)\($$/);
      if (funcMatch) {
        expression = expression.slice(0, -funcMatch[0].length);
      } else {
        expression = expression.slice(0, -1);
      }
      result = null;
    },

    // Clear everything
    clear() {
      expression = "";
      result = null;
      hasError = false;
    },

    // Clear entry (current result only, keep expression)
    clearEntry() {
      if (hasError) { this.clear(); return; }
      expression = "";
      result = null;
    },

    // Toggle sign of last number in expression
    toggleSign() {
      if (hasError) return;
      if (result !== null) {
        lastAns = result;
        expression = formatResult(-result);
        result = null;
        return;
      }
      // Prepend minus or remove it
      if (expression.startsWith("-")) {
        expression = expression.slice(1);
      } else {
        expression = "-" + expression;
      }
    },

    // Compute result
    compute() {
      if (hasError || expression.trim() === "") return null;

      const evalResult = evaluate(expression);

      if (!evalResult.ok) {
        hasError = true;
        return { ok: false, error: evalResult.error, expression };
      }

      const formatted = formatResult(evalResult.value);
      lastAns = evalResult.value;
      result = evalResult.value;

      // If autoFix added closing parens, record the corrected expression
      const displayedExpr = evalResult.fixedExpr ?? expression;
      const entry = { expression: displayedExpr, result: formatted };
      expression = formatted;

      return { ok: true, value: evalResult.value, formatted, entry, fixedExpr: evalResult.fixedExpr };
    },

    // Use ANS token
    insertAns() {
      this.append("ans");
    },

    // Percentage: divide last number by 100
    percent() {
      if (hasError) return;
      const evalResult = evaluate(expression);
      if (evalResult.ok) {
        const pct = evalResult.value / 100;
        expression = formatResult(pct);
        result = null;
      }
    },

    formatResult,
    evaluate,
  };
})();