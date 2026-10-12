/* C4FE PFL — Loan calculator (car, student, mortgage).
   Text: LOAN_TEXT below. Example defaults: STATE below. Math: payment() and amortize(). */
(function () {
const LOAN_TEXT = {
en:{
 title:"Loan Calculator",
 lede:"See what a loan really costs: the monthly payment, the total interest, and how each payment splits between interest and the money you borrowed.",
 tab_car:"Car loan", tab_student:"Student loan", tab_mortgage:"Mortgage",
 inputs_h:"Your loan", example_note:"These are example numbers. Change any of them.",
 f_car_price:"Vehicle price", f_mortgage_price:"Home price",
 f_down:"Down payment", h_down:"Cash you pay up front. You borrow the rest.",
 f_amount:"Total amount borrowed", h_amount:"Add up the loans for all your years of school.",
 f_school:"Years until repayment starts", h_school:"Years in school plus any grace period.",
 f_unsub:"Unsubsidized loan (interest builds up while you're in school)",
 f_rate:"Interest rate (APR)", h_rate:"An example rate. Your real rate depends on the lender, your credit, and the market.",
 f_years:"Loan term",
 f_downPct:"Down payment", h_downPct:"Putting down less than 20% usually means paying PMI.",
 f_tax:"Property tax rate", h_tax:"Per year, as a % of the home's value. Texas has no state income tax but relatively high property taxes. Check your county appraisal district for real rates.",
 f_ins:"Homeowners insurance, per year",
 f_pmi:"PMI rate, per year", h_pmi:"Private mortgage insurance, as a % of the loan. It ends once you owe 78% of the home's original price.",
 f_extra:"Extra payment each month", h_extra:"Optional. All of it goes toward paying down what you owe.",
 years:n=>n===1?"1 year":n+" years", months:n=>n===1?"1 month":n+" months",
 yearsMonths:(y,m)=>[y?(y===1?"1 year":y+" years"):"",m?(m===1?"1 month":m+" months"):""].filter(Boolean).join(", "),
 mo_abbr:"mo.", per_month:"/month",
 monthly_pi:"Monthly payment (principal and interest)",
 monthly_total:"Total monthly housing cost",
 bd_pi:"Principal & interest", bd_tax:"Property tax", bd_ins:"Insurance", bd_pmi:"PMI", bd_tot:"Total",
 tila_apr:"Annual percentage rate", tila_apr_d:"The yearly cost of the loan",
 tila_fc:"Finance charge", tila_fc_d:"All the interest you pay",
 tila_af:"Amount financed", tila_af_d:"What you borrow",
 tila_tp:"Total of payments", tila_tp_d:"Everything you pay back",
 tila_note:"Under the federal Truth in Lending Act, lenders must show you these four numbers before you sign. This box follows that format. On a real loan the APR includes fees, so it is usually a little higher than the interest rate.",
 msg_accrued:(acc,bal,amt)=>`While you're in school, <b>${acc}</b> of interest builds up and is added to your loan. On the first day of repayment you owe <b>${bal}</b>, not ${amt}.`,
 msg_extra:(x,t,s)=>`Paying <b>${x}</b> extra each month pays the loan off <b>${t} sooner</b> and saves <b>${s}</b> in interest.`,
 msg_extra_try:"Try adding an extra monthly payment and watch the finance charge fall.",
 msg_pmi:(m,t,tot)=>`PMI adds <b>${m}</b> a month for about <b>${t}</b>, roughly <b>${tot}</b> in total, until you owe less than 78% of the home's price.`,
 msg_nopmi:"With 20% or more down, you skip PMI entirely.",
 chart_h:"Where your payments go, year by year",
 leg_int:"Interest (the cost of borrowing)", leg_pri:"Principal (pays down what you owe)",
 chart_note:"Early on, much of each payment is interest. That is why extra payments made early save the most.",
 ax_year:"Year",
 cmp_h:"Same loan, different terms", cmp_sub:"Same amount and rate, no extra payments.",
 cmp_term:"Term", cmp_monthly:"Monthly payment", cmp_interest:"Total interest", cmp_cur:"your choice",
 sched_h:"Year-by-year schedule",
 sch_year:"Year", sch_int:"Interest paid", sch_pri:"Principal paid", sch_bal:"Still owed",
 take_h:"What this shows",
 take_car:"A longer term lowers the monthly payment but raises the total interest, often by thousands of dollars. Cars also lose value quickly, so on a 6- or 7-year loan you can end up owing more than the car is worth. A reliable used car on a shorter loan is usually the better deal.",
 read_car:"Read more in your Session 1 materials: Section 4, “Understanding Debt” (Types of Debt and How Amortization Works).",
 take_student:"With unsubsidized loans, interest starts the day the money is paid out, so you graduate owing more than you borrowed. Borrow only the gap between your costs and your aid. A common rule of thumb: keep your total student debt below your expected first-year salary.",
 read_student:"Read more in your Session 2 materials: Section 3, “Student Loans.”",
 take_mortgage:"Owning a home costs more than the loan payment: there are property taxes, insurance, and PMI if you put down less than 20%. On a 30-year loan, the early payments are mostly interest. A bigger down payment or a shorter term cuts the total cost sharply.",
 read_mortgage:"Read more in your Session 2 materials: Section 3, “Mortgages — Buying a Home.”"
},
es:{
 title:"Calculadora de préstamos",
 lede:"Descubre cuánto cuesta realmente un préstamo: el pago mensual, el total de intereses y cómo se divide cada pago entre intereses y el dinero que pediste prestado.",
 tab_car:"Préstamo de auto", tab_student:"Préstamo estudiantil", tab_mortgage:"Hipoteca",
 inputs_h:"Tu préstamo", example_note:"Estos son números de ejemplo. Puedes cambiar cualquiera.",
 f_car_price:"Precio del vehículo", f_mortgage_price:"Precio de la casa",
 f_down:"Enganche (pago inicial)", h_down:"El dinero que pagas al principio. El resto lo pides prestado.",
 f_amount:"Monto total del préstamo", h_amount:"Suma los préstamos de todos tus años de estudio.",
 f_school:"Años hasta empezar a pagar", h_school:"Años de estudio más el período de gracia.",
 f_unsub:"Préstamo no subsidiado (los intereses se acumulan mientras estudias)",
 f_rate:"Tasa de interés (APR)", h_rate:"Una tasa de ejemplo. Tu tasa real depende del prestamista, tu historial de crédito y el mercado.",
 f_years:"Plazo del préstamo",
 f_downPct:"Enganche (pago inicial)", h_downPct:"Con menos del 20% de enganche normalmente pagas PMI.",
 f_tax:"Tasa de impuesto a la propiedad", h_tax:"Por año, como % del valor de la casa. Texas no tiene impuesto estatal sobre la renta, pero sus impuestos a la propiedad son relativamente altos. Consulta las tasas reales con el distrito de avalúo de tu condado.",
 f_ins:"Seguro de vivienda, por año",
 f_pmi:"Tasa de PMI, por año", h_pmi:"Seguro hipotecario privado, como % del préstamo. Termina cuando debes el 78% del precio original de la casa.",
 f_extra:"Pago extra cada mes", h_extra:"Opcional. Todo se aplica a reducir lo que debes.",
 years:n=>n===1?"1 año":n+" años", months:n=>n===1?"1 mes":n+" meses",
 yearsMonths:(y,m)=>[y?(y===1?"1 año":y+" años"):"",m?(m===1?"1 mes":m+" meses"):""].filter(Boolean).join(" y "),
 mo_abbr:"meses", per_month:"/mes",
 monthly_pi:"Pago mensual (capital e intereses)",
 monthly_total:"Costo mensual total de la vivienda",
 bd_pi:"Capital e intereses", bd_tax:"Impuesto a la propiedad", bd_ins:"Seguro", bd_pmi:"PMI", bd_tot:"Total",
 tila_apr:"Tasa de porcentaje anual", tila_apr_d:"El costo anual del préstamo",
 tila_fc:"Cargo financiero", tila_fc_d:"Todos los intereses que pagas",
 tila_af:"Monto financiado", tila_af_d:"Lo que pides prestado",
 tila_tp:"Total de pagos", tila_tp_d:"Todo lo que devuelves",
 tila_note:"Según la ley federal de Veracidad en los Préstamos (Truth in Lending Act), el prestamista debe mostrarte estas cuatro cifras antes de que firmes. Este cuadro sigue ese formato. En un préstamo real la APR incluye cargos, así que suele ser un poco más alta que la tasa de interés.",
 msg_accrued:(acc,bal,amt)=>`Mientras estudias, se acumulan <b>${acc}</b> de intereses que se suman a tu préstamo. El primer día de pago debes <b>${bal}</b>, no ${amt}.`,
 msg_extra:(x,t,s)=>`Si pagas <b>${x}</b> extra cada mes, terminas de pagar <b>${t} antes</b> y ahorras <b>${s}</b> en intereses.`,
 msg_extra_try:"Prueba agregar un pago extra mensual y observa cómo baja el cargo financiero.",
 msg_pmi:(m,t,tot)=>`El PMI suma <b>${m}</b> al mes durante unos <b>${t}</b>, alrededor de <b>${tot}</b> en total, hasta que debes menos del 78% del precio de la casa.`,
 msg_nopmi:"Con un enganche del 20% o más, no pagas PMI.",
 chart_h:"A dónde va tu dinero, año por año",
 leg_int:"Intereses (el costo de pedir prestado)", leg_pri:"Capital (reduce lo que debes)",
 chart_note:"Al principio, gran parte de cada pago son intereses. Por eso los pagos extra al inicio son los que más ahorran.",
 ax_year:"Año",
 cmp_h:"El mismo préstamo, distintos plazos", cmp_sub:"Mismo monto y misma tasa, sin pagos extra.",
 cmp_term:"Plazo", cmp_monthly:"Pago mensual", cmp_interest:"Total de intereses", cmp_cur:"tu elección",
 sched_h:"Calendario de pagos año por año",
 sch_year:"Año", sch_int:"Intereses pagados", sch_pri:"Capital pagado", sch_bal:"Saldo pendiente",
 take_h:"Qué muestra esto",
 take_car:"Un plazo más largo baja el pago mensual pero sube el total de intereses, a menudo por miles de dólares. Además, los autos pierden valor rápido, así que con un préstamo de 6 o 7 años puedes terminar debiendo más de lo que vale el auto. Un auto usado y confiable con un plazo más corto suele ser la mejor opción.",
 read_car:"Lee más en tus materiales de la Sesión 1: Sección 4, “Understanding Debt” (Types of Debt y How Amortization Works).",
 take_student:"En los préstamos no subsidiados, los intereses empiezan a correr desde el día en que recibes el dinero, así que te gradúas debiendo más de lo que pediste. Pide prestado solo la diferencia entre tus costos y tu ayuda financiera. Una regla práctica: que tu deuda estudiantil total no supere tu salario esperado del primer año.",
 read_student:"Lee más en tus materiales de la Sesión 2: Sección 3, “Student Loans.”",
 take_mortgage:"Ser dueño de una casa cuesta más que el pago del préstamo: hay impuestos a la propiedad, seguro y PMI si tu enganche es menor al 20%. En una hipoteca a 30 años, los primeros pagos son casi todo intereses. Un enganche mayor o un plazo más corto reducen mucho el costo total.",
 read_mortgage:"Lee más en tus materiales de la Sesión 2: Sección 3, “Mortgages — Buying a Home.”"
}};

const FIELDS = {
 car:[{k:"price",kind:"money",step:500},{k:"down",kind:"money",step:500},{k:"rate",kind:"pct",min:0,max:25,step:0.1},{k:"years",kind:"years",min:2,max:8},{k:"extra",kind:"money",step:10}],
 student:[{k:"amount",kind:"money",step:500},{k:"unsub",kind:"check"},{k:"school",kind:"years",min:0,max:7},{k:"rate",kind:"pct",min:0,max:15,step:0.1},{k:"years",kind:"years",min:5,max:25},{k:"extra",kind:"money",step:10}],
 mortgage:[{k:"price",kind:"money",step:5000},{k:"downPct",kind:"pct",min:0,max:50,step:1},{k:"rate",kind:"pct",min:0,max:12,step:0.05},{k:"years",kind:"years",min:10,max:30},{k:"tax",kind:"pct",min:0,max:4,step:0.1},{k:"ins",kind:"money",step:100},{k:"pmi",kind:"pct",min:0,max:1.5,step:0.05},{k:"extra",kind:"money",step:25}]
};
const TERMS = {car:[3,4,5,6,7], student:[10,15,20,25], mortgage:[15,20,30]};
// Example defaults shown when the page opens (illustrative, not current market rates).
const STATE = {
 car:{price:28000,down:3000,rate:7.5,years:5,extra:0},
 student:{amount:30000,unsub:true,school:4,rate:5.5,years:10,extra:0},
 mortgage:{price:250000,downPct:10,rate:6.5,years:30,tax:2.0,ins:1800,pmi:0.5,extra:0}
};
let type = "car";
const $ = id => document.getElementById(id);
const T = k => PFL.T(k);
const money = (v,c) => PFL.money(v,c);
const dpOf = step => step>=1 ? 0 : (String(step).split(".")[1]||"").length;

// Fixed-rate amortization. Optional PMI is charged while the balance exceeds 78% of the original price.
function payment(P,apr,n){const r=apr/100/12; if(P<=0) return 0; if(r===0) return P/n; return P*r/(1-Math.pow(1+r,-n));}
function amortize(P,apr,n,extra,pmi){
 const r=apr/100/12, pmt=payment(P,apr,n);
 let bal=P, m=0, ti=0, tp=0, pmiTot=0, pmiMonths=0; const years=[];
 while(bal>0.005 && m<n+1){
  m++;
  if(pmi && bal>0.78*pmi.price){pmiTot+=pmi.monthly; pmiMonths++;}
  const int=bal*r; let pri=pmt-int+extra; if(pri>bal) pri=bal;
  bal-=pri; ti+=int; tp+=int+pri;
  const yi=Math.ceil(m/12)-1; years[yi]=years[yi]||{int:0,pri:0,bal:0};
  years[yi].int+=int; years[yi].pri+=pri; years[yi].bal=Math.max(bal,0);
 }
 return {pmt,months:m,interest:ti,paid:tp,years,pmiTot,pmiMonths};
}

const fieldLabel = k => T(`f_${type}_${k}`) || T("f_"+k);
const outText = (f,v) => f.kind==="years" ? PFL.L().years(v) : PFL.pct(v,dpOf(f.step||1));

function buildFields(){
 const box=$("fields"); box.innerHTML="";
 FIELDS[type].forEach(f=>{
  const v=STATE[type][f.k], id="f-"+f.k, hint=T("h_"+f.k);
  const d=document.createElement("div"); d.className="field";
  if(f.kind==="check"){
   d.innerHTML=`<label class="check"><input type="checkbox" id="${id}" ${v?"checked":""}><span>${fieldLabel(f.k)}</span></label>`;
  }else if(f.kind==="money"){
   d.innerHTML=`<label class="lbl" for="${id}">${fieldLabel(f.k)}</label><div class="money"><span>$</span><input type="number" id="${id}" inputmode="decimal" min="0" step="${f.step}" value="${v}"></div>`;
  }else{
   d.innerHTML=`<label class="lbl" for="${id}"><span>${fieldLabel(f.k)}</span><output id="o-${f.k}">${outText(f,v)}</output></label><input type="range" id="${id}" min="${f.min}" max="${f.max}" step="${f.step||1}" value="${v}">`;
  }
  if(hint){const p=document.createElement("p");p.className="hint";p.textContent=hint;d.appendChild(p);}
  box.appendChild(d);
  const inp=d.querySelector("input");
  inp.addEventListener("input",()=>{
   let nv = f.kind==="check" ? inp.checked : parseFloat(inp.value);
   if(f.kind!=="check" && !isFinite(nv)) nv=0;
   if(f.kind==="money") nv=Math.max(0,nv);
   STATE[type][f.k]=nv;
   const o=$("o-"+f.k); if(o) o.textContent=outText(f,nv);
   if(f.k==="unsub") dimSchool();
   compute();
  });
 });
 if(type==="student") dimSchool();
}
function dimSchool(){ $("f-school").closest(".field").style.opacity = STATE.student.unsub ? "1" : ".5"; }

function loanInputs(s){
 if(type==="car"){const P=Math.max(0,s.price-s.down);return {P,financed:P,accrued:0};}
 if(type==="student"){const acc=s.unsub?s.amount*s.rate/100*s.school:0;return {P:s.amount+acc,financed:s.amount,accrued:acc};}
 const P=s.price*(1-s.downPct/100);return {P,financed:P,accrued:0};
}

function compute(){
 const s=STATE[type], L=PFL.L();
 const {P,financed,accrued}=loanInputs(s), n=Math.round(s.years*12);
 const pmi = type==="mortgage" && s.downPct<20 && s.pmi>0 ? {price:s.price,monthly:P*s.pmi/100/12} : null;
 const base=amortize(P,s.rate,n,0,pmi);
 const ex = s.extra>0 ? amortize(P,s.rate,n,s.extra,pmi) : null;
 const act = ex||base;

 const bd=$("breakdown");
 if(type==="mortgage"){
  const taxM=s.price*s.tax/100/12, insM=s.ins/12, pmiM=pmi?pmi.monthly:0, tot=base.pmt+taxM+insM+pmiM;
  $("monthly-label").textContent=L.monthly_total;
  $("monthly").innerHTML=`${money(tot)}<small>${L.per_month}</small>`;
  bd.hidden=false;
  bd.innerHTML=`<dt>${L.bd_pi}</dt><dd>${money(base.pmt)}</dd><dt>${L.bd_tax}</dt><dd>${money(taxM)}</dd><dt>${L.bd_ins}</dt><dd>${money(insM)}</dd>${pmi?`<dt>${L.bd_pmi}</dt><dd>${money(pmiM)}</dd>`:""}<dt class="tot">${L.bd_tot}</dt><dd class="tot">${money(tot)}</dd>`;
 }else{
  $("monthly-label").textContent=L.monthly_pi;
  $("monthly").innerHTML=`${money(base.pmt,true)}<small>${L.per_month}</small>`;
  bd.hidden=true; bd.innerHTML="";
 }

 // Truth-in-Lending-style box: reflects the plan as entered, including extra payments.
 const fc=act.interest+accrued;
 $("t-apr").textContent=PFL.pct(s.rate,2);
 $("t-fc").textContent=money(fc);
 $("t-af").textContent=money(financed);
 $("t-tp").textContent=money(financed+fc);

 const msgs=[];
 if(type==="student" && accrued>0) msgs.push(`<div class="msg">${L.msg_accrued(money(accrued),money(P),money(s.amount))}</div>`);
 if(type==="mortgage"){
  if(pmi) msgs.push(`<div class="msg">${L.msg_pmi(money(pmi.monthly),L.yearsMonths(Math.floor(act.pmiMonths/12),act.pmiMonths%12),money(act.pmiTot))}</div>`);
  else msgs.push(`<div class="msg">${L.msg_nopmi}</div>`);
 }
 if(ex){
  const saved=base.months-ex.months;
  msgs.push(`<div class="msg good">${L.msg_extra(money(s.extra),L.yearsMonths(Math.floor(saved/12),saved%12)||L.months(0),money(base.interest-ex.interest))}</div>`);
 }else if(P>0) msgs.push(`<div class="msg">${L.msg_extra_try}</div>`);
 $("msgs").innerHTML=msgs.join("");

 drawChart(act.years);

 let rows=`<thead><tr><th>${L.cmp_term}</th><th>${L.cmp_monthly}</th><th>${L.cmp_interest}</th></tr></thead><tbody>`;
 const terms=[...TERMS[type]]; if(!terms.includes(s.years)){terms.push(s.years);terms.sort((a,b)=>a-b);}
 terms.forEach(y=>{const a=amortize(P,s.rate,y*12,0,null), cur=y===s.years;
  const lbl=type==="car"?`${L.years(y)} (${y*12} ${L.mo_abbr})`:L.years(y);
  rows+=`<tr class="${cur?"cur":""}"><td>${lbl}${cur?`<span class="pill">${L.cmp_cur}</span>`:""}</td><td>${money(a.pmt,true)}</td><td>${money(a.interest+accrued)}</td></tr>`;});
 $("cmp").innerHTML=rows+"</tbody>";

 let sr=`<thead><tr><th>${L.sch_year}</th><th>${L.sch_int}</th><th>${L.sch_pri}</th><th>${L.sch_bal}</th></tr></thead><tbody>`;
 act.years.forEach((y,i)=>{sr+=`<tr><td>${i+1}</td><td>${money(y.int)}</td><td>${money(y.pri)}</td><td>${money(y.bal)}</td></tr>`;});
 $("sched").innerHTML=sr+"</tbody>";

 $("take").textContent=T("take_"+type);
 $("read").textContent=T("read_"+type);
}

function niceStep(max){const raw=max/4, p=Math.pow(10,Math.floor(Math.log10(raw||1))), m=raw/p; return (m<=1?1:m<=2?2:m<=2.5?2.5:m<=5?5:10)*p;}
function drawChart(years){
 const W=640,H=270,ml=64,mr=12,mt=12,mb=34, iw=W-ml-mr, ih=H-mt-mb;
 const n=years.length||1, max=Math.max(1,...years.map(y=>y.int+y.pri));
 const step=niceStep(max), top=Math.ceil(max/step)*step, sy=v=>mt+ih-(v/top)*ih;
 const bw=iw/n, gap=Math.min(6,bw*.25);
 let g="";
 for(let v=0;v<=top+1e-6;v+=step){const y=sy(v);g+=`<line class="grid" x1="${ml}" x2="${W-mr}" y1="${y}" y2="${y}"/><text class="ax" x="${ml-8}" y="${y+4}" text-anchor="end">${money(v)}</text>`;}
 const every = n<=10?1:n<=20?2:5;
 years.forEach((y,i)=>{
  const x=ml+i*bw+gap/2, w=bw-gap, yi=sy(y.int), yp=sy(y.int+y.pri);
  g+=`<rect class="bi" x="${x}" y="${yi}" width="${w}" height="${mt+ih-yi}"><title>${T("sch_year")} ${i+1}: ${T("sch_int")} ${money(y.int)}</title></rect>`;
  g+=`<rect class="bp" x="${x}" y="${yp}" width="${w}" height="${yi-yp}"><title>${T("sch_year")} ${i+1}: ${T("sch_pri")} ${money(y.pri)}</title></rect>`;
  if((i+1)%every===0||i===0) g+=`<text class="ax" x="${x+w/2}" y="${H-mb+18}" text-anchor="middle">${i+1}</text>`;
 });
 g+=`<text class="ax" x="${ml+iw/2}" y="${H-2}" text-anchor="middle">${T("ax_year")}</text>`;
 $("chart").innerHTML=`<svg class="chart" viewBox="0 0 ${W} ${H}" role="img" aria-label="${T("chart_h")}">${g}</svg>`;
}

function setType(t){
 type=t;
  try{ history.replaceState(null,"",(t==="car"?location.pathname:"#"+t)); }catch(e){}
 document.querySelectorAll(".tab").forEach(b=>b.setAttribute("aria-selected",String(b.dataset.type===t)));
 buildFields(); compute();
}
document.querySelectorAll(".tab").forEach(b=>b.addEventListener("click",()=>setType(b.dataset.type)));
$("form").addEventListener("submit",e=>e.preventDefault());
// Deep link: loans.html#student or #mortgage opens that tab.
const h=(location.hash||"").slice(1); if(FIELDS[h]) type=h;
document.querySelectorAll(".tab").forEach(b=>b.setAttribute("aria-selected",String(b.dataset.type===type)));
PFL.onChange(()=>{ buildFields(); compute(); });
PFL.init(LOAN_TEXT,{print:true,titleKey:"title",ledeKey:"lede",sources:["fsa","auto","home"]});
})();
