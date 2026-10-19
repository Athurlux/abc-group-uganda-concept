import type { RefObject } from 'react'
import { gsap, ScrollTrigger, useGSAP } from './gsap'

const DUR = { base: 0.6, slow: 0.9 }
const EASE = { out: 'power3.out', expo: 'expo.out', mask: 'power4.inOut', scrub: 'none' }

const revealPending = () => document.documentElement.classList.remove('hero-pending')

/**
 * One scoped context per page. useGSAP reverts every tween and ScrollTrigger on
 * unmount, and matchMedia reverts per-breakpoint work on resize, so navigation and
 * resizing cannot pile triggers up. Content is visible by default: elements are
 * hidden only inside the motion branch, right before their reveal is armed, and
 * links and buttons are never hidden.
 */
export function useSiteMotion(root: RefObject<HTMLElement | null>) {
  useGSAP(() => {
    const mm = gsap.matchMedia()

    mm.add({ motion: '(prefers-reduced-motion: no-preference)', desktop: '(min-width: 1024px)' }, context => {
      const { motion, desktop } = context.conditions as { motion: boolean; desktop: boolean }
      const scope = root.current
      if (!scope || !motion) { revealPending(); return }
      const cleanups: (() => void)[] = []

      // ---- Hero: staged headline, then the room opens from the wall ----------------
      if (scope.querySelector('[data-hero="line"]')) {
        const tl = gsap.timeline({ defaults: { ease: EASE.out } })
        tl.from('[data-hero="line"]', { yPercent: 110, duration: DUR.slow, stagger: 0.12, ease: EASE.expo })
          .from('[data-hero="lede"]', { y: 14, opacity: 0, duration: DUR.base }, '-=0.5')
          .fromTo('[data-hero="mask"]', { scaleX: 1 }, { scaleX: 0, duration: 1.2, ease: EASE.mask }, 0.1)
          .from('[data-hero="photo"]', { scale: 1.07, duration: 1.5 }, 0.1)
        revealPending()
        // Reaching for a CTA mid-entrance finishes the entrance at once.
        const settle = () => tl.progress(1)
        scope.addEventListener('pointerdown', settle)
        scope.addEventListener('focusin', settle)
        cleanups.push(() => { scope.removeEventListener('pointerdown', settle); scope.removeEventListener('focusin', settle) })
      } else {
        revealPending()
      }

      // ---- Section text: batched, once --------------------------------------------
      const reveals = gsap.utils.toArray<HTMLElement>('[data-anim="reveal"]', scope)
      gsap.set(reveals, { y: desktop ? 24 : 14, opacity: 0 })
      ScrollTrigger.batch(reveals, {
        start: 'top 88%', once: true,
        onEnter: batch => gsap.to(batch, { y: 0, opacity: 1, duration: DUR.slow, stagger: 0.08, ease: EASE.out, clearProps: 'transform,opacity' }),
      })

      // ---- Collection and catalogue cards: a small, quick stagger ---------------------
      const cards = gsap.utils.toArray<HTMLElement>('[data-anim="card"]', scope)
      gsap.set(cards, { y: desktop ? 28 : 14, opacity: 0 })
      ScrollTrigger.batch(cards, {
        start: 'top 92%', once: true,
        onEnter: batch => gsap.to(batch, { y: 0, opacity: 1, duration: DUR.base, stagger: 0.07, ease: EASE.out, clearProps: 'transform,opacity' }),
      })

      // ---- Architectural image reveal: the frame opens upward, like a blind -----------
      gsap.utils.toArray<HTMLElement>('[data-anim="image"]', scope).forEach(frame => {
        gsap.fromTo(frame, { clipPath: 'inset(18% 0% 0% 0%)' }, {
          clipPath: 'inset(0% 0% 0% 0%)', duration: 1.1, ease: EASE.mask, clearProps: 'clipPath',
          scrollTrigger: { trigger: frame, start: 'top 85%', once: true },
        })
      })

      // ---- Material to room (desktop): a swatch grows to fill the frame, then gives way
      // to the room. Native scroll drives it through a CSS-sticky stage; no pinning.
      const story = scope.querySelector<HTMLElement>('[data-story]')
      if (desktop && story) {
        story.classList.add('story--scrub')
        const tl = gsap.timeline({
          defaults: { ease: EASE.scrub },
          scrollTrigger: { trigger: story, start: 'top top', end: 'bottom bottom', scrub: 0.5 },
        })
        tl.fromTo('[data-story="swatch"]', { scale: 0.28 }, { scale: 1, duration: 1 })
          .fromTo('[data-story="room"]', { scale: 1.12 }, { scale: 1, duration: 1.4 }, 0.6)
          .to('[data-story="swatch"]', { opacity: 0, duration: 0.6 }, 1)
          .fromTo('[data-story="caption-room"]', { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.5 }, 1.2)
          .to('[data-story="caption-swatch"]', { opacity: 0, duration: 0.4 }, 0.9)
        ScrollTrigger.refresh()
        cleanups.push(() => story.classList.remove('story--scrub'))
      }

      let alive = true
      document.fonts.ready.then(() => { if (alive) ScrollTrigger.refresh() })
      return () => { alive = false; cleanups.forEach(cleanup => cleanup()) }
    })

    return () => revealPending()
  }, { scope: root, dependencies: [] })
}
