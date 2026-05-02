<script setup>
const props = defineProps({
    value: Object,
    loaded: Boolean,
    showData: Boolean,
})

watch(() => props.loaded, (newVal, oldVal) => {
    if (!props.loaded) return;
    console.log(props.value)
    const chartVisitorsProfile = new ApexCharts(
        document.getElementById("finance-health"),
        {
            series: [props.value.score],
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
    <Teleport to="body">
        <!--Basic Modal -->
        <div class="modal modal-lg modal-borderless fade text-left" id="financialHealthModal" tabindex="-1"
            role="dialog" aria-labelledby="financialHealthModal" aria-hidden="true">
            <div class="modal-dialog modal-dialog-scrollable" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h4 class="modal-title" id="financialHealthModal">Breakdown Kesehatan Finansial</h4>
                        <button type="button" class="close rounded-pill" data-bs-dismiss="modal" aria-label="Close">
                            <i class="bi bi-x-lg"></i>
                        </button>
                    </div>
                    <div class="modal-body">
                        <h5>1) Likuiditas (Liquidity)</h5>
                        <p><strong>Definisi:</strong> kemampuan aset yang cepat dicairkan untuk menutup
                            kebutuhan/pengeluaran jangka pendek.</p>
                        <p><strong>Rumus:</strong></p>
                        <p>Liquidity = A / E</p>
                        <ul>
                            <li><strong>A (aset likuid):</strong> kas, saldo rekening, e-wallet</li>
                            <li><strong>E (expense):</strong> total pengeluaran bulanan</li>
                        </ul>
                        <p><strong>Interpretasi:</strong></p>
                        <ul>
                            <li>&ge; 1.0 → aman (aset cukup menutup 1 bulan pengeluaran)</li>
                            <li>0.5 – 1.0 → cukup, tapi terbatas</li>
                            <li>&lt; 0.5 → rawan (buffer tipis)</li>
                        </ul>
                        <p><strong>Intinya:</strong> ini daya tahan hidup kalau pemasukan berhenti sementara.</p>
                        <p><strong>Nilai kamu:</strong> {{ format2Digit(value?.breakdown?.liquidity) }} ({{ value?.breakdown_text?.liquidity }}) </p>

                        <hr>

                        <h5>2) Debt Ratio</h5>
                        <p><strong>Definisi:</strong> seberapa besar beban utang dibanding total aset.</p>
                        <p><strong>Rumus:</strong></p>
                        <p>Debt Ratio = 1 - (D / (A + B))</p>
                        <ul>
                            <li><strong>D (debt):</strong> total hutang + sisa cicilan</li>
                            <li><strong>A + B:</strong> total aset (likuid + jangka panjang)</li>
                        </ul>
                        <p><strong>Interpretasi:</strong></p>
                        <ul>
                            <li>&ge; 0.7 → sehat (utang relatif kecil)</li>
                            <li>0.4 – 0.7 → mulai berat</li>
                            <li>&lt; 0.4 → berisiko (utang dominan)</li>
                        </ul>
                        <p><strong>Intinya:</strong> apakah aset kamu cukup kuat untuk menanggung utang.</p>
                        <p><strong>Nilai kamu:</strong> {{ format2Digit(value?.breakdown?.debt) }} ({{ value?.breakdown_text?.debt }}) </p>

                        <hr>

                        <h5>3) Cashflow Ratio</h5>
                        <p><strong>Definisi:</strong> seberapa besar sisa uang dari pemasukan (dibanding salary sebagai
                            baseline).</p>
                        <p><strong>Rumus:</strong></p>
                        <p>Cashflow Ratio = S / I</p>
                        <ul>
                            <li>Sebelum tanggal gajian → gunakan salary + income sebagai expected income</li>
                            <li>Setelah tanggal gajian → gunakan income sebagai expected income</li>
                            <li><strong>S (cashflow):</strong> sisa uang setelah semua kewajiban [ (expected income - cicilan - budget) / expected income ]</li>
                            <li><strong>I (income / salary):</strong> pemasukan bulanan</li>
                        </ul>
                        <p><strong>Interpretasi:</strong></p>
                        <ul>
                            <li>&gt; 0.2 → sehat (banyak sisa)</li>
                            <li>0 – 0.2 → tipis</li>
                            <li>&lt; 0 → negatif (defisit)</li>
                        </ul>
                        <p><strong>Catatan:</strong></p>
                        <ul>
                            <li>Sebelum tanggal gajian → gunakan salary + income sebagai expected income</li>
                            <li>Setelah tanggal gajian → gunakan income sebagai expected income</li>
                        </ul>
                        <p><strong>Intinya:</strong> apakah kamu punya sisa uang atau selalu habis.</p>
                        <p><strong>Nilai kamu:</strong> {{ format2Digit(value?.breakdown?.cashflow) }} ({{ value?.breakdown_text?.cashflow }}) </p>

                        <hr>

                        <h5>4) Budget Control</h5>
                        <p><strong>Definisi:</strong> seberapa disiplin kamu mengikuti anggaran.</p>
                        <p><strong>Rumus:</strong></p>
                        <p>Budget Control = 1 - (E / BGT)</p>
                        <ul>
                            <li><strong>E (expense):</strong> pengeluaran berjalan</li>
                            <li><strong>BGT (budget):</strong> anggaran bulanan</li>
                        </ul>
                        <p><strong>Interpretasi:</strong></p>
                        <ul>
                            <li>&ge; 0.3 → disiplin</li>
                            <li>0 – 0.3 → hampir habis</li>
                            <li>&lt; 0 → over budget</li>
                        </ul>
                        <p><strong>Intinya:</strong> kontrol kebiasaan pengeluaran.</p>
                        <p><strong>Nilai kamu:</strong> {{ format2Digit(value?.breakdown?.budget) }} ({{ value?.breakdown_text?.budget }}) </p>

                        <hr>
                        <h5>Rumus total perhitungan</h5>
                        <ul>
                            <li>30% liquidity = {{ format2Digit(value?.breakdown?.liquidity) }} * 0.3 = {{ format2Digit(value?.breakdown?.liquidity * 0.3)  }}</li>
                            <li>25% debt ratio = {{ format2Digit(value?.breakdown?.debt) }} * 0.25 = {{ format2Digit(value?.breakdown?.debt * 0.25)  }}</li>
                            <li>25% cashflow ratio = {{ format2Digit(value?.breakdown?.cashflow) }} * 0.25 = {{ format2Digit(value?.breakdown?.cashflow * 0.25)  }}</li>
                            <li>25% budget control = {{ format2Digit(value?.breakdown?.budget) }} * 0.2 = {{ format2Digit(value?.breakdown?.budget * 0.2)  }}</li>
                        </ul>
                        <p>Score = (liquidity + debt ratio + cashflow ratio + budget control) * 100</p>
                        <p>Score = ({{ format2Digit(value?.breakdown?.liquidity * 0.3) }} + {{ format2Digit(value?.breakdown?.debt * 0.25) }} + {{ format2Digit(value?.breakdown?.cashflow * 0.25) }} + {{ format2Digit(value?.breakdown?.budget * 0.2) }}) * 100</p>
                        <p>Score = ({{ format2Digit(value?.breakdown?.liquidity * 0.3 + value?.breakdown?.debt * 0.25 + value?.breakdown?.cashflow * 0.25 + value?.breakdown?.budget * 0.2) }}) * 100</p>
                        <h5><strong>Score = {{ value?.score }} %</strong></h5>

                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn" data-bs-dismiss="modal">
                            <i class="bx bx-x d-block d-sm-none"></i>
                            <span class="d-none d-sm-block">Close</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </Teleport>
    <div class="col-12">
        <div class="card">
            <div class="card-header">
                <h4>Kesehatan Finansial</h4>
            </div>
            <div class="card-body" :style="showData ? '' : 'filter: blur(.5rem)'">
                <button class="btn btn-sm btn-light position-absolute top-0 end-0 m-3" data-bs-toggle="modal"
                    data-bs-target="#financialHealthModal">Breakdown</button>
                <div id="finance-health"></div>
            </div>
        </div>
    </div>
</template>