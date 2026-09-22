import Image from 'next/image'
import type { Photo } from '@/lib/photos'

export default function PhotoGrid({ photos }: { photos: Photo[] }) {
  if (photos.length === 0) {
    return (
      <p className="font-body text-sm text-[var(--c-txt-1)]">
        No photos in this collection yet.
      </p>
    )
  }

  return (
    <div className="columns-1 sm:columns-2 lg:columns-3 gap-4">
      {photos.map((photo) => (
        <figure key={photo.src} className="mb-4 break-inside-avoid">
          <Image
            src={photo.src}
            alt=""
            width={photo.width}
            height={photo.height}
            className="w-full h-auto rounded-lg"
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          />
          {photo.location && (
            <figcaption className="mt-1.5 font-body text-xs tracking-wide text-[var(--c-txt-3)]">
              {photo.location}
            </figcaption>
          )}
        </figure>
      ))}
    </div>
  )
}
