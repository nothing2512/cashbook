export const useIncome = () => {
    const { fetchSupabaseList } = useApi()

    const fetchIncomes = async (page: number) => {
        return await fetchSupabaseList("GET", "/", page)
    }

    return {
        fetchIncomes
    }
}