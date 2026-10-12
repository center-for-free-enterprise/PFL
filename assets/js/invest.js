/* C4FE PFL — Investing and compound growth.
   Returns are simulated, not a straight line: 500 paths with random yearly ups and downs.
   Assumptions live in ASSUME; text in TEXT; example defaults in STATE. */
(function () {
const ASSUME = {
  // "growth" is the typical (median) yearly compound growth, before inflation.
  // Calibrated so the default 80/20 mix grows about 7% a year, the figure used in the Session 2 reading.
  stocks:{growth:0.08, vol:0.18},
  bonds:{growth:0.03, vol:0.06},
  inflation:0.03, paths:500, seed:20261023, laterYears:10
};
const TEXT = {
en:{
 title:"Investing and Compound Growth",
 lede:"See how regular investing grows over decades, why starting early matters so much, what fees cost, and why the path is never a straight line.",
 inputs_h:"Your plan", example_note:"These are example numbers. Change any of them.",
 monthly:"Invested each month", start:"Already invested",
 startAge:"Age you start", retireAge:"Age you stop (retire)",
 stocks:"Mix of stocks and bonds", h_stocks:"More stocks: higher growth on average, bigger swings. More bonds: steadier, slower.",
 fee:"Yearly fund fee (expense ratio)", h_fee:"Broad index funds often charge under 0.1% a year. Many actively managed funds charge around 1%.",
 real:"Show in today's dollars (adjust for 3% inflation)",
 age:v=>"age "+v, mix:v=>`${v}% stocks / ${100-v}% bonds`,
 big:a=>`At age ${a}, a typical outcome is`,
 range:(lo,hi)=>`In 8 of 10 simulated paths, the account ends between <b>${lo}</b> and <b>${hi}</b>.`,
 st_in:"You put in", st_growth:"Growth from returns (typical path)", st_low:"A bad-luck outcome (1 in 10 paths do worse)",
 cmp_h:"Two choices that change the result", cmp_sub:"Same plan and the same simulated markets; one thing changed.",
 cmp_late:a=>`If you start at ${a} instead`, cmp_fee:f=>`If your fund charges ${f} a year`,
 cmp_less:x=>`${x} less`, cmp_more:x=>`${x} more`,
 msg_swings:n=>`In <b>${n} of 10</b> simulated paths, the account had at least one year when it fell more than 20%. Staying invested through those years is how the long-run average is earned.`,
 msg_nominal:"These are future dollars. Turn on “today's dollars” to see what the money would buy at today's prices.",
 msg_real:"Shown in today's dollars, assuming prices rise 3% a year.",
 chart_h:"Range of outcomes over time", leg_band:"8 of 10 paths fall in this band", leg_mid:"Typical path (median)", leg_in:"Money you put in", ax_age:"Age",
 assume:"Assumptions: in a typical year-over-year path, stocks grow about 8% a year and bonds about 3%, before inflation, so the default mix of 80% stocks and 20% bonds grows about 7% a year, the figure used in the Session 2 reading. Stocks swing much more (about 18% in a typical year) than bonds (about 6%). The past does not guarantee the future, and taxes are not included.",
 take_h:"What this shows",
 take:"Time does more of the work than the amount you invest, which is why starting early matters more than any other choice you control. Fees look small but compound against you for decades. And returns are never a straight line: the band shows how differently the same plan can turn out, which is why investing is for money you won't need for many years.",
 read:"Read more in your Session 2 materials: “The Power of Compound Interest — Revisited,” Section 5, “Diversification,” and the section on common investing mistakes."
},
es:{
 title:"Inversión e interés compuesto",
 lede:"Descubre cómo crece una inversión constante a lo largo de décadas, por qué importa tanto empezar temprano, cuánto cuestan las comisiones y por qué el camino nunca es una línea recta.",
 inputs_h:"Tu plan", example_note:"Estos son números de ejemplo. Puedes cambiar cualquiera.",
 monthly:"Inversión mensual", start:"Lo que ya tienes invertido",
 startAge:"Edad a la que empiezas", retireAge:"Edad a la que dejas de invertir (retiro)",
 stocks:"Mezcla de acciones y bonos", h_stocks:"Más acciones: mayor crecimiento en promedio, con altibajos más fuertes. Más bonos: más estable y más lento.",
 fee:"Comisión anual del fondo (expense ratio)", h_fee:"Los fondos indexados amplios suelen cobrar menos de 0.1% al año. Muchos fondos de gestión activa cobran alrededor de 1%.",
 real:"Mostrar en dólares de hoy (ajustado por 3% de inflación)",
 age:v=>v+" años", mix:v=>`${v}% acciones / ${100-v}% bonos`,
 big:a=>`A los ${a} años, un resultado típico es`,
 range:(lo,hi)=>`En 8 de cada 10 trayectorias simuladas, la cuenta termina entre <b>${lo}</b> y <b>${hi}</b>.`,
 st_in:"Lo que aportas", st_growth:"Crecimiento por rendimientos (trayectoria típica)", st_low:"Un resultado de mala suerte (1 de cada 10 trayectorias es peor)",
 cmp_h:"Dos decisiones que cambian el resultado", cmp_sub:"El mismo plan y los mismos mercados simulados; solo cambia una cosa.",
 cmp_late:a=>`Si empiezas a los ${a} años`, cmp_fee:f=>`Si tu fondo cobra ${f} al año`,
 cmp_less:x=>`${x} menos`, cmp_more:x=>`${x} más`,
 msg_swings:n=>`En <b>${n} de cada 10</b> trayectorias simuladas, la cuenta tuvo al menos un año en que cayó más de 20%. Mantenerse invertido durante esos años es lo que permite obtener el promedio de largo plazo.`,
 msg_nominal:"Estos son dólares del futuro. Activa “dólares de hoy” para ver lo que ese dinero compraría a precios actuales.",
 msg_real:"Mostrado en dólares de hoy, suponiendo que los precios suben 3% al año.",
 chart_h:"Rango de resultados a lo largo del tiempo", leg_band:"8 de cada 10 trayectorias caen en esta franja", leg_mid:"Trayectoria típica (mediana)", leg_in:"Dinero que aportas", ax_age:"Edad",
 assume:"Supuestos: en una trayectoria típica, las acciones crecen alrededor de 8% al año y los bonos alrededor de 3%, antes de inflación; así, la mezcla predeterminada de 80% acciones y 20% bonos crece cerca de 7% al año, la cifra que usa la lectura de la Sesión 2. Las acciones tienen altibajos mucho mayores (cerca de 18% en un año típico) que los bonos (cerca de 6%). El pasado no garantiza el futuro, y no se incluyen impuestos.",
 take_h:"Qué muestra esto",
 take:"El tiempo hace más trabajo que el monto que inviertes; por eso empezar temprano importa más que cualquier otra decisión que controlas. Las comisiones parecen pequeñas, pero se acumulan en tu contra durante décadas. Y los rendimientos nunca son una línea recta: la franja muestra qué tan distinto puede terminar el mismo plan, y por eso la inversión es para dinero que no necesitarás en muchos años.",
 read:"Lee más en tus materiales de la Sesión 2: “The Power of Compound Interest — Revisited,” Sección 5, “Diversification,” y la sección sobre errores comunes al invertir."
}};

const STATE = {monthly:100, start:0, startAge:18, retireAge:65, stocks:80, fee:0.10, real:false};
const $ = id => document.getElementById(id);
const T = k => PFL.T(k), money = (v,c) => PFL.money(v,c);

function defs(){
  const L = PFL.L();
  return [{k:"monthly",kind:"money",step:25},{k:"start",kind:"money",step:500},
    {k:"startAge",kind:"range",min:14,max:60,step:1,unit:L.age},{k:"retireAge",kind:"range",min:40,max:75,step:1,unit:L.age},
    {k:"stocks",kind:"range",min:0,max:100,step:10,unit:L.mix},{k:"fee",kind:"range",min:0,max:2,step:0.05,unit:v=>PFL.pct(v,2)},
    {k:"real",kind:"check"}];
}
// The simulation takes a moment, so wait until a slider settles before redrawing.
let timer=null;
function schedule(){ clearTimeout(timer); timer=setTimeout(compute, 90); }
function build(){ PFL.buildFields($("fields"), defs(), STATE, T, k=>T("h_"+k), schedule); }

// Seeded random numbers so the same inputs always give the same picture.
function rng(seed){ let a=seed>>>0; return ()=>{ a|=0; a=a+0x6D2B79F5|0; let t=Math.imul(a^a>>>15,1|a); t=t+Math.imul(t^t>>>7,61|t)^t; return ((t^t>>>14)>>>0)/4294967296; }; }
function gaussFactory(seed){ const u=rng(seed); let spare=null;
  return ()=>{ if(spare!==null){const s=spare;spare=null;return s;} let a,b,s; do{a=u()*2-1;b=u()*2-1;s=a*a+b*b;}while(s>=1||s===0);
    const m=Math.sqrt(-2*Math.log(s)/s); spare=b*m; return a*m; }; }

function portfolio(stockShare){
  const s=stockShare/100;
  const g=s*Math.log(1+ASSUME.stocks.growth)+(1-s)*Math.log(1+ASSUME.bonds.growth);
  const vol=Math.sqrt(Math.pow(s*ASSUME.stocks.vol,2)+Math.pow((1-s)*ASSUME.bonds.vol,2));
  const mu=g/12, sd=vol/Math.sqrt(12);
  return {mu, sd};
}
// Simulate yearly snapshots. skipYears delays the start (same random markets, later entry).
function simulate(years, monthly, start, fee, stocks, skipYears){
  const {mu,sd}=portfolio(stocks), feeM=Math.pow(1-fee/100,1/12), gauss=gaussFactory(ASSUME.seed);
  const P=ASSUME.paths, snaps=Array.from({length:years+1},()=>new Float64Array(P)); let bigDrop=0;
  for(let p=0;p<P;p++){
    let b=skipYears?0:start, dropped=false;
    for(let y=0;y<years;y++){
      let yr=1;
      for(let m=0;m<12;m++){
        const R=Math.exp(mu+sd*gauss())*feeM; yr*=R;
        b=b*R+(y>=skipYears?monthly:0);
        if(y===skipYears && m===0 && skipYears) b+=start;
      }
      if(yr<0.8) dropped=true;
      snaps[y+1][p]=b;
    }
    if(dropped) bigDrop++;
  }
  const q=(arr,f)=>{const s=Array.from(arr).sort((a,b)=>a-b);return s[Math.floor(f*(s.length-1))];};
  return {p10:snaps.map(a=>q(a,.1)), p50:snaps.map(a=>q(a,.5)), p90:snaps.map(a=>q(a,.9)), dropShare:bigDrop/P};
}

function compute(){
  const s=STATE, L=PFL.L();
  const years=Math.max(1, s.retireAge-s.startAge);
  const defl=y=> s.real ? Math.pow(1+ASSUME.inflation, y) : 1;
  const main=simulate(years, s.monthly, s.start, s.fee, s.stocks, 0);
  const late=Math.min(ASSUME.laterYears, years-1);
  const later=simulate(years, s.monthly, s.start, s.fee, s.stocks, late);
  const altFee = s.fee < 0.5 ? 1.0 : 0.05;
  const fees=simulate(years, s.monthly, s.start, altFee, s.stocks, 0);
  const D=defl(years), med=main.p50[years]/D;
  const putIn=s.start+s.monthly*12*years;

  $("big-label").textContent=L.big(s.retireAge);
  $("big").textContent=money(med);
  $("range").innerHTML=L.range(money(main.p10[years]/D), money(main.p90[years]/D));
  $("stats").innerHTML=
    `<div class="stat"><span>${L.st_in}</span><strong>${money(putIn)}</strong></div>`+
    `<div class="stat"><span>${L.st_growth}</span><strong>${money(Math.max(0,med-putIn))}</strong></div>`+
    `<div class="stat"><span>${L.st_low}</span><strong>${money(main.p10[years]/D)}</strong></div>`;

  const lateMed=later.p50[years]/D, feeMed=fees.p50[years]/D;
  const diff=(x)=> x<med ? L.cmp_less(money(med-x)) : L.cmp_more(money(x-med));
  $("compare").innerHTML=
    `<div class="stat"><span>${L.cmp_late(s.startAge+late)}</span><strong>${money(lateMed)}</strong><em>${diff(lateMed)}</em></div>`+
    `<div class="stat"><span>${L.cmp_fee(PFL.pct(altFee,2))}</span><strong>${money(feeMed)}</strong><em>${diff(feeMed)}</em></div>`;

  $("msgs").innerHTML=
    `<div class="msg">${L.msg_swings(Math.round(main.dropShare*10))}</div>`+
    `<div class="msg">${s.real?L.msg_real:L.msg_nominal}</div>`;

  // chart
  const a0=s.startAge, pts=[...Array(years+1).keys()];
  const v=(arr,y)=>arr[y]/defl(y);
  const contrib=y=>(s.start+s.monthly*12*y)/defl(y);
  const ymax=Math.max(...pts.map(y=>v(main.p90,y)));
  const f=PFL.frame({x0:a0,x1:a0+years,ymax,xticks:PFL.ticks(a0,a0+years,7),xLabel:T("ax_age")});
  const up=pts.map(y=>[f.sx(a0+y),f.sy(v(main.p90,y))]), lo=pts.map(y=>[f.sx(a0+y),f.sy(v(main.p10,y))]);
  const band=PFL.path(up.concat(lo.reverse()))+"Z";
  const mid=PFL.path(pts.map(y=>[f.sx(a0+y),f.sy(v(main.p50,y))]));
  const inn=PFL.path(pts.map(y=>[f.sx(a0+y),f.sy(contrib(y))]));
  $("chart").innerHTML=f.wrap(`<path class="fan" d="${band}"/><path class="ln ln-c" d="${inn}"/><path class="ln ln-b" d="${mid}"/>`, T("chart_h"));
}

PFL.onChange(()=>{ build(); compute(); });
$("form").addEventListener("submit",e=>e.preventDefault());
PFL.init(TEXT,{print:true,titleKey:"title",ledeKey:"lede",sources:["investor","investorcalc"]});
})();
