<script setup>
const props = defineProps({
    income: Number,
    expenses: Number,
    saving: Number,
    loaded: Boolean,
    showData: Boolean,
})

watch(() => props.loaded, (newVal, oldVal) => {
    if (!props.loaded) return;
    const chartVisitorsProfile = new ApexCharts(
        document.getElementById("current-month-finance"),
        {
            series: [props.income == 0 ? props.saving : props.income, props.expenses],
            labels: [props.income == 0 ? "Simpanan" : "Pemasukan", "Pengeluaran"],
            colors: ["#435ebe", "#55c6e8"],
            chart: {
                type: "donut",
                width: "100%",
                height: "350px",
            },
            legend: {
                position: "bottom",
            },
            tooltip: {
                y: {
                    formatter: function (val) {
                        return rupiah(val, true)
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
                <h4>Keuangan bulan ini</h4>
            </div>
            <div class="card-body" :style="showData ? '' : 'filter: blur(.5rem)'">
                <div id="current-month-finance"></div>
            </div>
        </div>
    </div>
</template>