/* C4FE PFL — Saving for a goal (car, home down payment, or your own goal).
   Text: TEXT below. Example defaults: STATE. */
(function () {
const TEXT = {
en:{
 title:"Saving for a Goal",
 lede:"Turn a goal into a monthly number: how much to save, for how long, to buy a car or make a down payment on a home.",
 tab_car:"A car", tab_home:"Home down payment", tab_custom:"Your own goal",
 inputs_h:"Your goal", example_note:"These are example numbers. Change any of them.",
 mode_date:"Reach it by a date", mode_amount:"Save a set amount each month",
 f_car_price:"Price of the car", f_home_price:"Price of the home", f_custom_price:"How much you need",
 h_car_price:"A reliable used car costs far less than a new one, and needs a smaller loan or none at all.",
 f_downPct:"Down payment", h_downPct:"10% to 20% is typical. Below 20% usually means paying PMI on the mortgage.",
 f_saved:"Already saved",
 f_apy:"Interest your savings earn (APY)", h_apy:"An example rate for a high-yield savings account. Rates change; check what banks and credit unions offer today.",
 f_growth:"How fast the price rises each year", h_growth:"Prices tend to go up while you save. This is the goal's own inflation.",
 f_years:"When you want it", f_monthly:"What you can save each month",
 years:n=>n===1?"1 year":n+" years",
 yearsMonths:(y,m)=>[y?(y===1?"1 year":y+" years"):"",m?(m===1?"1 month":m+" months"):""].filter(Boolean).join(", ")||"0 months",
 per_month:"/month",
 big_date:"Save this much every month", big_amount:"You reach your goal in",
 never:"Not within 50 years",
 st_today:"The goal today", st_then:"What it will cost then", st_in:"You put in", st_int:"Interest earns",
 msg_have:"<b>You already have enough.</b> Keep it in an insured savings account until you're ready.",
 msg_basic_date:(x,y)=>`In a basic savings account paying 0.5%, you'd need <b>${x}</b> a month instead of ${y}.`,
 msg_basic_amount:(t)=>`In a basic savings account paying 0.5%, it would take <b>${t}</b>.`,
 msg_race:"The price is rising faster than your savings earn, so every year you wait the goal moves further away. Starting sooner beats searching for a slightly better rate.",
 msg_short:"If the monthly amount doesn't fit your budget, you have three levers: more time, a less expensive goal, or a bigger monthly amount.",
 chart_h:"How your savings grow", leg_in:"Money you put in", leg_int:"Interest earned", leg_goal:"Goal (rising with prices)", ax_year:"Years from now",
 take_h:"What this shows",
 take:"A goal with a name, a price, and a date turns into a monthly amount you can put in your budget. Interest helps, and a high-yield account helps more, but over a few years the money you put in does most of the work. Prices also rise while you save, so aim for what the goal will cost when you get there, not what it costs today.",
 read:"Read more in your Session 1 materials: Section 3, “Saving with Purpose.”"
},
es:{
 title:"Ahorrar para una meta",
 lede:"Convierte una meta en una cifra mensual: cuánto ahorrar, y por cuánto tiempo, para comprar un auto o dar el enganche de una casa.",
 tab_car:"Un auto", tab_home:"Enganche de una casa", tab_custom:"Tu propia meta",
 inputs_h:"Tu meta", example_note:"Estos son números de ejemplo. Puedes cambiar cualquiera.",
 mode_date:"Lograrla para una fecha", mode_amount:"Ahorrar un monto fijo al mes",
 f_car_price:"Precio del auto", f_home_price:"Precio de la casa", f_custom_price:"Cuánto necesitas",
 h_car_price:"Un auto usado y confiable cuesta mucho menos que uno nuevo y requiere un préstamo menor, o ninguno.",
 f_downPct:"Enganche (pago inicial)", h_downPct:"Lo común es entre 10% y 20%. Con menos del 20% normalmente pagas PMI en la hipoteca.",
 f_saved:"Lo que ya ahorraste",
 f_apy:"Interés que gana tu ahorro (APY)", h_apy:"Una tasa de ejemplo para una cuenta de ahorro de alto rendimiento. Las tasas cambian; revisa lo que ofrecen hoy los bancos y las cooperativas de crédito.",
 f_growth:"Cuánto sube el precio cada año", h_growth:"Los precios suelen subir mientras ahorras. Es la inflación propia de tu meta.",
 f_years:"Cuándo la quieres", f_monthly:"Lo que puedes ahorrar al mes",
 years:n=>n===1?"1 año":n+" años",
 yearsMonths:(y,m)=>[y?(y===1?"1 año":y+" años"):"",m?(m===1?"1 mes":m+" meses"):""].filter(Boolean).join(" y ")||"0 meses",
 per_month:"/mes",
 big_date:"Ahorra esto cada mes", big_amount:"Alcanzas tu meta en",
 never:"No en menos de 50 años",
 st_today:"La meta hoy", st_then:"Lo que costará entonces", st_in:"Lo que aportas", st_int:"Lo que gana en intereses",
 msg_have:"<b>Ya tienes suficiente.</b> Guárdalo en una cuenta de ahorro asegurada hasta que estés listo.",
 msg_basic_date:(x,y)=>`En una cuenta de ahorro básica que paga 0.5%, necesitarías <b>${x}</b> al mes en lugar de ${y}.`,
 msg_basic_amount:(t)=>`En una cuenta de ahorro básica que paga 0.5%, tardarías <b>${t}</b>.`,
 msg_race:"El precio sube más rápido de lo que gana tu ahorro, así que cada año que esperas la meta se aleja más. Empezar antes vale más que buscar una tasa un poco mejor.",
 msg_short:"Si el monto mensual no cabe en tu presupuesto, tienes tres palancas: más tiempo, una meta más barata o un monto mensual mayor.",
 chart_h:"Cómo crece tu ahorro", leg_in:"Dinero que aportas", leg_int:"Intereses ganados", leg_goal:"Meta (sube con los precios)", ax_year:"Años a partir de hoy",
 take_h:"Qué muestra esto",
 take:"Una meta con nombre, precio y fecha se convierte en un monto mensual que puedes incluir en tu presupuesto. Los intereses ayudan, y una cuenta de alto rendimiento ayuda más, pero en pocos años el dinero que aportas hace casi todo el trabajo. Además, los precios suben mientras ahorras, así que apunta a lo que costará la meta cuando llegues, no a lo que cuesta hoy.",
 read:"Lee más en tus materiales de la Sesión 1: Sección 3, “Saving with Purpose.”"
}};

const STATE = {
  car:{price:12000, saved:500, apy:4.0, growth:2, mode:"date", years:2, monthly:300},
  home:{price:250000, downPct:10, saved:1000, apy:4.0, growth:3, mode:"date", years:5, monthly:400},
  custom:{price:5000, saved:0, apy:4.0, growth:0, mode:"date", years:2, monthly:200}
};
const BASIC_APY = 0.5, MAX_M = 600;
let type = "car";
const $ = id => document.getElementById(id);
const T = k => PFL.T(k), money = (v,c) => PFL.money(v,c);

function defs(){
  const s = STATE[type], L = PFL.L(), d = [{k:"price",kind:"money",step: type==="home"?5000:500}];
  if (type==="home") d.push({k:"downPct",kind:"range",min:3,max:25,step:1});
  d.push({k:"saved",kind:"money",step:100},{k:"apy",kind:"range",min:0,max:6,step:0.1},{k:"growth",kind:"range",min:0,max:8,step:0.5});
  d.push(s.mode==="date" ? {k:"years",kind:"range",min:1,max:10,step:1,unit:v=>L.years(v)} : {k:"monthly",kind:"money",step:25});
  return d;
}
const label = k => T(`f_${type}_${k}`) || T("f_"+k);
const hint = k => T(`h_${type}_${k}`) || T("h_"+k);
function build(){
  const s = STATE[type];
  $("mode").innerHTML = ["date","amount"].map(m=>`<label><input type="radio" name="mode" id="mode-${m}" value="${m}" ${s.mode===m?"checked":""}> ${T("mode_"+m)}</label>`).join("");
  $("mode").querySelectorAll("input").forEach(i=>i.addEventListener("change",()=>{ s.mode=i.value; build(); compute(); }));
  PFL.buildFields($("fields"), defs(), s, label, hint, compute);
}

function grow(saved, pmt, r, n){ return saved*Math.pow(1+r,n) + (r===0 ? pmt*n : pmt*(Math.pow(1+r,n)-1)/r); }
function needed(target, saved, r, n){
  const rest = target - saved*Math.pow(1+r,n);
  if (rest <= 0) return 0;
  return r===0 ? rest/n : rest*r/(Math.pow(1+r,n)-1);
}
function monthsTo(goal0, saved, pmt, r, gm){
  let b = saved;
  for (let m=0; m<=MAX_M; m++){ if (b >= goal0*Math.pow(1+gm,m)) return m; b = b*(1+r)+pmt; }
  return null;
}

function compute(){
  const s = STATE[type], L = PFL.L();
  const goal0 = type==="home" ? s.price*s.downPct/100 : s.price;
  const r = Math.pow(1+s.apy/100,1/12)-1, gm = Math.pow(1+s.growth/100,1/12)-1;
  const rb = Math.pow(1+BASIC_APY/100,1/12)-1;
  let n, pmt;
  const msgs = [];
  if (s.mode==="date"){
    n = s.years*12; pmt = needed(goal0*Math.pow(1+gm,n), s.saved, r, n);
    $("big-label").textContent = L.big_date;
    $("big").innerHTML = `${money(pmt)}<small>${L.per_month}</small>`;
    if (pmt>0) msgs.push(`<div class="msg">${L.msg_basic_date(money(needed(goal0*Math.pow(1+gm,n), s.saved, rb, n)), money(pmt))}</div>`);
  } else {
    pmt = s.monthly; n = monthsTo(goal0, s.saved, pmt, r, gm);
    $("big-label").textContent = L.big_amount;
    $("big").textContent = n===null ? L.never : L.yearsMonths(Math.floor(n/12), n%12);
    const nb = monthsTo(goal0, s.saved, pmt, rb, gm);
    if (n!==null && n>0) msgs.push(`<div class="msg">${L.msg_basic_amount(nb===null?L.never:L.yearsMonths(Math.floor(nb/12),nb%12))}</div>`);
    if (n===null) { msgs.push(`<div class="msg bad">${L.msg_short}</div>`); n = MAX_M; }
  }
  if (s.saved >= goal0) msgs.unshift(`<div class="msg good">${L.msg_have}</div>`);
  if (s.growth > s.apy) msgs.push(`<div class="msg">${L.msg_race}</div>`);

  const end = grow(s.saved, pmt, r, n), putIn = s.saved + pmt*n;
  $("stats").innerHTML =
    `<div class="stat"><span>${L.st_today}</span><strong>${money(goal0)}</strong></div>`+
    `<div class="stat"><span>${L.st_then}</span><strong>${money(goal0*Math.pow(1+gm,n))}</strong></div>`+
    `<div class="stat"><span>${L.st_in}</span><strong>${money(putIn)}</strong></div>`+
    `<div class="stat"><span>${L.st_int}</span><strong>${money(Math.max(0,end-putIn))}</strong></div>`;
  $("msgs").innerHTML = msgs.join("");
  draw(goal0, s.saved, pmt, r, gm, Math.max(n,12));
}

function draw(goal0, saved, pmt, r, gm, n){
  const pts = []; let b = saved;
  for (let m=0; m<=n; m++){ pts.push({m, bal:b, inn:saved+pmt*m, goal:goal0*Math.pow(1+gm,m)}); b = b*(1+r)+pmt; }
  const ymax = Math.max(...pts.map(p=>Math.max(p.bal,p.goal)));
  const yrs = n/12, f = PFL.frame({x0:0, x1:yrs, ymax, xticks:PFL.ticks(0,yrs,6), xLabel:T("ax_year")});
  const X = p => f.sx(p.m/12);
  const top = pts.map(p=>[X(p),f.sy(p.bal)]), mid = pts.map(p=>[X(p),f.sy(Math.min(p.inn,p.bal))]);
  const baseL = [[X(pts[pts.length-1]),f.base],[X(pts[0]),f.base]];
  const areaInt = PFL.path(top.concat(mid.slice().reverse()))+"Z";
  const areaIn = PFL.path(mid.concat(baseL))+"Z";
  const goal = PFL.path(pts.map(p=>[X(p),f.sy(p.goal)]));
  $("chart").innerHTML = f.wrap(`<path class="area-b" d="${areaInt}"/><path class="area-a" d="${areaIn}"/><path class="goal" d="${goal}"/>`, T("chart_h"));
}

function setType(t){
  type = t;
  try{ history.replaceState(null,"",(t==="car"?location.pathname:"#"+t)); }catch(e){}
  document.querySelectorAll(".tab").forEach(b=>b.setAttribute("aria-selected",String(b.dataset.type===t)));
  build(); compute();
}
document.querySelectorAll(".tab").forEach(b=>b.addEventListener("click",()=>setType(b.dataset.type)));
$("form").addEventListener("submit",e=>e.preventDefault());
const h=(location.hash||"").slice(1); if(STATE[h]) type=h;
document.querySelectorAll(".tab").forEach(b=>b.setAttribute("aria-selected",String(b.dataset.type===type)));
PFL.onChange(()=>{ build(); compute(); });
PFL.init(TEXT,{print:true,titleKey:"title",ledeKey:"lede",sources:["cfpb","investorcalc"]});
})();
