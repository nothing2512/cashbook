<script setup>

var props = defineProps({
    show: Boolean,
    onSubmit: Function,
    onCloseModal: Function,
    data: Object,
    savings: Array,
    categories: Array,
})

let form = reactive({
    id: props.data?.id || 0,
    salary: props.data?.salary || 0,
    payday: props.data?.payday || 0,
    auto_add_salary: props.data?.auto_add_salary || false,
    category_id: props.data?.category_id || 1,
    saving_id: props.data?.saving_id || 1
})

let modal = null

onMounted(() => {
    const el = document.getElementById("settingModal")
    modal = new bootstrap.Modal(el)
    el.addEventListener('hidden.bs.modal', () => {
        props.onCloseModal()
    })
})

watch(() => props.show, (newVal, oldVal) => {
    if (newVal) {
        form = reactive({
            id: props.data?.id || 0,
            salary: props.data?.salary || 0,
            payday: props.data?.payday || 0,
            auto_add_salary: props.data?.auto_add_salary || false,
            category_id: props.data?.category_id || 1,
            saving_id: props.data?.saving_id || 1
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

    if (form.salary === '') return toast("Gaji pokok wajib diisi walaupun 0")
    if (form.payday === '') return toast("Tanggal gajian wajib diisi walaupun 0")
    if (form.salary < 0) return toast("Gaji pokok tidak boleh minus")
    if (form.payday < 0 || form.payday > 31) return toast("Tanggal gajian tidak boleh lebih dari 31 dan kurang dari 0")

    modal.hide()
    props.onSubmit(form)
}

watch(form, (newVal, oldVal) => {
    if (newVal.payday == 0 || newVal.salary == 0) form.auto_add_salary = false
})

</script>

<template>
    <Teleport to="body">
        <div class="modal fade text-left" id="settingModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel33"
            aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h4 class="modal-title" id="myModalLabel33">Pengaturan</h4>
                        <button type="button" class="close" data-bs-dismiss="modal" aria-label="Close">
                            <i data-feather="x"></i>
                        </button>
                    </div>
                    <form @submit.prevent="onSubmit">
                        <div class="modal-body">

                            <div class="form-group mandatory">
                                <label class="form-label" for="salary">Gaji pokok
                                </label>
                                <input id="salary" required="true" type="number" placeholder="Gaji pokok"
                                    class="form-control" v-model="form.salary">
                            </div>

                            <div class="form-group mandatory">
                                <label class="form-label" for="payday">Tanggal gajian </label>
                                <input id="payday" required="true" type="number" placeholder="Gaji pokok"
                                    class="form-control" v-model="form.payday">
                            </div>

                            <div class="form-check form-switch mt-3 mb-3">
                                <input class="form-check-input" type="checkbox" id="auto_add_salary"
                                    v-model="form.auto_add_salary" :disabled="form.payday == 0 || form.salary == 0">
                                <label class="form-check-label" for="auto_add_salary">Otomatis tambahkan gaji
                                    bulanan</label>
                            </div>

                            <div class="form-group mandatory">
                                <label class="form-label" for="account">Akun Penyimpanan gaji </label>
                                <select class="form-select" id="account" v-model="form.saving_id">
                                    <option v-for="saving in savings" :value="saving.id">{{ saving.name }}  ( {{ rupiah(saving.amount, true) }} ) </option>
                                </select>
                            </div>

                            <div class="form-group mandatory">
                                <label class="form-label" for="category">Kategori gaji </label>
                                <select class="form-select" id="account" v-model="form.category_id">
                                    <option v-for="category in categories" :value="category.id">{{ category.name }}
                                    </option>
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