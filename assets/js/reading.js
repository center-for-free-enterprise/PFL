/* C4FE PFL — session reading pages. Text for the page chrome; the reading itself is English only for now. */
(function () {
const n = document.body.dataset.reading;
const TITLES = {
  1: { en: "Session 1: Budgeting, Saving, Debt, and Credit", es: "Sesión 1: Presupuesto, ahorro, deudas y crédito" },
  2: { en: "Session 2: Building Wealth Over Time", es: "Sesión 2: Construir patrimonio con el tiempo" }
};
const TEXT = {
  en: { title: TITLES[n].en, lede: "The workshop reading. Read it here, or download the PDF to print or keep.",
        toc: "Contents", dl_pdf: "Download PDF", en_only: "" },
  es: { title: TITLES[n].es, lede: "La lectura del taller. Léela aquí o descarga el PDF para imprimirla o guardarla.",
        toc: "Contenido", dl_pdf: "Descargar PDF",
        en_only: "Por ahora, esta lectura está disponible solo en inglés. Las calculadoras sí están en español." }
};
const note = document.querySelector(".en-only");
PFL.onChange(function (lang) { note.hidden = lang !== "es"; });
PFL.init(TEXT, { titleKey: "title", ledeKey: "lede", sources: ["cfpb", "irs"] });

// Highlight the section being read in the contents list.
const links = Array.from(document.querySelectorAll(".toc a"));
const heads = links.map(a => document.getElementById(a.getAttribute("href").slice(1))).filter(Boolean);
function mark() {
  let cur = heads[0];
  for (const h of heads) { if (h.getBoundingClientRect().top < 120) cur = h; }
  links.forEach(a => a.classList.toggle("on", cur && a.getAttribute("href") === "#" + cur.id));
}
window.addEventListener("scroll", mark, { passive: true });
mark();
// On phones, start with the contents list closed so the reading comes first.
try { if (window.matchMedia("(max-width: 900px)").matches) document.getElementById("toc-details").open = false; } catch (e) {}
})();
