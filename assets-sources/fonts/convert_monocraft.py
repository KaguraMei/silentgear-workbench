"""Rebuild the webfont: python -m pip install fonttools brotli, then run this file."""
from pathlib import Path
from fontTools.ttLib import TTFont

source_dir = Path(__file__).resolve().parent
source = source_dir / 'monocraft-source/Monocraft-ttf/Monocraft.ttf'
destination = source_dir.parent.parent / 'public/fonts/Monocraft-Regular.woff2'
font = TTFont(source)
font.flavor = 'woff2'
font.save(destination)
print(destination)
