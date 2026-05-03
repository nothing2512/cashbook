export const useRpc = () => {
    const { fetchSupabaseList } = useApi()

    const fetchAllCategories = async (page: number, pageSize: number) => {
        const now = new Date()
        const data = {
            p_month: now.getMonth() + 1,
            p_year: now.getFullYear()
        }
        return await fetchSupabaseList("POST", "/rpc/monthly_categories", page, pageSize, {}, data)
    }

    const fetchMonthlyBudget = async (page: number, pageSize: number) => {
        const now = new Date()
        const data = {
            p_month: now.getMonth() + 1,
            p_year: now.getFullYear()
        }
        return await fetchSupabaseList("POST", "/rpc/monthly_budget", page, pageSize, {}, data)
    }

    return { fetchAllCategories, fetchMonthlyBudget }
}