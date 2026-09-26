import { ImageResponse } from "next/og"

import { getPublishedProjects } from "lib/supabase/projects"
import { getProjectImageUrl } from "lib/storage"
import { siteConfig } from "lib/site"

export const alt = "Project preview"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"
export const dynamic = "force-static"

export async function generateStaticParams() {
  const projects = await getPublishedProjects()
  return projects.map((project) => ({ slug: project.slug }))
}

export default async function OpenGraphImage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const projects = await getPublishedProjects()
  const project = projects.find((item) => item.slug === slug)

  if (!project) {
    return new ImageResponse(
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#f5f5f5",
          color: "#171717",
          fontSize: 48,
          fontWeight: 700,
        }}
      >
        {siteConfig.name}
      </div>,
      size
    )
  }

  let imageSource: string | undefined
  const firstImage = project.images[0]
  if (firstImage) {
    try {
      const imageUrl = getProjectImageUrl(firstImage)
      const response = await fetch(imageUrl)
      if (response.ok) {
        const image = await response.arrayBuffer()
        const mimeType = response.headers.get("content-type") ?? "image/png"
        imageSource = `data:${mimeType};base64,${Buffer.from(image).toString("base64")}`
      }
    } catch {
      imageSource = undefined
    }
  }

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "40px 64px 36px",
        background: "#f5f5f5",
        color: "#171717",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          width: "100%",
          height: 390,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          border: "2px solid #d4d4d4",
          borderRadius: 20,
          background: "#ffffff",
        }}
      >
        {imageSource ? (
          <img
            src={imageSource}
            alt=""
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
            }}
          />
        ) : (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#737373",
              fontSize: 32,
            }}
          >
            {project.name}
          </div>
        )}
      </div>
      <div
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          marginTop: 22,
        }}
      >
        <div
          style={{
            display: "flex",
            maxWidth: "100%",
            overflow: "hidden",
            color: "#171717",
            fontSize: 32,
            fontWeight: 700,
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {project.name} - {siteConfig.name}
        </div>
        <div
          style={{
            display: "flex",
            maxWidth: "100%",
            marginTop: 8,
            overflow: "hidden",
            color: "#525252",
            fontSize: 20,
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {project.description}
        </div>
      </div>
    </div>,
    size
  )
}
