from pathlib import Path
from PIL import Image

SOURCE = Path('gorilla-icon-source-1254.png')
img = Image.open(SOURCE).convert('RGBA')

def save_icon(name, size, pad_ratio=None):
    if pad_ratio is None:
        icon = img.resize((size, size), Image.LANCZOS)
    else:
        icon = Image.new('RGBA', (size, size), (0, 0, 0, 0))
        inner = int(size * pad_ratio)
        pad = (size - inner) // 2
        resized = img.resize((inner, inner), Image.LANCZOS)
        icon.paste(resized, (pad, pad), resized)
    icon.save(name)

save_icon('icon-512.png', 512)
save_icon('icon-192.png', 192)
save_icon('apple-touch-icon.png', 180)
save_icon('favicon-32.png', 32)
save_icon('favicon-16.png', 16)
save_icon('icon-maskable-512.png', 512, 0.80)
save_icon('icon-maskable-192.png', 192, 0.80)
print('icons regenerated')
