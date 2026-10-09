import { readFile } from "node:fs/promises"
import { join } from "node:path"
import { ImageResponse } from "next/og"

import { getEmbedTheme, type EmbedTheme } from "lib/embed"

const imageColors = {
  light: {
    background: "#ffffff",
    border: "#d4d4d4",
    text: "#171717",
    muted: "#737373",
  },
  dark: {
    background: "#171717",
    border: "#404040",
    text: "#fafafa",
    muted: "#a3a3a3",
  },
} as const

async function loadFont() {
  return readFile(join(process.cwd(), "assets/fonts/Geist-SemiBold.ttf"))
}

export async function renderEmbedImage(
  lines: string[],
  size: { width: number; height: number },
  theme: EmbedTheme
) {
  const colors = getEmbedTheme(theme)
  const font = await loadFont()

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: colors.background,
        border: `1px solid ${colors.border}`,
        borderRadius: 4,
        paddingLeft: 12,
        paddingRight: 12,
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: lines.length > 1 ? 2 : 0,
        }}
      >
        {lines.map((line) => (
          <div
            key={line}
            style={{
              display: "flex",
              color: colors.text,
              fontSize: 12,
              fontWeight: 600,
              fontFamily: "Geist SemiBold",
              whiteSpace: "nowrap",
              lineHeight: 1.2,
            }}
          >
            {line}
          </div>
        ))}
      </div>
    </div>,
    {
      ...size,
      fonts: [
        {
          name: "Geist SemiBold",
          data: font,
          style: "normal",
          weight: 600,
        },
      ],
    }
  )
}

export async function renderCustomEmbedImage(
  title: string,
  description: string,
  theme: EmbedTheme
) {
  const colors = imageColors[theme]
  const font = await loadFont()

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        background: colors.background,
        border: `1px solid ${colors.border}`,
        borderRadius: 4,
        padding: "14px 16px",
      }}
    >
      <div
        style={{
          display: "flex",
          color: colors.text,
          fontSize: 14,
          fontWeight: 600,
          fontFamily: "Geist SemiBold",
          lineHeight: 1.4,
          whiteSpace: "nowrap",
          overflow: "hidden",
        }}
      >
        {title}
      </div>
      {description.trim() ? (
        <div
          style={{
            display: "flex",
            marginTop: 4,
            color: colors.muted,
            fontSize: 12,
            fontWeight: 600,
            fontFamily: "Geist SemiBold",
            lineHeight: 1.5,
            maxHeight: 36,
            overflow: "hidden",
          }}
        >
          {description}
        </div>
      ) : null}
    </div>,
    {
      width: 320,
      height: 84,
      fonts: [
        {
          name: "Geist SemiBold",
          data: font,
          style: "normal",
          weight: 600,
        },
      ],
    }
  )
}
