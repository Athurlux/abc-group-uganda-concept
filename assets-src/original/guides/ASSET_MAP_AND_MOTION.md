# Asset placement and motion

## Main visual sequence
Hero desktop: inspiration/master/hero-desktop.webp, 1536×1024. Place live dark text over the quiet left wall or in a separate panel; the image is not a full-width 21:9 composition. Do not crop it blindly. Headline proposal: “Every remarkable space starts with the right materials.” CTAs: Explore collections; Build your project shortlist.
Hero mobile: hero-mobile.webp; use the clean upper wall or separate copy above. Preserve the chair and material floor without making the entire first screen an oversized image.

Collection/lifestyle scenes: bathroom-inspiration, kitchen-inspiration, living-flooring, wall-panels-inspiration. They are four independent spaces, not four angles of one home. Do not label them as existing client projects or specific manufacturer's installations. The kitchen scene does not verify an ABC kitchen brand or service.

Detail: fittings-detail.webp is a generic unbranded concept, not Hansgrohe, Toto or another SKU. material-board.webp supports editorial material selection. Four texture masters are generic appearance references; not calibrated colour samples or guaranteed seamless textures. Do not derive product specifications or suitable wet-area use from appearance.

Authentic sources: authentic/source-register.json maps optimised local derivatives to source pages and published alt text. Inspect each before using; category labels and filenames do not prove model identity, pack coverage or technical ratings. Never relabel an image with an invented brand or model code.

## GSAP storyboard
1. Live headline entrance and calm architectural reveal, with usable CTAs immediately.
2. A single material tile expands as the next room scene reveals; describe it as inspiration, not an exact product simulation. Images are flat; no fake 3D rotation.
3. Editorial collection cards reveal subtly; browsing and saved selections work without animation.
4. Selected-item feedback is short and accessible; avoid full-screen cart theatre.
5. Showroom and professional enquiry sections return to calm normal flow.
Use transforms and opacity, GSAP cleanup, responsive matchMedia and reduced-motion static layouts. Keep native scrolling. No lengthy phone pinning, continuous shader backgrounds, forced intro screen or video autoplay.

## Practical delivery
Use responsive picture/srcset. Preload only active hero. Lazy-load other scenes. Small versions are in inspiration/web; generated masters retain their full dimensions. Icons use currentColor and can be styled in CSS. Keep headings and controls in HTML. Use authentic logo unchanged; do not recolour it to match bronze. Neutral concept favicon is not a new official mark.
