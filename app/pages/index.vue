<script setup>
import Swal from 'sweetalert2';
import CardStat from '~/components/dashboard/CardStat.vue';
import CashflowEstimationTable from '~/components/dashboard/CashflowEstimationTable.vue';
import CurrentMonthFinanceChart from '~/components/dashboard/CurrentMonthFinanceChart.vue';
import FinancialHealthChart from '~/components/dashboard/FinancialHealthChart.vue';
import MonthlyReportChart from '~/components/dashboard/MonthlyReportChart.vue';
import OverBudgetTable from '~/components/dashboard/OverBudgetTable.vue';

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
const payday = ref(0)
const instalments = ref([])
const overBudgets = ref([])

const props = defineProps({
    setTab: Function,
    setLoading: Function,
    showData: Boolean
})

props.setTab("dashboard")

const { fetchDashboard } = useDashboard()
const { fetchAccount, fetchSetting, fetchBudget } = useCrud()
const { fetchTransaction } = useTransaction()
const { fetchOverBudget } = useRpc()

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

        response = await fetchSetting.all(1, 1)
        if (response.data.length > 0) {
            salary.value = response.data[0].salary
            payday.value = response.data[0].payday
        }

        response = await fetchAccount.all(1, 200, { long_term: "eq.false" })
        for (const data of response.data) {
            shortTermMoney.value += data.amount
        }

        response = await fetchAccount.all(1, 200, { long_term: "eq.true" })
        for (const data of response.data) {
            longTermMoney.value += data.amount
        }

        response = await fetchBudget.all(1, 200)
        for (const data of response.data) {
            budget.value += data.amount
        }

        response = await fetchTransaction.monthlyInstalments(1, 999)
        instalments.value = response.data
        for (const data of response.data) {
            instalment.value += data.sum
        }
        totalInstalment.value = response.totalData

        response = await fetchOverBudget(1, 999)
        overBudgets.value = response.data

        loaded.value = true
        props.setLoading(false)
    } catch (e) {
        showErr(e)
    }
})

</script>

<template>
    <section class="row">
        <div class="col-12 col-lg-9">
            <div class="row">
                <CardStat title="Uang panas" tooltip="Total uang yang bisa dipakai kapanpun, tidak untuk jangka panjang" :value="rupiah(shortTermMoney, showData)" :color="'green'"
                    :icon="'iconly-boldBag-2'" />
                <CardStat title="Uang dingin" tooltip="Total simpanan uang jangka panjang, bisa dipakai jika terdesak" :value="rupiah(longTermMoney, showData)" :color="'red'"
                    :icon="'iconly-boldTicket'" />
                <CardStat title="Pemasukan" tooltip="Total pemasukan bulan ini tidak termasuk gaji pokok yang belum ditambahkan (hutang akan masuk sebagai pemasukan juga)" :value="rupiah(income, showData)" :color="'purple'"
                    :icon="'iconly-boldActivity'" bg="success" href="/incomes" />
                <CardStat title="Pengeluaran" tooltip="Total pengeluaran bulan ini, piutang juga termasuk sebagai pengeluaran juga" :value="rupiah(expenses, showData)" :color="'blue'"
                    :icon="'iconly-boldBuy'" bg="secondary" href="/expenses" />
            </div>
            <div class="row">
                <CardStat title="Tagihan" tooltip="Tagihan pada cicilan yang belum terbayarkan bulan ini" :value="rupiah(unpaidCurrentInstalment, showData)"
                    :color="'blue'" :icon="'iconly-boldWallet'" :bg="unpaidCurrentInstalment > 0 ? 'danger' : ''"
                    href="/instalment" />
                <CardStat title="Hutang" tooltip="Sisa hutang yang belum dibayarkan hingga hari ini, tidak termasuk cicilan" :value="rupiah(debt, showData)" :color="'black'"
                    :icon="'iconly-boldPaper'" :bg="debt > 0 ? 'danger' : 'success'" href="/debts" />
                <CardStat title="Piutang" tooltip="Sisa piutang yang belum dibayarkan hingga hari ini" :value="rupiah(receivables, showData)" :color="'red'"
                    :icon="'iconly-boldFolder'" bg="success" href="/receivables" />
                <CardStat title="Anggaran" tooltip="Jumlah anggaran / rencana pengeluaran bulanan " :value="rupiah(budget, showData)" :color="'green'"
                    :icon="'iconly-boldDiscount'" href="/budgets" />
            </div>
            <div class="row">
                <CardStat title="Cicilan" tooltip="Jumlah seluruh cicilan yang belum terbayarkan" :value="rupiah(instalment, showData)" :color="'green'"
                    :icon="'iconly-boldBag-2'" :bg="instalment > 0 ? 'danger' : ''" href="/instalment" />
                <CardStat title="Bulan cicilan" tooltip="Jumlah bulan tagihan cicilan yang belum terbayarkan" :value="`${totalInstalment} Bulan`" :color="'red'"
                    :icon="'iconly-boldTicket'" :bg="totalInstalment > 0 ? 'danger' : ''" href="/instalment" />
                <CardStat title="Debtflow" tooltip="Jumlah hutang + cicilan yang belum dibayarkan" :value="rupiah(debt + instalment, showData)" :color="'purple'"
                    :icon="'iconly-boldActivity'" :bg="debt + instalment > 0 ? 'danger' : ''" />
                <CardStat title="Cashflow" tooltip="Jumlah uang sisa dari gaji pokok per bulan (gaji pokok - cicilan bulan ini - anggaran)"
                    :value="rupiah(salary - currentInstalment - budget, showData)" :color="'blue'"
                    :icon="'iconly-boldBuy'" :bg="salary - currentInstalment - budget < 0 ? 'danger' : ''" />
            </div>
            <div class="row">
                <MonthlyReportChart id="main-financial" title="Grafik laporan keuangan" :loaded="loaded"
                    :incomes="incomeList" :expenses="expensesList" :show-data="showData" />
                <OverBudgetTable :over-budgets="overBudgets" :show-data="showData" />
                <MonthlyReportChart id="debt-financial" title="Grafik laporan hutang" :loaded="loaded"
                    :incomes="debtList" :expenses="receivablesList" income-text="Hutang" expenses-text="Piutang"
                    :show-data="showData" />
            </div>
        </div>
        <div class="col-12 col-lg-3">
            <FinancialHealthChart
                :value="calculateFinancialHealth(shortTermMoney, longTermMoney, income, expenses, debt, salary, budget, currentInstalment, payday)"
                :loaded="loaded" :showData="showData" />
            <CurrentMonthFinanceChart :income="income" :saving="shortTermMoney" :expenses="expenses" :loaded="loaded"
                :show-data="showData" />
            <CashflowEstimationTable :instalments="instalments" :salary="salary" :budget="budget" :show-data="showData" />
        </div>
        <div class="col-12 col-lg-9">
        </div>
    </section>
</template>
