const crud = (base: string) => {
    const { fetchSupabaseList, fetchSupabase } = useApi()

    const all = async (page: number, pageSize:number=10) => fetchSupabaseList("GET", `/${base}?order=id.asc`, page, pageSize)

    const add = async (data: any) => fetchSupabase("POST", `/${base}`, data)

    const edit = async (data: any) => fetchSupabase("PATCH", `/${base}?id=eq.${data.id}`, data)

    const remove = async (id: any) => fetchSupabase("DELETE", `/${base}?id=eq.${id}`)

    return { all, add, edit, remove }
}

export const useCrud = () => {
    return {
        fetchCategory: crud("categories"),
        fetchAccount: crud("savings"),
        fetchTransaction: crud("transactions"),
        fetchInstalment: crud("instalments")
    }
}