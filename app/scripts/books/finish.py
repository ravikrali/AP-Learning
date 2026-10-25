"""PDF steps that Chrome cannot do, using PyMuPDF (pip install pymupdf).

  python finish.py names <in.pdf> <out.json>
      Writes {"pages": N, "at": {anchor: page number (1-based)}} for every named destination.

  python finish.py stamp <body.pdf> <cover.pdf> <overlay.pdf> <manifest.json> <out.pdf>
      Puts the cover on the blank first page, lays page i of the overlay (running head, page number, watermark) over page i of the body,
      skipping the cover; links each running head to the contents; adds the bookmark outline and
      the document properties; writes a compact, print-ready PDF.
"""
import json
import sys

import pymupdf


def names(src, dst):
    doc = pymupdf.open(src)
    at = {k: v["page"] + 1 for k, v in doc.resolve_names().items()}
    with open(dst, "w", encoding="utf-8") as f:
        json.dump({"pages": doc.page_count, "at": at}, f)


def stamp(body_path, cover_path, overlay_path, manifest_path, out_path):
    with open(manifest_path, encoding="utf-8") as f:
        m = json.load(f)
    doc = pymupdf.open(body_path)
    over = pymupdf.open(overlay_path)
    if over.page_count != doc.page_count:
        raise SystemExit(f"overlay has {over.page_count} pages, body has {doc.page_count}")
    at = {k: v["page"] for k, v in doc.resolve_names().items()}
    toc_page = at.get(m["toc"], 0)
    for i, page in enumerate(doc):
        for link in page.get_links():
            if link["from"].width < 2 or link["from"].height < 2:
                page.delete_link(link)  # the 1-pixel anchor strip (see render.tsx)
        if i == 0:
            page.show_pdf_page(page.rect, pymupdf.open(cover_path), 0)
            continue
        page.show_pdf_page(page.rect, over, i, overlay=True)
        # the running head links back to the contents
        page.insert_link({"kind": pymupdf.LINK_GOTO, "page": toc_page, "from": pymupdf.Rect(36, 20, page.rect.width - 36, 52)})

    outline = []
    last = 0
    for e in m["outline"]:
        if e["id"] not in at:
            raise SystemExit(f"bookmark target #{e['id']} not found")
        level = min(e["level"], last + 1)
        outline.append([level, e["title"], at[e["id"]] + 1])
        last = level
    doc.set_toc(outline)
    doc.set_metadata(
        {
            "title": m["title"],
            "author": "R2 Digital LLC",
            "subject": m["subject"],
            "keywords": m["keywords"],
            "creator": "EzIQ (eziq.app)",
            "producer": "EzIQ book builder",
        }
    )
    doc.set_pagemode("UseOutlines")
    doc.save(out_path, garbage=3, deflate=True, deflate_fonts=True, use_objstms=1)


if __name__ == "__main__":
    cmd = sys.argv[1]
    if cmd == "names":
        names(sys.argv[2], sys.argv[3])
    elif cmd == "stamp":
        stamp(*sys.argv[2:7])
    else:
        raise SystemExit(__doc__)
