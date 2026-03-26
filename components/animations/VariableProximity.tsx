'use client'
import { forwardRef, useMemo, useRef, useEffect, RefObject } from 'react'
import { motion } from 'motion/react'

function useAnimationFrame(callback: () => void) {
  useEffect(() => {
    let frameId: number
    const loop = () => {
      callback()
      frameId = requestAnimationFrame(loop)
    }
    frameId = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(frameId)
  }, [callback])
}

function useMousePositionRef(containerRef: RefObject<HTMLElement | null>) {
  const positionRef = useRef({ x: 0, y: 0 })
  useEffect(() => {
    const updatePosition = (x: number, y: number) => {
      if (containerRef?.current) {
        const rect = containerRef.current.getBoundingClientRect()
        positionRef.current = { x: x - rect.left, y: y - rect.top }
      } else {
        positionRef.current = { x, y }
      }
    }
    const handleMouseMove = (ev: MouseEvent) => updatePosition(ev.clientX, ev.clientY)
    const handleTouchMove = (ev: TouchEvent) => {
      const touch = ev.touches[0]
      updatePosition(touch.clientX, touch.clientY)
    }
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('touchmove', handleTouchMove)
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('touchmove', handleTouchMove)
    }
  }, [containerRef])
  return positionRef
}

interface VariableProximityProps {
  label: string
  fromFontVariationSettings: string
  toFontVariationSettings: string
  containerRef: RefObject<HTMLElement | null>
  radius?: number
  falloff?: 'linear' | 'exponential' | 'gaussian'
  className?: string
  onClick?: () => void
  style?: React.CSSProperties
  highlightedWords?: string[]
  highlightStyle?: React.CSSProperties
}

const VariableProximity = forwardRef<HTMLSpanElement, VariableProximityProps>((props, ref) => {
  const {
    label,
    fromFontVariationSettings,
    toFontVariationSettings,
    containerRef,
    radius = 50,
    falloff = 'linear',
    className = '',
    onClick,
    style,
    highlightedWords = [],
    highlightStyle,
  } = props

  const letterRefs = useRef<(HTMLElement | null)[]>([])
  const interpolatedSettingsRef = useRef<string[]>([])
  const mousePositionRef = useMousePositionRef(containerRef)
  const lastPositionRef = useRef({ x: null as number | null, y: null as number | null })

  const parsedSettings = useMemo(() => {
    const parseSettings = (settingsStr: string) =>
      new Map(
        settingsStr.split(',').map(s => s.trim()).map(s => {
          const [name, value] = s.split(' ')
          return [name.replace(/['"]/g, ''), parseFloat(value)] as [string, number]
        })
      )
    const fromSettings = parseSettings(fromFontVariationSettings)
    const toSettings = parseSettings(toFontVariationSettings)
    return Array.from(fromSettings.entries()).map(([axis, fromValue]) => ({
      axis, fromValue, toValue: toSettings.get(axis) ?? fromValue
    }))
  }, [fromFontVariationSettings, toFontVariationSettings])

  const calculateFalloff = (distance: number) => {
    const norm = Math.min(Math.max(1 - distance / radius, 0), 1)
    switch (falloff) {
      case 'exponential': return norm ** 2
      case 'gaussian': return Math.exp(-((distance / (radius / 2)) ** 2) / 2)
      default: return norm
    }
  }

  useAnimationFrame(() => {
    if (!containerRef?.current) return
    const containerRect = containerRef.current.getBoundingClientRect()
    const { x, y } = mousePositionRef.current
    if (lastPositionRef.current.x === x && lastPositionRef.current.y === y) return
    lastPositionRef.current = { x, y }

    letterRefs.current.forEach((letterRef, index) => {
      if (!letterRef) return
      const rect = letterRef.getBoundingClientRect()
      const letterCenterX = rect.left + rect.width / 2 - containerRect.left
      const letterCenterY = rect.top + rect.height / 2 - containerRect.top
      const distance = Math.sqrt(
        (mousePositionRef.current.x - letterCenterX) ** 2 +
        (mousePositionRef.current.y - letterCenterY) ** 2
      )
      if (distance >= radius) {
        letterRef.style.fontVariationSettings = fromFontVariationSettings
        return
      }
      const falloffValue = calculateFalloff(distance)
      const newSettings = parsedSettings.map(({ axis, fromValue, toValue }) => {
        const interpolated = fromValue + (toValue - fromValue) * falloffValue
        return `'${axis}' ${interpolated}`
      }).join(', ')
      interpolatedSettingsRef.current[index] = newSettings
      letterRef.style.fontVariationSettings = newSettings
    })
  })

  const words = label.split(' ')
  let letterIndex = 0

  return (
    <span ref={ref} className={`${className} variable-proximity`} onClick={onClick} style={{ display: 'inline', ...style }}>
      {words.map((word, wordIndex) => (
        <span
          key={wordIndex}
          style={{
            display: 'inline-block',
            whiteSpace: 'nowrap',
            ...(highlightedWords.includes(word) ? highlightStyle : null),
          }}
        >
          {word.split('').map(letter => {
            const currentIndex = letterIndex++
            return (
              <motion.span
                key={currentIndex}
                ref={el => { letterRefs.current[currentIndex] = el }}
                style={{ display: 'inline-block', fontVariationSettings: interpolatedSettingsRef.current[currentIndex] }}
                aria-hidden="true"
              >
                {letter}
              </motion.span>
            )
          })}
          {wordIndex < words.length - 1 && <span style={{ display: 'inline-block' }}>&nbsp;</span>}
        </span>
      ))}
      <span style={{ position: 'absolute', width: 1, height: 1, padding: 0, margin: -1, overflow: 'hidden', clip: 'rect(0,0,0,0)', whiteSpace: 'nowrap', border: 0 }}>{label}</span>
    </span>
  )
})

VariableProximity.displayName = 'VariableProximity'
export default VariableProximity
