from pathlib import Path
from PIL import Image

SOURCE = Path('gorilla-icon-source-1254.png')
img = Image.open(SOURCE).convert('RGBA')

sizes = {
    'icon-512.png': 512,
    'icon-192.png': 192,
    'apple-touch-icon.png': 180,
    'favicon-32.png': 32,
    'favicon-16.png': 16,
}
for name, size in sizes.items():
    img.resize((size, size), Image.LANCZOS).save(name)

for name, size in [('icon-maskable-512.png', 512), ('icon-maskable-192.png', 192)]:
    canvas = Image.new('RGBA', (size, size), (0,0,0,0))
    inner = int(size * 0.8)
    pad = (size - inner) // 2
    resized = img.resize((inner, inner), Image.LANCZOS)
    canvas.paste(resized, (pad, pad), resized)
    canvas.save(name)

print('done')
