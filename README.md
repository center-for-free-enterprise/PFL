# Personal Financial Literacy Tools — C4FE

Interactive companion site for the **Personal Financial Literacy Workshop** of the Center for Free Enterprise (C4FE), Woody L. Hunt College of Business, The University of Texas at El Paso.

The site is educational only. It is not financial advice, and every page says so.

## How the site is built

A plain static site: HTML, CSS, and JavaScript. No build step, no server, no database. All calculations run in the visitor's browser and nothing they type is stored or sent anywhere (only their English/Spanish choice is remembered on their device).

```
index.html              Landing page: tool cards + About the Center
budget.html             Budget simulator: salary → take-home pay → 50/30/20 plan    (Session 1)
savings.html            Saving for a goal: car, home down payment, or custom       (Session 1)
loans.html              Loan calculator: car, student, mortgage                     (Sessions 1–2)
credit.html             Credit cards: the minimum-payment trap                      (Session 1)
score.html              Credit score explorer: the five FICO factors, utilization  (Session 1)
invest.html             Investing: compound growth, fees, range of outcomes        (Session 2)
match.html              Paycheck and employer match: 401(k), traditional vs. Roth  (Session 2)
teachers.html           Teacher guide: setup, QR code, one activity per tool
assets/css/site.css     Shared styles and UTEP colors (blue #041E42, orange #FF8200)
assets/js/site.js       Shared header, disclaimer, footer, language toggle, common text, form and chart helpers
assets/js/home.js       Landing page text
assets/js/<tool>.js     Each tool's text (English and Spanish), example defaults, and math
assets/img/             C4FE logos (color, reverse for dark backgrounds, white), qr-site.svg, social-preview.jpg
.nojekyll               Tells GitHub Pages to serve files as-is
```

## Editing text

All wording lives in JavaScript objects with an `en` and an `es` version side by side:

- Disclaimer, footer, and official-source links: `COMMON` in `assets/js/site.js`
- Landing page and "About the Center": `HOME_TEXT` in `assets/js/home.js`
- Each tool: the `TEXT` (or `LOAN_TEXT`) object at the top of its file in `assets/js/`

Change the text between the quotes, keeping the English and Spanish entries in step. A few entries are small functions (for example `msg_extra`) because they insert numbers into a sentence; edit the words around the `${...}` parts and leave those parts as they are.

## Editing the example numbers and assumptions

The numbers a calculator opens with are in the `STATE` object near the top of its file. They are illustrative, not current market rates.

Several tools rest on assumptions worth reviewing once a year:

- **Taxes (`assets/js/site.js`, `TAX`)**: federal brackets and standard deduction for a single filer, shared by the budget and paycheck tools. Currently 2026 figures. The IRS publishes the next year's numbers each October.
- **Investing (`assets/js/invest.js`, `ASSUME`)**: typical growth and yearly swing for stocks and bonds, inflation, and the number of simulated paths. The simulation uses a fixed random seed, so the same inputs always show the same picture.
- **Credit cards (`assets/js/credit.js`, `MIN_RULE`)**: the minimum-payment formula (1% of the balance plus interest, or $25).
- **Credit score (`assets/js/score.js`, `RATE` and `BANDS`)**: an illustration of how FICO's published factor weights combine. It deliberately shows a band, not a score, because FICO's formula is private.

## Workshop readings

The session readings are published twice from one source: as web pages (`session-1.html`, `session-2.html`) and as print PDFs (`assets/pdf/session-N.pdf`).

- **Edit the text** in `readings/src/session-N.md` (Markdown). Callout boxes, figures, and "Try it" links use fenced blocks:
  `::: {.callout .example}` … `:::` (types: example, tip, takeaway, fact, think, note, warning, further, final),
  `::: {.figure fig="name"}` / `:::`, and `::: {.tryit tool="budget"}` / `:::` (a tool name, optionally with a tab, such as `loans#student`).
- **Figures** are drawn in code in `tools/figures.py`, so their numbers are computed rather than typed. Tax figures there use 2026 federal rules; update `TAX` each year along with `assets/js/site.js`.
- **PDF layout** is in `tools/pdf.css`; web styles are in `assets/css/site.css`. Both use the UTEP 2026 brand (Inter / Inter Tight, Midnight Pick and Miner Blaze), with fonts self-hosted in `assets/fonts/`.
- **Rebuild** after any change (this also restamps the `?v=` version on every page's CSS/JS links so browsers fetch fresh copies), then commit the generated HTML and PDF files:

  ```
  pip install beautifulsoup4 lxml weasyprint   # plus pandoc
  python3 tools/build_readings.py
  ```
- **Add a session**: add its Markdown file, an entry in `SESSIONS` in `tools/build_readings.py`, a title in `assets/js/reading.js`, and a card on the landing page (`index.html`, `assets/js/home.js`).

## Publishing with GitHub Pages

1. In the repository, open **Settings → Pages**.
2. Under **Build and deployment**, choose **Deploy from a branch**, branch `main`, folder `/ (root)`, and save.
3. After a minute or two the site is live at `https://center-for-free-enterprise.github.io/PFL/`.

Every change pushed to `main` republishes the site automatically.

## Printing

Every tool and the teacher guide have a **Print results** button. The printed page uses a light, one-column layout, shows the inputs and results, and adds the page address, the date, and the "not financial advice" line at the bottom.

## QR code

`assets/img/qr-site.svg` points to `https://center-for-free-enterprise.github.io/PFL/`. If the site moves to another address, regenerate it.

## Sharing

Every page has a **Share** button. On phones it opens the phone's own share menu (WhatsApp, Messages, email, and so on); where that menu isn't available it becomes **Copy link**. It loads no outside scripts and sends no data. On tools with tabs, the shared link keeps the tab the visitor was on.

## Link previews

When someone shares a page (WhatsApp, text messages, LinkedIn, email), the preview card uses `assets/img/social-preview.jpg` (1280 × 640), set by the `og:` tags in each page's `<head>`. To change it, replace that file and keep the same size. The repository's own preview on GitHub is uploaded separately under **Settings → General → Social preview**.

## Linking straight to a tab

`loans.html#student`, `loans.html#mortgage`, `savings.html#home`, and `savings.html#custom` open a tool on that tab, which is handy for slides or handouts.

## Adding a new tool

Copy one of the tool pages (`credit.html` is the simplest) as a starting point, give it its own script in `assets/js/`, build its inputs with `PFL.buildFields(...)`, and call `PFL.init(TEXT, {titleKey, ledeKey, sources})` at the end of that script. Then add a card for it on the landing page.

## Contact

Center for Free Enterprise · c4fe@utep.edu
