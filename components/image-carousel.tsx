"use client"

import * as React from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight, X } from "lucide-react"

import { cn } from "lib/utils"

function ImageCarousel({
  images,
  alt,
}: {
  images: string[]
  alt: string
}) {
  const [index, setIndex] = React.useState(0)
  const [modalOpen, setModalOpen] = React.useState(false)

  const count = images.length
  const goTo = React.useCallback(
    (next: number) => setIndex((next + count) % count),
    [count]
  )

  React.useEffect(() => {
    if (!modalOpen) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setModalOpen(false)
      if (event.key === "ArrowLeft") goTo(index - 1)
      if (event.key === "ArrowRight") goTo(index + 1)
    }

    document.addEventListener("keydown", onKeyDown)
    document.body.style.overflow = "hidden"
    return () => {
      document.removeEventListener("keydown", onKeyDown)
      document.body.style.overflow = ""
    }
  }, [modalOpen, index, goTo])

  if (images.length === 0) {
    return null
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="bg-muted relative aspect-video w-full overflow-hidden rounded-xl border">
        <button
          type="button"
          aria-label="View image full screen"
          onClick={() => setModalOpen(true)}
          className="absolute inset-0 z-10 cursor-zoom-in"
        />
        <Image
          key={images[index]}
          src={images[index]}
          alt={`${alt} — ${index + 1}`}
          fill
          unoptimized
          sizes="(min-width: 768px) 768px, 100vw"
          className="object-cover"
        />

        {count > 1 && (
          <>
            <button
              type="button"
              aria-label="Previous image"
              onClick={() => goTo(index - 1)}
              className="bg-background/70 hover:bg-background absolute top-1/2 left-2 z-20 flex size-9 -translate-y-1/2 items-center justify-center rounded-full border backdrop-blur transition-colors"
            >
              <ChevronLeft className="size-4" />
            </button>
            <button
              type="button"
              aria-label="Next image"
              onClick={() => goTo(index + 1)}
              className="bg-background/70 hover:bg-background absolute top-1/2 right-2 z-20 flex size-9 -translate-y-1/2 items-center justify-center rounded-full border backdrop-blur transition-colors"
            >
              <ChevronRight className="size-4" />
            </button>

            <div className="bg-background/70 text-foreground absolute right-2 bottom-2 z-20 rounded-md border px-2 py-0.5 text-xs backdrop-blur">
              {index + 1} / {count}
            </div>
          </>
        )}
      </div>

      {count > 1 && (
        <div className="flex flex-wrap gap-2">
          {images.map((image, i) => (
            <button
              key={image}
              type="button"
              aria-label={`Go to image ${i + 1}`}
              aria-current={i === index}
              onClick={() => setIndex(i)}
              className={cn(
                "bg-muted relative aspect-video w-20 shrink-0 overflow-hidden rounded-md border transition-opacity",
                i === index
                  ? "ring-ring ring-2 ring-offset-2"
                  : "opacity-60 hover:opacity-100"
              )}
            >
              <Image
                src={image}
                alt={`${alt} thumbnail ${i + 1}`}
                fill
                unoptimized
                sizes="80px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {modalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${alt} — image ${index + 1} of ${count}`}
          onClick={() => setModalOpen(false)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm sm:p-8"
        >
          <button
            type="button"
            aria-label="Close"
            onClick={() => setModalOpen(false)}
            className="absolute top-4 right-4 flex size-10 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white transition-colors hover:bg-white/20"
          >
            <X className="size-5" />
          </button>

          <div
            className="relative flex max-h-full w-full max-w-5xl items-center justify-center"
            onClick={(event) => event.stopPropagation()}
          >
            <Image
              key={images[index]}
              src={images[index]}
              alt={`${alt} — ${index + 1}`}
              width={1600}
              height={900}
              unoptimized
              sizes="100vw"
              className="max-h-[85vh] w-auto rounded-lg object-contain"
            />

            {count > 1 && (
              <>
                <button
                  type="button"
                  aria-label="Previous image"
                  onClick={() => goTo(index - 1)}
                  className="absolute top-1/2 left-2 flex size-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white transition-colors hover:bg-white/20 sm:-left-16"
                >
                  <ChevronLeft className="size-5" />
                </button>
                <button
                  type="button"
                  aria-label="Next image"
                  onClick={() => goTo(index + 1)}
                  className="absolute top-1/2 right-2 flex size-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white transition-colors hover:bg-white/20 sm:-right-16"
                >
                  <ChevronRight className="size-5" />
                </button>

                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-md border border-white/20 bg-black/50 px-2.5 py-1 text-xs text-white">
                  {index + 1} / {count}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export { ImageCarousel }
