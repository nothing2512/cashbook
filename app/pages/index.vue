<script setup>
import Swal from 'sweetalert2';
import CardStat from '~/components/dashboard/CardStat.vue';
import CurrentMonthFinanceChart from '~/components/dashboard/CurrentMonthFinanceChart.vue';
import FinancialHealthChart from '~/components/dashboard/FinancialHealthChart.vue';
import MonthlyReportChart from '~/components/dashboard/MonthlyReportChart.vue';

const income = ref(0)
const expenses = ref(0)
const debt = ref(0)
const receivables = ref(0)
const loaded = ref(false)
const incomeList = ref()
const expensesList = ref()
const debtList = ref()
const receivablesList = ref()
const shortTermMoney = ref(0)
const longTermMoney = ref(0)
const instalment = ref(0)
const totalInstalment = ref(0)
const currentInstalment = ref(0)
const unpaidCurrentInstalment = ref(0)
const salary = ref(0)
const budget = ref(0)

const props = defineProps({
    setTab: Function,
    setLoading: Function,
    showData: Boolean
})

props.setTab("dashboard")

const { fetchDashboard } = useDashboard()
const { fetchAccount, fetchSetting, fetchBudget } = useCrud()
const { fetchTransaction } = useTransaction()

const showErr = (e) => {
    props.setLoading(false)
    Swal.fire({
        title: "Gagal!",
        text: e.msg || e,
        icon: "warning",
        confirmButtonText: "OK"
    })
}

onMounted(async () => {
    props.setLoading(true)
    try {
        let response = await fetchDashboard.fetchMonthlyIncome()
        income.value = response.now
        incomeList.value = response.data

        response = await fetchDashboard.fetchMonthlyExpenes()
        expenses.value = response.now
        expensesList.value = response.data

        response = await fetchDashboard.fetchMonthlyIncomeDebt()
        debtList.value = response.data

        response = await fetchDashboard.fetchMonthlyExpenesDebt()
        receivablesList.value = response.data

        response = await fetchDashboard.fetchUpiadDebts()
        debt.value = response.debt
        receivables.value = response.receivables

        currentInstalment.value = await fetchDashboard.fetchCurrentInstalment()
        unpaidCurrentInstalment.value = await fetchDashboard.fetchUnpaidCurrentInstalment()

        response = await fetchSetting.detail(1)
        salary.value = response.data[0].salary

        response = await fetchAccount.all(1, 200, {long_term: "eq.false"})
        for (const data of response.data) {
            shortTermMoney.value += data.amount
        }

        response = await fetchAccount.all(1, 200, {long_term: "eq.true"})
        for (const data of response.data) {
            longTermMoney.value += data.amount
        }

        response = await fetchBudget.all(1, 200)
        for (const data of response.data) {
            budget.value += data.amount
        }

        response = await fetchTransaction.monthlyInstalments(1, 999)
        for (const data of response.data) {
            instalment.value += data.sum
        }
        totalInstalment.value = response.totalData

        loaded.value = true
        props.setLoading(false)
    } catch (e) {
        showErr(e)
    }
})

</script>

<template>
    <section class="row">
        <div class="col-12">
            <div class="row">
                <CardStat title="Total uang jangka pendek" :value="rupiah(shortTermMoney, showData)" :color="'green'"
                    :icon="'iconly-boldBag-2'" />
                <CardStat title="Total uang jangka panjang" :value="rupiah(longTermMoney, showData)" :color="'red'"
                    :icon="'iconly-boldTicket'" />
                <CardStat title="Pemasukan bulan ini" :value="rupiah(income, showData)" :color="'purple'"
                    :icon="'iconly-boldActivity'" bg="success" href="/incomes" />
                <CardStat title="Pengeluaran bulan ini" :value="rupiah(expenses, showData)" :color="'blue'"
                    :icon="'iconly-boldBuy'" bg="secondary" href="/expenses" />
            </div>
            <div class="row">
                <CardStat title="Sisa tagihan bulan ini" :value="rupiah(unpaidCurrentInstalment, showData)" :color="'blue'"
                    :icon="'iconly-boldWallet'" :bg="unpaidCurrentInstalment > 0 ? 'danger' : ''" href="/instalment" />
                <CardStat title="Total hutang tersisa" :value="rupiah(debt, showData)" :color="'black'"
                    :icon="'iconly-boldPaper'" :bg="debt > 0 ? 'danger': 'success'" href="/debts" />
                <CardStat title="Total piutang tersisa" :value="rupiah(receivables, showData)" :color="'red'"
                    :icon="'iconly-boldFolder'" bg="success" href="/receivables" />
                <CardStat title="Anggaran tiap bulan" :value="rupiah(budget, showData)" :color="'green'"
                    :icon="'iconly-boldDiscount'" href="/budgets" />
            </div>
            <div class="row">
                <CardStat title="Total cicilan tersisa" :value="rupiah(instalment, showData)" :color="'green'"
                    :icon="'iconly-boldBag-2'" :bg="instalment > 0 ? 'danger' : ''" href="/instalment" />
                <CardStat title="Sisa bulan cicilan" :value="`${totalInstalment} Bulan`" :color="'red'"
                    :icon="'iconly-boldTicket'" :bg="totalInstalment > 0 ? 'danger': ''" href="/instalment" />
                <CardStat title="Hutang + cicilan" :value="rupiah(debt + instalment, showData)" :color="'purple'"
                    :icon="'iconly-boldActivity'" :bg="debt + instalment > 0 ? 'danger': ''" />
                <CardStat title="Gaji - cicilan - anggaran" :value="rupiah(salary - currentInstalment - budget, showData)" :color="'blue'"
                    :icon="'iconly-boldBuy'" :bg="salary - currentInstalment - budget < 0 ? 'danger': ''" />
            </div>
        </div>
        <div class="col-12 col-lg-9">
            <div class="row">
                <MonthlyReportChart id="main-financial" title="Grafik laporan keuangan" :loaded="loaded"
                    :incomes="incomeList" :expenses="expensesList" :show-data="showData" />
                <MonthlyReportChart id="debt-financial" title="Grafik laporan hutang" :loaded="loaded"
                    :incomes="debtList" :expenses="receivablesList" income-text="Hutang" expenses-text="Piutang"
                    :show-data="showData" />
            </div>
        </div>
        <div class="col-12 col-lg-3">
            <FinancialHealthChart :income="income" :saving="shortTermMoney" :expenses="expenses" :debt="debt"
                :receivables="receivables" :loaded="loaded" :showData="showData" />
            <CurrentMonthFinanceChart :income="income" :saving="shortTermMoney" :expenses="expenses" :loaded="loaded"
                :show-data="showData" />
        </div>
    </section>
</template>
