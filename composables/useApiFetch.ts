import type { UseFetchOptions } from 'nuxt/app'

export function useApiFetch<T>(path: string, options: UseFetchOptions<T> = {}) {
  let headers: any = {
    referer: 'http://localhost:3000',
  }

  const token = useCookie('XSRF-TOKEN')
  const config = useRuntimeConfig()

  if (token.value) {
    headers['X-XSRF-TOKEN'] = token.value as string
  }

  if (process.server) {
    headers = {
      ...headers,
      ...useRequestHeaders(['cookie']),
    }
  }

  return useFetch(config.public.apiUrl + path, {
    credentials: 'include',
    ...options,
    watch: false,
    headers: {
      ...headers,
      ...options.headers,
    },
  })
}
