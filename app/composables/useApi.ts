// /composables/useApi.ts
export const useApi = () => {
  const config = useRuntimeConfig()

  const fetchSupabase = async (method: any, endpoint: string, body?: any) => {
    if (body) delete(body.id)
    const token = useCookie('token')
    if (!token.value) {
      return navigateTo('/login')
    }

    let headers = {
      "apikey": config.public.supabaseApiKey,
      "Authorization": `Bearer ${token.value}`
    }

    try {
      const response = await $fetch.raw(endpoint, {
        baseURL: config.public.supabaseUrl,
        method: method,
        body: body,
        headers: headers,
      })
      return {
        data: response._data,
        headers: response.headers
      }
    } catch (err: any) {
      if (err?.response?.status === 401) {
        const token = useCookie('token')
        token.value = null

        return navigateTo('/login')
      }

      throw err.response._data
    }
  }

  const fetchSupabaseList = async (method: any, endpoint: string, page: number, pageSize:number=10) => {
    const token = useCookie('token')
    if (!token.value) {
      return navigateTo('/login')
    }

    let headers = {
      "apikey": config.public.supabaseApiKey,
      "Authorization": `Bearer ${token.value}`,
      "Prefer": "count=exact",
      "Range": ""
    }

    try {

      if (page < 0) page = 0;
      if (page > 0) {
        const start = (page - 1) * pageSize
        const end = start + pageSize - 1
        headers["Range"] = `${start}-${end}`
      }

      const response = await $fetch.raw(endpoint, {
        baseURL: config.public.supabaseUrl,
        method: method,
        headers: headers,
      })

      const contentRange = response.headers.get("content-range")
      const totalData = Number(contentRange?.split("/")[1])

      return {
        data: response._data,
        headers: response.headers,
        totalData: totalData,
        totalPage: Math.ceil(totalData / pageSize)
      }
    } catch (err: any) {
      if (err?.response?.status === 401) {
        const token = useCookie('token')
        token.value = null

        return navigateTo('/login')
      }

      throw err.response._data
    }
  }

  const fetchLogin = async (email: string, password: string) => {
    try {
      const response = await $fetch.raw("/auth/v1/token?grant_type=password", {
        method: "POST",
        baseURL: config.public.supabaseUrl!.split("/rest/v1")[0],
        body: {
          email: email,
          password: password
        },
        headers: {
          "apikey": config.public.supabaseApiKey
        },
      })
      return {
        data: response._data,
        headers: response.headers
      }
    } catch (err: any) {
      throw err.response._data
    }
  }

  return {
    fetchLogin,
    fetchSupabase,
    fetchSupabaseList
  }
}