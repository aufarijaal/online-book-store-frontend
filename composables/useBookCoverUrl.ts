export function useBookCoverUrl(filename: string | undefined) {
  const config = useRuntimeConfig()
  const imageUrl = `${config.public.bookCoversUrl}${filename}`

  return imageUrl
}
