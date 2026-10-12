"""Build the session readings: one web page and one print-quality PDF per session, from the same Markdown.

    python3 tools/build_readings.py          # builds every session listed in SESSIONS

Needs: pandoc, and the Python packages beautifulsoup4, lxml, weasyprint.
Source files live in readings/src/. Edit those, then rerun this script and commit the results.
Markdown conventions:
    ::: {.callout .example}   ... :::      callout box (example, tip, takeaway, fact, think, note, warning, further, final)
    ::: {.figure fig="name"}  :::          a figure drawn by tools/figures.py
    ::: {.tryit tool="budget"} :::         a link card to one of the calculators
"""
import os, re, subprocess, sys
from html import escape
from bs4 import BeautifulSoup

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(ROOT, "tools"))
import figures  # noqa: E402

SITE = "https://center-for-free-enterprise.github.io/PFL/"
# Stamped onto every CSS/JS link so browsers fetch fresh copies after each rebuild instead of a cached old stylesheet.
VERSION = __import__("time").strftime("%Y%m%d%H%M")


def stamp_pages():
    import glob
    pat = re.compile(r'((?:href|src)="assets/(?:css|js)/[a-z0-9-]+\.(?:css|js))(?:\?v=\d+)?"')
    for p in glob.glob(os.path.join(ROOT, "*.html")):
        s = open(p).read(); n = pat.sub(lambda m: f'{m.group(1)}?v={VERSION}"', s)
        if n != s: open(p, "w").write(n)
SESSIONS = [
    dict(id="session-1", src="readings/src/session-1.md", num=1,
         title="Budgeting, Saving, Debt, and Credit",
         desc="The Session 1 reading of the C4FE Personal Financial Literacy Workshop: income and taxes, budgeting, saving, debt, credit cards, credit scores, and insurance."),
    dict(id="session-2", src="readings/src/session-2.md", num=2,
         title="Building Wealth Over Time",
         desc="The Session 2 reading of the C4FE Personal Financial Literacy Workshop: saving vs. investing, risk and return, student loans and mortgages, index funds, diversification, retirement accounts, and net worth."),
]
TOOLS = {
    "budget": ("Budget Simulator", "See your own take-home pay and build a 50/30/20 plan."),
    "savings": ("Saving for a Goal", "Find the monthly amount for a car, a down payment, or your own goal."),
    "loans": ("Loan Calculator", "See how term and rate change the payment and the total interest."),
    "credit": ("Credit Cards", "See what paying only the minimum really costs."),
    "score": ("Credit Score Explorer", "See how each habit moves the five credit score factors."),
    "invest": ("Investing and Compound Growth", "See how time, fees, and market swings shape your savings."),
    "match": ("Paycheck and Employer Match", "See how a 401(k) changes your paycheck and what the match adds."),
    "loans#student": ("Loan Calculator: Student Loans", "See how interest builds while you are in school and what each repayment term costs."),
    "loans#mortgage": ("Loan Calculator: Mortgages", "See how the price, down payment, rate, and PMI change your monthly payment."),
}


def md_to_soup(path):
    html = subprocess.run(["pandoc", "-f", "markdown", "-t", "html", "--wrap=none", "--shift-heading-level-by=1",
                           os.path.join(ROOT, path)], capture_output=True, text=True, check=True).stdout
    return BeautifulSoup(f"<article>{html}</article>", "lxml")


def enrich(soup, pdf=False):
    for div in soup.select("div.figure"):
        div.replace_with(BeautifulSoup(figures.render(div["data-fig"]), "lxml").figure)
    for div in soup.select("div.tryit"):
        key = div["data-tool"]; name, desc = TOOLS[key]
        page, _, tab = key.partition("#"); href = f"{page}.html" + (f"#{tab}" if tab else "")
        card = (f'<a class="tryit" href="{SITE if pdf else ""}{href}"><span class="k">Try it</span><b>{escape(name)}</b>'
                f'<span class="d">{escape(desc)}</span><span class="go">Open the tool →</span>'
                f'<span class="url">{SITE.replace("https://", "")}{href}</span></a>')
        div.replace_with(BeautifulSoup(card, "lxml").a)
    for div in soup.select("div.callout"):
        div["role"] = "note"
    # "Section 3: Saving with Purpose" -> a ruled label ("Section 3") above the title, as in the UTEP brand guide.
    for h in soup.find_all("h2"):
        full = h.get_text(" ", strip=True)
        h["data-full"] = full
        m = re.match(r"^((?:Section \d+)|Introduction|Summary)\s*:\s*(.+)$", full)
        if m:
            h.clear()
            lab = soup.new_tag("span", attrs={"class": "eyebrow-rule"}); lab.string = m.group(1)
            t = soup.new_tag("span", attrs={"class": "t"}); t.string = m.group(2)
            h.append(lab); h.append(t)
    return soup


def toc(soup):
    items = [(h["id"], h.get("data-full") or h.get_text(" ", strip=True)) for h in soup.find_all("h2") if h.get("id")]
    return items


# ---------------------------------------------------------------- web page
PAGE = """<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>Session {num} Reading · C4FE</title>
<meta name="description" content="{desc}">
<meta property="og:type" content="article">
<meta property="og:site_name" content="C4FE Personal Financial Literacy Tools">
<meta property="og:title" content="Session {num}: {title}">
<meta property="og:description" content="{desc}">
<meta property="og:url" content="{site}{id}.html">
<meta property="og:image" content="{site}assets/img/social-preview.jpg">
<meta property="og:image:width" content="1280">
<meta property="og:image:height" content="640">
<meta name="twitter:card" content="summary_large_image">
<link rel="preload" href="assets/fonts/inter-latin-400-normal.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="assets/css/site.css?v={ver}">
</head>
<body data-reading="{num}">
<header id="site-header"></header>

<main class="wrap">
  <div id="site-notice"></div>
  <div class="read-layout">
    <nav class="toc" aria-label="Contents">
      <details open id="toc-details"><summary data-i18n="toc">Contents</summary>
        <ol>
{toc}
        </ol>
      </details>
      <div class="dl">
        <a class="btn primary" href="assets/pdf/{id}.pdf" download><svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v12M7 10l5 5 5-5M5 20h14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg><span data-i18n="dl_pdf">Download PDF</span></a>
      </div>
    </nav>
    <article class="prose" lang="en">
      <p class="en-only" data-i18n="en_only" hidden></p>
{body}
    </article>
  </div>
</main>

<footer id="site-footer"></footer>

<script src="assets/js/site.js?v={ver}"></script>
<script src="assets/js/reading.js?v={ver}"></script>
</body>
</html>
"""


def build_web(s):
    soup = enrich(md_to_soup(s["src"]))
    items = toc(soup)
    toc_html = "\n".join(f'          <li><a href="#{i}">{escape(t)}</a></li>' for i, t in items)
    body = soup.article.decode_contents()
    out = PAGE.format(toc=toc_html, body=body, site=SITE, ver=VERSION, **{k: escape(str(v)) for k, v in s.items()})
    with open(os.path.join(ROOT, f'{s["id"]}.html'), "w") as f:
        f.write(out)


# ---------------------------------------------------------------- PDF
PDF_COLORS = {"c-orange": "#FF8200", "c-navy": "#041E42", "c-cool": "#B1B3B3", "c-sky": "#1CA6DF", "track": "#EDF1F6"}
PDF_STROKES = {"c-orange-s": "#FF8200", "c-navy-s": "#041E42", "c-cool-s": "#B1B3B3", "grid": "#D8DFE9", "axis": "#566379"}
PDF_TEXT = {"ax": "#566379", "val": "#566379", "lab": "#0B1B33", "on-fill": "#FFFFFF"}


def inline_svg_colors(soup):
    """WeasyPrint doesn't apply page CSS inside SVG reliably, so set colors as attributes for print."""
    for el in soup.select("svg.fig-svg *"):
        cls = el.get("class") or []
        for c in cls:
            if c in PDF_COLORS: el["fill"] = PDF_COLORS[c]
            if c in PDF_STROKES:
                el["stroke"] = PDF_STROKES[c]; el["fill"] = "none" if el.name != "line" else el.get("fill", "none")
            if c in PDF_TEXT: el["fill"] = PDF_TEXT[c]
            if c == "ln": el["fill"] = "none"; el["stroke-width"] = "3"
            if c == "dash": el["stroke-dasharray"] = "7 5"
        if el.name == "text":
            el["font-family"] = "Inter"
            if not el.get("fill"): el["fill"] = "#0B1B33"
            if not el.get("font-size"): el["font-size"] = "12" if "ax" in cls or "val" in cls else "13"
            if "strong" in cls: el["font-weight"] = "700"
        if "grid" in cls: el["stroke-width"] = "1"
        if "axis" in cls: el["stroke-width"] = "2"


PDF_PAGE = """<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Session {num}: {title}</title>
<link rel="stylesheet" href="file://{root}/tools/pdf.css">
<style>@page{{@top-left{{content:"Personal Financial Literacy · Session {num}"}}}}</style></head><body>
<section class="cover">
  <img class="cover-logo" src="file://{root}/assets/img/c4fe-logo-reverse.png" alt="UTEP Center for Free Enterprise">
  <div class="cover-text">
    <p class="kicker">Personal Financial Literacy Workshop</p>
    <h1>Session {num}</h1>
    <p class="cover-sub">{title}</p>
  </div>
  <div class="cover-foot">
    <p>Center for Free Enterprise · Woody L. Hunt College of Business · The University of Texas at El Paso</p>
    <p>Interactive tools: <b>center-for-free-enterprise.github.io/PFL</b></p>
  </div>
  <img class="cover-qr" src="file://{root}/assets/img/qr-site.svg" alt="">
</section>
<section class="contents">
  <h2 class="toc-h">Contents</h2>
  <ol>{toc}</ol>
  <div class="note">
    <p><b>For learning only.</b> This reading is educational material for the C4FE Personal Financial Literacy Workshop. It is not financial, legal, or tax advice. Figures are simplified examples; tax figures use 2026 federal rules for a single filer.</p>
    <p>The interactive calculators mentioned in “Try it” boxes are free at <b>center-for-free-enterprise.github.io/PFL</b>. Nothing you type there is saved or sent anywhere.</p>
  </div>
</section>
<main class="prose">{body}</main>
<section class="back">
  <img src="file://{root}/assets/img/c4fe-logo-color.png" alt="UTEP Center for Free Enterprise">
  <p>Center for Free Enterprise<br>Woody L. Hunt College of Business<br>The University of Texas at El Paso<br>c4fe@utep.edu</p>
</section>
</body></html>"""


def build_pdf(s):
    from weasyprint import HTML
    soup = enrich(md_to_soup(s["src"]), pdf=True)
    inline_svg_colors(soup)
    items = toc(soup)
    toc_html = "".join(f'<li><a href="#{i}">{escape(t)}</a></li>' for i, t in items)
    html = PDF_PAGE.format(root=ROOT, toc=toc_html, body=soup.article.decode_contents(),
                           num=s["num"], title=escape(s["title"]))
    os.makedirs(os.path.join(ROOT, "assets/pdf"), exist_ok=True)
    out = os.path.join(ROOT, f'assets/pdf/{s["id"]}.pdf')
    HTML(string=html, base_url=ROOT).write_pdf(out)
    return out


if __name__ == "__main__":
    for s in SESSIONS:
        build_web(s)
        print("web:", s["id"] + ".html")
        print("pdf:", build_pdf(s))
    stamp_pages()
    print("stamped CSS/JS links with v=" + VERSION)
