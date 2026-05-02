<script setup>
const props = defineProps({
    income: Number,
    expenses: Number,
    debt: Number,
    expenses: Number,
    saving: Number,
    loaded: Boolean,
    showData: Boolean,
})

watch(() => props.loaded, (newVal, oldVal) => {
    if (!props.loaded) return;
    const health = calculateFinancialHealth(props.income == 0 ? props.saving : props.income, props.expenses, props.debt, props.expenses)
    const chartVisitorsProfile = new ApexCharts(
        document.getElementById("finance-health"),
        {
            series: [health.score],
            chart: {
                height: 350,
                type: "radialBar",
                toolbar: {
                    show: true,
                },
            },
            plotOptions: {
                radialBar: {
                    startAngle: -135,
                    endAngle: 225,
                    hollow: {
                        margin: 0,
                        size: "70%",
                        background: "#fff",
                        image: undefined,
                        imageOffsetX: 0,
                        imageOffsetY: 0,
                        position: "front",
                        dropShadow: {
                            enabled: true,
                            top: 3,
                            left: 0,
                            blur: 4,
                            opacity: 0.24,
                        },
                    },
                    track: {
                        background: "#fff",
                        strokeWidth: "67%",
                        margin: 0, // margin is in pixels
                        dropShadow: {
                            enabled: true,
                            top: -3,
                            left: 0,
                            blur: 4,
                            opacity: 0.35,
                        },
                    },

                    dataLabels: {
                        show: true,
                        name: { show: false },
                        value: {
                            formatter: function (val) {
                                return `${parseInt(val)} %`
                            },
                            color: "#111",
                            fontSize: "36px",
                            show: true,
                        },
                    },
                },
            },
            fill: {
                type: "gradient",
                gradient: {
                    shade: "dark",
                    type: "horizontal",
                    shadeIntensity: 0.5,
                    gradientToColors: ["#ABE5A1"],
                    inverseColors: true,
                    opacityFrom: 1,
                    opacityTo: 1,
                    stops: [0, 100],
                },
            },
            stroke: {
                lineCap: "round",
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
                <h4>Kesehatan Finansial</h4>
            </div>
            <div class="card-body" :style="showData ? '' : 'filter: blur(.5rem)'">
                <div id="finance-health"></div>
            </div>
        </div>
    </div>
</template>