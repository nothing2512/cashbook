// /composables/useApi.ts
export const useApi = () => {
  const config = useRuntimeConfig()

  const fetchSupabase = async (method:any, endpoint:string, body:any) => {
    let headers = {}

    const token = useCookie('token')
    if (!token.value) {
      headers = {
        "apikey": config.public.supabaseApiKey,
        "Authorization": `Bearer ${token.value}`
      }
    } else {
      headers = {
        "apikey": config.public.supabaseApiKey
      }
    }
    
    try {
      return await $fetch(endpoint, {
        baseURL: config.public.supabaseUrl,
        method: method,
        body: body,
        headers: headers,
      })
    } catch (err: any) {
      if (err?.response?.status === 401) {
        const token = useCookie('token')
        token.value = null

        return navigateTo('/login')
      }

      throw err
    }
  }

  const fetchLogin = async (email:string, password:string) => {
    try {
      return await $fetch("/auth/v1/token?grant_type=password", {
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
    } catch (err: any) {
      throw err
    }
  }

  const fetchAllCategories = async () => {
    return await fetchSupabase("GET", "/categories", null)
  }

  return {
    fetchAllCategories,
    fetchLogin,
  }
}