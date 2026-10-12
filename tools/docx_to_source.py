"""One-time helper: convert a session .docx into the Markdown source used by build_readings.py.
Callout tables become fenced divs (::: {.callout .tip}), charts and figures become figure slots
(::: {.figure fig="name"}). Run once per session, then edit the Markdown by hand from then on."""
import re, subprocess, sys
from bs4 import BeautifulSoup

LABELS = [("did you know", "fact"), ("example", "example"), ("pro tip", "tip"), ("key takeaway", "takeaway"),
          ("think about it", "think"), ("worth remembering", "note"), ("rule of thumb", "tip"),
          ("warning", "warning"), ("going further", "further"), ("a final thought", "final")]

def kind(text):
    t = text.strip().lower()
    for k, v in LABELS:
        if t.startswith(k):
            return v
    return None

def convert(docx, figmap, out):
    html = subprocess.run(["pandoc", docx, "-t", "html", "--wrap=none"], capture_output=True, text=True).stdout
    s = BeautifulSoup(html, "lxml")
    body = s.body
    # drop cover, title box and table of contents: everything before the first real h1
    first = next(h for h in body.find_all("h1") if h.get_text(strip=True) and "Contents" not in h.get_text())
    for el in list(first.find_previous_siblings()):
        el.decompose()
    for t in body.find_all("table"):
        cells = t.find_all(["td", "th"])
        text = t.get_text(" ", strip=True)
        fig = next((name for key, name in figmap.items() if text.startswith(key)), None)
        if fig is not None:
            div = s.new_tag("div", attrs={"class": "figure", "data-fig": fig})
            t.replace_with(div)
            continue
        if "c4fe@utep.edu" in text or not text:
            t.decompose(); continue
        if len(cells) == 1 or kind(text):
            frag = s.new_tag("div")
            current = None
            for p in cells[0].find_all(["p", "ul", "ol"], recursive=False) or [cells[0]]:
                k = kind(p.get_text())
                if k or current is None:
                    current = s.new_tag("div", attrs={"class": "callout " + (k or "note")})
                    frag.append(current)
                current.append(p)
            t.replace_with(frag)
            frag.unwrap()
    for img in body.find_all("img"):
        src = img.get("src", "")
        fig = figmap.get(src.split("/")[-1])
        if fig:
            div = s.new_tag("div", attrs={"class": "figure", "data-fig": fig})
            (img.find_parent("p") or img).replace_with(div)
            for extra in figmap.get(src.split("/")[-1] + "+", []):
                d2 = s.new_tag("div", attrs={"class": "figure", "data-fig": extra}); div.insert_after(d2); div = d2
        else:
            (img.find_parent("p") or img).decompose()
    for h in body.find_all(["h1", "h2", "h3", "h4"]):
        if not h.get_text(strip=True): h.decompose()
    for p in body.find_all("p"):
        if not p.get_text(strip=True) and not p.find("img"): p.decompose()
    md = subprocess.run(["pandoc", "-f", "html", "-t", "markdown-raw_html-native_divs-native_spans-header_attributes+fenced_divs", "--wrap=none"],
                        input=str(body), capture_output=True, text=True).stdout
    md = re.sub(r"::: \{\.figure data-fig=\"(\w+)\"\}\s*:::", r'::: {.figure fig="\1"}\n:::', md)
    md = re.sub(r"\n{3,}", "\n\n", md)
    open(out, "w").write(md.strip() + "\n")

if __name__ == "__main__":
    import json
    convert(sys.argv[1], json.loads(sys.argv[2]), sys.argv[3])
