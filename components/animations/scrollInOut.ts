import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

type ScrollInOutOptions = {
  trigger: Element
  items: Element[]
  fromX?: number
  fromY?: number
  duration?: number
  stagger?: number
  start?: string
  fromScale?: number
  fromRotation?: number
  fromBlur?: number
  individual?: boolean
}

export function createScrollInOut({
  trigger,
  items,
  fromX = 0,
  fromY = 46,
  duration = 0.9,
  stagger = 0.1,
  start = 'top 84%',
  fromScale = 0.92,
  fromRotation = 0,
  fromBlur = 10,
  individual = false,
}: ScrollInOutOptions) {
  if (!items.length) return null

  const setInitial = (target: Element | Element[]) =>
    gsap.set(target, {
      opacity: 0,
      x: fromX,
      y: fromY,
      scale: fromScale,
      rotate: fromRotation,
      filter: `blur(${fromBlur}px)`,
      transformOrigin: '50% 50%',
      force3D: true,
      willChange: 'transform, opacity, filter',
    })

  const animateIn = (target: Element | Element[]) =>
    gsap.to(target, {
      opacity: 1,
      x: 0,
      y: 0,
      scale: 1,
      rotate: 0,
      filter: 'blur(0px)',
      duration,
      stagger,
      ease: 'power4.out',
      overwrite: 'auto',
    })

  const animateOut = (target: Element | Element[]) =>
    gsap.to(target, {
      opacity: 0,
      x: fromX,
      y: fromY,
      scale: fromScale,
      rotate: fromRotation,
      filter: `blur(${fromBlur}px)`,
      duration: Math.max(0.42, duration * 0.78),
      stagger: stagger * 0.7,
      ease: 'power2.in',
      overwrite: 'auto',
    })

  if (individual) {
    return items.map((item) => {
      setInitial(item)
      return ScrollTrigger.create({
        trigger: item,
        start,
        invalidateOnRefresh: true,
        onEnter: () => animateIn(item),
        onEnterBack: () => animateIn(item),
        onLeaveBack: () => animateOut(item),
      })
    })
  }

  setInitial(items)

  return ScrollTrigger.create({
    trigger,
    start,
    invalidateOnRefresh: true,
    onEnter: () => animateIn(items),
    onEnterBack: () => animateIn(items),
    onLeaveBack: () => animateOut(items),
  })
}
