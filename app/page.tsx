'use client'

import { useEffect, useState, ChangeEvent } from 'react'
import ServerSpecsModal from './components/ServerSpecsModal'

const placeholders = Array.from({ length: 9 }, (_, index) => index + 1)

type PhotoGrid = Array<string | null>

export default function Home() {
  const [photos, setPhotos] = useState<PhotoGrid>(Array(9).fill(null))
  const [isSpecsModalOpen, setIsSpecsModalOpen] = useState(false)

  const handlePhotoUpload = (index: number) => (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]

    if (!file) {
      return
    }

    const url = URL.createObjectURL(file)

    setPhotos((prev) => {
      const next = [...prev]

      if (next[index]) {
        URL.revokeObjectURL(next[index] as string)
      }

      next[index] = url
      return next
    })
  }

  useEffect(() => {
    return () => {
      photos.forEach((url) => {
        if (url) {
          URL.revokeObjectURL(url)
        }
      })
    }
  }, [photos])

  return (
    <>
      <button
        className="server-specs-link"
        onClick={() => setIsSpecsModalOpen(true)}
        aria-label="View server specifications"
      >
        Server Specs
      </button>
      <ServerSpecsModal
        isOpen={isSpecsModalOpen}
        onClose={() => setIsSpecsModalOpen(false)}
      />
      <main className="gallery">
        <h1 className="gallery__title">ShermanFun Gallery</h1>
        <p className="gallery__subtitle">Click a square to add your own picture</p>
        <div className="gallery__grid">
        {placeholders.map((item, index) => (
          <label key={item} className="gallery__cell">
            <input
              className="gallery__file-input"
              type="file"
              accept="image/*"
              onChange={handlePhotoUpload(index)}
            />
            {photos[index] ? (
              <img
                src={photos[index] as string}
                alt={`Uploaded photo ${item}`}
                className="gallery__preview"
              />
            ) : (
              <span className="gallery__cell-label">Add photo {item}</span>
            )}
          </label>
        ))}
      </div>
    </main>
    </>
  )
}

