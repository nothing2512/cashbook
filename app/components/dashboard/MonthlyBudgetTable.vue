<script setup>
const props = defineProps({
    overBudgets: Array,
    remainingBudgets: Array,
    showData: Boolean,
})

</script>

<template>
    <div class="col-12">
        <div class="card">
            <div class="card-content">
                <div class="card-body">

                    <h4>Pengeluaran melebihi anggaran bulan ini</h4>
                    <p class="card-text"></p>
                    <!-- Table with outer spacing -->
                    <div class="table-responsive">
                        <table class="table table-lg">
                            <thead>
                                <tr>
                                    <th>No</th>
                                    <th>Nama</th>
                                    <th>Kategori</th>
                                    <th>Anggaran</th>
                                    <th>Pengeluaran</th>
                                    <th>Kelebihan anggaran</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-if="!overBudgets || overBudgets.length == 0">
                                    <td colspan="6" class="text-center">Tidak ada pengeluaran yang melebihi budget</td>
                                </tr>
                                <tr v-for="(budget, idx) in overBudgets">
                                    <td>{{ idx + 1 }}</td>
                                    <td>{{ budget.title }} </td>
                                    <td>{{ budget.category }}</td>
                                    <td>{{ rupiah(budget.amount, showData) }} </td>
                                    <td>{{ rupiah(budget.expenses, showData) }} </td>
                                    <td>{{ rupiah(budget.expenses - budget.amount, showData) }} </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <h4>Anggaran tersisa bulan ini</h4>
                    <p class="card-text"></p>
                    <!-- Table with outer spacing -->
                    <div class="table-responsive">
                        <table class="table table-lg">
                            <thead>
                                <tr>
                                    <th>No</th>
                                    <th>Nama</th>
                                    <th>Kategori</th>
                                    <th>Anggaran</th>
                                    <th>Pengeluaran</th>
                                    <th>Sisa anggaran</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-if="!remainingBudgets || remainingBudgets.length == 0">
                                    <td colspan="6" class="text-center">Tidak ada anggaran tersisa</td>
                                </tr>
                                <tr v-for="(budget, idx) in remainingBudgets">
                                    <td>{{ idx + 1 }}</td>
                                    <td>{{ budget.title }} </td>
                                    <td>{{ budget.category }}</td>
                                    <td>{{ rupiah(budget.amount, showData) }} </td>
                                    <td>{{ rupiah(budget.expenses, showData) }} </td>
                                    <td>{{ rupiah(budget.amount - budget.expenses, showData) }} </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                </div>
            </div>
        </div>
    </div>
</template>