<script setup>
const props = defineProps({
    instalments: Array,
    salary: Number,
    budget: Number,
    showData: Boolean
})

const bulan = ["--", "Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"]

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
                        <table class="table table-lg">
                            <thead>
                                <tr>
                                    <th>No</th>
                                    <th>Bulan</th>
                                    <th>Cashflow</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-if="!instalments || instalments.length == 0">
                                    <td colspan="3" class="text-center">Tidak ada cicilan</td>
                                </tr>
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