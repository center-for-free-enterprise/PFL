/* C4FE PFL — Credit cards: the minimum payment trap.
   Text: TEXT. Example defaults: STATE. Minimum payment rule: MIN_RULE. */
(function () {
// A common issuer formula: 1% of the balance plus that month's interest, or $25, whichever is more.
const MIN_RULE = {pctOfBalance:0.01, floor:25};
const TEXT = {
en:{
 title:"Credit Cards",
 lede:"See what happens when you pay only the minimum on a credit card balance, and how much a bigger payment saves.",
 inputs_h:"Your card", example_note:"These are example numbers. Change any of them.",
 balance:"Balance on the card", h_balance:"Assumes you stop using the card and add no new charges.",
 apr:"Interest rate (APR)", h_apr:"Card rates are often between 18% and 29% a year.",
 payment:"What you pay each month",
 years:n=>n===1?"1 year":n+" years",
 yearsMonths:(y,m)=>[y?(y===1?"1 year":y+" years"):"",m?(m===1?"1 month":m+" months"):""].filter(Boolean).join(", ")||"under 1 month",
 big_label:"Paying only the minimum, you're debt-free in",
 big_sub:x=>`and pay <b>${x}</b> in interest on top of what you borrowed.`,
 first:(m,i)=>`This month's minimum is <b>${m}</b>. Of that, <b>${i}</b> is interest.`,
 ca_warn_h:"Minimum payment warning:",
 ca_warn:"If you make only the minimum payment each period, you will pay more in interest and it will take you longer to pay off your balance.",
 ca_cap:"Credit card statements must show a box like this one under the federal Credit CARD Act of 2009.",
 ca_pay:"If you make no additional charges and each month you pay…", ca_time:"You will pay off the balance in about…", ca_total:"And you will pay an estimated total of…", ca_int:"Of that, interest",
 row_min:"Only the minimum payment", row_yours:x=>`${x} (your payment)`, row_36:x=>`${x} (paid off in 3 years)`,
 never:"Never: the payment doesn't cover the interest",
 msg_never:"Your payment is smaller than the interest charged each month, so the balance never goes down. Pay more than the interest, or the debt only grows.",
 msg_save:(t,x)=>`Paying your amount instead of the minimum gets you out <b>${t} sooner</b> and saves <b>${x}</b> in interest.`,
 msg_full:"Pay the full statement balance every month and you pay <b>$0</b> in interest. The minimum is the least you can pay without a late fee, not a target.",
 chart_h:"What you still owe, month by month", leg_min:"Minimum only", leg_yours:"Your payment", leg_36:"3-year payoff", ax_year:"Years from now",
 assume:"Simplified: interest is charged monthly at the APR divided by 12. Real cards charge daily interest on the average balance and may add fees.",
 take_h:"What this shows",
 take:"Minimum payments are set low on purpose. They shrink as the balance shrinks, so most of each payment goes to interest and the debt lasts for years. A fixed payment well above the minimum ends the debt much faster, and paying the full balance every month means the card costs nothing.",
 read:"Read more in the Session 1 reading: Section 5, “Credit Cards — Friend or Enemy?”"
},
es:{
 title:"Tarjetas de crédito",
 lede:"Descubre qué pasa cuando pagas solo el mínimo de tu tarjeta de crédito y cuánto ahorras con un pago mayor.",
 inputs_h:"Tu tarjeta", example_note:"Estos son números de ejemplo. Puedes cambiar cualquiera.",
 balance:"Saldo de la tarjeta", h_balance:"Supone que dejas de usar la tarjeta y no haces compras nuevas.",
 apr:"Tasa de interés (APR)", h_apr:"Las tasas de las tarjetas suelen estar entre 18% y 29% al año.",
 payment:"Lo que pagas cada mes",
 years:n=>n===1?"1 año":n+" años",
 yearsMonths:(y,m)=>[y?(y===1?"1 año":y+" años"):"",m?(m===1?"1 mes":m+" meses"):""].filter(Boolean).join(" y ")||"menos de 1 mes",
 big_label:"Pagando solo el mínimo, terminas de pagar en",
 big_sub:x=>`y pagas <b>${x}</b> en intereses además de lo que pediste prestado.`,
 first:(m,i)=>`El pago mínimo de este mes es <b>${m}</b>. De eso, <b>${i}</b> son intereses.`,
 ca_warn_h:"Advertencia sobre el pago mínimo:",
 ca_warn:"Si haces solo el pago mínimo en cada periodo, pagarás más intereses y tardarás más en liquidar tu saldo.",
 ca_cap:"Los estados de cuenta de las tarjetas deben mostrar un cuadro como este según la ley federal Credit CARD Act de 2009.",
 ca_pay:"Si no haces cargos nuevos y cada mes pagas…", ca_time:"Liquidarás el saldo en aproximadamente…", ca_total:"Y pagarás un total estimado de…", ca_int:"De eso, intereses",
 row_min:"Solo el pago mínimo", row_yours:x=>`${x} (tu pago)`, row_36:x=>`${x} (liquidado en 3 años)`,
 never:"Nunca: el pago no cubre los intereses",
 msg_never:"Tu pago es menor que los intereses que se cobran cada mes, así que el saldo nunca baja. Paga más que los intereses o la deuda solo crecerá.",
 msg_save:(t,x)=>`Si pagas tu monto en lugar del mínimo, terminas <b>${t} antes</b> y ahorras <b>${x}</b> en intereses.`,
 msg_full:"Si pagas el saldo total del estado de cuenta cada mes, pagas <b>$0</b> de intereses. El mínimo es lo menos que puedes pagar sin cargo por atraso, no una meta.",
 chart_h:"Lo que todavía debes, mes a mes", leg_min:"Solo el mínimo", leg_yours:"Tu pago", leg_36:"Liquidar en 3 años", ax_year:"Años a partir de hoy",
 assume:"Simplificado: el interés se cobra cada mes con la APR dividida entre 12. Las tarjetas reales cobran interés diario sobre el saldo promedio y pueden agregar cargos.",
 take_h:"Qué muestra esto",
 take:"Los pagos mínimos se fijan bajos a propósito. Bajan a medida que baja el saldo, así que la mayor parte de cada pago se va a intereses y la deuda dura años. Un pago fijo bastante mayor que el mínimo termina la deuda mucho antes, y pagar el saldo total cada mes significa que la tarjeta no te cuesta nada.",
 read:"Lee más en la lectura de la Sesión 1 (en inglés): Sección 5, “Credit Cards — Friend or Enemy?”"
}};

const STATE = {balance:1000, apr:24, payment:100};
const MAX_M = 600;
const $ = id => document.getElementById(id);
const T = k => PFL.T(k), money = (v,c) => PFL.money(v,c);

function defs(){ return [{k:"balance",kind:"money",step:100},{k:"apr",kind:"range",min:0,max:36,step:0.5},{k:"payment",kind:"money",step:10}]; }
function build(){ PFL.buildFields($("fields"), defs(), STATE, T, k=>T("h_"+k), compute); }

const minPay = (bal,int) => Math.min(bal+int, Math.max(MIN_RULE.floor, bal*MIN_RULE.pctOfBalance+int));
// payFn(balance, interest) -> payment. Returns months, interest, total paid, and the balance path.
function run(B, apr, payFn){
  const r=apr/100/12; let b=B, m=0, ti=0, tp=0; const path=[b];
  while(b>0.005 && m<MAX_M){
    const int=b*r, pay=Math.min(b+int, payFn(b,int));
    if(pay<=int+1e-9) return {never:true, path};
    b=b+int-pay; ti+=int; tp+=pay; m++; path.push(Math.max(b,0));
  }
  return {never:b>0.005, months:m, interest:ti, total:tp, path};
}
function pmt36(B,apr){ const r=apr/100/12, n=36; return r===0 ? B/n : B*r/(1-Math.pow(1+r,-n)); }

function compute(){
  const s=STATE, L=PFL.L(), r=s.apr/100/12;
  const min=run(s.balance,s.apr,minPay);
  const yours=run(s.balance,s.apr,()=>s.payment);
  const p36=pmt36(s.balance,s.apr), three=run(s.balance,s.apr,()=>p36);
  const ym = m => L.yearsMonths(Math.floor(m/12), m%12);

  if(min.never){ $("big").textContent=L.never; $("big-sub").innerHTML=""; }
  else { $("big").textContent=ym(min.months); $("big-sub").innerHTML=L.big_sub(money(min.interest)); }
  const int0=s.balance*r; $("first").innerHTML=s.balance>0?L.first(money(minPay(s.balance,int0),true),money(int0,true)):"";

  const row=(cls,label,res)=>`<tr class="${cls}"><td>${label}</td><td>${res.never?L.never:ym(res.months)}</td><td>${res.never?"—":money(res.total)}</td><td>${res.never?"—":money(res.interest)}</td></tr>`;
  $("cardact").innerHTML=
    `<thead><tr><th>${L.ca_pay}</th><th>${L.ca_time}</th><th>${L.ca_total}</th><th>${L.ca_int}</th></tr></thead><tbody>`+
    row("min",L.row_min,min)+row("",L.row_yours(money(s.payment)),yours)+row("",L.row_36(money(p36)),three)+"</tbody>";

  const msgs=[];
  if(yours.never && s.balance>0) msgs.push(`<div class="msg bad">${L.msg_never}</div>`);
  else if(!min.never && !yours.never && yours.months<min.months) msgs.push(`<div class="msg good">${L.msg_save(ym(min.months-yours.months),money(min.interest-yours.interest))}</div>`);
  msgs.push(`<div class="msg">${L.msg_full}</div>`);
  $("msgs").innerHTML=msgs.join("");

  // chart: balance paths
  const series=[[min,"ln-c"],[yours,"ln-b"],[three,"ln-a"]];
  const months=Math.max(12,...series.map(([x])=>x.path.length-1));
  const f=PFL.frame({x0:0,x1:months/12,ymax:Math.max(s.balance,...series.map(([x])=>Math.max(...x.path))),xticks:PFL.ticks(0,months/12,6),xLabel:T("ax_year")});
  const lines=series.map(([x,c])=>`<path class="ln ${c}" d="${PFL.path(x.path.map((b,i)=>[f.sx(i/12),f.sy(b)]))}"/>`).join("");
  $("chart").innerHTML=f.wrap(lines,T("chart_h"));
}

PFL.onChange(()=>{ build(); compute(); });
$("form").addEventListener("submit",e=>e.preventDefault());
PFL.init(TEXT,{print:true,titleKey:"title",ledeKey:"lede",sources:["cards","cfpb"]});
})();
