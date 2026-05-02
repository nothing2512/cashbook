<script setup>

var props = defineProps({
    show: Boolean,
    onSubmit: Function,
    onCloseModal: Function,
    paid: Number,
    savings: Array,
})

let form = reactive({
    paid: props.paid || 0,
    saving_id: 0
})

let modal = null

onMounted(() => {
    const el = document.getElementById("installmentPayModal")
    modal = new bootstrap.Modal(el)
    el.addEventListener('hidden.bs.modal', () => {
        props.onCloseModal()
    })
})

watch(() => props.show, (newVal, oldVal) => {
    if (newVal) {
        form = reactive({
            paid: props.paid || 0,
            saving_id: 0
        })
        modal.show()
    }
})

const toast = (message) => {
    Toastify({
        text: message,
        duration: 3000,
        close: true,
        gravity: "bottom",
        position: "right",
        backgroundColor: "#4fbe87",
    }).showToast()
}

const onSubmit = () => {
    modal.hide()

    if (form.saving_id == 0) return toast(`uang pada penyimpanan anda tidak mencukupi`)

    props.onSubmit(form)
}

</script>

<template>
    <Teleport to="body">
        <div class="modal fade text-left" id="installmentPayModal" tabindex="-1" role="dialog"
            aria-labelledby="myModalLabel33" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h4 class="modal-title" id="myModalLabel33">Bayar cicilan</h4>
                        <button type="button" class="close" data-bs-dismiss="modal" aria-label="Close">
                            <i data-feather="x"></i>
                        </button>
                    </div>
                    <form @submit.prevent="onSubmit">

                        <div class="modal-body">
                            <div class="form-group mandatory">
                                <label class="form-label" for="paid">Jumlah bayar </label>
                                <input disabled="true" id="paid" required="true" type="text"
                                    class="form-control disabled" :value="rupiah(props.paid, true)">
                            </div>
                        </div>
                        <div class="modal-body">
                            <div class="form-group mandatory">
                                <label class="form-label" for="name">Akun penyimpanan </label>
                                <select class="form-select" id="saving" v-model="form.saving_id">
                                    <template v-for="saving in props.savings">
                                        <option :value="saving.id" v-if="saving.amount >= props.paid">{{ saving.name }}
                                            ( {{ rupiah(saving.amount, true) }} )
                                        </option>
                                    </template>
                                </select>
                            </div>
                        </div>

                        <div class="modal-footer">
                            <button type="button" class="btn btn-light-secondary" data-bs-dismiss="modal">
                                <i class="bx bx-x d-block d-sm-none"></i>
                                <span class="d-none d-sm-block">Close</span>
                            </button>
                            <button type="button" class="btn btn-primary ms-1" @click.prevent="onSubmit">
                                <i class="bx bx-check d-block d-sm-none"></i>
                                <span class="d-none d-sm-block">Submit</span>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </Teleport>
</template>