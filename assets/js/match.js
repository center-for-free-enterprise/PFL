/* C4FE PFL — Your paycheck, your 401(k), and the employer match.
   Text: TEXT. Example defaults: STATE (the Session 2 reading's example: $50,000, 100% match up to 3%).
   Taxes use the shared 2026 figures in site.js. */
(function () {
const PAYS = 26; // paid every two weeks
const TEXT = {
en:{
 title:"Paycheck and Employer Match",
 lede:"See how a retirement contribution changes your paycheck, how much your employer adds, and what that adds up to by retirement.",
 inputs_h:"Your job and your plan", example_note:"The Session 2 example: a $50,000 salary and a 100% match up to 3%. Change any of it.",
 g_job:"Your job", g_plan:"Your 401(k)", g_future:"The long run",
 salary:"Yearly salary (before taxes)",
 matchRate:"Employer match", h_matchRate:"How much your employer adds for each dollar you put in, up to the limit below.",
 matchCap:"Match limit (share of your salary)", h_matchCap:"The employer matches contributions only up to this share of your pay.",
 contrib:"You contribute (share of each paycheck)",
 type_trad:"Traditional 401(k): pre-tax", type_roth:"Roth 401(k): after-tax",
 startAge:"Age you start", retireAge:"Age you retire",
 growth:"Yearly growth of your investments", h_growth:"7% matches the example in the Session 2 reading. Real returns go up and down; see the Investing tool.",
 pct:v=>`${v}%`, cents:v=>`${v} cents per dollar`, age:v=>"age "+v,
 stub_h:"Your paycheck (every two weeks)",
 stub_gross:"Gross pay", stub_k_trad:"401(k), pre-tax", stub_k_roth:"Roth 401(k), after-tax", stub_fed:"Federal income tax", stub_fica:"Social Security and Medicare", stub_net:"Take-home pay",
 acct_h:"Into your account each paycheck", acct_you:"From you", acct_emp:"From your employer", acct_tot:"Total",
 msg_tax:(x,y,z)=>`Putting in <b>${x}</b> lowers your take-home pay by only <b>${y}</b>, because a pre-tax contribution also cuts your income tax by ${z}.`,
 msg_roth:"With a Roth, you pay income tax on the money now, so your take-home drops by the full contribution. In exchange, what you withdraw in retirement is tax-free (rules apply).",
 msg_full:x=>`<b>You're getting the full match:</b> ${x} a year that your employer adds on top of your pay.`,
 msg_miss:(c,x)=>`Contribute at least <b>${c}</b> to get the full match. Right now you're leaving <b>${x} a year</b> on the table.`,
 msg_none:"This employer doesn't offer a match. Contributing still lowers your taxes (traditional) or grows tax-free (Roth), and an IRA is another option.",
 lr_h:a=>`What it adds up to by age ${a}`,
 st_total:"Your account at retirement", st_you:"Built from your contributions", st_emp:"Built from the employer match", st_put:"What you put in from your pay",
 chart_h:"Your account as you get older", leg_you:"Your contributions and their growth", leg_emp:"The match and its growth", ax_age:"Age",
 assume:"Simplified: your salary stays the same, investments grow at a steady rate (real returns go up and down), and taxes use 2026 federal rates for a single filer with the standard deduction. The IRS sets yearly contribution limits. A traditional account is taxed when you withdraw; the employer match usually is too.",
 take_h:"What this shows",
 take:"An employer match is part of your pay. If you don't contribute enough to get all of it, you are turning down money your employer already set aside for you. With a traditional 401(k), the contribution costs your paycheck less than it puts in, because it lowers your taxes now; with a Roth, you pay the tax now and withdraw tax-free later, which often suits people early in their careers. Either way, starting with your first job gives the money the most years to grow.",
 read:"Read more in the Session 2 reading: the section on retirement accounts (401(k), IRA, and Roth)."
},
es:{
 title:"Cheque de pago y aportación del empleador",
 lede:"Descubre cómo una aportación para el retiro cambia tu cheque de pago, cuánto agrega tu empleador y cuánto suma todo eso al momento de retirarte.",
 inputs_h:"Tu empleo y tu plan", example_note:"El ejemplo de la Sesión 2: un salario de $50,000 y una aportación del empleador del 100% hasta el 3%. Puedes cambiar cualquier dato.",
 g_job:"Tu empleo", g_plan:"Tu 401(k)", g_future:"El largo plazo",
 salary:"Salario anual (antes de impuestos)",
 matchRate:"Aportación del empleador", h_matchRate:"Cuánto agrega tu empleador por cada dólar que tú aportas, hasta el límite de abajo.",
 matchCap:"Límite de la aportación (parte de tu salario)", h_matchCap:"El empleador iguala tus aportaciones solo hasta esta parte de tu sueldo.",
 contrib:"Lo que aportas (parte de cada cheque)",
 type_trad:"401(k) tradicional: antes de impuestos", type_roth:"401(k) Roth: después de impuestos",
 startAge:"Edad a la que empiezas", retireAge:"Edad a la que te retiras",
 growth:"Crecimiento anual de tus inversiones", h_growth:"7% coincide con el ejemplo de la lectura de la Sesión 2. Los rendimientos reales suben y bajan; consulta la herramienta de Inversión.",
 pct:v=>`${v}%`, cents:v=>`${v} centavos por dólar`, age:v=>v+" años",
 stub_h:"Tu cheque de pago (cada dos semanas)",
 stub_gross:"Pago bruto", stub_k_trad:"401(k), antes de impuestos", stub_k_roth:"401(k) Roth, después de impuestos", stub_fed:"Impuesto federal sobre la renta", stub_fica:"Seguro Social y Medicare", stub_net:"Ingreso neto",
 acct_h:"Lo que entra a tu cuenta en cada cheque", acct_you:"De ti", acct_emp:"De tu empleador", acct_tot:"Total",
 msg_tax:(x,y,z)=>`Aportar <b>${x}</b> reduce tu ingreso neto solo en <b>${y}</b>, porque una aportación antes de impuestos también baja tu impuesto sobre la renta en ${z}.`,
 msg_roth:"Con un Roth pagas el impuesto sobre ese dinero ahora, así que tu ingreso neto baja por el monto completo. A cambio, lo que retires en el retiro está libre de impuestos (aplican reglas).",
 msg_full:x=>`<b>Recibes la aportación completa:</b> ${x} al año que tu empleador agrega además de tu sueldo.`,
 msg_miss:(c,x)=>`Aporta al menos <b>${c}</b> para recibir la aportación completa. Ahora mismo estás dejando <b>${x} al año</b> sobre la mesa.`,
 msg_none:"Este empleador no ofrece aportación. Aportar igual baja tus impuestos (tradicional) o crece libre de impuestos (Roth), y una cuenta IRA es otra opción.",
 lr_h:a=>`Cuánto suma a los ${a} años`,
 st_total:"Tu cuenta al retirarte", st_you:"Formado por tus aportaciones", st_emp:"Formado por la aportación del empleador", st_put:"Lo que aportaste de tu sueldo",
 chart_h:"Tu cuenta con los años", leg_you:"Tus aportaciones y su crecimiento", leg_emp:"La aportación del empleador y su crecimiento", ax_age:"Edad",
 assume:"Simplificado: tu salario no cambia, las inversiones crecen a un ritmo constante (los rendimientos reales suben y bajan) y los impuestos usan las tasas federales de 2026 para una persona soltera con la deducción estándar. El IRS fija límites anuales de aportación. Una cuenta tradicional paga impuestos al retirar el dinero; la aportación del empleador normalmente también.",
 take_h:"Qué muestra esto",
 take:"La aportación del empleador es parte de tu sueldo. Si no aportas lo suficiente para recibirla completa, estás rechazando dinero que tu empleador ya apartó para ti. Con un 401(k) tradicional, la aportación le cuesta a tu cheque menos de lo que deposita, porque baja tus impuestos ahora; con un Roth pagas el impuesto hoy y retiras sin impuestos después, lo que suele convenir al inicio de la carrera. En ambos casos, empezar con tu primer empleo le da al dinero más años para crecer.",
 read:"Lee más en la lectura de la Sesión 2 (en inglés): la sección sobre cuentas para el retiro (401(k), IRA y Roth)."
}};

const STATE = {salary:50000, matchRate:100, matchCap:3, contrib:3, type:"trad", startAge:22, retireAge:65, growth:7};
const $ = id => document.getElementById(id);
const T = k => PFL.T(k), money = (v,c) => PFL.money(v,c);

function defs(){
  const L = PFL.L();
  return [{group:"g_job"},{k:"salary",kind:"money",step:1000},
    {k:"matchRate",kind:"range",min:0,max:100,step:25,unit:L.cents},{k:"matchCap",kind:"range",min:0,max:8,step:1,unit:L.pct},
    {group:"g_plan"},{k:"contrib",kind:"range",min:0,max:15,step:1,unit:L.pct},
    {group:"g_future"},{k:"startAge",kind:"range",min:16,max:40,step:1,unit:L.age},{k:"retireAge",kind:"range",min:55,max:70,step:1,unit:L.age},
    {k:"growth",kind:"range",min:3,max:9,step:0.5}];
}
function build(){
  PFL.buildFields($("fields"), defs(), STATE, T, k=>T("h_"+k), compute);
  const seg=document.createElement("div"); seg.className="seg"; seg.setAttribute("role","radiogroup");
  seg.innerHTML=["trad","roth"].map(t=>`<label><input type="radio" name="type" id="type-${t}" value="${t}" ${STATE.type===t?"checked":""}> ${T("type_"+t)}</label>`).join("");
  seg.querySelectorAll("input").forEach(i=>i.addEventListener("change",()=>{STATE.type=i.value;compute();}));
  $("f-contrib").closest(".field").after(seg);
}

function paycheck(S, c, type){
  const k = S*c/100, taxable = type==="trad" ? S-k : S;
  const fed = PFL.fedTax(taxable), fica = S*PFL.TAX.fica;
  return {gross:S/PAYS, k:k/PAYS, fed:fed/PAYS, fica:fica/PAYS, net:(S-k-fed-fica)/PAYS};
}
// Future value of a steady yearly amount paid in evenly every paycheck, at an effective yearly rate.
function fvPath(perPay, g, years){
  const r = Math.pow(1+g,1/PAYS)-1, out=[0]; let b=0;
  for(let y=1;y<=years;y++){ for(let p=0;p<PAYS;p++) b=b*(1+r)+perPay; out.push(b); }
  return out;
}

function compute(){
  const s=STATE, L=PFL.L();
  const pc=paycheck(s.salary,s.contrib,s.type), base=paycheck(s.salary,0,s.type);
  const emp=s.salary*Math.min(s.contrib,s.matchCap)/100*s.matchRate/100, empMax=s.salary*s.matchCap/100*s.matchRate/100;
  $("net").innerHTML=`${money(pc.net,true)}`;
  $("stub").innerHTML=
    `<dt>${L.stub_gross}</dt><dd>${money(pc.gross,true)}</dd>`+
    `<dt>${s.type==="trad"?L.stub_k_trad:L.stub_k_roth}</dt><dd class="minus">−${money(pc.k,true)}</dd>`+
    `<dt>${L.stub_fed}</dt><dd class="minus">−${money(pc.fed,true)}</dd>`+
    `<dt>${L.stub_fica}</dt><dd class="minus">−${money(pc.fica,true)}</dd>`+
    `<dt class="net">${L.stub_net}</dt><dd class="net">${money(pc.net,true)}</dd>`;
  $("acct").innerHTML=
    `<div class="stat"><span>${L.acct_you}</span><strong>${money(pc.k,true)}</strong></div>`+
    `<div class="stat"><span>${L.acct_emp}</span><strong>${money(emp/PAYS,true)}</strong></div>`+
    `<div class="stat"><span>${L.acct_tot}</span><strong>${money(pc.k+emp/PAYS,true)}</strong></div>`;

  const msgs=[];
  if(s.contrib>0){
    if(s.type==="trad"){ const drop=base.net-pc.net; msgs.push(`<div class="msg">${L.msg_tax(money(pc.k,true),money(drop,true),money(pc.k-drop,true))}</div>`); }
    else msgs.push(`<div class="msg">${L.msg_roth}</div>`);
  }
  if(empMax<=0) msgs.push(`<div class="msg">${L.msg_none}</div>`);
  else if(s.contrib>=s.matchCap) msgs.push(`<div class="msg good">${L.msg_full(money(empMax))}</div>`);
  else msgs.push(`<div class="msg bad">${L.msg_miss(PFL.pct(s.matchCap,0),money(empMax-emp))}</div>`);
  $("msgs").innerHTML=msgs.join("");

  const years=Math.max(1,s.retireAge-s.startAge), g=s.growth/100;
  const you=fvPath(pc.k,g,years), em=fvPath(emp/PAYS,g,years);
  $("lr-h").textContent=L.lr_h(s.retireAge);
  $("lr").innerHTML=
    `<div class="stat"><span>${L.st_total}</span><strong>${money(you[years]+em[years])}</strong></div>`+
    `<div class="stat"><span>${L.st_you}</span><strong>${money(you[years])}</strong></div>`+
    `<div class="stat"><span>${L.st_emp}</span><strong>${money(em[years])}</strong></div>`+
    `<div class="stat"><span>${L.st_put}</span><strong>${money(s.salary*s.contrib/100*years)}</strong></div>`;

  const a0=s.startAge, ys=[...Array(years+1).keys()];
  const f=PFL.frame({x0:a0,x1:a0+years,ymax:you[years]+em[years],xticks:PFL.ticks(a0,a0+years,7),xLabel:T("ax_age")});
  const top=ys.map(y=>[f.sx(a0+y),f.sy(you[y]+em[y])]), mid=ys.map(y=>[f.sx(a0+y),f.sy(you[y])]);
  const base0=[[f.sx(a0+years),f.base],[f.sx(a0),f.base]];
  $("chart").innerHTML=f.wrap(`<path class="area-b" d="${PFL.path(top.concat(mid.slice().reverse()))}Z"/><path class="area-a" d="${PFL.path(mid.concat(base0))}Z"/>`,T("chart_h"));
}

PFL.onChange(()=>{ build(); compute(); });
$("form").addEventListener("submit",e=>e.preventDefault());
PFL.init(TEXT,{print:true,titleKey:"title",ledeKey:"lede",sources:["irsret","dol"]});
})();
