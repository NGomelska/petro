"""Збирає сайт «Ігри Петра» з папки petro-game.

Ігри редагуються в D:/Personal projects claude/petro-game, а цей скрипт копіює їх сюди
(разом з assets/) і переписує sw.js — список файлів для офлайну й нову версію кешу.
Запуск з кореня petro-site:  python tools/build.py   → потім git add/commit/push.
"""
import hashlib
import shutil
from pathlib import Path

SITE = Path(__file__).resolve().parent.parent
SRC = SITE.parent / "petro-game"
GAMES = ["mavpochka-banany.html", "budivnytstvo.html", "vantazhnyi-potiah.html", "kotiacha-kukhnia.html"]
OWN = ["./", "index.html", "manifest.webmanifest", "icons/icon-192.png", "icons/icon-512.png"]

for g in GAMES:
    shutil.copy2(SRC / g, SITE / g)
if (SITE / "assets").exists():
    shutil.rmtree(SITE / "assets")
shutil.copytree(SRC / "assets", SITE / "assets")

files = OWN + GAMES + sorted(f"assets/{p.name}" for p in (SITE / "assets").iterdir() if p.is_file())
h = hashlib.sha1()
for f in files:
    p = SITE / ("index.html" if f == "./" else f)
    h.update(p.read_bytes())
version = h.hexdigest()[:10]

sw = (SITE / "tools" / "sw.template.js").read_text(encoding="utf-8")
sw = sw.replace("__VERSION__", version).replace("__FILES__", ",\n  ".join(f'"{f}"' for f in files))
(SITE / "sw.js").write_text(sw, encoding="utf-8")
print(f"{len(files)} files, cache petro-{version}")
