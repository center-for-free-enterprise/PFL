/* C4FE PFL — Budget simulator.
   Text: TEXT below. Tax parameters live in site.js (TAX). Example budget: STATE. */
(function () {
const TEXT = {
en:{
 title:"Budget Simulator",
 lede:"Start from a salary, see what actually lands in your account, and build a monthly plan where every dollar has a job.",
 inputs_h:"Your plan", example_note:"Example numbers for a first full-time job. Change any of them.",
 g_income:"Income", g_needs:"Needs", g_wants:"Wants", g_save:"Savings",
 salary:"Yearly salary (before taxes)", h_salary:"The number in a job offer. Taxes come out before you see it.",
 rent:"Rent", utilities:"Utilities (power, water, gas)", groceries:"Groceries", transport:"Transportation (car payment, gas, insurance)", phone:"Phone and internet", other_needs:"Other needs (health insurance, minimum debt payments)",
 eating:"Eating out", shopping:"Shopping and clothes", fun:"Fun, streaming, and subscriptions",
 emergency:"Emergency fund", retire:"Investing for retirement", goals:"Saving for a goal (car, home, school)",
 h_emergency:"Money set aside for surprises: a car repair, a medical bill, a lost job.",
 paycheck_h:"Your paycheck", takehome:"Take-home pay", per_month:"/month",
 stub_gross:"Gross pay (monthly)", stub_fed:"Federal income tax", stub_fica:"Social Security and Medicare (7.65%)", stub_state:"Texas state income tax", stub_net:"Take-home pay",
 tax_note:(y,sd,rate)=>`Uses ${y} federal tax rates for a single filer taking the standard deduction (${sd}). Your effective federal rate is ${rate}. Texas has no state income tax. Real paychecks also depend on your W-4, benefits, and retirement contributions.`,
 split_h:"How your plan compares with 50/30/20", split_sub:"A common starting rule: 50% of take-home pay for needs, 30% for wants, 20% for savings. The black mark is the guideline.",
 msg_left:x=>`You have <b>${x}</b> a month with no job yet. Give it one: more savings, a goal, or a want you planned for.`,
 msg_over:x=>`You're planning to spend <b>${x}</b> more than you take home each month. Something has to give.`,
 msg_even:"<b>Every dollar has a job.</b> That is what a budget is.",
 msg_needs:p=>`Needs take <b>${p}</b> of your pay, above the 50% guideline. Housing is usually the biggest lever: a roommate or living at home changes the whole picture.`,
 msg_save:p=>`You're saving <b>${p}</b> of your pay. That meets the 20% guideline.`,
 ef_h:"Your emergency fund",
 ef_3:"3 months of needs", ef_6:"6 months (safer)", ef_time:"Time to reach 3 months", ef_never:"Add an emergency savings amount",
 months:n=>n===1?"1 month":n+" months",
 take_h:"What this shows",
 take:"A salary is not what you take home. Taxes come out first, so build your budget on take-home pay. Needs come first, savings come next, and wants fit in what is left. If the plan doesn't add up, change the plan before the month starts, not after.",
 read:"Read more in your Session 1 materials: Section 1, “Understanding Your Income,” and Section 2, “Building a Budget.”"
},
es:{
 title:"Simulador de presupuesto",
 lede:"Empieza con un salario, descubre cuánto llega realmente a tu cuenta y arma un plan mensual en el que cada dólar tenga un propósito.",
 inputs_h:"Tu plan", example_note:"Números de ejemplo para un primer empleo de tiempo completo. Puedes cambiar cualquiera.",
 g_income:"Ingreso", g_needs:"Necesidades", g_wants:"Gustos", g_save:"Ahorro",
 salary:"Salario anual (antes de impuestos)", h_salary:"La cifra de una oferta de trabajo. Los impuestos se descuentan antes de que la veas.",
 rent:"Renta", utilities:"Servicios (luz, agua, gas)", groceries:"Supermercado", transport:"Transporte (pago del auto, gasolina, seguro)", phone:"Teléfono e internet", other_needs:"Otras necesidades (seguro médico, pagos mínimos de deudas)",
 eating:"Comer fuera", shopping:"Compras y ropa", fun:"Diversión, streaming y suscripciones",
 emergency:"Fondo de emergencia", retire:"Inversión para el retiro", goals:"Ahorro para una meta (auto, casa, estudios)",
 h_emergency:"Dinero apartado para imprevistos: una reparación del auto, una cuenta médica, perder el empleo.",
 paycheck_h:"Tu cheque de pago", takehome:"Ingreso neto", per_month:"/mes",
 stub_gross:"Pago bruto (mensual)", stub_fed:"Impuesto federal sobre la renta", stub_fica:"Seguro Social y Medicare (7.65%)", stub_state:"Impuesto estatal de Texas", stub_net:"Ingreso neto",
 tax_note:(y,sd,rate)=>`Usa las tasas federales de ${y} para una persona soltera con la deducción estándar (${sd}). Tu tasa federal efectiva es ${rate}. Texas no tiene impuesto estatal sobre la renta. Los cheques reales también dependen de tu formulario W-4, tus beneficios y tus aportes para el retiro.`,
 split_h:"Cómo se compara tu plan con la regla 50/30/20", split_sub:"Una regla inicial común: 50% del ingreso neto para necesidades, 30% para gustos y 20% para ahorro. La marca negra es la guía.",
 msg_left:x=>`Te quedan <b>${x}</b> al mes sin propósito. Dales uno: más ahorro, una meta o un gusto planeado.`,
 msg_over:x=>`Planeas gastar <b>${x}</b> más de lo que recibes cada mes. Algo tiene que cambiar.`,
 msg_even:"<b>Cada dólar tiene un propósito.</b> Eso es un presupuesto.",
 msg_needs:p=>`Las necesidades se llevan <b>${p}</b> de tu ingreso, más que el 50% de la guía. La vivienda suele ser la palanca más grande: compartir departamento o vivir con tu familia cambia todo el panorama.`,
 msg_save:p=>`Estás ahorrando <b>${p}</b> de tu ingreso. Eso cumple la guía del 20%.`,
 ef_h:"Tu fondo de emergencia",
 ef_3:"3 meses de necesidades", ef_6:"6 meses (más seguro)", ef_time:"Tiempo para juntar 3 meses", ef_never:"Agrega un monto para emergencias",
 months:n=>n===1?"1 mes":n+" meses",
 take_h:"Qué muestra esto",
 take:"El salario no es lo que te llevas a casa. Primero se descuentan los impuestos, así que arma tu presupuesto con el ingreso neto. Primero las necesidades, después el ahorro, y los gustos caben en lo que queda. Si el plan no cuadra, cámbialo antes de que empiece el mes, no después.",
 read:"Lee más en tus materiales de la Sesión 1: Sección 1, “Understanding Your Income,” y Sección 2, “Building a Budget.”"
}};

const NEEDS = ["rent","utilities","groceries","transport","phone","other_needs"],
      WANTS = ["eating","shopping","fun"],
      SAVE  = ["emergency","retire","goals"];
const STATE = { salary:40000, rent:800, utilities:150, groceries:300, transport:250, phone:100, other_needs:0,
  eating:200, shopping:100, fun:100, emergency:250, retire:150, goals:100 };
const COLORS = { needs:"var(--principal)", wants:"var(--interest)", save:"var(--good)" };

const $ = id => document.getElementById(id);
const TAX = PFL.TAX, fedTax = PFL.fedTax;
const T = k => PFL.T(k), money = (v,c) => PFL.money(v,c);
const pct0 = v => PFL.pct(v, 0);


function defs(){
  const m = k => ({k, kind:"money", step:10});
  return [{group:"g_income"},{k:"salary",kind:"money",step:1000},
    {group:"g_needs",color:COLORS.needs},...NEEDS.map(m),
    {group:"g_wants",color:COLORS.wants},...WANTS.map(m),
    {group:"g_save",color:COLORS.save},...SAVE.map(m)];
}
function build(){ PFL.buildFields($("fields"), defs(), STATE, T, k=>T("h_"+k), compute); }

function compute(){
  const L = PFL.L(), g = STATE.salary;
  const fed = fedTax(g), fica = g * TAX.fica, net = (g - fed - fica) / 12;
  $("net").innerHTML = `${money(net)}<small>${L.per_month}</small>`;
  $("stub").innerHTML =
    `<dt>${L.stub_gross}</dt><dd>${money(g/12)}</dd>`+
    `<dt>${L.stub_fed}</dt><dd class="minus">−${money(fed/12)}</dd>`+
    `<dt>${L.stub_fica}</dt><dd class="minus">−${money(fica/12)}</dd>`+
    `<dt>${L.stub_state}</dt><dd>${money(0)}</dd>`+
    `<dt class="net">${L.stub_net}</dt><dd class="net">${money(net)}</dd>`;
  $("taxnote").textContent = L.tax_note(TAX.year, money(TAX.stdDeduction), PFL.pct(g ? fed/g*100 : 0, 1));

  const sum = ks => ks.reduce((a,k)=>a+(STATE[k]||0),0);
  const needs = sum(NEEDS), wants = sum(WANTS), save = sum(SAVE), left = net - needs - wants - save;
  const share = v => net > 0 ? v/net*100 : 0;

  const msgs = [];
  if (left > 0.5) msgs.push(`<div class="msg">${L.msg_left(money(left))}</div>`);
  else if (left < -0.5) msgs.push(`<div class="msg bad">${L.msg_over(money(-left))}</div>`);
  else msgs.push(`<div class="msg good">${L.msg_even}</div>`);
  if (share(needs) > 50) msgs.push(`<div class="msg">${L.msg_needs(pct0(share(needs)))}</div>`);
  if (share(save) >= 20) msgs.push(`<div class="msg good">${L.msg_save(pct0(share(save)))}</div>`);
  $("msgs").innerHTML = msgs.join("");

  const rows = [["g_needs",needs,50,COLORS.needs],["g_wants",wants,30,COLORS.wants],["g_save",save,20,COLORS.save]];
  $("split").innerHTML = rows.map(([k,v,t,c]) =>
    `<div class="split-row"><span>${L[k]}</span><div class="track" role="img" aria-label="${L[k]} ${pct0(share(v))}"><div class="fill" style="width:${Math.min(100,share(v))}%;background:${c}"></div><div class="target" style="left:calc(${t}% - 1px)"></div></div><b>${pct0(share(v))} · ${money(v)}</b></div>`
  ).join("");

  const ef3 = needs*3, ef6 = needs*6, em = STATE.emergency;
  $("ef").innerHTML =
    `<div class="stat"><span>${L.ef_3}</span><strong>${money(ef3)}</strong></div>`+
    `<div class="stat"><span>${L.ef_6}</span><strong>${money(ef6)}</strong></div>`+
    `<div class="stat"><span>${L.ef_time}</span><strong>${em>0 ? L.months(Math.ceil(ef3/em)) : "—"}</strong>${em>0?"":`<span>${L.ef_never}</span>`}</div>`;
}

PFL.onChange(()=>{ build(); compute(); });
$("form").addEventListener("submit", e=>e.preventDefault());
PFL.init(TEXT,{print:true,titleKey:"title", ledeKey:"lede", sources:["irs","cfpb"]});
})();
