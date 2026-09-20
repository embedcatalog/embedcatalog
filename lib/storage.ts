const bucket = "project-images"

function getStoragePublicUrl(path: string) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL

  if (!supabaseUrl) {
    return `/images/${path}`
  }

  return `${supabaseUrl}/storage/v1/object/public/${bucket}/${path}`
}

export { bucket, getStoragePublicUrl }