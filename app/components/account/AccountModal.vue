<script setup>

var props = defineProps({
    show: Boolean,
    onSubmit: Function,
    onCloseModal: Function,
    data: Object,
})

let form = reactive({
    id: props.data?.id || 0,
    name: props.data?.name || '',
    num: props.data?.num || '',
    amount: props.data?.amount || 0,
    long_term: props.data?.long_term || false,
})

let modal = null

onMounted(() => {
    const el = document.getElementById("savingModal")
    modal = new bootstrap.Modal(el)
    el.addEventListener('hidden.bs.modal', () => {
        props.onCloseModal()
    })
})

watch(() => props.show, (newVal, oldVal) => {
    if (newVal) {
        form = reactive({
            id: props.data?.id || 0,
            name: props.data?.name || '',
            num: props.data?.num || '',
            amount: props.data?.amount || 0,
    long_term: props.data?.long_term || false,
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
    if (form.name === '') return toast("akun wajib diisi")
    if (form.amount === '') return toast("nominal wajib diisi")
    modal.hide()
    props.onSubmit(form)
}

</script>

<template>
    <Teleport to="body">
        <div class="modal fade text-left" id="savingModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel33"
            aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h4 class="modal-title" id="myModalLabel33">Kelola Akun Penyimpanan</h4>
                        <button type="button" class="close" data-bs-dismiss="modal" aria-label="Close">
                            <i data-feather="x"></i>
                        </button>
                    </div>
                    <form @submit.prevent="onSubmit">
                        <div class="modal-body">

                            <div class="form-group mandatory">
                                <label class="form-label" for="name">Akun </label>
                                <input id="name" required="true" type="text" placeholder="Nama penyimpanan (e.g. BCA, OVO, dll.)"
                                    class="form-control" v-model="form.name">
                            </div>

                            <div class="form-group">
                                <label class="form-label" for="num">Nomor Akun </label>
                                <input id="num" required="false" type="text" placeholder="Nomor Akun"
                                    class="form-control" v-model="form.num">
                            </div>

                            <div class="form-group mandatory">
                                <label class="form-label" for="amount">Nominal </label>
                                <input id="amount" required="true" type="number" placeholder="Nominal Simpanan"
                                    class="form-control" v-model="form.amount">
                            </div>

                            <div class="form-check form-switch mt-3 mb-3">
                                <input class="form-check-input" type="checkbox" id="long_term" v-model="form.long_term">
                                <label class="form-check-label" for="long_term">Tabungan jangka panjang</label>
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