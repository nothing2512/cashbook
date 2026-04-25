export const useTransaction = () => {
    const { fetchSupabase, fetchSupabaseList } = useApi()

    const incomes = async (page: number, pageSize:number=10) => {
        return await fetchSupabaseList("GET", `/transactions?select=*,savings(name),categories(name)&order=transaction_date.desc&kind=eq.income&status=eq.paid&is_debt=eq.false`, page, pageSize)
    }

    const expenses = async (page: number, pageSize:number=10) => {
        return await fetchSupabaseList("GET", `/transactions?select=*,savings(name),categories(name)&order=transaction_date.desc&kind=eq.expenses&status=eq.paid&is_debt=eq.false`, page, pageSize)
    }

    const debts = async (page: number, paidOff: string, pageSize:number=10) => {
        let query = ""
        if (paidOff == "paidoff") query = "&paid_off=eq.true"
        if (paidOff == "unpaidoff") query = "&paid_off=eq.false"
        return await fetchSupabaseList("GET", `/transaction_views?select=*,savings(name),categories(name)&order=transaction_date.desc&kind=eq.income&status=eq.unpaid&is_debt=eq.true${query}`, page, pageSize)
    }

    const receivables = async (page: number, paidOff: string, pageSize:number=10) => {
        let query = ""
        if (paidOff == "paidoff") query = "&paid_off=eq.true"
        if (paidOff == "unpaidoff") query = "&paid_off=eq.false"
        return await fetchSupabaseList("GET", `/transaction_views?select=*,savings(name),categories(name)&order=transaction_date.desc&kind=eq.expenses&status=eq.unpaid&is_debt=eq.true${query}`, page, pageSize)
    }

    const body = (data: any) => {
        return {
            saving_id: data.saving_id,
            category_id: data.category_id,
            title: data.title,
            description: data.description,
            amount: data.amount,
            kind: data.kind,
            status: data.status,
            transaction_date: data.transaction_date,
            parent_id: data.parent_id,
            is_debt: data.is_debt
        }
    }

    const add = async (data: any) => {
        return await fetchSupabase("POST", `/transactions`, body(data))
    }

    const edit = async (data: any) => {
        return await fetchSupabase("PATCH", `/transactions?id=eq.${data.id}`, body(data))
    }

    const remove = async (id: any) => {
        return await fetchSupabase("DELETE", `/transactions?id=eq.${id}`)
    }

    return { fetchTransaction: { add, edit, remove, incomes, expenses, debts, receivables } }
}