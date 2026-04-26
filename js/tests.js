// ─── tests.js — Calculator verification suite ────────────────────────────────
// Runs entirely in the browser against the live Calculator engine.
// No external dependencies. Called by TestRunner.run() from app.js.

const TestRunner = (() => {

  // ── Helpers ────────────────────────────────────────────────────────────────

  const EPSILON = 1e-9; // tolerance for floating-point comparisons

  function approxEqual(a, b) {
    if (!isFinite(a) || !isFinite(b)) return a === b;
    if (a === 0 && b === 0) return true;
    return Math.abs(a - b) <= EPSILON * (Math.abs(a) + Math.abs(b) + 1);
  }

  // Evaluate an expression with a given angle mode, return numeric result or error key
  function calc(expr, mode = "deg") {
    Calculator.setAngleMode(mode);
    const r = Calculator.evaluate(expr);
    if (!r.ok) return { error: r.error };
    return r.value;
  }

  // ── Test case builder ──────────────────────────────────────────────────────

  function makeTest(label, expr, expected, mode = "deg") {
    return { label, expr, expected, mode };
  }

  function makeErrorTest(label, expr, expectedError) {
    return { label, expr, expected: { error: expectedError }, mode: "deg" };
  }

  // ── Test groups ────────────────────────────────────────────────────────────

  const GROUPS = [
    {
      name: "Arithmetic",
      icon: "＋",
      tests: [
        makeTest("Addition",              "2+3",          5),
        makeTest("Subtraction",           "10-4",         6),
        makeTest("Multiplication",        "6*7",          42),
        makeTest("Division",             "15/4",          3.75),
        makeTest("Negative result",       "3-10",        -7),
        makeTest("Integer power",         "2^10",         1024),
        makeTest("Operator precedence",   "2+3*4",        14),
        makeTest("Parentheses",           "(2+3)*4",      20),
        makeTest("Nested parentheses",    "((2+3)*2)^2",  100),
        makeTest("Decimal arithmetic",    "0.1+0.2",      0.3),
        makeTest("Large numbers",         "999999*999999",999998000001),
        makeTest("Negative base power",   "(-2)^3",      -8),
      ],
    },
    {
      name: "Trigonometry (DEG)",
      icon: "∿",
      tests: [
        makeTest("sin(0°)",    "sin(0)",    0),
        makeTest("sin(30°)",   "sin(30)",   0.5),
        makeTest("sin(90°)",   "sin(90)",   1),
        makeTest("cos(0°)",    "cos(0)",    1),
        makeTest("cos(60°)",   "cos(60)",   0.5),
        makeTest("cos(90°)",   "cos(90)",   0),
        makeTest("tan(45°)",   "tan(45)",   1),
        makeTest("tan(0°)",    "tan(0)",    0),
        makeTest("asin(0.5)",  "asin(0.5)", 30),
        makeTest("acos(0.5)",  "acos(0.5)", 60),
        makeTest("atan(1)",    "atan(1)",   45),
        makeTest("sin²+cos²=1","sin(37)^2+cos(37)^2", 1),
      ],
    },
    {
      name: "Trigonometry (RAD)",
      icon: "∿",
      tests: [
        makeTest("sin(π/6)=0.5",  "sin(pi/6)",  0.5,   "rad"),
        makeTest("sin(π/2)=1",    "sin(pi/2)",  1,     "rad"),
        makeTest("cos(0)=1",      "cos(0)",     1,     "rad"),
        makeTest("cos(π)=-1",     "cos(pi)",   -1,     "rad"),
        makeTest("tan(π/4)=1",    "tan(pi/4)",  1,     "rad"),
        makeTest("asin(1)=π/2",   "asin(1)",    Math.PI / 2, "rad"),
        makeTest("acos(-1)=π",    "acos(-1)",   Math.PI,     "rad"),
        makeTest("atan(1)=π/4",   "atan(1)",    Math.PI / 4, "rad"),
      ],
    },
    {
      name: "Logarithms & Exponentials",
      icon: "㏒",
      tests: [
        makeTest("log(1)=0",      "log(1)",     0),
        makeTest("log(10)=1",     "log(10)",    1),
        makeTest("log(100)=2",    "log(100)",   2),
        makeTest("log(1000)=3",   "log(1000)",  3),
        makeTest("ln(1)=0",       "ln(1)",      0),
        makeTest("ln(e)=1",       "ln(e)",      1),
        makeTest("ln(e²)=2",      "ln(e^2)",    2),
        makeTest("e^ln(5)=5",     "e^ln(5)",    5),
        makeTest("10^log(7)=7",   "10^log(7)",  7),
      ],
    },
    {
      name: "Powers & Roots",
      icon: "√",
      tests: [
        makeTest("√4=2",          "sqrt(4)",    2),
        makeTest("√9=3",          "sqrt(9)",    3),
        makeTest("√2",            "sqrt(2)",    Math.SQRT2),
        makeTest("√(2+2)=2",      "sqrt(2+2)",  2),
        makeTest("2^0=1",         "2^0",        1),
        makeTest("2^0.5=√2",      "2^0.5",      Math.SQRT2),
        makeTest("27^(1/3)=3",    "27^(1/3)",   3),
        makeTest("|x| positive",  "abs(-42)",   42),
        makeTest("|x| of zero",   "abs(0)",     0),
      ],
    },
    {
      name: "Constants",
      icon: "π",
      tests: [
        makeTest("π value",       "pi",             Math.PI),
        makeTest("e value",       "e",              Math.E),
        makeTest("2π",            "2*pi",           2 * Math.PI),
        makeTest("π²",            "pi^2",           Math.PI ** 2),
        makeTest("e²",            "e^2",            Math.E ** 2),
        makeTest("Implicit 2π",   "2pi",            2 * Math.PI),
      ],
    },
    {
      name: "Factorial",
      icon: "n!",
      tests: [
        makeTest("0!=1",   "0!",   1),
        makeTest("1!=1",   "1!",   1),
        makeTest("5!=120", "5!",   120),
        makeTest("10!",    "10!",  3628800),
        makeTest("(3+2)!", "(3+2)!", 120),
      ],
    },
    {
      name: "Auto-fix & UX",
      icon: "✎",
      tests: [
        makeTest("Auto-close sin(30",      "sin(30",         0.5,  "deg"),
        makeTest("Auto-close nested",      "sin(cos(0",      Math.sin(1 * Math.PI / 180), "deg"),
        makeTest("Strip trailing +",       "5+",             5),
        makeTest("Strip trailing *",       "7*",             7),
        makeTest("Double negation",        "-(-5)",          5),
        makeTest("Percent of 200",         "200/100",        2),
      ],
    },
    {
      name: "Edge Cases",
      icon: "⚠",
      tests: [
        makeTest("Zero",                   "0",              0),
        makeTest("Negative zero",          "-0",             0),
        makeTest("Very small decimal",     "0.000001*1000000", 1),
        makeTest("Chained ops",            "1+2+3+4+5",      15),
        makeTest("Mixed signs",            "5+-3",           2),
        makeErrorTest("Division by zero",  "1/0",            "divzero"),
        makeErrorTest("sqrt of negative",  "sqrt(-1)",       "domain"),
        makeErrorTest("log of zero",       "log(0)",         "domain"),
        makeErrorTest("asin out of range", "asin(2)",        "domain"),
      ],
    },
  ];

  // ── Run all tests ──────────────────────────────────────────────────────────

  function runAll() {
    // Preserve calculator state
    const savedMode = Calculator.getAngleMode();

    const results = GROUPS.map(group => {
      const tests = group.tests.map(t => {
        const got = calc(t.expr, t.mode);

        let pass;
        if (t.expected && typeof t.expected === "object" && t.expected.error) {
          // Expect an error
          pass = (typeof got === "object" && got.error === t.expected.error);
        } else {
          // Expect a numeric value
          pass = (typeof got === "number" && approxEqual(got, t.expected));
        }

        return {
          label:    t.label,
          expr:     t.expr,
          expected: t.expected,
          got,
          pass,
          mode:     t.mode,
        };
      });

      const passed = tests.filter(t => t.pass).length;
      return { name: group.name, icon: group.icon, tests, passed, total: tests.length };
    });

    // Restore calculator state
    Calculator.setAngleMode(savedMode);

    const totalPassed = results.reduce((s, g) => s + g.passed, 0);
    const totalTests  = results.reduce((s, g) => s + g.total,  0);

    return { groups: results, totalPassed, totalTests, allPassed: totalPassed === totalTests };
  }

  return { run: runAll };
})();