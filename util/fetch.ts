const oktaFetch = async <T>(url: string, apiKey: string) => {
  const server = process.env.NEXT_PUBLIC_API_SERVER
  const endpoint = (!url.startsWith('https') ? server : '') + url

  const response = await fetch(endpoint, {
    headers: {
      Authorization: 'SSWS ' + apiKey
    }
  })
  const data: T[] = await response.json()

  return data
}

export default oktaFetch
