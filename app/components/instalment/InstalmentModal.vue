<script setup>

var props = defineProps({
    show: Boolean,
    onSubmit: Function,
    onCloseModal: Function,
    data: Object,
})

let form = reactive({
    name: '',
    startmonth: 0,
    startyear: '',
    totalmonth: '',
    monthlypaid: ''
})

let modal = null

onMounted(() => {
    const el = document.getElementById("instalmentModal")
    modal = new bootstrap.Modal(el)
    el.addEventListener('hidden.bs.modal', () => {
        props.onCloseModal()
    })
})

watch(() => props.show, (newVal, oldVal) => {
    if (newVal) {
        form = reactive({
            name: '',
            startmonth: 0,
            startyear: '',
            totalmonth: '',
            monthlypaid: ''
        })
        modal.show()
    }
})

const bulan = ["--", "Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"]

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
    if (form.name == '') return toast("judul cicilan wajib diisi")
    if (form.startmonth === '' || form.startmonth === 0) return toast("bulan mulai wajib diisi")
    if (form.startyear === '' || form.startyear === 0) return toast("tahun mulai wajib diisi")
    if (form.totalmonth === '' || form.totalmonth === 0) return toast("tenor wajib diisi")
    if (form.monthlypaid === '' || form.monthlypaid === 0) return toast("cicilan per bulan wajib diisi")
    modal.hide()
    props.onSubmit(form)
}

</script>

<template>
    <Teleport to="body">
        <div class="modal fade text-left" id="instalmentModal" tabindex="-1" role="dialog"
            aria-labelledby="myModalLabel33" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h4 class="modal-title" id="myModalLabel33">Tambah cicilan</h4>
                        <button type="button" class="close" data-bs-dismiss="modal" aria-label="Close">
                            <i data-feather="x"></i>
                        </button>
                    </div>
                    <form @submit.prevent="onSubmit">

                        <div class="modal-body">
                            <div class="form-group mandatory">
                                <label class="form-label" for="name">Nama cicilan </label>
                                <input id="name" required="true" type="text" placeholder="Judul cicilan"
                                    class="form-control" v-model="form.name">
                            </div>
                        </div>
                        <div class="modal-body">
                            <div class="form-group mandatory">
                                <label class="form-label" for="name">Bulan mulai </label>
                                <select class="form-select" id="account" v-model="form.startmonth">
                                    <option v-for="(b, idx) in bulan" :value="idx">{{ b }}
                                    </option>
                                </select>
                            </div>
                        </div>

                        <div class="modal-body">
                            <div class="form-group mandatory">
                                <label class="form-label" for="startyear">Tahun mulai </label>
                                <input id="startyear" required="true" type="number" placeholder="Tahun mulai"
                                    class="form-control" v-model="form.startyear">
                            </div>
                        </div>

                        <div class="modal-body">
                            <div class="form-group mandatory">
                                <label class="form-label" for="totalmonth">Tenor (berpaa bulan cicilan) </label>
                                <input id="totalmonth" required="true" type="number" placeholder="Tenor"
                                    class="form-control" v-model="form.totalmonth">
                            </div>
                        </div>

                        <div class="modal-body">
                            <div class="form-group mandatory">
                                <label class="form-label" for="monthlypaid">Cicilan per bulan </label>
                                <input id="monthlypaid" required="true" type="number" placeholder="Cicilan per bulan"
                                    class="form-control" v-model="form.monthlypaid">
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