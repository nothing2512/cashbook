export const useTransaction = () => {
    const { fetchSupabase, fetchSupabaseList } = useApi()

    const incomes = async (page: number, pageSize:number=10) => fetchSupabaseList("GET", `/transactions?select=*,savings(name),categories(name)&order=transaction_date.desc&kind=eq.income&status=eq.paid&is_debt=eq.false&parent_id=is.null`, page, pageSize)

    const expenses = async (page: number, pageSize:number=10) => fetchSupabaseList("GET", `/transactions?select=*,savings(name),categories(name)&order=transaction_date.desc&kind=eq.expenses&status=eq.paid&is_debt=eq.false&parent_id=is.null`, page, pageSize)

    const settlements = async (id: number, page: number, pageSize:number=10) => fetchSupabaseList("GET", `/transactions?select=*,savings(name),categories(name)&order=transaction_date.desc&parent_id=eq.${id}`, page, pageSize)

    const detail = async (id: number) => fetchSupabaseList("GET", `/transactions?id=eq.${id}`, 1, 1)

    const debts = async (page: number, paidOff: string, pageSize:number=10) => {
        let query = ""
        if (paidOff == "paidoff") query = "&paid_off=eq.true"
        if (paidOff == "unpaidoff") query = "&paid_off=eq.false"
        return await fetchSupabaseList("GET", `/transaction_views?select=*,savings(name),categories(name)&order=transaction_date.desc&kind=eq.income&is_debt=eq.true${query}&parent_id=is.null`, page, pageSize)
    }

    const receivables = async (page: number, paidOff: string, pageSize:number=10) => {
        let query = ""
        if (paidOff == "paidoff") query = "&paid_off=eq.true"
        if (paidOff == "unpaidoff") query = "&paid_off=eq.false"
        return await fetchSupabaseList("GET", `/transaction_views?select=*,savings(name),categories(name)&order=transaction_date.desc&kind=eq.expenses&is_debt=eq.true${query}&parent_id=is.null`, page, pageSize)
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

    const add = async (data: any) => fetchSupabase("POST", `/transactions`, body(data))

    const edit = async (data: any) => fetchSupabase("PATCH", `/transactions?id=eq.${data.id}`, body(data))

    const remove = async (id: any) => fetchSupabase("DELETE", `/transactions?id=eq.${id}`)

    return { fetchTransaction: { add, edit, remove, incomes, expenses, debts, receivables, settlements, detail } }
}