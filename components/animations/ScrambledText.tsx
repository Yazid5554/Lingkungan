'use client'
import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { SplitText } from 'gsap/SplitText'
import { ScrambleTextPlugin } from 'gsap/ScrambleTextPlugin'

gsap.registerPlugin(SplitText, ScrambleTextPlugin)

interface ScrambledTextProps {
  children: string
  radius?: number
  duration?: number
  speed?: number
  scrambleChars?: string
  className?: string
  style?: React.CSSProperties
}

export default function ScrambledText({
  children,
  radius = 100,
  duration = 1.2,
  speed = 0.5,
  scrambleChars = '.:',
  className = '',
  style = {},
}: ScrambledTextProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const charsRef = useRef<Element[]>([])

  useEffect(() => {
    if (!rootRef.current) return
    const p = rootRef.current.querySelector('p')
    if (!p) return

    const split = SplitText.create(p, { type: 'chars', charsClass: 'char' })
    charsRef.current = split.chars

    charsRef.current.forEach(c => {
      gsap.set(c, { display: 'inline-block', attr: { 'data-content': (c as HTMLElement).innerHTML } })
    })

    const handleMove = (e: PointerEvent) => {
      charsRef.current.forEach(c => {
        const { left, top, width, height } = c.getBoundingClientRect()
        const dx = e.clientX - (left + width / 2)
        const dy = e.clientY - (top + height / 2)
        const dist = Math.hypot(dx, dy)
        if (dist < radius) {
          gsap.to(c, {
            overwrite: true,
            duration: duration * (1 - dist / radius),
            scrambleText: { text: (c as HTMLElement).dataset.content || '', chars: scrambleChars, speed },
            ease: 'none',
          })
        }
      })
    }

    const el = rootRef.current
    el.addEventListener('pointermove', handleMove)
    return () => {
      el.removeEventListener('pointermove', handleMove)
      split.revert()
    }
  }, [radius, duration, speed, scrambleChars])

  return (
    <div ref={rootRef} className={className} style={style}>
      <p style={{ margin: 0 }}>{children}</p>
    </div>
  )
}
