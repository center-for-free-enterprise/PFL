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


FIGURES = {"paystub": paystub, "takehome": takehome, "compound": compound, "goals": goals,
           "amortization": amortization, "avalanche": avalanche, "fico": fico}


def render(name):
    html, cap = FIGURES[name]()
    return f'<figure class="fig fig-{name}">{html}<figcaption>{escape(cap)}</figcaption></figure>'
