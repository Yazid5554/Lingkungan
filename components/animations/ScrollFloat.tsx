'use client'
import { useEffect, useMemo, useRef, RefObject, CSSProperties } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface ScrollFloatProps {
  children: string
  scrollContainerRef?: RefObject<HTMLElement>
  containerClassName?: string
  textClassName?: string
  animationDuration?: number
  ease?: string
  scrollStart?: string
  scrollEnd?: string
  stagger?: number
  tag?: string
  style?: CSSProperties
}

export default function ScrollFloat({
  children,
  scrollContainerRef,
  containerClassName = '',
  textClassName = '',
  animationDuration = 1.2,
  ease = 'back.inOut(2)',
  scrollStart = 'top bottom-=10%',
  scrollEnd = 'top center',
  stagger = 0.04,
  tag = 'h2',
  style,
}: ScrollFloatProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  const splitText = useMemo(() => {
    const text = typeof children === 'string' ? children : ''

    return text.split(' ').map((word, wordIndex, arr) => (
      <span
        key={wordIndex}
        style={{
          display: 'inline-block',
          overflow: 'hidden',
          verticalAlign: 'bottom',
          // Tambah spasi antar kata kecuali kata terakhir
          marginRight: wordIndex < arr.length - 1 ? '0.25em' : undefined,
        }}
      >
        {word.split('').map((char, charIndex) => (
          <span
            key={charIndex}
            className="sf-char"
            style={{ display: 'inline-block' }}
          >
            {char}
          </span>
        ))}
      </span>
    ))
  }, [children])

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const scroller = scrollContainerRef?.current ?? window
    const charEls = el.querySelectorAll('.sf-char')

    gsap.fromTo(
      charEls,
      {
        willChange: 'opacity, transform',
        opacity: 0,
        yPercent: 120,
        scaleY: 2.3,
        scaleX: 0.7,
        transformOrigin: '50% 0%',
      },
      {
        duration: animationDuration,
        ease,
        opacity: 1,
        yPercent: 0,
        scaleY: 1,
        scaleX: 1,
        stagger,
        scrollTrigger: {
          trigger: el,
          scroller,
          start: scrollStart,
          end: scrollEnd,
          scrub: 1,
        },
      }
    )

    return () => {
      ScrollTrigger.getAll().forEach(st => {
        if (st.trigger === el) st.kill()
      })
    }
  }, [scrollContainerRef, animationDuration, ease, scrollStart, scrollEnd, stagger])

  const Tag = tag as 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'div' | 'span'

  return (
    <Tag
      ref={containerRef as React.Ref<HTMLDivElement>}
      className={`scroll-float-wrap ${containerClassName}`}
      // ↓ overflow: hidden DIHAPUS dari sini
      style={{ margin: 0, ...style }}
    >
      <span
        className={`scroll-float-text ${textClassName}`}
        style={{ display: 'block' }}  // ← block biar kata bisa wrap natural
      >
        {splitText}
      </span>
    </Tag>
  )
}