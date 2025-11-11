'use client'

import { useEffect } from 'react'

export default function Home() {
  return (
    <main className="container">
      <div className="content">
        <h1>Welcome to ShermanFun</h1>
        <p className="subtitle">A Next.js website built with TypeScript</p>
        <div className="features">
          <div className="feature-card">
            <h2>⚡ Fast</h2>
            <p>Built with Next.js for optimal performance</p>
          </div>
          <div className="feature-card">
            <h2>🔒 Type Safe</h2>
            <p>TypeScript ensures type safety throughout</p>
          </div>
          <div className="feature-card">
            <h2>🎨 Modern</h2>
            <p>Clean and responsive design</p>
          </div>
        </div>
      </div>
    </main>
  )
}

