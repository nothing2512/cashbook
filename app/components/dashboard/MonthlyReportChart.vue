<script setup>
const props = defineProps({
    id: String,
    title: String,
    incomes: Array,
    incomeText: String,
    expenses: Array,
    expensesText: String,
    loaded: Boolean,
    showData: Boolean,
})

const IndonesianMonth = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember"
]

watch(() => props.loaded, (newVal, oldVal) => {
    if (!props.loaded) return;
    const now = new Date()
    const categories = []
    for (let i = 0; i < 12; i++) {
        const m = IndonesianMonth[now.getMonth()]
        const y = now.getFullYear()
        categories.push(`${m} ${y}`)
        if (now.getMonth() == 1) {
            now.setMonth(11)
            now.setFullYear(now.getFullYear() - 1)
        } else {
            now.setMonth(now.getMonth() - 1)
        }
    }
    const chartVisitorsProfile = new ApexCharts(
        document.getElementById(props.id),
        {
            series: [
                {
                    name: props.incomeText || "Pemasukan",
                    data: props.incomes.reverse(),
                },
                {
                    name: props.expensesText || "Pengeluaran",
                    data: props.expenses.reverse(),
                },
            ],
            chart: {
                height: 350,
                type: "area",
            },
            dataLabels: {
                enabled: false,
            },
            stroke: {
                curve: "smooth",
            },
            xaxis: {
                categories: categories.reverse(),
            },
            tooltip: {
                y: {
                    formatter: function (val) {
                        return rupiah(val)
                    }
                }
            },
        }
    )
    chartVisitorsProfile.render()
})

</script>

<template>
    <div class="col-12">
        <div class="card">
            <div class="card-header">
                <h4>{{ props.title }}</h4>
            </div>
            <div class="card-body" :style="showData ? '' : 'filter: blur(.5rem)'">
                <div :id="props.id"></div>
            </div>
        </div>
    </div>
</template>