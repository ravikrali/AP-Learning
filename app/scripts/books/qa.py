"""Checks finished course PDFs before they are listed for sale.

  python scripts/books/qa.py <pdf> [<pdf> ...] [--png <dir> --pages 1,3,10]

For each PDF: page count, page size, bookmarks, document properties, every internal link lands on
a real page, no "000" page-number placeholders are left, every font is embedded and comes
from fonts/ (no Type 3, no system fallbacks), and the copyright notice is on every page after the cover. With --png, renders the listed pages (1-based)
at 110 dpi for a visual check.
"""
import re
import sys

import pymupdf


def check(path):
    doc = pymupdf.open(path)
    problems = []
    meta = doc.metadata
    toc = doc.get_toc()
    links = 0
    names = doc.resolve_names()
    for i, page in enumerate(doc):
        for link in page.get_links():
            if link["kind"] in (pymupdf.LINK_GOTO, pymupdf.LINK_NAMED):
                links += 1
                target = link.get("page", -1)
                if link["kind"] == pymupdf.LINK_NAMED and link.get("nameddest") in names:
                    target = names[link["nameddest"]]["page"]
                if not 0 <= target < doc.page_count:
                    problems.append(f"page {i + 1}: link to a missing page ({link.get('nameddest', '')})")
        text = page.get_text()
        if re.search(r"(page|p\.)\s*000\b", text):
            problems.append(f"page {i + 1}: an unfilled page number (000)")
        if i > 0 and "R2 Digital LLC" not in text:
            problems.append(f"page {i + 1}: no copyright line")
    fonts = {f[3]: f[1] for p in doc for f in p.get_fonts()}
    unembedded = [name for name, ext in fonts.items() if ext in ("n/a", "")]
    if unembedded:
        problems.append(f"fonts not embedded or Type 3: {unembedded}")
    # only the open-license fonts in fonts/ may appear (system fonts carry other licenses)
    system = sorted({n.split("+")[-1] for n in fonts if n and not re.match(r"(.+\+)?(Nunito|SourceSerif4|Noto)", n)})
    if system:
        problems.append(f"system fonts used as fallbacks: {system}")
    if not toc:
        problems.append("no bookmarks")
    if "R2 Digital" not in (meta.get("author") or ""):
        problems.append("author is not R2 Digital LLC")
    w, h = doc[0].rect.width, doc[0].rect.height
    print(f"{path}\n  {doc.page_count} pages, {w / 72:.2f} x {h / 72:.2f} in, {len(toc)} bookmarks, {links} internal links, {len(fonts)} fonts")
    print(f"  title: {meta.get('title')}")
    for p in problems[:30]:
        print(f"  ! {p}")
    if len(problems) > 30:
        print(f"  ! … and {len(problems) - 30} more")
    if not problems:
        print("  ok")
    return doc, not problems


if __name__ == "__main__":
    args = sys.argv[1:]
    png = None
    pages = []
    if "--png" in args:
        k = args.index("--png")
        png = args[k + 1]
        del args[k : k + 2]
    if "--pages" in args:
        k = args.index("--pages")
        pages = [int(x) for x in args[k + 1].split(",")]
        del args[k : k + 2]
    ok = True
    for path in args:
        doc, good = check(path)
        ok = ok and good
        if png:
            stem = re.sub(r"\W+", "-", path.rsplit("/", 1)[-1].rsplit("\\", 1)[-1].removesuffix(".pdf"))
            for n in pages:
                if 1 <= n <= doc.page_count:
                    doc[n - 1].get_pixmap(dpi=110).save(f"{png}/{stem}-p{n}.png")
    sys.exit(0 if ok else 1)
