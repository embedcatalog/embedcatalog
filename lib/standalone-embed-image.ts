export type StandaloneEmbedTheme = "light" | "dark"

const imageWidth = 320
const imageHeight = 84

function fitText(
  context: CanvasRenderingContext2D,
  text: string,
  maxWidth: number
) {
  let result = text
  while (result && context.measureText(result).width > maxWidth) {
    result = `${result.slice(0, -2).trimEnd()}...`
  }
  return result
}

function wrapDescription(
  context: CanvasRenderingContext2D,
  description: string,
  maxWidth: number
) {
  const words = description.trim().split(/\s+/).filter(Boolean)
  const lines: string[] = []
  let line = ""

  for (const word of words) {
    const nextLine = line ? `${line} ${word}` : word
    if (context.measureText(nextLine).width <= maxWidth) {
      line = nextLine
      continue
    }

    if (line) lines.push(line)
    line = word
    if (lines.length === 1) break
  }

  if (line && lines.length < 2) lines.push(line)
  if (lines.length === 2 && words.join(" ") !== lines.join(" ")) {
    lines[1] = fitText(context, `${lines[1]}...`, maxWidth)
  }
  return lines
}

function renderStandaloneEmbedImage(
  title: string,
  description: string,
  theme: StandaloneEmbedTheme
) {
  const canvas = document.createElement("canvas")
  canvas.width = imageWidth * 2
  canvas.height = imageHeight * 2

  const context = canvas.getContext("2d")
  if (!context) throw new Error("Could not create an embed image.")

  context.scale(2, 2)
  context.fillStyle = theme === "dark" ? "#171717" : "#ffffff"
  context.fillRect(0, 0, imageWidth, imageHeight)
  context.strokeStyle = theme === "dark" ? "#404040" : "#d4d4d4"
  context.lineWidth = 1
  context.strokeRect(0.5, 0.5, imageWidth - 1, imageHeight - 1)

  context.fillStyle = theme === "dark" ? "#fafafa" : "#171717"
  context.font = "600 14px Arial, sans-serif"
  context.textBaseline = "top"
  context.fillText(fitText(context, title, 288), 16, 16)

  if (description.trim()) {
    context.fillStyle = theme === "dark" ? "#a3a3a3" : "#737373"
    context.font = "12px Arial, sans-serif"
    wrapDescription(context, description, 288).forEach((line, index) => {
      context.fillText(line, 16, 40 + index * 16)
    })
  }

  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob)
      else reject(new Error("Could not encode the embed image."))
    }, "image/png")
  })
}

export { imageHeight, imageWidth, renderStandaloneEmbedImage }
