'use client'

import { ReactNode, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

type MasonryItem = {
  id: string
  height: number
}

type AnimateFrom = 'top' | 'bottom' | 'left' | 'right' | 'center' | 'random'

type MasonryProps<T extends MasonryItem> = {
  items: readonly T[]
  renderItem: (item: T) => ReactNode
  ease?: string
  duration?: number
  stagger?: number
  animateFrom?: AnimateFrom
  scaleOnHover?: boolean
  hoverScale?: number
  blurToFocus?: boolean
  colorShiftOnHover?: boolean
}

function useMedia(queries: string[], values: number[], defaultValue: number) {
  const getValue = () => {
    if (typeof window === 'undefined') return defaultValue
    const index = queries.findIndex((query) => window.matchMedia(query).matches)
    return values[index] ?? defaultValue
  }

  const [value, setValue] = useState(getValue)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const handler = () => setValue(getValue())
    const mediaQueries = queries.map((query) => window.matchMedia(query))

    mediaQueries.forEach((mq) => mq.addEventListener('change', handler))
    return () => mediaQueries.forEach((mq) => mq.removeEventListener('change', handler))
  }, [queries, values, defaultValue])

  return value
}

function useMeasure<T extends HTMLElement>() {
  const ref = useRef<T>(null)
  const [size, setSize] = useState({ width: 0, height: 0 })

  useLayoutEffect(() => {
    if (!ref.current) return

    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect
      setSize({ width, height })
    })

    observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return [ref, size] as const
}

export default function Masonry<T extends MasonryItem>({
  items,
  renderItem,
  ease = 'power2.out',
  duration = 0.95,
  stagger = 0.05,
  animateFrom = 'bottom',
  scaleOnHover = true,
  hoverScale = 0.97,
  blurToFocus = true,
  colorShiftOnHover = false,
}: MasonryProps<T>) {
  const columns = useMedia(
    ['(min-width:1500px)', '(min-width:1100px)', '(min-width:700px)', '(min-width:460px)'],
    [4, 3, 2, 2],
    1
  )

  const [containerRef, { width }] = useMeasure<HTMLDivElement>()
  const hasMounted = useRef(false)
  const triggerRef = useRef<ScrollTrigger | null>(null)

  const getInitialPosition = (item: T & { x: number; y: number; w: number; h: number }) => {
    const containerRect = containerRef.current?.getBoundingClientRect()
    if (!containerRect) return { x: item.x, y: item.y }

    let direction = animateFrom
    if (animateFrom === 'random') {
      const directions: AnimateFrom[] = ['top', 'bottom', 'left', 'right']
      direction = directions[Math.floor(Math.random() * directions.length)]
    }

    switch (direction) {
      case 'top':
        return { x: item.x, y: item.y - 70 }
      case 'bottom':
        return { x: item.x, y: item.y + 90 }
      case 'left':
        return { x: item.x - 90, y: item.y }
      case 'right':
        return { x: item.x + 90, y: item.y }
      case 'center':
        return {
          x: containerRect.width / 2 - item.w / 2,
          y: containerRect.height / 2 - item.h / 2,
        }
      default:
        return { x: item.x, y: item.y + 70 }
    }
  }

  const grid = useMemo(() => {
    if (!width) return []

    const gap = 20
    const colHeights = new Array(columns).fill(0)
    const columnWidth = (width - gap * (columns - 1)) / columns

    return items.map((item) => {
      const col = colHeights.indexOf(Math.min(...colHeights))
      const x = (columnWidth + gap) * col
      const y = colHeights[col]
      const h = item.height

      colHeights[col] += h + gap

      return { ...item, x, y, w: columnWidth, h }
    })
  }, [columns, items, width])

  const totalHeight = useMemo(() => {
    if (!grid.length) return 0
    return Math.max(...grid.map((item) => item.y + item.h))
  }, [grid])

  useLayoutEffect(() => {
    if (!grid.length) return

    grid.forEach((item, index) => {
      const selector = `[data-masonry-key="${item.id}"]`
      const animationProps = {
        x: item.x,
        y: item.y,
        width: item.w,
        height: item.h,
      }

      if (!hasMounted.current) {
        const initialPos = getInitialPosition(item)
        gsap.set(selector, {
          opacity: 0,
          x: initialPos.x,
          y: initialPos.y,
          width: item.w,
          height: item.h,
          ...(blurToFocus ? { filter: 'blur(10px)' } : {}),
        })
      } else {
        gsap.to(selector, {
          ...animationProps,
          duration,
          ease,
          overwrite: 'auto',
        })
      }
    })

    if (containerRef.current) {
      triggerRef.current?.kill()

      const animateIn = () => {
        grid.forEach((item, index) => {
          const selector = `[data-masonry-key="${item.id}"]`
          gsap.to(selector, {
            opacity: 1,
            x: item.x,
            y: item.y,
            width: item.w,
            height: item.h,
            scale: 1,
            ...(blurToFocus ? { filter: 'blur(0px)' } : {}),
            duration: 1.05,
            ease: 'power2.out',
            delay: index * stagger,
            overwrite: 'auto',
          })
        })
      }

      const animateOut = () => {
        grid.forEach((item, index) => {
          const selector = `[data-masonry-key="${item.id}"]`
          const initialPos = getInitialPosition(item)
          gsap.to(selector, {
            opacity: 0,
            x: initialPos.x,
            y: initialPos.y,
            width: item.w,
            height: item.h,
            scale: 0.92,
            ...(blurToFocus ? { filter: 'blur(10px)' } : {}),
            duration: 0.62,
            ease: 'power2.in',
            delay: index * Math.min(stagger * 0.45, 0.04),
            overwrite: 'auto',
          })
        })
      }

      triggerRef.current = ScrollTrigger.create({
        trigger: containerRef.current,
        start: 'top 86%',
        onEnter: animateIn,
        onEnterBack: animateIn,
        onLeaveBack: animateOut,
      })
    }

    hasMounted.current = true

    return () => {
      if (!hasMounted.current) return
    }
  }, [blurToFocus, containerRef, duration, ease, grid, stagger])

  useEffect(() => {
    return () => {
      triggerRef.current?.kill()
    }
  }, [])

  const handleMouseEnter = (item: T) => {
    if (!scaleOnHover && !colorShiftOnHover) return

    const selector = `[data-masonry-key="${item.id}"]`
    if (scaleOnHover) {
      gsap.to(selector, {
        scale: hoverScale,
        duration: 0.28,
        ease: 'power2.out',
      })
    }

    if (colorShiftOnHover) {
      gsap.to(`${selector} .masonry-color-overlay`, {
        opacity: 0.22,
        duration: 0.28,
      })
    }
  }

  const handleMouseLeave = (item: T) => {
    const selector = `[data-masonry-key="${item.id}"]`
    if (scaleOnHover) {
      gsap.to(selector, {
        scale: 1,
        duration: 0.28,
        ease: 'power2.out',
      })
    }

    if (colorShiftOnHover) {
      gsap.to(`${selector} .masonry-color-overlay`, {
        opacity: 0,
        duration: 0.28,
      })
    }
  }

  return (
    <div
      ref={containerRef}
      style={{
        position: 'relative',
        width: '100%',
        height: totalHeight || 1,
      }}
    >
      {grid.map((item) => (
        <div
          key={item.id}
          data-masonry-key={item.id}
          onMouseEnter={() => handleMouseEnter(item)}
          onMouseLeave={() => handleMouseLeave(item)}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            padding: 0,
            willChange: 'transform, width, height, opacity',
            transformOrigin: 'center center',
          }}
        >
          <div
            style={{
              position: 'relative',
              width: '100%',
              height: '100%',
            }}
          >
            {colorShiftOnHover && (
              <div
                className="masonry-color-overlay"
                style={{
                  position: 'absolute',
                  inset: 0,
                  opacity: 0,
                  pointerEvents: 'none',
                  background:
                    'linear-gradient(135deg, rgba(74,222,128,0.18), rgba(0,180,255,0.16))',
                }}
              />
            )}
            {renderItem(item)}
          </div>
        </div>
      ))}
    </div>
  )
}
