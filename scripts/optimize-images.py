"""Generate web derivatives from the untouched masters in assets-src/original.

Run with `npm run images` (Python 3 + Pillow). Outputs are committed so the build
never depends on Python. Every derivative is made from the largest supplied file,
and nothing is ever upscaled beyond its source width.
"""
import shutil
from pathlib import Path
from PIL import Image, ImageDraw

root = Path(__file__).resolve().parents[1]
source = root / 'assets-src' / 'original'
public = root / 'public'
output = public / 'images'
output.mkdir(parents=True, exist_ok=True)
(public / 'brand').mkdir(exist_ok=True)


def variants(relative, name, widths, box=None, quality=78):
    with Image.open(source / relative) as master:
        image = master.convert('RGB')
        if box:
            image = image.crop(box)
        made, total = [], 0
        for width in widths:
            width = min(width, image.width)  # never upscale
            if width in made:
                continue
            height = round(image.height * width / image.width)
            target = output / f'{name}-{width}.webp'
            image.resize((width, height), Image.Resampling.LANCZOS).save(target, 'WEBP', quality=quality, method=6)
            made.append(width)
            total += target.stat().st_size
        print(f'{name}: {image.width}x{image.height} -> {made}, {total // 1024} KB')


# Generated inspiration (full-dimension masters). <picture> serves one hero per device.
# The mobile hero drops the top band of quiet wall, because on phones the headline
# sits above the photograph rather than over it.
variants('inspiration/master/hero-desktop.webp', 'hero-desktop', [960, 1536], quality=80)
variants('inspiration/master/hero-mobile.webp', 'hero-mobile', [480, 800], box=(0, 360, 1024, 1536), quality=80)
for scene in ['bathroom-inspiration', 'kitchen-inspiration', 'living-flooring', 'wall-panels-inspiration', 'material-board']:
    variants(f'inspiration/master/{scene}.webp', scene, [480, 960, 1536])
for texture in ['limestone', 'marble', 'charcoal', 'walnut']:
    variants(f'inspiration/master/texture-{texture}.webp', f'texture-{texture}', [240, 640, 1254])

# Company-site references: already modest web files, so only a card size is added.
for ref in ['sanitaryware-01', 'sanitaryware-02', 'sanitaryware-03', 'sanitaryware-04', 'grout-adhesive-01', 'grout-adhesive-02',
            'concealed-cistern-02', 'kitchensinks-01', 'kitchensinks-02', 'vox-panels-01', 'vox-panels-02']:
    variants(f'authentic/web/{ref}.webp', ref, [400, 1024], quality=82)
for ref in ['tiles-01', 'tiles-02', 'about-us-01', 'about-us-02', 'about-us-03']:
    variants(f'authentic/web/{ref}.webp', ref, [480, 1024], quality=82)

# The published logo is used unchanged (transparent RGBA, 292x149). No vector is claimed.
shutil.copy(source / 'authentic' / 'web' / 'abc-official-logo.webp', public / 'brand' / 'abc-logo.webp')
shutil.copy(source / 'branding' / 'favicon-concept.svg', public / 'favicon.svg')
shutil.copy(source / 'social' / 'social-preview.jpg', public / 'og-image.jpg')

# Apple touch icon drawn from the concept favicon's geometry (64-unit grid).
scale = 180 / 64
icon = Image.new('RGB', (180, 180), (0x24, 0x25, 0x22))
draw = ImageDraw.Draw(icon)
pt = lambda x, y: (x * scale, y * scale)
draw.polygon([pt(12, 20), pt(32, 11), pt(52, 20), pt(32, 29)], fill=(0xE8, 0xDE, 0xCE))
for y in (30, 40):
    draw.line([pt(12, y), pt(32, y + 9), pt(52, y)], fill=(0xAD, 0x89, 0x63), width=round(4 * scale), joint='curve')
icon.save(public / 'apple-touch-icon.png')
print('brand files, favicon, og-image and apple-touch-icon written')
