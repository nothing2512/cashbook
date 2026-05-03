<script setup>

var props = defineProps({
    show: Boolean,
    onSubmit: Function,
    onCloseModal: Function,
    data: Object,
    categories: Array,
    savings: Array,
    expenses: Boolean,
})

const expenses = props.expenses || false

let form = reactive({
    id: props.data?.id || 0,
    parent_id: props.data?.parent_id,
    saving_id: props.data?.saving_id,
    category_id: props.data?.category_id,
    title: props.data?.title,
    description: props.data?.description,
    amount: props.data?.amount,
    kind: props.data?.kind,
    status: props.data?.status,
    transaction_date: props.data?.transaction_date
})

let modal = null
let fp = null

onMounted(() => {
    const el = document.getElementById("transactionModal")
    modal = new bootstrap.Modal(el)
    el.addEventListener('hidden.bs.modal', () => {
        props.onCloseModal()
    })

    fp = flatpickr('#transactiondate', {
        enableTime: true,
        time_24hr: true,
        dateFormat: "Y-m-d\\TH:i:S",
        altInput: true,
        altFormat: "d M Y H:i",
        allowInput: true
    })
    fp.setDate(new Date())
})

watch(() => props.show, (newVal, oldVal) => {
    if (newVal) {
        form = reactive({
            id: props.data?.id || 0,
            parent_id: props.data?.parent_id,
            saving_id: props.data?.saving_id || 1,
            category_id: props.data?.category_id || 1,
            title: props.data?.title || '',
            description: props.data?.description || '',
            amount: props.data?.amount || 0,
            kind: props.data?.kind,
            status: props.data?.status,
            transaction_date: props.data?.transaction_date
        })
        if (props.data?.transaction_date) fp.setDate(props.data?.transaction_date)
        else fp.setDate(new Date())
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
    if (form.title === '') return toast("Judul wajib diisi")
    if (form.amount === '' || form.amount === 0) return toast("Nominal wajib diisi")
    if (expenses) {
        for (const saving of props.savings) {
            if (saving.id == form.saving_id && form.amount > saving.amount) {
                return toast(`uang anda pada ${saving.name} tidak mencukupi`)
            }
        }
    }

    modal.hide()
    props.onSubmit(form)
}

</script>

<template>
    <Teleport to="body">
        <div class="modal fade text-left" id="transactionModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel33"
            aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h4 class="modal-title" id="myModalLabel33">Kelola Transaksi</h4>
                        <button type="button" class="close" data-bs-dismiss="modal" aria-label="Close">
                            <i data-feather="x"></i>
                        </button>
                    </div>
                    <form @submit.prevent="onSubmit">
                        <div class="modal-body">

                            <div class="form-group mandatory">
                                <label class="form-label" for="account">Akun Penyimpanan </label>
                                <select class="form-select" id="account" v-model="form.saving_id">
                                    <option v-for="saving in savings" :value="saving.id">{{ saving.name }}  ( {{ rupiah(saving.amount, true) }} ) </option>
                                </select>
                            </div>
                            <div class="form-group mandatory">
                                <label class="form-label" for="category">Kategori </label>
                                <select class="form-select" id="account" v-model="form.category_id">
                                    <option v-for="category in categories" :value="category.id">{{ category.name }}
                                    </option>
                                </select>
                            </div>
                            <div class="form-group mandatory">
                                <label class="form-label" for="title">Judul </label>
                                <input id="title" required="true" type="text" placeholder="Judul" class="form-control"
                                    v-model="form.title">
                            </div>
                            <div class="form-group">
                                <label class="form-label" for="description">Deskripsi </label>
                                <textarea class="form-control" id="description" rows="3"
                                    v-model="form.description"></textarea>
                            </div>
                            <div class="form-group mandatory">
                                <label class="form-label" for="amount">Nominal </label>
                                <input id="amount" required="true" type="number" placeholder="Nominal"
                                    class="form-control" v-model="form.amount">
                            </div>
                            <div class="form-group mandatory">
                                <label class="form-label" for="transactiondate">Tanggal Transaksi </label>
                                <input type="text" id="transactiondate"
                                    class="form-control flatpickr-no-config flatpickr-input" placeholder="Select date.."
                                    v-model="form.transaction_date">
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