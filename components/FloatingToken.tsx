"use client"

import { useEffect, useState } from "react"

export function FloatingToken() {
  const [position, setPosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const x = Math.random() * window.innerWidth
    const y = Math.random() * window.innerHeight
    setPosition({ x, y })

    const interval = setInterval(() => {
      setPosition((prev) => ({
        x: prev.x + (Math.random() - 0.5) * 2,
        y: prev.y + (Math.random() - 0.5) * 2,
      }))
    }, 50)

    return () => clearInterval(interval)
  }, [])

  return (
    <div
      className="absolute text-yellow-400 animate-pulse"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        transition: "all 0.5s ease-out",
      }}
    >
      ⭐
    </div>
  )
}

