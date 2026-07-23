import { copyFile, mkdir, readdir, stat } from "node:fs/promises"
import { basename, dirname, join } from "node:path"

import { getEmbedFileName, type EmbedKind, type EmbedTheme } from "../lib/embed"

async function walk(dir: string) {
  const entries = await readdir(dir)
  await Promise.all(
    entries.map(async (name) => {
      const full = join(dir, name)
      const info = await stat(full)
      if (info.isDirectory()) {
        await walk(full)
        return
      }
      if (name !== "opengraph-image") {
        return
      }

      // /embed/{slug}/{kind}/{theme}/opengraph-image
      // → /embed/{slug}/license.png
      // → /embed/{slug}/license.theme-light.png
      // → /embed/{slug}/license.theme-dark.png
      const theme = basename(dirname(full)) as EmbedTheme
      const kind = basename(dirname(dirname(full))) as EmbedKind
      const slugDir = dirname(dirname(dirname(full)))

      await mkdir(slugDir, { recursive: true })
      await copyFile(full, join(slugDir, getEmbedFileName(kind, theme)))

      if (theme === "light") {
        await copyFile(full, join(slugDir, `${kind}.theme-light.png`))
      }
    })
  )
}

await walk(join(process.cwd(), "out/embed"))
console.log(
  "Copied embed images to {kind}.png / {kind}.theme-light.png / {kind}.theme-dark.png"
)
