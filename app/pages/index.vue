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
const totalMoney = ref(0)
const currentInstalment = ref(0)
const unpaidCurrentInstalment = ref(0)
const salary = ref(0)

const props = defineProps({
    setTab: Function,
    setLoading: Function,
    showData: Boolean
})

props.setTab("dashboard")

const { fetchDashboard } = useDashboard()
const { fetchAccount, fetchSetting } = useCrud()

const showErr = (e) => {
    props.setLoading(false)
    Swal.fire({
        title: "Gagal!",
        text: e.msg,
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

        response = await fetchAccount.all(1, 200)
        for (const data of response.data) {
            totalMoney.value += data.amount
        }

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
                <CardStat title="Total uang saat ini" :value="rupiah(totalMoney, showData)" :color="'green'"
                    :icon="'iconly-boldBag-2'" />
                <CardStat title="Gaji bulan ini" :value="rupiah(salary, showData)" :color="'red'"
                    :icon="'iconly-boldTicket'" />
                <CardStat title="Pemasukan bulan ini" :value="rupiah(income, showData)" :color="'purple'"
                    :icon="'iconly-boldActivity'" />
                <CardStat title="Pengeluaran bulan ini" :value="rupiah(expenses, showData)" :color="'blue'"
                    :icon="'iconly-boldBuy'" />

            </div>
            <div class="row">
                <CardStat title="Tagihan bulan ini" :value="rupiah(unpaidCurrentInstalment, showData)" :color="'blue'"
                    :icon="'iconly-boldWallet'" />
                <CardStat title="Total hutang tersisa" :value="rupiah(debt, showData)" :color="'black'"
                    :icon="'iconly-boldPaper'" />
                <CardStat title="Total piutang tersisa" :value="rupiah(receivables, showData)" :color="'red'"
                    :icon="'iconly-boldFolder'" />
                <CardStat title="Gaji - tagihan bulan ini" :value="rupiah(salary - currentInstalment, showData)" :color="'green'"
                    :icon="'iconly-boldDiscount'" />
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
            <FinancialHealthChart :income="income" :saving="totalMoney" :expenses="expenses" :debt="debt"
                :receivables="receivables" :loaded="loaded" :showData="showData" />
            <CurrentMonthFinanceChart :income="income" :saving="totalMoney" :expenses="expenses" :loaded="loaded"
                :show-data="showData" />
        </div>
    </section>
</template>
