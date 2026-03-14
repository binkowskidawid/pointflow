export async function serverFetch<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const baseUrl = process.env.NEXT_PUBLIC_API_GATEWAY_URL || 'http://localhost:3001'

  const response = await fetch(`${baseUrl}/api/v1${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  })

  if (!response.ok) throw new Error(`API Error: ${response.statusText}`)

  return response.json()
}
