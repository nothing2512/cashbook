export const useDashboard = () => {
    const { fetchSupabaseList } = useApi()

    const fetchMonthlyList = async (table: String, kind: string) => {
        const today = new Date()
        let key = (today.getFullYear() * 100) + (today.getMonth() + 1)
        const response: any = await fetchSupabaseList("GET", `/${table}?order=key.desc&key=lte.${key}&kind=eq.${kind}`, 1, 12)

        let data = []

        for (let i = 0; i < 12; i++) {
            key = (today.getFullYear() * 100) + (today.getMonth() + 1)
            let exists = false
            for (const item of response.data) {
                if (item.key == key) {
                    data.push(item.total_amount)
                    exists = true
                    break
                }
            }
            if (!exists) {
                data.push(0)
            }
            if (today.getMonth() == 1) {
                today.setMonth(11)
                today.setFullYear(today.getFullYear() - 1)
            } else {
                today.setMonth(today.getMonth() - 1)
            }
        }

        return { data, now: data[0] || 0 }
    }

    const fetchMonthlyIncome = async () => await fetchMonthlyList("monthly_report", "income")

    const fetchMonthlyExpenes = async () => await fetchMonthlyList("monthly_report", "expenses")

    const fetchMonthlyIncomeDebt = async () => await fetchMonthlyList("monthly_debt", "income")

    const fetchMonthlyExpenesDebt = async () => await fetchMonthlyList("monthly_debt", "expenses")

    return { fetchDashboard: { fetchMonthlyIncome, fetchMonthlyExpenes, fetchMonthlyIncomeDebt, fetchMonthlyExpenesDebt } }
}