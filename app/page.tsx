'use client'
import { startTransition, useEffect, useState } from 'react'
import CustomCursor from '@/components/CustomCursor'
import ClickSpark from '@/components/ClickSpark'
import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import About from '@/components/About'
import Programs from '@/components/Programs'
import Skills from '@/components/Skills'
import Testimonials from '@/components/Testimonials'
import Solutions from '@/components/Solutions'
import Contact from '@/components/Contact'
import Loader from '@/components/Loader'

export default function Home() {
  const [loaded, setLoaded] = useState(false)
  const [showRest, setShowRest] = useState(false)

  useEffect(() => {
    if (!loaded) return

    let secondFrame = 0
    const firstFrame = requestAnimationFrame(() => {
      secondFrame = requestAnimationFrame(() => {
        startTransition(() => setShowRest(true))
      })
    })

    return () => {
      cancelAnimationFrame(firstFrame)
      if (secondFrame) cancelAnimationFrame(secondFrame)
    }
  }, [loaded])

  return (
    <>
      <Loader onComplete={() => setLoaded(true)} />
      <div className="noise-overlay" />
      <CustomCursor />
      {loaded && (
        <ClickSpark
          sparkColor="#4ade80"
          sparkSize={18}
          sparkRadius={40}
          sparkCount={8}
          duration={400}
        >
          <Navbar />
          <main>
            <Hero />
            {showRest && (
              <>
                <About />
                <Programs />
                <Skills />
                <Testimonials />
                <Solutions />
                <Contact />
              </>
            )}
          </main>
        </ClickSpark>
      )}
    </>
  )
}
