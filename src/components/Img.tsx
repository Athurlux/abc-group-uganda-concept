import type { ImgHTMLAttributes } from 'react'
import type { CatalogueItem } from '../data/catalogue'

type Base = Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'srcSet' | 'width' | 'height' | 'alt'> & { alt: string; sizes: string; priority?: boolean }

const loading = (priority = false) => ({
  loading: priority ? ('eager' as const) : ('lazy' as const),
  decoding: 'async' as const,
  fetchPriority: priority ? ('high' as const) : ('auto' as const),
})

/** Generated 3:2 inspiration scene (1536 × 1024 master). */
export function SceneImg({ name, alt, sizes, priority, ...rest }: Base & { name: string }) {
  return (
    <img
      src={`/images/${name}-960.webp`}
      srcSet={[480, 960, 1536].map(width => `/images/${name}-${width}.webp ${width}w`).join(', ')}
      sizes={sizes} width={1536} height={1024} alt={alt} {...loading(priority)} {...rest}
    />
  )
}

/** Generated square texture reference. Always paired with the illustrative-finish label. */
export function TextureImg({ name, alt, sizes, priority, ...rest }: Base & { name: string }) {
  return (
    <img
      src={`/images/texture-${name}-640.webp`}
      srcSet={[240, 640, 1254].map(width => `/images/texture-${name}-${width}.webp ${width}w`).join(', ')}
      sizes={sizes} width={1254} height={1254} alt={alt} {...loading(priority)} {...rest}
    />
  )
}

/**
 * Image published on ABC's website. Two derivatives exist: a card size and the
 * source width (never upscaled), so the set is built from the item's own width.
 */
export function RefImg({ image, width, height, alt, sizes, priority, ...rest }: Base & { image: string; width: number; height: number }) {
  const small = width / height > 1.1 ? 480 : 400
  const large = Math.min(width, 1024)
  return (
    <img
      src={`/images/${image}-${small}.webp`}
      srcSet={`/images/${image}-${small}.webp ${small}w, /images/${image}-${large}.webp ${large}w`}
      sizes={sizes} width={width} height={height} alt={alt} {...loading(priority)} {...rest}
    />
  )
}

export const ItemImg = ({ item, ...rest }: Omit<Parameters<typeof RefImg>[0], 'image' | 'width' | 'height'> & { item: CatalogueItem }) => (
  <RefImg image={item.image} width={item.width} height={item.height} {...rest} />
)
