/* C4FE PFL — Page for teachers. Edit wording in TEXT; activities in ACT. */
(function () {
const SITE = "center-for-free-enterprise.github.io/PFL";
const TEXT = {
en:{
 title:"For Teachers",
 lede:"How to use these tools in class: a quick setup, one short activity per tool, and where each one fits in the workshop.",
 setup_h:"Before class",
 qr_cap:"Scan to open the site",
 setup:[
  "Students need only a phone or a laptop with a browser. There are no accounts, no logins, and nothing to install.",
  "Nothing students type is saved or sent anywhere. The math runs on their own device, so the tools are safe to use with real or made-up numbers.",
  "Every page has an English/Español button at the top. The choice carries across pages, which helps students share the tools with family.",
  "Each tool opens with example numbers, so it shows something useful even before students change anything.",
  "The “Print results” button prints the inputs and results on one or two pages, ready to hand in as a worksheet."
 ],
 mat_h:"Workshop slides and readings",
 mat_sub:"The slides used in each session, as a PDF you can project or share, next to the full reading. The quiz answers are in the presenter notes, not in the PDF, so students can see the slides ahead of time.",
 s1:"Session 1", s2:"Session 2",
 m1_h:"Budgeting, Saving, Debt, and Credit", m2_h:"Building Wealth Over Time",
 mat_meta:"38 slides with tool demos and check-your-understanding questions.",
 mat_slides:"Download slides (PDF)", mat_read:"Read the session →",
 act_h:"Tools and 10-minute activities",
 act_sub:"Each card names the reading it supports, one activity, and a question for discussion. Links open the tool on the right tab.",
 lbl_idea:"The idea", lbl_do:"Activity", lbl_ask:"Ask",
 seq_h:"A suggested sequence",
 seq:[
  ["Session 1","Budget Simulator → Saving for a Goal → Credit Cards → Credit Score Explorer → Loan Calculator (car)."],
  ["Session 2","Investing and Compound Growth → Paycheck and Employer Match → Loan Calculator (student loan and mortgage)."],
  ["Session 3","Before the bank or credit union visit, have students write two questions using what they saw in the Credit Score Explorer or the Loan Calculator."]
 ],
 know_h:"Good to know",
 know:[
  "All rates and prices are examples, chosen to match the workshop readings. Encourage students to change them.",
  "Taxes use 2026 federal rates for a single filer with the standard deduction. Texas has no state income tax.",
  "The investing tool simulates many possible markets instead of drawing a straight line, so students see a range of outcomes, not a promise.",
  "Every page says clearly that the tools are for learning and are not financial advice, and links to official sources."
 ],
 fb_h:"Used this in class? Tell us how.",
 fb_p:"A few lines help us improve the tools and show schools what the workshop does. For example:",
 fb_list:["Which tools you used, and with which grade or class","What worked and what confused students","A question or a topic you wish the site covered"],
 fb_privacy:"Please don't send student names or other student information. Your message goes only to the Center for Free Enterprise.",
 fb_label:"Send feedback to", fb_btn:"Email the Center", fb_copy:"Copy", fb_copied:"Copied",
 fb_subject:"PFL tools: classroom feedback",
 open:"Open",
 s1:"Session 1", s2:"Session 2", s12:"Sessions 1 and 2"
},
es:{
 title:"Para docentes",
 lede:"Cómo usar estas herramientas en clase: una preparación rápida, una actividad breve por herramienta y dónde encaja cada una en el taller.",
 setup_h:"Antes de la clase",
 qr_cap:"Escanea para abrir el sitio",
 setup:[
  "Los estudiantes solo necesitan un teléfono o una computadora con navegador. No hay cuentas, ni inicios de sesión, ni nada que instalar.",
  "Nada de lo que escriben los estudiantes se guarda ni se envía. Los cálculos se hacen en su propio dispositivo, así que pueden usar números reales o inventados con tranquilidad.",
  "Cada página tiene un botón English/Español en la parte superior. La elección se mantiene entre páginas, lo que ayuda a compartir las herramientas con la familia.",
  "Cada herramienta abre con números de ejemplo, así que muestra algo útil incluso antes de cambiar nada.",
  "El botón “Imprimir resultados” imprime los datos y los resultados en una o dos páginas, listos para entregarse como hoja de trabajo."
 ],
 mat_h:"Diapositivas y lecturas del taller",
 mat_sub:"Las diapositivas de cada sesión, en PDF para proyectar o compartir, junto a la lectura completa. Las respuestas de las preguntas están en las notas del presentador, no en el PDF, así que los estudiantes pueden ver las diapositivas de antemano.",
 s1:"Sesión 1", s2:"Sesión 2",
 m1_h:"Budgeting, Saving, Debt, and Credit (en inglés)", m2_h:"Building Wealth Over Time (en inglés)",
 mat_meta:"38 diapositivas con demostraciones de las herramientas y preguntas para comprobar lo aprendido.",
 mat_slides:"Descargar diapositivas (PDF)", mat_read:"Leer la sesión →",
 act_h:"Herramientas y actividades de 10 minutos",
 act_sub:"Cada tarjeta indica la lectura que apoya, una actividad y una pregunta para conversar. Los enlaces abren la herramienta en la pestaña indicada.",
 lbl_idea:"La idea", lbl_do:"Actividad", lbl_ask:"Pregunta",
 seq_h:"Una secuencia sugerida",
 seq:[
  ["Sesión 1","Simulador de presupuesto → Ahorrar para una meta → Tarjetas de crédito → Explorador del puntaje de crédito → Calculadora de préstamos (auto)."],
  ["Sesión 2","Inversión e interés compuesto → Cheque de pago y aportación del empleador → Calculadora de préstamos (préstamo estudiantil e hipoteca)."],
  ["Sesión 3","Antes de la visita del banco o la cooperativa de crédito, pide a los estudiantes que escriban dos preguntas a partir de lo que vieron en el Explorador del puntaje de crédito o en la Calculadora de préstamos."]
 ],
 know_h:"Conviene saber",
 know:[
  "Todas las tasas y precios son ejemplos, elegidos para coincidir con las lecturas del taller. Anima a los estudiantes a cambiarlos.",
  "Los impuestos usan las tasas federales de 2026 para una persona soltera con la deducción estándar. Texas no tiene impuesto estatal sobre la renta.",
  "La herramienta de inversión simula muchos mercados posibles en lugar de dibujar una línea recta, así que los estudiantes ven un rango de resultados, no una promesa.",
  "Cada página indica claramente que las herramientas son para aprender, no asesoría financiera, y enlaza a fuentes oficiales."
 ],
 fb_h:"¿Las usaste en clase? Cuéntanos cómo.",
 fb_p:"Unas líneas nos ayudan a mejorar las herramientas y a mostrar a las escuelas lo que logra el taller. Por ejemplo:",
 fb_list:["Qué herramientas usaste y con qué grado o grupo","Qué funcionó y qué confundió a los estudiantes","Una pregunta o un tema que te gustaría que el sitio incluyera"],
 fb_privacy:"Por favor, no envíes nombres ni otros datos de los estudiantes. Tu mensaje llega solo al Center for Free Enterprise.",
 fb_label:"Envía tus comentarios a", fb_btn:"Escribir al Centro", fb_copy:"Copiar", fb_copied:"Copiada",
 fb_subject:"Herramientas PFL: comentarios de clase",
 open:"Abrir",
 s1:"Sesión 1", s2:"Sesión 2", s12:"Sesiones 1 y 2"
}};

// One entry per tool: [session key, links [[href, en label, es label]], en {name, idea, do, ask}, es {...}]
const ACT = [
 ["s1",[["budget.html","Budget Simulator","Simulador de presupuesto"]],
  {name:"Budget Simulator",idea:"A salary is not take-home pay, and a budget is a plan made before the month starts.",
   do:"Give each pair a different job offer ($32,000, $40,000, or $55,000). They change the salary, then adjust the plan until every dollar has a job (the green message) without dropping savings below 10%.",
   ask:"Which category did you cut first, and why? Why does the plan start from take-home pay instead of salary?"},
  {name:"Simulador de presupuesto",idea:"El salario no es el ingreso neto, y un presupuesto es un plan que se hace antes de que empiece el mes.",
   do:"Da a cada pareja una oferta de trabajo distinta ($32,000, $40,000 o $55,000). Cambian el salario y ajustan el plan hasta que cada dólar tenga un propósito (el mensaje verde), sin bajar el ahorro de 10%.",
   ask:"¿Qué categoría recortaron primero y por qué? ¿Por qué el plan parte del ingreso neto y no del salario?"}],
 ["s1",[["savings.html","A car","Un auto"],["savings.html#home","Home down payment","Enganche de una casa"]],
  {name:"Saving for a Goal",idea:"A goal with a price and a date becomes a monthly amount, and prices rise while you save.",
   do:"Students pick a used car from a local listing, find the monthly amount to buy it in 2 years, then switch to “Save a set amount” and enter what their budget left over.",
   ask:"What happens when the price rises faster than your savings earn? Which lever would you pull: time, price, or the monthly amount?"},
  {name:"Ahorrar para una meta",idea:"Una meta con precio y fecha se convierte en un monto mensual, y los precios suben mientras ahorras.",
   do:"Los estudiantes eligen un auto usado de un anuncio local, calculan el monto mensual para comprarlo en 2 años y luego cambian a “Ahorrar un monto fijo al mes” con lo que les sobró en el presupuesto.",
   ask:"¿Qué pasa si el precio sube más rápido de lo que gana tu ahorro? ¿Qué palanca moverías: tiempo, precio o monto mensual?"}],
 ["s1",[["credit.html","Credit Cards","Tarjetas de crédito"]],
  {name:"Credit Cards",idea:"Minimum payments are set low on purpose, so a small balance can last for years.",
   do:"Start with $1,000 at 24%. Students read the warning box aloud, then find the smallest monthly payment that clears the balance within one year.",
   ask:"Why do card companies set the minimum so low? Who benefits?"},
  {name:"Tarjetas de crédito",idea:"Los pagos mínimos se fijan bajos a propósito, así que un saldo pequeño puede durar años.",
   do:"Empieza con $1,000 al 24%. Los estudiantes leen en voz alta el cuadro de advertencia y luego buscan el pago mensual más pequeño que liquida el saldo en un año.",
   ask:"¿Por qué las compañías de tarjetas fijan un mínimo tan bajo? ¿A quién beneficia?"}],
 ["s1",[["score.html","Credit Score Explorer","Explorador del puntaje de crédito"]],
  {name:"Credit Score Explorer",idea:"Paying on time and keeping balances low drive most of a credit score.",
   do:"From the example profile, add one late payment and note the change. Reset it, then check “Close your oldest card” and watch utilization.",
   ask:"Which two habits matter most? Why might closing an old card hurt even if you never use it?"},
  {name:"Explorador del puntaje de crédito",idea:"Pagar a tiempo y mantener saldos bajos explican la mayor parte del puntaje.",
   do:"Desde el perfil de ejemplo, agrega un pago atrasado y anota el cambio. Regrésalo a cero y marca “Cerrar tu tarjeta más antigua” para ver el uso del crédito.",
   ask:"¿Qué dos hábitos importan más? ¿Por qué cerrar una tarjeta antigua puede perjudicar aunque nunca la uses?"}],
 ["s12",[["loans.html","Car loan","Préstamo de auto"],["loans.html#student","Student loan","Préstamo estudiantil"],["loans.html#mortgage","Mortgage","Hipoteca"]],
  {name:"Loan Calculator",idea:"A longer term lowers the payment and raises the total cost; the loan disclosure box shows the real price.",
   do:"On the car tab, compare the 3-year and 7-year rows in the table. Then add $50 a month in extra payments and read the savings.",
   ask:"Why do car ads quote a monthly payment instead of the total cost? Which number on the disclosure box would you check first?"},
  {name:"Calculadora de préstamos",idea:"Un plazo más largo baja el pago y sube el costo total; el cuadro de información del préstamo muestra el precio real.",
   do:"En la pestaña de auto, comparen las filas de 3 y 7 años de la tabla. Luego agreguen $50 al mes de pago extra y lean cuánto se ahorra.",
   ask:"¿Por qué los anuncios de autos muestran el pago mensual y no el costo total? ¿Qué cifra del cuadro revisarías primero?"}],
 ["s2",[["invest.html","Investing and Compound Growth","Inversión e interés compuesto"]],
  {name:"Investing and Compound Growth",idea:"Starting early matters more than the amount, fees compound against you, and returns are never a straight line.",
   do:"Students record the typical outcome at 18, then compare it with starting 10 years later and with a 1% fee. Last, turn on “today's dollars.”",
   ask:"Why does the band get wider over time? Why does the reading tell you to stay invested when markets fall?"},
  {name:"Inversión e interés compuesto",idea:"Empezar temprano importa más que el monto, las comisiones se acumulan en tu contra y los rendimientos nunca son una línea recta.",
   do:"Los estudiantes anotan el resultado típico empezando a los 18, lo comparan con empezar 10 años después y con una comisión de 1%. Al final, activan “dólares de hoy”.",
   ask:"¿Por qué la franja se hace más ancha con el tiempo? ¿Por qué la lectura recomienda mantenerse invertido cuando caen los mercados?"}],
 ["s2",[["match.html","Paycheck and Employer Match","Cheque de pago y aportación del empleador"]],
  {name:"Paycheck and Employer Match",idea:"An employer match is part of your pay, and a pre-tax contribution costs your paycheck less than it puts in.",
   do:"Lower the contribution from 3% to 1% and read how much match is left on the table. Then switch between traditional and Roth and compare the take-home pay.",
   ask:"Is the match part of your salary? Why might a Roth suit someone early in their career?"},
  {name:"Cheque de pago y aportación del empleador",idea:"La aportación del empleador es parte de tu sueldo, y una aportación antes de impuestos le cuesta a tu cheque menos de lo que deposita.",
   do:"Bajen la aportación de 3% a 1% y lean cuánto dinero del empleador queda sobre la mesa. Luego cambien entre tradicional y Roth y comparen el ingreso neto.",
   ask:"¿La aportación del empleador es parte de tu salario? ¿Por qué un Roth podría convenir al inicio de la carrera?"}]
];

const $ = id => document.getElementById(id);
function render(){
  const L = PFL.L(), es = PFL.lang==="es";
  $("site-url").textContent = SITE;
  $("setup").innerHTML = L.setup.map(t=>`<li>${t}</li>`).join("");
  $("acts").innerHTML = ACT.map(([sess,links,en,sp])=>{ const a = es?sp:en;
    return `<article class="act"><span class="session">${L[sess]}</span><h3>${a.name}</h3>`+
      `<p><b>${L.lbl_idea}.</b> ${a.idea}</p><p><b>${L.lbl_do}.</b> ${a.do}</p><p><b>${L.lbl_ask}.</b> ${a.ask}</p>`+
      `<p class="act-links">${links.map(([h,le,ls])=>`<a href="${h}">${L.open}: ${es?ls:le} →</a>`).join("")}</p></article>`; }).join("");
  $("seq").innerHTML = L.seq.map(([s,t])=>`<li><b>${s}.</b> ${t}</li>`).join("");
  $("know").innerHTML = L.know.map(t=>`<li>${t}</li>`).join("");
  $("fb-list").innerHTML = L.fb_list.map(t=>`<li>${t}</li>`).join("");
  $("fb-link").href = "mailto:c4fe@utep.edu?subject=" + encodeURIComponent(L.fb_subject);
}
$("fb-copy").addEventListener("click", ()=>{
  const lab = $("fb-copy").querySelector("span"), done = ()=>{ lab.textContent = PFL.T("fb_copied"); setTimeout(()=>{ lab.textContent = PFL.T("fb_copy"); }, 1600); };
  const sel = ()=>{ const c=document.querySelector(".fb-mail code"), r=document.createRange(); r.selectNodeContents(c); const s=getSelection(); s.removeAllRanges(); s.addRange(r); };
  try { navigator.clipboard.writeText("c4fe@utep.edu").then(done, sel); } catch(e){ sel(); }
});
PFL.onChange(render);
PFL.init(TEXT,{print:true,titleKey:"title",ledeKey:"lede",sources:["cfpb","investor"]});
})();
