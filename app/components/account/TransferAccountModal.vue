<script setup>

var props = defineProps({
    show: Boolean,
    onSubmit: Function,
    onCloseModal: Function,
    data: Array,
})

let form = reactive({
    source: props.data.length > 0 ? props.data[0].id : 0,
    destination: props.data.length > 1 ? props.data[1].id : 0,
    source_out: 0,
    destionation_in: 0,
    source_amount: 0,
    destination_amount: 0
})

let modal = null

onMounted(() => {
    const el = document.getElementById("transferSavingModal")
    modal = new bootstrap.Modal(el)
    el.addEventListener('hidden.bs.modal', () => {
        props.onCloseModal()
    })
})

watch(() => props.show, (newVal, oldVal) => {
    if (newVal) {
        form = reactive({
            source: props.data.length > 0 ? props.data[0].id : 0,
            destination: props.data.length > 1 ? props.data[1].id : 0,
            source_out: 0,
            destionation_in: 0,
            source_amount: 0,
            destination_amount: 0
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
    if (form.source === '' || form.source == 0) return toast("Akun sumber wajib diisi")
    if (form.destination === '' || form.destination == 0) return toast("Akun tujuan wajib diisi")
    if (form.source_out === '' || form.source_out == 0) return toast("Nominal sumber wajib diisi")
    if (form.destionation_in === '' || form.destionation_in == 0) return toast("Nominal tujuan wajib diisi")


    for (const account of props.data) {
        if (account.id == form.source) {
            if (parseInt(form.source_out) > account.amount) {
                return toast("Nominal pada akun sumber tidak mencukupi")
            }
            form.source_amount = account.amount - form.source_out
        }

        if (account.id == form.destination) form.destination_amount = account.amount + form.destionation_in;
    }

    modal.hide()
    props.onSubmit(form)
}

</script>

<template>
    <Teleport to="body">
        <div class="modal fade text-left" id="transferSavingModal" tabindex="-1" role="dialog"
            aria-labelledby="myModalLabel33" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h4 class="modal-title" id="myModalLabel33">Transfer antar akun Penyimpanan</h4>
                        <button type="button" class="close" data-bs-dismiss="modal" aria-label="Close">
                            <i data-feather="x"></i>
                        </button>
                    </div>
                    <form @submit.prevent="onSubmit">
                        <div class="modal-body">

                            <div class="form-group mandatory">
                                <label class="form-label" for="source">Akun sumber</label>
                                <select class="form-select" id="source" v-model="form.source">
                                    <template v-for="account in data">
                                        <option :value="account.id" v-if="form.destination != account.id">{{
                                            account.name }}
                                            {{ rupiah(account.amount, true) }}
                                        </option>
                                    </template>
                                </select>
                            </div>

                            <div class="form-group mandatory">
                                <label class="form-label" for="destination">Akun tujuan</label>
                                <select class="form-select" id="source" v-model="form.destination">
                                    <template v-for="account in data">
                                        <option :value="account.id" v-if="form.source != account.id">{{ account.name }}
                                            {{ rupiah(account.amount, true) }}
                                        </option>
                                    </template>
                                </select>
                            </div>

                            <div class="form-group mandatory">
                                <label class="form-label" for="source_out">Nominal dikirim</label>
                                <input id="source_out" required="true" type="number" placeholder="Nominal dikirim"
                                    class="form-control" v-model="form.source_out">
                            </div>

                            <div class="form-group mandatory">
                                <label class="form-label" for="destionation_in">Nominal diterima</label>
                                <input id="destionation_in" required="true" type="number" placeholder="Nominal diterima"
                                    class="form-control" v-model="form.destionation_in">
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