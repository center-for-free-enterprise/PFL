"""Figures for the session readings, drawn as inline SVG/HTML so they stay sharp, follow the
site's light/dark colors, and print cleanly in the PDFs. Each function returns (html, caption).
Numbers are computed here, not typed in, so they stay consistent with the text."""
from html import escape


def money(v, cents=False):
    return f"${v:,.2f}" if cents else f"${v:,.0f}"


def svg(w, h, body, label):
    return (f'<svg class="fig-svg" viewBox="0 0 {w} {h}" role="img" aria-label="{escape(label)}" '
            f'xmlns="http://www.w3.org/2000/svg">{body}</svg>')


def nice_step(mx, n=4):
    import math
    raw = mx / n
    p = 10 ** math.floor(math.log10(raw))
    m = raw / p
    return (1 if m <= 1 else 2 if m <= 2 else 2.5 if m <= 2.5 else 5 if m <= 5 else 10) * p


# ---------------------------------------------------------------- Session 1
TAX = dict(std=16100, brackets=[(12400, .10), (50400, .12), (105700, .22)], ss=.062, med=.0145)


def fed_tax(gross):
    taxable, tax, lo = max(0, gross - TAX["std"]), 0, 0
    for hi, r in TAX["brackets"]:
        if taxable > lo:
            tax += (min(taxable, hi) - lo) * r
        lo = hi
    return tax


def paystub():
    pays, n = 26, 17
    gross = round(40000 / pays, 2)
    fed = round(fed_tax(40000) / pays, 2)
    ss, med, health = round(gross * TAX["ss"], 2), round(gross * TAX["med"], 2), 50.00
    rows = [("Federal income tax", fed), ("Social Security (6.2%)", ss), ("Medicare (1.45%)", med),
            ("Texas state income tax", 0.0), ("Health insurance", health)]
    ded = round(sum(v for _, v in rows), 2)
    net = round(gross - ded, 2)
    r = lambda a, b, c: f"<tr><td>{a}</td><td>{b}</td><td>{c}</td></tr>"
    body = "".join(r(k, money(v, True), money(v * n, True)) for k, v in rows)
    html = f'''<div class="stub-doc" role="group" aria-label="Sample pay stub">
  <div class="stub-top"><b>Your Employer, Inc.</b><span>Earnings statement</span></div>
  <dl class="stub-meta">
    <div><dt>Employee</dt><dd>Jordan Rivera</dd></div><div><dt>SSN</dt><dd>XXX-XX-1234</dd></div>
    <div><dt>Pay period</dt><dd>Aug 17 – Aug 30, 2026</dd></div><div><dt>Pay date</dt><dd>Sep 4, 2026</dd></div>
  </dl>
  <div class="stub-tables">
    <table><thead><tr><th>Earnings</th><th>This period</th><th>Year to date</th></tr></thead>
      <tbody><tr><td>Regular pay</td><td>{money(gross, True)}</td><td>{money(gross * n, True)}</td></tr></tbody>
      <tfoot><tr><td>Gross pay</td><td>{money(gross, True)}</td><td>{money(gross * n, True)}</td></tr></tfoot></table>
    <table><thead><tr><th>Deductions</th><th>This period</th><th>Year to date</th></tr></thead>
      <tbody>{body}</tbody>
      <tfoot><tr><td>Total deductions</td><td>{money(ded, True)}</td><td>{money(ded * n, True)}</td></tr></tfoot></table>
  </div>
  <div class="stub-net"><span>Net pay</span><b>{money(net, True)}</b><span class="ytd">Year to date: {money(net * n, True)}</span></div>
</div>'''
    cap = ("A sample pay stub: a $40,000 salary paid every two weeks, with 2026 federal withholding for a single filer "
           "and a $50 health insurance deduction. Real stubs mask most of your Social Security number, as here.")
    return html, cap


def takehome():
    g = 40000
    parts = [("Federal income tax", fed_tax(g), "c-orange"), ("Social Security", g * TAX["ss"], "c-navy"),
             ("Medicare", g * TAX["med"], "c-cool")]
    net = g - sum(v for _, v, _ in parts)
    parts.append(("Take-home pay", net, "c-sky"))
    W, H, x0, x1, y, bh = 720, 150, 10, 710, 20, 46
    x, segs, legend = x0, "", ""
    for i, (name, v, cls) in enumerate(parts):
        w = (x1 - x0) * v / g
        segs += f'<rect class="{cls}" x="{x:.1f}" y="{y}" width="{w:.1f}" height="{bh}"/>'
        if w > 70:
            segs += f'<text class="on-fill" x="{x + 10:.1f}" y="{y + 29}">{v / g * 100:.1f}%</text>'
        x += w
    lx = x0
    for name, v, cls in parts:
        legend += (f'<rect class="{cls}" x="{lx}" y="96" width="14" height="14" rx="2"/>'
                   f'<text class="lab" x="{lx + 20}" y="108">{name}</text>'
                   f'<text class="val" x="{lx + 20}" y="128">{money(v)} a year</text>')
        lx += 178
    return svg(W, H, segs + legend, "Where a $40,000 salary goes"), \
        "Where a $40,000 salary goes in 2026: about 86% reaches your bank account. Texas has no state income tax."


def compound():
    W, H, ml, mr, mt, mb = 720, 300, 64, 110, 16, 40
    ages = list(range(18, 66))
    a = [1000 * 1.07 ** (t - 18) for t in ages]
    b = [None if t < 35 else 1000 * 1.07 ** (t - 35) for t in ages]
    top = max(a); step = nice_step(top); top = -(-top // step) * step
    sx = lambda t: ml + (t - 18) / 47 * (W - ml - mr)
    sy = lambda v: mt + (H - mt - mb) * (1 - v / top)
    g = ""
    v = 0
    while v <= top + 1:
        g += f'<line class="grid" x1="{ml}" x2="{W - mr}" y1="{sy(v):.1f}" y2="{sy(v):.1f}"/><text class="ax" x="{ml - 8}" y="{sy(v) + 4:.1f}" text-anchor="end">{money(v)}</text>'
        v += step
    for t in (18, 25, 35, 45, 55, 65):
        g += f'<text class="ax" x="{sx(t):.1f}" y="{H - mb + 20}" text-anchor="middle">{t}</text>'
    g += f'<text class="ax" x="{(ml + W - mr) / 2:.1f}" y="{H - 4}" text-anchor="middle">Age</text>'
    pa = " ".join(f"{sx(t):.1f},{sy(v):.1f}" for t, v in zip(ages, a))
    pb = " ".join(f"{sx(t):.1f},{sy(v):.1f}" for t, v in zip(ages, b) if v is not None)
    g += f'<polyline class="ln c-orange-s" points="{pa}"/><polyline class="ln c-navy-s" points="{pb}"/>'
    g += f'<circle class="c-orange" cx="{sx(65):.1f}" cy="{sy(a[-1]):.1f}" r="5"/><circle class="c-navy" cx="{sx(65):.1f}" cy="{sy(b[-1]):.1f}" r="5"/>'
    g += (f'<text class="lab" x="{sx(65) + 10:.1f}" y="{sy(a[-1]) - 2:.1f}">Saved at 18</text><text class="val strong" x="{sx(65) + 10:.1f}" y="{sy(a[-1]) + 16:.1f}">{money(a[-1])}</text>'
          f'<text class="lab" x="{sx(65) + 10:.1f}" y="{sy(b[-1]) - 2:.1f}">Saved at 35</text><text class="val strong" x="{sx(65) + 10:.1f}" y="{sy(b[-1]) + 16:.1f}">{money(b[-1])}</text>')
    return svg(W, H, g, "The power of starting early"), \
        "The power of starting early: the same $1,000 deposit at the same 7% yearly return, left until age 65. Starting at 18 ends with about three times as much."


def goals():
    W, H = 720, 190
    x0, x1 = 20, 700
    seg = [(0, 2, "c-orange", "Short-term", "1–2 years"), (2, 10, "c-navy", "Medium-term", "2–10 years"),
           (10, 14, "c-cool", "Long-term", "10+ years")]
    sx = lambda yrs: x0 + yrs / 14 * (x1 - x0)
    g = ""
    for a, b, cls, name, rng in seg:
        g += (f'<rect class="{cls}" x="{sx(a):.1f}" y="10" width="{sx(b) - sx(a) - 2:.1f}" height="56"/>'
              f'<text class="on-fill strong" x="{(sx(a) + sx(b)) / 2:.1f}" y="34" text-anchor="middle">{name.upper()}</text>'
              f'<text class="on-fill" x="{(sx(a) + sx(b)) / 2:.1f}" y="54" text-anchor="middle">{rng}</text>')
    g += f'<line class="axis" x1="{x0}" x2="{x1}" y1="86" y2="86"/>'
    for yrs, lab in ((0, "Now"), (1, "1 yr"), (2, "2 yrs"), (5, "5 yrs"), (10, "10 yrs")):
        g += f'<circle class="c-navy" cx="{sx(yrs):.1f}" cy="86" r="4"/><text class="ax" x="{sx(yrs):.1f}" y="104" text-anchor="middle">{lab}</text>'
    ex = [((0, 2), ["New laptop", "Car repair fund", "Emergency fund"]), ((2, 10), ["Car down payment", "A year of college", "First home down payment"]),
          ((10, 14), ["Retirement"])]
    for (a, b), items in ex:
        for i, it in enumerate(items):
            g += f'<text class="lab" x="{(sx(a) + sx(b)) / 2:.1f}" y="{130 + i * 20}" text-anchor="middle">{it}</text>'
    return svg(W, H, g, "Savings goals by time horizon"), \
        "Savings goals by time horizon. Short- and medium-term goals belong in a savings account; long-term goals benefit most from investing (Session 2)."


def amortization():
    P, rate, n = 20000, .06, 60
    r = rate / 12
    pmt = P * r / (1 - (1 + r) ** -n)
    b, I, Pr = P, [], []
    for _ in range(n):
        i = b * r; I.append(i); Pr.append(pmt - i); b -= pmt - i
    W, H, ml, mr, mt, mb = 720, 290, 56, 20, 16, 44
    top = 400
    sx = lambda m: ml + (m - 1) / (n - 1) * (W - ml - mr)
    sy = lambda v: mt + (H - mt - mb) * (1 - v / top)
    g = ""
    for v in range(0, top + 1, 100):
        g += f'<line class="grid" x1="{ml}" x2="{W - mr}" y1="{sy(v):.1f}" y2="{sy(v):.1f}"/><text class="ax" x="{ml - 8}" y="{sy(v) + 4:.1f}" text-anchor="end">${v}</text>'
    for m in (1, 12, 24, 36, 48, 60):
        g += f'<text class="ax" x="{sx(m):.1f}" y="{H - mb + 20}" text-anchor="middle">{m}</text>'
    g += f'<text class="ax" x="{(ml + W - mr) / 2:.1f}" y="{H - 4}" text-anchor="middle">Payment number (month)</text>'
    base = f"{sx(n):.1f},{sy(0):.1f} {sx(1):.1f},{sy(0):.1f}"
    pr_pts = " ".join(f"{sx(m + 1):.1f},{sy(Pr[m]):.1f}" for m in range(n))
    tot_pts = " ".join(f"{sx(m + 1):.1f},{sy(pmt):.1f}" for m in range(n))
    pr_rev = " ".join(f"{sx(m + 1):.1f},{sy(Pr[m]):.1f}" for m in reversed(range(n)))
    g += f'<polygon class="c-navy" points="{pr_pts} {base}"/><polygon class="c-orange" points="{tot_pts} {pr_rev}"/>'
    g += (f'<text class="on-fill strong" x="{sx(6):.1f}" y="{sy(pmt) + 22:.1f}">Interest: {money(I[0], True)} in month 1</text>'
          f'<text class="on-fill strong" x="{sx(6):.1f}" y="{sy(150):.1f}">Principal: {money(Pr[0], True)} in month 1</text>'
          f'<text class="on-fill" x="{sx(40):.1f}" y="{sy(150):.1f}">{money(Pr[-1], True)} by month 60</text>')
    return svg(W, H, g, "How each loan payment splits between interest and principal"), \
        (f"Example: a 5-year, $20,000 loan at 6% APR. Every payment is {money(pmt, True)}, but early payments carry more interest. "
         f"Total interest over the loan: {money(sum(I))}.")


def avalanche():
    debts = [("Credit card", 2500, 22), ("Personal loan", 4000, 11), ("Student loan", 1200, 6)]
    av = sorted(debts, key=lambda d: -d[2])
    sb = sorted(debts, key=lambda d: d[1])
    def col(title, sub, order):
        items = "".join(
            f'<li><span class="n">{i + 1}</span><div><b>{name}</b>{"<em>Extra payments go here</em>" if i == 0 else ""}'
            f'<span>Balance {money(bal)} · {apr}% APR</span></div></li>' for i, (name, bal, apr) in enumerate(order))
        return f'<div class="dcol"><h4>{title}</h4><p>{sub}</p><ol>{items}</ol></div>'
    html = ('<div class="debt-compare">' + col("Debt avalanche", "Highest interest rate first", av)
            + col("Debt snowball", "Smallest balance first", sb) + "</div>")
    return html, "Two ways to pay off the same three debts. Pay the minimum on all of them and put any extra money toward number 1; when it is gone, move to the next."


def fico():
    f = [("Payment history", 35), ("Credit utilization", 30), ("Length of credit history", 15), ("Credit mix", 10), ("New credit inquiries", 10)]
    W, H, lw = 720, 210, 210
    g = ""
    for i, (name, w) in enumerate(f):
        y = 10 + i * 40
        g += (f'<text class="lab" x="0" y="{y + 20}">{name}</text>'
              f'<rect class="track" x="{lw}" y="{y + 4}" width="{W - lw - 60}" height="22" rx="3"/>'
              f'<rect class="{"c-orange" if i < 2 else "c-navy"}" x="{lw}" y="{y + 4}" width="{(W - lw - 60) * w / 35:.1f}" height="22" rx="3"/>'
              f'<text class="val strong" x="{W - 50}" y="{y + 20}">{w}%</text>')
    return svg(W, H, g, "What affects your credit score"), \
        "What affects your FICO credit score. The two biggest factors, paying on time and keeping balances low, are the ones you control every month."


# ---------------------------------------------------------------- Session 2
def fv_monthly(pmt, rate, months):
    """Monthly deposits at the end of each month, rate/12 per month (the convention the Investing tool uses)."""
    i = rate / 12
    return pmt * ((1 + i) ** months - 1) / i


def line_chart(xs, series, xlab, xticks, W=720, H=300, label="", mr=150, fmt=money):
    """series: list of (values, stroke-class, name, dashed). Values may contain None (no point)."""
    ml, mt, mb = 70, 16, 40
    top = max(v for vals, *_ in series for v in vals if v is not None)
    step = nice_step(top); top = -(-top // step) * step
    x0, x1 = xs[0], xs[-1]
    sx = lambda x: ml + (x - x0) / (x1 - x0) * (W - ml - mr)
    sy = lambda v: mt + (H - mt - mb) * (1 - v / top)
    g, v = "", 0
    while v <= top + 1:
        g += (f'<line class="grid" x1="{ml}" x2="{W - mr}" y1="{sy(v):.1f}" y2="{sy(v):.1f}"/>'
              f'<text class="ax" x="{ml - 8}" y="{sy(v) + 4:.1f}" text-anchor="end">{fmt(v)}</text>')
        v += step
    for t in xticks:
        g += f'<text class="ax" x="{sx(t):.1f}" y="{H - mb + 20}" text-anchor="middle">{t}</text>'
    g += f'<text class="ax" x="{(ml + W - mr) / 2:.1f}" y="{H - 4}" text-anchor="middle">{xlab}</text>'
    ends = []
    for vals, cls, name, dashed in series:
        pts = " ".join(f"{sx(x):.1f},{sy(v):.1f}" for x, v in zip(xs, vals) if v is not None)
        g += f'<polyline class="ln {cls}{" dash" if dashed else ""}" points="{pts}"/>'
        ends.append([sy(vals[-1]), cls, name, vals[-1]])
    # end labels, nudged apart so they never overlap
    ends.sort(key=lambda e: e[0])
    for k in range(1, len(ends)):
        if ends[k][0] - ends[k - 1][0] < 38: ends[k][0] = ends[k - 1][0] + 38
    for y, cls, name, val in ends:
        dot = cls.replace("-s", "")
        g += (f'<circle class="{dot}" cx="{sx(x1):.1f}" cy="{sy(val):.1f}" r="5"/>'
              f'<text class="lab" x="{sx(x1) + 12:.1f}" y="{y - 2:.1f}">{name}</text>'
              f'<text class="val strong" x="{sx(x1) + 12:.1f}" y="{y + 15:.1f}">{money(val)}</text>')
    return svg(W, H, g, label)


def saving_vs_investing():
    yrs = list(range(0, 31))
    inv = [10000 * 1.07 ** t for t in yrs]
    need = [10000 * 1.03 ** t for t in yrs]
    sav = [10000 * 1.01 ** t for t in yrs]
    html = line_chart(yrs, [(inv, "c-orange-s", "Invested at 7%", False),
                            (need, "c-cool-s", "Keeping up with 3% inflation", True),
                            (sav, "c-navy-s", "Savings at 1%", False)],
                      "Years", (0, 5, 10, 15, 20, 25, 30), mr=210, label="Saving vs. investing: $10,000 over 30 years")
    return html, (f"$10,000 over 30 years. In savings at 1% it grows to {money(sav[-1])}, short of the {money(need[-1])} needed just to keep "
                  f"up with 3% inflation. Invested at an average 7% a year, it grows to {money(inv[-1])}. Returns are averages; real markets go up and down.")


def risk_return():
    steps = [("Savings accounts", "and CDs", "c-cool"), ("Bonds", "Treasury, corporate", "c-sky"),
             ("Mutual and", "index funds", "c-navy"), ("Individual", "stocks", "c-orange")]
    W, H, x0, y0, bw, gap = 720, 280, 60, 230, 150, 10
    g = (f'<line class="axis" x1="{x0 - 10}" x2="{W - 10}" y1="{y0}" y2="{y0}"/>'
         f'<line class="axis" x1="{x0 - 10}" x2="{x0 - 10}" y1="{y0}" y2="10"/>'
         f'<path class="c-navy" d="M{W - 10},{y0} l-10,-6 v12 z"/><path class="c-navy" d="M{x0 - 10},6 l-6,10 h12 z"/>'
         f'<text class="ax" x="{W - 14}" y="{y0 + 22}" text-anchor="end">Higher risk (bigger ups and downs) →</text>'
         f'<text class="ax" x="{x0 - 22}" y="{y0}" transform="rotate(-90 {x0 - 22} {y0})">Higher expected return →</text>')
    for i, (a, b, cls) in enumerate(steps):
        h = 50 + i * 45
        x = x0 + i * (bw + gap)
        txt = "lab" if cls == "c-cool" else "on-fill"
        g += (f'<rect class="{cls}" x="{x}" y="{y0 - h}" width="{bw}" height="{h}" rx="3"/>'
              f'<text class="{txt} strong" x="{x + 10}" y="{y0 - h + 22}">{a}</text>'
              f'<text class="{txt}" x="{x + 10}" y="{y0 - h + 40}">{b}</text>')
    return svg(W, H, g, "The risk-return spectrum"), \
        ("The risk-return spectrum. Investments that can earn more over time also swing more along the way. "
         "The goal is the right amount of risk for your situation, not zero risk.")


def eggs():
    html = ('<img class="fig-img" src="assets/img/readings/eggs-baskets.jpg" width="1100" height="620" '
            'alt="Left: one large basket holding every egg, with one egg broken on the ground. Right: the same eggs spread across three smaller baskets.">')
    return html, ("Don't put all your eggs in one basket. With everything in one company, one failure can wipe you out; "
                  "spread across many, a single failure costs you only a small share.")


def _donut(cx, cy, r, w, parts):
    import math
    out, a = "", -math.pi / 2
    for frac, cls in parts:
        b = a + frac * 2 * math.pi
        large = 1 if frac > .5 else 0
        p = lambda ang, rad: (cx + rad * math.cos(ang), cy + rad * math.sin(ang))
        (ax1, ay1), (bx1, by1) = p(a, r), p(b, r)
        (bx2, by2), (ax2, ay2) = p(b, r - w), p(a, r - w)
        out += (f'<path class="{cls}" d="M{ax1:.1f},{ay1:.1f} A{r},{r} 0 {large} 1 {bx1:.1f},{by1:.1f} '
                f'L{bx2:.1f},{by2:.1f} A{r - w},{r - w} 0 {large} 0 {ax2:.1f},{ay2:.1f} Z"/>')
        a = b
    return out


def allocation():
    W, H = 720, 290
    cols = [(180, "Younger investor", "decades to retirement", .90), (540, "Investor near retirement", "protecting built wealth", .40)]
    g = ""
    for cx, t, sub, st in cols:
        g += (f'<text class="lab strong" x="{cx}" y="20" text-anchor="middle">{t}</text>'
              f'<text class="ax" x="{cx}" y="38" text-anchor="middle">({sub})</text>'
              + _donut(cx, 145, 85, 34, [(st, "c-orange"), (1 - st, "c-navy")]) +
              f'<text class="lab strong" x="{cx}" y="142" text-anchor="middle" font-size="20" style="font-size:20px">{st * 100:.0f}%</text>'
              f'<text class="ax" x="{cx}" y="160" text-anchor="middle">stocks</text>'
              f'<text class="val" x="{cx}" y="254" text-anchor="middle">{st * 100:.0f}% stocks · {(1 - st) * 100:.0f}% bonds</text>')
    g += (f'<rect class="c-orange" x="270" y="270" width="14" height="14" rx="2"/><text class="lab" x="290" y="282">Stocks</text>'
          f'<rect class="c-navy" x="370" y="270" width="14" height="14" rx="2"/><text class="lab" x="390" y="282">Bonds</text>')
    return svg(W, H, g, "Asset allocation shifts with age"), \
        ("Asset allocation shifts with age. With decades ahead, a young investor can ride out market drops and holds mostly stocks; "
         "near retirement, more bonds protect what has been built. These mixes are illustrations, not recommendations.")


def tax_timing():
    W, H, lw = 720, 200, 140
    stages = ["Money goes in", "Grows for decades", "You take it out"]
    rows = [("Traditional", "401(k) or IRA", [False, False, True]), ("Roth", "401(k) or IRA", [True, False, False])]
    cw = (W - lw) / 3
    g = ""
    for j, s in enumerate(stages):
        g += f'<text class="ax strong" x="{lw + j * cw + cw / 2 - 6:.1f}" y="18" text-anchor="middle">{s.upper()}</text>'
    for i, (name, sub, taxed) in enumerate(rows):
        y = 34 + i * 82
        g += (f'<text class="lab strong" x="0" y="{y + 30}">{name}</text>'
              f'<text class="val" x="0" y="{y + 48}">{sub}</text>')
        for j, t in enumerate(taxed):
            x = lw + j * cw
            cls, txt = ("c-orange", "Taxed here") if t else ("track", "Not taxed")
            g += (f'<rect class="{cls}" x="{x:.1f}" y="{y}" width="{cw - 26:.1f}" height="64" rx="4"/>'
                  f'<text class="{"lab" if not t else "lab"} strong" x="{x + (cw - 26) / 2:.1f}" y="{y + 38}" text-anchor="middle">{txt}</text>')
            if j < 2:
                ax = x + cw - 22
                g += f'<path class="c-cool" d="M{ax:.1f},{y + 24} l12,8 l-12,8 z"/>'
    return svg(W, H, g, "Traditional vs. Roth: when you pay taxes"), \
        ("Traditional vs. Roth: when you pay taxes. A Traditional account lowers your taxes now and taxes withdrawals later; "
         "a Roth taxes the money going in, then the growth and qualified withdrawals are tax-free.")


def early_late():
    ages = list(range(22, 63))
    def path(start, stop):  # $5,000 at the start of each year from age `start` through `stop - 1`, 7% a year
        b, out = 0.0, []
        for a in ages:
            out.append(b if a >= start or b else None)
            if a == ages[-1]: break
            b = (b + (5000 if start <= a < stop else 0)) * 1.07
        out[0] = out[0] if out[0] is not None else (0 if start == 22 else None)
        return out
    A, B = path(22, 32), path(32, 62)
    B = [None if a < 32 else v for a, v in zip(ages, B)]
    A[0] = 0; B[ages.index(32)] = 0
    html = line_chart(ages, [(A, "c-orange-s", "Person A: 22 to 31", False), (B, "c-navy-s", "Person B: 32 to 61", False)],
                      "Age", (22, 32, 42, 52, 62), mr=170, label="Starting early: Person A vs. Person B")
    return html, (f"Person A puts in $5,000 a year for 10 years ($50,000) and then stops; Person B starts 10 years later and puts in "
                  f"$5,000 a year for 30 years ($150,000). Both earn 7% a year. At 62, A has {money(A[-1])} and B has {money(B[-1])}.")


def net_worth():
    assets = [("Savings", 3000), ("Roth IRA", 2000), ("Car", 8000)]
    owe = [("Card", 1500), ("Car loan", 5000)]
    total = sum(v for _, v in assets); nw = total - sum(v for _, v in owe)
    W, H, lw, x1 = 720, 230, 150, 710
    sc = (x1 - lw) / total
    g = ""
    def row(y, title, sub, segs):
        nonlocal g
        g += f'<text class="lab strong" x="0" y="{y + 26}">{title}</text><text class="val" x="0" y="{y + 44}">{sub}</text>'
        x = lw
        for name, v, cls in segs:
            w = v * sc
            dark = cls != "c-cool"
            t = "on-fill" if dark else "lab"
            g += (f'<rect class="{cls}" x="{x:.1f}" y="{y}" width="{w - 3:.1f}" height="58" rx="3"/>'
                  f'<text class="{t} strong" x="{x + 8:.1f}" y="{y + 25}">{name}</text>'
                  f'<text class="{t}" x="{x + 8:.1f}" y="{y + 44}">{money(v)}</text>')
            x += w
    row(10, "Assets", "what you own", [(n, v, "c-navy") for n, v in assets])
    row(90, "Liabilities", "what you owe", [(n, v, "c-cool") for n, v in owe] + [("Net worth", nw, "c-orange")])
    g += (f'<line class="axis" x1="{lw}" x2="{x1 - 3}" y1="168" y2="168"/>'
          f'<text class="lab" x="{lw}" y="192">Assets {money(total)} − liabilities {money(total - nw)} = <tspan class="strong" font-weight="700">net worth {money(nw)}</tspan></text>')
    return svg(W, H, g, "Net worth: assets minus liabilities"), \
        ("Net worth is what is left when you subtract what you owe from what you own. Assets include cash, investments, a car, and a home "
         "(at market value); liabilities include credit card balances, student loans, a car loan, and a mortgage.")


FIGURES = {"paystub": paystub, "takehome": takehome, "compound": compound, "goals": goals,
           "amortization": amortization, "avalanche": avalanche, "fico": fico,
           "saving_vs_investing": saving_vs_investing, "risk_return": risk_return, "eggs": eggs, "allocation": allocation,
           "tax_timing": tax_timing, "early_late": early_late, "net_worth": net_worth}


def render(name):
    html, cap = FIGURES[name]()
    return f'<figure class="fig fig-{name}">{html}<figcaption>{escape(cap)}</figcaption></figure>'
