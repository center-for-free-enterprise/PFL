/* C4FE Personal Financial Literacy — shared page chrome and language handling.
   Each page calls PFL.init(pageText, options). Text lives in plain objects (en / es),
   so editing wording never requires touching the calculator logic. */
window.PFL = (function () {
  const COMMON = {
    en: {
      eyebrow: "Center for Free Enterprise · The University of Texas at El Paso",
      site_name: "Personal Financial Literacy",
      all_tools: "← All tools",
      disc_title: "For learning only. ",
      disc_short: "These tools are for the classroom, not financial advice. Rates and prices are examples, and real products include fees and terms these tools leave out. For real decisions, use official sources and the provider's own disclosures.",
      foot_h: "Important",
      foot_1: "This site is an educational companion to the C4FE Personal Financial Literacy Workshop. Its purpose is teaching. It is not financial, legal, or tax advice, and it is not an offer of credit or of any financial product.",
      foot_2: "Results are simplified estimates. They rest on stated assumptions, leave out fees and taxes unless shown, and are rounded. Real outcomes can differ in important ways. Always read official disclosures before you sign or invest.",
      foot_3: "Nothing you type here is saved or sent anywhere; the math runs in your browser. Only your language choice is remembered on this device.",
      src_h: "Official sources",
      src_fsa: "Federal Student Aid loan simulator (U.S. Department of Education)",
      src_auto: "Consumer Financial Protection Bureau: auto loans",
      src_home: "Consumer Financial Protection Bureau: buying a home",
      src_investor: "Investor.gov: saving and investing (U.S. Securities and Exchange Commission)",
      src_cfpb: "Consumer Financial Protection Bureau: money topics",
      src_cards: "Consumer Financial Protection Bureau: credit cards",
      src_irs: "IRS Tax Withholding Estimator",
      src_investorcalc: "SEC compound interest calculator",
      src_acr: "Free credit reports (the only official site)",
      src_scores: "Consumer Financial Protection Bureau: credit reports and scores",
      src_dol: "U.S. Department of Labor: retirement plans",
      src_irsret: "IRS: retirement plans and current contribution limits",
      credit: "Center for Free Enterprise, Woody L. Hunt College of Business, UTEP · c4fe@utep.edu",
      logo_alt: "UTEP Center for Free Enterprise, Woody L. Hunt College of Business",
      print_btn: "Print results",
      print_note: (url, date) => "Printed from " + url + " on " + date + ". For learning only; not financial advice.",
      for_teachers: "For teachers"
    },
    es: {
      eyebrow: "Center for Free Enterprise · The University of Texas at El Paso",
      site_name: "Educación Financiera Personal",
      all_tools: "← Todas las herramientas",
      disc_title: "Solo con fines educativos. ",
      disc_short: "Estas herramientas son para el aula, no asesoría financiera. Las tasas y los precios son ejemplos, y los productos reales incluyen cargos y condiciones que estas herramientas no consideran. Para decisiones reales, consulta fuentes oficiales y la información que te entregue el proveedor.",
      foot_h: "Importante",
      foot_1: "Este sitio es un complemento educativo del Taller de Educación Financiera Personal del C4FE. Su propósito es enseñar. No es asesoría financiera, legal ni fiscal, y no es una oferta de crédito ni de ningún producto financiero.",
      foot_2: "Los resultados son estimaciones simplificadas. Se basan en los supuestos indicados, no incluyen cargos ni impuestos salvo que se muestren, y están redondeados. Los resultados reales pueden ser muy distintos. Lee siempre la información oficial antes de firmar o invertir.",
      foot_3: "Nada de lo que escribes aquí se guarda ni se envía; los cálculos se hacen en tu navegador. Solo se recuerda en este dispositivo el idioma que elegiste.",
      src_h: "Fuentes oficiales",
      src_fsa: "Simulador de préstamos de Federal Student Aid (Departamento de Educación de EE. UU.)",
      src_auto: "Oficina para la Protección Financiera del Consumidor: préstamos de auto",
      src_home: "Oficina para la Protección Financiera del Consumidor: comprar una casa",
      src_investor: "Investor.gov: ahorro e inversión (Comisión de Bolsa y Valores de EE. UU.)",
      src_cfpb: "Oficina para la Protección Financiera del Consumidor: temas de dinero",
      src_cards: "Oficina para la Protección Financiera del Consumidor: tarjetas de crédito",
      src_irs: "Estimador de retenciones del IRS",
      src_investorcalc: "Calculadora de interés compuesto de la SEC",
      src_acr: "Reportes de crédito gratuitos (el único sitio oficial)",
      src_scores: "Oficina para la Protección Financiera del Consumidor: reportes y puntajes de crédito",
      src_dol: "Departamento de Trabajo de EE. UU.: planes de retiro",
      src_irsret: "IRS: planes de retiro y límites de aportación vigentes",
      credit: "Center for Free Enterprise, Woody L. Hunt College of Business, UTEP · c4fe@utep.edu",
      logo_alt: "UTEP Center for Free Enterprise, Woody L. Hunt College of Business",
      print_btn: "Imprimir resultados",
      print_note: (url, date) => "Impreso desde " + url + " el " + date + ". Solo con fines educativos; no es asesoría financiera.",
      for_teachers: "Para docentes"
    }
  };
  /* Federal income tax, single filer. Update once a year (the IRS announces the next year's figures each October).
     2026 figures: IRS inflation adjustments announced October 2025. */
  const TAX = {
    year: 2026, stdDeduction: 16100, fica: 0.0765,
    brackets: [[12400, .10], [50400, .12], [105700, .22], [201775, .24], [256225, .32], [640600, .35], [Infinity, .37]]
  };
  function fedTax(gross) {
    const taxable = Math.max(0, gross - TAX.stdDeduction); let tax = 0, lo = 0;
    for (const [hi, r] of TAX.brackets) { if (taxable > lo) tax += (Math.min(taxable, hi) - lo) * r; lo = hi; }
    return tax;
  }
  const SOURCES = {
    fsa: { href: "https://studentaid.gov/loan-simulator/", name: "StudentAid.gov", key: "src_fsa" },
    auto: { href: "https://www.consumerfinance.gov/consumer-tools/auto-loans/", name: "ConsumerFinance.gov", key: "src_auto" },
    home: { href: "https://www.consumerfinance.gov/owning-a-home/", name: "ConsumerFinance.gov", key: "src_home" },
    investor: { href: "https://www.investor.gov/", name: "Investor.gov", key: "src_investor" },
    cfpb: { href: "https://www.consumerfinance.gov/consumer-tools/", name: "ConsumerFinance.gov", key: "src_cfpb" },
    cards: { href: "https://www.consumerfinance.gov/consumer-tools/credit-cards/", name: "ConsumerFinance.gov", key: "src_cards" },
    irs: { href: "https://www.irs.gov/individuals/tax-withholding-estimator", name: "IRS.gov", key: "src_irs" },
    acr: { href: "https://www.annualcreditreport.com/", name: "AnnualCreditReport.com", key: "src_acr" },
    scores: { href: "https://www.consumerfinance.gov/consumer-tools/credit-reports-and-scores/", name: "ConsumerFinance.gov", key: "src_scores" },
    dol: { href: "https://www.dol.gov/general/topic/retirement", name: "DOL.gov", key: "src_dol" },
    irsret: { href: "https://www.irs.gov/retirement-plans", name: "IRS.gov", key: "src_irsret" },
    investorcalc: { href: "https://www.investor.gov/financial-tools-calculators/calculators/compound-interest-calculator", name: "Investor.gov", key: "src_investorcalc" }
  };

  let lang = "en";
  try { const s = localStorage.getItem("pfl-lang"); if (s === "en" || s === "es") lang = s; } catch (e) {}
  let page = { en: {}, es: {} };
  const listeners = [];

  function T(k) {
    const v = (page[lang] || {})[k] ?? COMMON[lang][k] ?? page.en[k] ?? COMMON.en[k];
    return v ?? "";
  }
  function L() { return Object.assign({}, COMMON.en, page.en, COMMON[lang], page[lang]); }
  const locale = () => (lang === "es" ? "es-US" : "en-US");
  function money(v, cents) {
    return new Intl.NumberFormat(locale(), { style: "currency", currency: "USD",
      minimumFractionDigits: cents ? 2 : 0, maximumFractionDigits: cents ? 2 : 0 }).format(v);
  }
  function pct(v, dp) {
    return new Intl.NumberFormat(locale(), { minimumFractionDigits: dp, maximumFractionDigits: dp }).format(v) + "%";
  }

  /* Shared chart frame: returns scales and the gridline/axis SVG for a W×H viewBox. */
  function niceStep(max) {
    const raw = max / 4, p = Math.pow(10, Math.floor(Math.log10(raw || 1))), m = raw / p;
    return (m <= 1 ? 1 : m <= 2 ? 2 : m <= 2.5 ? 2.5 : m <= 5 ? 5 : 10) * p;
  }
  function frame(o) {
    const W = o.W || 640, H = o.H || 270, ml = o.ml || 70, mr = 14, mt = 12, mb = 34;
    const iw = W - ml - mr, ih = H - mt - mb;
    const ymax = Math.max(1, o.ymax), step = niceStep(ymax), top = Math.ceil(ymax / step) * step;
    const sx = x => ml + (x - o.x0) / ((o.x1 - o.x0) || 1) * iw;
    const sy = v => mt + ih - (v / top) * ih;
    let g = "";
    for (let v = 0; v <= top + 1e-6; v += step) {
      const y = sy(v);
      g += '<line class="grid" x1="' + ml + '" x2="' + (W - mr) + '" y1="' + y + '" y2="' + y + '"/>' +
        '<text class="ax" x="' + (ml - 8) + '" y="' + (y + 4) + '" text-anchor="end">' + (o.fmtY || money)(v) + "</text>";
    }
    (o.xticks || []).forEach(function (t) {
      g += '<text class="ax" x="' + sx(t) + '" y="' + (H - mb + 18) + '" text-anchor="middle">' + (o.fmtX ? o.fmtX(t) : t) + "</text>";
    });
    if (o.xLabel) g += '<text class="ax" x="' + (ml + iw / 2) + '" y="' + (H - 2) + '" text-anchor="middle">' + o.xLabel + "</text>";
    return { W: W, H: H, sx: sx, sy: sy, base: mt + ih, grid: g,
      wrap: function (inner, label) { return '<svg class="chart" viewBox="0 0 ' + W + " " + H + '" role="img" aria-label="' + (label || "") + '">' + g + inner + "</svg>"; } };
  }
  function ticks(x0, x1, n) {
    const span = x1 - x0, raw = span / (n || 6);
    const step = [1, 2, 5, 10, 20, 25, 50].find(s => s >= raw) || Math.ceil(raw);
    const out = []; for (let t = Math.ceil(x0 / step) * step; t <= x1; t += step) out.push(t);
    return out;
  }
  function path(pts) { return pts.map((p, i) => (i ? "L" : "M") + p[0].toFixed(1) + " " + p[1].toFixed(1)).join(""); }

  /* Shared form builder. defs: [{k, kind: money|pct|range|check, min,max,step, unit(v)->text, group}]
     state: object of current values. label(k)/hint(k): text lookups. onInput(k, value) after each change. */
  function buildFields(box, defs, state, label, hint, onInput) {
    box.innerHTML = "";
    defs.forEach(function (f) {
      if (f.group) {
        const h = document.createElement("p"); h.className = "group-h";
        h.innerHTML = (f.color ? '<i style="background:' + f.color + '"></i>' : "") + "<span>" + label(f.group) + "</span>";
        box.appendChild(h); return;
      }
      const v = state[f.k], id = "f-" + f.k, d = document.createElement("div"), ht = hint(f.k);
      d.className = "field";
      const outTxt = function (x) { return f.unit ? f.unit(x) : pct(x, f.step >= 1 ? 0 : (String(f.step).split(".")[1] || "").length); };
      if (f.kind === "check") {
        d.innerHTML = '<label class="check"><input type="checkbox" id="' + id + '"' + (v ? " checked" : "") + "><span>" + label(f.k) + "</span></label>";
      } else if (f.kind === "money") {
        d.innerHTML = '<label class="lbl" for="' + id + '">' + label(f.k) + '</label><div class="money"><span>$</span><input type="number" id="' + id + '" inputmode="decimal" min="0" step="' + (f.step || 1) + '" value="' + v + '"></div>';
      } else {
        d.innerHTML = '<label class="lbl" for="' + id + '"><span>' + label(f.k) + '</span><output id="o-' + f.k + '">' + outTxt(v) + '</output></label><input type="range" id="' + id + '" min="' + f.min + '" max="' + f.max + '" step="' + (f.step || 1) + '" value="' + v + '">';
      }
      if (ht) { const p = document.createElement("p"); p.className = "hint"; p.textContent = ht; d.appendChild(p); }
      box.appendChild(d);
      const inp = d.querySelector("input");
      inp.addEventListener("input", function () {
        let nv = f.kind === "check" ? inp.checked : parseFloat(inp.value);
        if (f.kind !== "check" && !isFinite(nv)) nv = 0;
        if (f.kind === "money") nv = Math.max(0, nv);
        state[f.k] = nv;
        const o = document.getElementById("o-" + f.k); if (o) o.textContent = outTxt(nv);
        onInput(f.k, nv);
      });
    });
  }

  function renderChrome(opt) {
    const header = document.getElementById("site-header");
    header.className = "band";
    header.innerHTML =
      '<div class="wrap"><div class="brand">' +
      '<a class="logo-link" href="index.html"><img class="logo" src="assets/img/c4fe-logo-reverse.png" width="243" height="90" data-i18n-alt="logo_alt" alt=""></a>' +
      "<div>" +
      (opt.home ? "" : '<a class="crumb" href="index.html" data-i18n="all_tools"></a><br>') +
      '<p class="eyebrow" data-i18n="eyebrow"></p>' +
      '<h1 data-i18n="' + opt.titleKey + '"></h1>' +
      '<p class="lede" data-i18n="' + opt.ledeKey + '"></p>' +
      "</div></div>" +
      '<div class="lang" role="group" aria-label="Language / Idioma">' +
      '<button type="button" data-lang="en">English</button><button type="button" data-lang="es">Español</button>' +
      "</div></div>";

    const notice = document.getElementById("site-notice");
    notice.className = "notice";
    notice.setAttribute("role", "note");
    notice.innerHTML =
      '<svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="2"/><path d="M12 7v6M12 16.5v.5" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/></svg>' +
      '<p><strong data-i18n="disc_title"></strong><span data-i18n="disc_short"></span></p>';

    if (opt.print) {
      const bar = document.createElement("div"); bar.className = "toolbar";
      bar.innerHTML = '<button type="button" class="btn" id="print-btn"><svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path d="M7 9V3h10v6M7 17H4v-7h16v7h-3M7 14h10v7H7z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg><span data-i18n="print_btn"></span></button>';
      notice.after(bar);
      bar.querySelector("button").addEventListener("click", function () { window.print(); });
    }

    const footer = document.getElementById("site-footer");
    const src = (opt.sources || []).map(function (k) {
      const s = SOURCES[k];
      return '<li><a href="' + s.href + '" target="_blank" rel="noopener">' + s.name + '</a> — <span data-i18n="' + s.key + '"></span></li>';
    }).join("");
    footer.innerHTML =
      '<div class="wrap"><div><h3 data-i18n="foot_h"></h3><p data-i18n="foot_1"></p><p data-i18n="foot_2"></p><p data-i18n="foot_3"></p></div>' +
      '<div><h3 data-i18n="src_h"></h3><ul>' + src + '</ul><p class="credit"><a href="teachers.html" data-i18n="for_teachers"></a></p><p class="credit" data-i18n="credit"></p></div></div>';

    header.querySelectorAll(".lang button").forEach(function (b) {
      b.addEventListener("click", function () { setLang(b.dataset.lang); });
    });
  }

  function apply() {
    document.documentElement.lang = lang;
    const t = T(document.body.dataset.titleKey || "");
    if (t) document.title = t + " · C4FE";
    document.querySelectorAll("[data-i18n]").forEach(function (el) { el.textContent = T(el.dataset.i18n); });
    document.querySelectorAll("[data-i18n-alt]").forEach(function (el) { el.alt = T(el.dataset.i18nAlt); });
    document.querySelectorAll(".lang button").forEach(function (b) { b.setAttribute("aria-pressed", String(b.dataset.lang === lang)); });
    listeners.forEach(function (fn) { fn(lang); });
  }
  function setLang(l) {
    lang = l;
    try { localStorage.setItem("pfl-lang", l); } catch (e) {}
    apply();
  }
  window.addEventListener("beforeprint", function () {
    const date = new Intl.DateTimeFormat(locale(), { dateStyle: "long" }).format(new Date());
    document.body.dataset.printNote = L().print_note(location.host + location.pathname, date);
    document.querySelectorAll("details:not([open])").forEach(function (d) { d.dataset.reclose = "1"; d.open = true; });
  });
  window.addEventListener("afterprint", function () {
    document.querySelectorAll("details[data-reclose]").forEach(function (d) { d.open = false; delete d.dataset.reclose; });
  });

  function init(pageText, opt) {
    page = pageText;
    document.body.dataset.titleKey = opt.titleKey;
    renderChrome(opt);
    apply();
  }
  return {
    init: init, T: T, L: L, money: money, pct: pct, frame: frame, ticks: ticks, path: path, buildFields: buildFields, TAX: TAX, fedTax: fedTax,
    onChange: function (fn) { listeners.push(fn); },
    get lang() { return lang; }
  };
})();
