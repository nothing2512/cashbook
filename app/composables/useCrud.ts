const crud = (base: string) => {
    const { fetchSupabaseList, fetchSupabase } = useApi()

    const all = async (page: number, pageSize:number=10) => {
        return await fetchSupabaseList("GET", `/${base}`, page, pageSize)
    }

    const add = async (data: any) => {
        return await fetchSupabase("POST", `/${base}`, data)
    }

    const edit = async (data: any) => {
        return await fetchSupabase("PATCH", `/${base}?id=eq.${data.id}`, data)
    }

    const remove = async (id: any) => {
        return await fetchSupabase("DELETE", `/${base}?id=eq.${id}`)
    }

    return { all, add, edit, remove }
}

export const useCrud = () => {
    return {
        fetchCategory: crud("categories")
    }
}