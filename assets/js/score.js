/* C4FE PFL — Credit score explorer.
   Teaches how the five FICO factors are weighted. It does NOT compute a real score:
   FICO's formula is private. RATE maps each situation to an illustrative 0–100 strength,
   and BANDS turns the weighted total into FICO's published band names. */
(function () {
const WEIGHTS = {pay:.35, util:.30, len:.15, mix:.10, inq:.10};   // FICO's published weights
const BANDS = [ // [minimum strength, key, FICO range]
  [90,"b_exc","800–850"],[80,"b_vg","740–799"],[65,"b_good","670–739"],[45,"b_fair","580–669"],[0,"b_poor","300–579"]];
const interp = (x, pts) => { if (x<=pts[0][0]) return pts[0][1];
  for (let i=1;i<pts.length;i++) if (x<=pts[i][0]) { const [x0,y0]=pts[i-1],[x1,y1]=pts[i]; return y0+(y1-y0)*(x-x0)/(x1-x0); }
  return pts[pts.length-1][1]; };
const RATE = {
  pay: late => [100,50,35,25,15][Math.min(late,4)],
  util: u => u===null ? 40 : interp(u, [[0,95],[9.99,100],[10,90],[29.99,80],[30,65],[49.99,55],[50,45],[74.99,35],[75,25],[100,10]]),
  len: y => interp(y, [[0,10],[1,20],[2,35],[4,55],[7,75],[10,90],[15,100]]),
  mix: n => [20,50,75,90,95][Math.min(n,4)],
  inq: n => [100,85,70,55,35][Math.min(n,4)]
};

const TEXT = {
en:{
 title:"Credit Score Explorer",
 lede:"See which habits move a credit score the most, how credit utilization works, and why a missed payment hurts more than almost anything else.",
 inputs_h:"Your credit profile", example_note:"Example: a young adult with one student credit card. Change any of it.",
 g_pay:"Payment history · 35%", g_util:"Credit utilization · 30%", g_len:"Length of credit history · 15%", g_mix:"Credit mix · 10%", g_inq:"New credit · 10%",
 late:"Late payments in the last 2 years", h_late:"A payment 30 or more days late can stay on your report for up to 7 years.",
 limit:"Total credit limit on all your cards", balance:"Total balance on your statements",
 close:"Close your oldest card", closeLimit:"That card's credit limit", h_closeLimit:"Closing a card removes its limit from your total.",
 years:"Years since your first account opened",
 types:"Types of credit you have", h_types:"For example: credit card, car loan, student loan, mortgage.",
 inq:"Applications for new credit in the last year", h_inq:"Each application usually adds a “hard inquiry.” Checking your own score does not.",
 nLate:n=>n===0?"none":n===1?"1 payment":n+" payments", nYears:n=>n===0?"less than 1 year":n===1?"1 year":n+" years",
 nTypes:n=>n===0?"none":n===1?"1 type":n+" types", nInq:n=>n===0?"none":n===1?"1 application":n+" applications",
 band_label:"This profile tends toward the band", band_range:r=>`FICO range ${r}`,
 band_note:"This is an illustration of how the factors combine, not a credit score. FICO's formula is private, and lenders use several versions of it.",
 b_exc:"Exceptional", b_vg:"Very good", b_good:"Good", b_fair:"Fair", b_poor:"Poor",
 fx_h:"The five factors", fx_sub:"Bigger weight, bigger effect. The bar shows how strong this profile is on each one.",
 f_pay:"Payment history", f_util:"Credit utilization", f_len:"Length of history", f_mix:"Credit mix", f_inq:"New credit",
 weight:w=>`${w}% of the score`,
 chip_s:"Strong", chip_ok:"OK", chip_w:"Needs work",
 util_h:"Your utilization", util_none:"No credit cards yet", util_of:(b,l)=>`${b} of ${l} in available credit`,
 util_30:x=>`Pay down <b>${x}</b> to get under 30%.`, util_10:x=>`Pay down <b>${x}</b> to get under 10%.`, util_ok:"You're under 10%. That is where utilization helps the most.",
 msg_late:"<b>On-time payments matter most.</b> Setting up automatic payments for at least the minimum is the easiest way to protect this factor.",
 msg_close:(b,a)=>`Closing that card raises your utilization from <b>${b}</b> to <b>${a}</b>, and it can shorten your credit history too. That's why closing old cards often lowers a score.`,
 msg_thin:"<b>No history yet</b> is called a “thin file.” Lenders have nothing to judge, which can be almost as limiting as bad credit. A secured card or a student card, paid in full every month, is a common way to start.",
 msg_inq:"Several applications in a short time can signal risk to lenders. Apply for new credit only when you need it.",
 take_h:"What this shows",
 take:"Two habits drive most of a credit score: paying every bill on time and keeping card balances low compared with your limits. The rest rewards patience: an older history and a sensible mix of credit come with time. Your score is built slowly and can be damaged quickly, so protect your payment history above everything else.",
 read:"Read more in the Session 1 reading: Section 6, “Your Credit Score.”"
},
es:{
 title:"Explorador del puntaje de crédito",
 lede:"Descubre qué hábitos mueven más un puntaje de crédito, cómo funciona el uso del crédito y por qué un pago atrasado afecta más que casi cualquier otra cosa.",
 inputs_h:"Tu perfil de crédito", example_note:"Ejemplo: un adulto joven con una tarjeta de crédito para estudiantes. Puedes cambiar cualquier dato.",
 g_pay:"Historial de pagos · 35%", g_util:"Uso del crédito · 30%", g_len:"Antigüedad del historial · 15%", g_mix:"Tipos de crédito · 10%", g_inq:"Crédito nuevo · 10%",
 late:"Pagos atrasados en los últimos 2 años", h_late:"Un pago con 30 días o más de atraso puede permanecer en tu reporte hasta 7 años.",
 limit:"Límite de crédito total de tus tarjetas", balance:"Saldo total de tus estados de cuenta",
 close:"Cerrar tu tarjeta más antigua", closeLimit:"Límite de crédito de esa tarjeta", h_closeLimit:"Cerrar una tarjeta resta su límite de tu total.",
 years:"Años desde que abriste tu primera cuenta",
 types:"Tipos de crédito que tienes", h_types:"Por ejemplo: tarjeta de crédito, préstamo de auto, préstamo estudiantil, hipoteca.",
 inq:"Solicitudes de crédito nuevo en el último año", h_inq:"Cada solicitud normalmente agrega una “consulta dura”. Revisar tu propio puntaje no la agrega.",
 nLate:n=>n===0?"ninguno":n===1?"1 pago":n+" pagos", nYears:n=>n===0?"menos de 1 año":n===1?"1 año":n+" años",
 nTypes:n=>n===0?"ninguno":n===1?"1 tipo":n+" tipos", nInq:n=>n===0?"ninguna":n===1?"1 solicitud":n+" solicitudes",
 band_label:"Este perfil tiende hacia la categoría", band_range:r=>`Rango FICO ${r}`,
 band_note:"Es una ilustración de cómo se combinan los factores, no un puntaje de crédito. La fórmula de FICO es privada y los prestamistas usan varias versiones.",
 b_exc:"Excepcional", b_vg:"Muy bueno", b_good:"Bueno", b_fair:"Regular", b_poor:"Malo",
 fx_h:"Los cinco factores", fx_sub:"Más peso, más efecto. La barra muestra qué tan fuerte es este perfil en cada uno.",
 f_pay:"Historial de pagos", f_util:"Uso del crédito", f_len:"Antigüedad del historial", f_mix:"Tipos de crédito", f_inq:"Crédito nuevo",
 weight:w=>`${w}% del puntaje`,
 chip_s:"Fuerte", chip_ok:"Aceptable", chip_w:"Por mejorar",
 util_h:"Tu uso del crédito", util_none:"Aún no tienes tarjetas de crédito", util_of:(b,l)=>`${b} de ${l} de crédito disponible`,
 util_30:x=>`Paga <b>${x}</b> para quedar por debajo de 30%.`, util_10:x=>`Paga <b>${x}</b> para quedar por debajo de 10%.`, util_ok:"Estás por debajo de 10%. Ahí es donde el uso del crédito más ayuda.",
 msg_late:"<b>Pagar a tiempo es lo que más importa.</b> Programar pagos automáticos de al menos el mínimo es la forma más fácil de proteger este factor.",
 msg_close:(b,a)=>`Cerrar esa tarjeta sube tu uso del crédito de <b>${b}</b> a <b>${a}</b>, y además puede acortar tu historial. Por eso cerrar tarjetas antiguas suele bajar el puntaje.`,
 msg_thin:"<b>No tener historial</b> se llama “expediente delgado”. Los prestamistas no tienen nada que evaluar, lo que puede limitar casi tanto como un mal crédito. Una tarjeta asegurada o de estudiante, pagada por completo cada mes, es una forma común de empezar.",
 msg_inq:"Varias solicitudes en poco tiempo pueden parecer una señal de riesgo. Solicita crédito nuevo solo cuando lo necesites.",
 take_h:"Qué muestra esto",
 take:"Dos hábitos explican la mayor parte del puntaje: pagar todas tus cuentas a tiempo y mantener saldos bajos en comparación con tus límites. El resto premia la paciencia: un historial más largo y una buena combinación de créditos llegan con el tiempo. El puntaje se construye despacio y se daña rápido, así que protege tu historial de pagos por encima de todo.",
 read:"Lee más en la lectura de la Sesión 1 (en inglés): Sección 6, “Your Credit Score.”"
}};

const STATE = {late:0, limit:1000, balance:200, close:false, closeLimit:500, years:1, types:1, inq:1};
const $ = id => document.getElementById(id);
const T = k => PFL.T(k), money = (v,c) => PFL.money(v,c);

function defs(){
  const L = PFL.L(), d = [
    {group:"g_pay"},{k:"late",kind:"range",min:0,max:6,step:1,unit:L.nLate},
    {group:"g_util"},{k:"limit",kind:"money",step:100},{k:"balance",kind:"money",step:50},{k:"close",kind:"check"}];
  if (STATE.close) d.push({k:"closeLimit",kind:"money",step:100});
  d.push({group:"g_len"},{k:"years",kind:"range",min:0,max:15,step:1,unit:L.nYears},
    {group:"g_mix"},{k:"types",kind:"range",min:0,max:4,step:1,unit:L.nTypes},
    {group:"g_inq"},{k:"inq",kind:"range",min:0,max:6,step:1,unit:L.nInq});
  return d;
}
function build(){ PFL.buildFields($("fields"), defs(), STATE, T, k=>T("h_"+k), k=>{ if(k==="close") build(); compute(); }); }

function compute(){
  const s=STATE, L=PFL.L();
  const limit = Math.max(0, s.limit - (s.close ? s.closeLimit : 0));
  const utilOf = lim => lim>0 ? Math.min(100, s.balance/lim*100) : (s.balance>0 ? 100 : null);
  const u = utilOf(limit), u0 = utilOf(s.limit);
  const r = {pay:RATE.pay(s.late), util:RATE.util(u), len:RATE.len(s.years), mix:RATE.mix(s.types), inq:RATE.inq(s.inq)};
  const total = Object.keys(WEIGHTS).reduce((a,k)=>a+WEIGHTS[k]*r[k],0);
  const band = BANDS.find(b=>total>=b[0]);
  $("band").textContent = L[band[1]];
  $("band-range").textContent = L.band_range(band[2]);
  $("band-scale").innerHTML = BANDS.slice().reverse().map(b=>`<span class="${b===band?"on":""}">${L[b[1]]}</span>`).join("");

  const situ = {pay:L.nLate(s.late), util: u===null ? L.util_none : PFL.pct(u,0), len:L.nYears(s.years), mix:L.nTypes(s.types), inq:L.nInq(s.inq)};
  const chip = v => v>=80 ? `<span class="chip s">${L.chip_s}</span>` : v>=55 ? `<span class="chip ok">${L.chip_ok}</span>` : `<span class="chip w">${L.chip_w}</span>`;
  $("factors").innerHTML = Object.keys(WEIGHTS).map(k=>
    `<div class="factor"><div class="factor-top"><b>${L["f_"+k]}</b><span class="sub" style="margin:0">${L.weight(WEIGHTS[k]*100)}</span></div>`+
    `<div class="factor-mid"><div class="track" style="height:${10+WEIGHTS[k]*40}px"><div class="fill" style="width:${r[k]}%;background:${r[k]>=80?"var(--good)":r[k]>=55?"var(--interest)":"var(--bad)"}"></div></div>${chip(r[k])}</div>`+
    `<span class="factor-situ">${situ[k]}</span></div>`).join("");

  if (u===null){ $("util").textContent="—"; $("util-sub").textContent=L.util_none; $("util-tips").innerHTML=""; }
  else {
    $("util").textContent=PFL.pct(u,0);
    $("util-sub").textContent=L.util_of(money(s.balance),money(limit));
    const tips=[];
    if (u>=30) tips.push(L.util_30(money(Math.max(0,s.balance-0.2999*limit))));
    if (u>=10) tips.push(L.util_10(money(Math.max(0,s.balance-0.0999*limit))));
    else tips.push(L.util_ok);
    $("util-tips").innerHTML=tips.map(t=>`<div class="msg${u<10?" good":""}">${t}</div>`).join("");
  }

  const msgs=[];
  if (s.late>0) msgs.push(`<div class="msg bad">${L.msg_late}</div>`);
  if (s.close && u0!==null && u!==null && u>u0) msgs.push(`<div class="msg">${L.msg_close(PFL.pct(u0,0),PFL.pct(u,0))}</div>`);
  if (s.years===0 && s.types===0) msgs.push(`<div class="msg">${L.msg_thin}</div>`);
  if (s.inq>=3) msgs.push(`<div class="msg">${L.msg_inq}</div>`);
  $("msgs").innerHTML=msgs.join("");
}

PFL.onChange(()=>{ build(); compute(); });
$("form").addEventListener("submit",e=>e.preventDefault());
PFL.init(TEXT,{print:true,titleKey:"title",ledeKey:"lede",sources:["acr","scores"]});
})();
