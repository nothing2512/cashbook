<script setup>
const props = defineProps({
    instalments: Array,
    salary: Number,
    budget: Number,
    showData: Boolean,
    loaded: Boolean,
})

const bulan = ["--", "Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"]

const dtEl = ref(null)
let dt = null

onMounted(() => {
    dt = $(dtEl.value).DataTable({
        responsive: true,
        info: false
    })

    const setTableColor = () => {
        document.querySelectorAll('.dataTables_paginate .pagination').forEach(dt => {
            dt.classList.add('pagination-primary')
        })
    }
    setTableColor()
    dt.on('draw', setTableColor)
})

const reloadTable = () => {
    dt.clear()
    let newData = [];
    for (const idx in props.instalments) {
        const i = props.instalments[idx]
        newData.push([idx + 1, `${bulan[i.month]} ${i.year}`, rupiah(props.salary - i.sum - props.budget, props.showData)])
    }
    dt.rows.add(newData)
    dt.draw()
}

watch(() => props.loaded, (newVal, oldVal) => {
    reloadTable()
})

</script>

<template>
    <div class="col-12">
        <div class="card">
            <div class="card-content">
                <div class="card-body">
                    <h4>Estimasi cashflow berdasarkan cicilan</h4>
                    <p class="card-text"></p>
                    <!-- Table with outer spacing -->
                    <div class="table-responsive">
                        <table class="table table-lg" ref="dtEl">
                            <thead>
                                <tr>
                                    <th>No</th>
                                    <th>Bulan</th>
                                    <th>Cashflow</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(i, idx) in instalments">
                                    <td>{{ idx + 1 }}</td>
                                    <td>{{ bulan[i.month] }} {{ i.year }}</td>
                                    <td>{{ rupiah(salary - i.sum - budget, showData) }} </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>