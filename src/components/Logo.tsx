/**
 * ABC's published logo, used unchanged. The only source is a 292 × 149 raster, so it
 * is shown at modest sizes (it stays sharp up to about 146px wide on 2× screens).
 */
export function Logo({ height = 34 }: { height?: number }) {
  return <img className="logo" src="/brand/abc-logo.webp" width={292} height={149} style={{ height, width: 'auto' }} alt="ABC Group Uganda" />
}
