import { copyFile, mkdir, readdir, stat } from "node:fs/promises"
import { basename, dirname, join } from "node:path"

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
      // → /embed/{slug}/{kind}.png or {kind}-dark.png
      const theme = basename(dirname(full))
      const kind = basename(dirname(dirname(full)))
      const slugDir = dirname(dirname(dirname(full)))
      const fileName = theme === "dark" ? `${kind}-dark.png` : `${kind}.png`

      await mkdir(slugDir, { recursive: true })
      await copyFile(full, join(slugDir, fileName))
    })
  )
}

await walk(join(process.cwd(), "out/embed"))
console.log("Copied embed images to {kind}.png / {kind}-dark.png")
