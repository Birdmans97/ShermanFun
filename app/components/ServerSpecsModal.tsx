'use client'

import { useEffect, useState } from 'react'

interface ServerSpecs {
  ram: {
    total: string
    used: string
    free: string
    percentage: number
  }
  cpu: {
    usage: number
  }
  storage: {
    total: string
    used: string
    free: string
    percentage: number
  }
  latency: {
    value: number
    unit: string
  }
}

interface ServerSpecsModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function ServerSpecsModal({ isOpen, onClose }: ServerSpecsModalProps) {
  const [specs, setSpecs] = useState<ServerSpecs | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (isOpen) {
      fetchSpecs()
      const interval = setInterval(fetchSpecs, 5000) // Refresh every 5 seconds
      return () => clearInterval(interval)
    }
  }, [isOpen])

  const fetchSpecs = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch('/api/server-specs')
      if (!response.ok) {
        throw new Error('Failed to fetch server specs')
      }
      const data = await response.json()
      setSpecs(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Server Specifications</h2>
          <button className="modal-close" onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>
        <div className="modal-body">
          {loading && !specs && (
            <div className="loading">Loading server specs...</div>
          )}
          {error && (
            <div className="error">Error: {error}</div>
          )}
          {specs && (
            <div className="specs-grid">
              <div className="spec-card">
                <h3>RAM Usage</h3>
                <div className="spec-value">
                  <span className="spec-number">{specs.ram.percentage}%</span>
                </div>
                <div className="spec-details">
                  <div>Used: {specs.ram.used}</div>
                  <div>Free: {specs.ram.free}</div>
                  <div>Total: {specs.ram.total}</div>
                </div>
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{ width: `${specs.ram.percentage}%` }}
                  />
                </div>
              </div>

              <div className="spec-card">
                <h3>CPU Usage</h3>
                <div className="spec-value">
                  <span className="spec-number">{specs.cpu.usage}%</span>
                </div>
                <div className="spec-details">
                  <div>Current CPU utilization</div>
                </div>
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{ width: `${specs.cpu.usage}%` }}
                  />
                </div>
              </div>

              <div className="spec-card">
                <h3>Storage Usage</h3>
                <div className="spec-value">
                  <span className="spec-number">{specs.storage.percentage}%</span>
                </div>
                <div className="spec-details">
                  <div>Used: {specs.storage.used}</div>
                  <div>Free: {specs.storage.free}</div>
                  <div>Total: {specs.storage.total}</div>
                </div>
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{ width: `${specs.storage.percentage}%` }}
                  />
                </div>
              </div>

              <div className="spec-card">
                <h3>Network Latency</h3>
                <div className="spec-value">
                  <span className="spec-number">{specs.latency.value}</span>
                  <span className="spec-unit">{specs.latency.unit}</span>
                </div>
                <div className="spec-details">
                  <div>Ping to 8.8.8.8</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

