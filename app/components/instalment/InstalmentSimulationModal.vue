<script setup>

var props = defineProps({
    show: Boolean,
    onCloseModal: Function,
    instalments: Array,
    budget: Number,
    salary: Number,
})

let modal = null

onMounted(() => {
    const el = document.getElementById("installmentSimulationModal")
    modal = new bootstrap.Modal(el)
    el.addEventListener('hidden.bs.modal', () => {
        props.onCloseModal()
    })
})

watch(() => props.show, (newVal, oldVal) => {
    if (newVal) modal.show()
})

const months = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
const simulation = reactive({
    instalment: 0,
    budget: 0
})

</script>

<template>
    <Teleport to="body">
        <div class="modal modal-xl fade text-left" id="installmentSimulationModal" tabindex="-1" role="dialog"
            aria-labelledby="myModalLabel33" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h4 class="modal-title" id="myModalLabel33">Simulasi Cicilan</h4>
                        <button type="button" class="close" data-bs-dismiss="modal" aria-label="Close">
                            <i data-feather="x"></i>
                        </button>
                    </div>

                    <div class="modal-body">

                        <div class="form-group mandatory">
                            <label class="form-label" for="sinstalment">Biaya cicilan per bulan yang akan ditambahkan</label>
                            <input id="sinstalment" required="true" type="number" class="form-control"
                                v-model="simulation.instalment">
                        </div>

                        <div class="form-group mandatory">
                            <label class="form-label" for="sbudget">Anggaran per bulan yang akan ditambahkan</label>
                            <input id="sbudget" required="true" type="number" class="form-control"
                                v-model="simulation.budget">
                        </div>

                        <div class="table-responsive">
                            <table class="table table-lg">
                                <thead>
                                    <tr>
                                        <th>No</th>
                                        <th>Bulan</th>
                                        <th>Cicilan per bulan</th>
                                        <th>Anggaran</th>
                                        <th>Gaji pokok</th>
                                        <th>Cashflow</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="(i, idx) in instalments">
                                        <td>{{ idx + 1 }}</td>
                                        <td>{{ months[i.month - 1] }} {{ i.year }}</td>
                                        <td>{{ rupiah(parseInt(i.sum) + parseInt(simulation.instalment || 0), true) }}</td>
                                        <td>{{ rupiah(parseInt(budget) + parseInt(simulation.budget || 0), true) }}</td>
                                        <td>{{ rupiah(parseInt(salary), true) }}</td>
                                        <td>{{ rupiah(parseInt(salary) - parseInt(budget) - parseInt(i.sum) - parseInt(simulation.instalment || 0) - parseInt(simulation.budget || 0), true) }}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div class="modal-footer">
                        <button type="button" class="btn btn-light-secondary" data-bs-dismiss="modal">
                            <i class="bx bx-x d-block d-sm-none"></i>
                            <span class="d-none d-sm-block">Close</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </Teleport>
</template>