<script setup>

var props = defineProps({
    show: Boolean,
    onSubmit: Function,
    onCloseModal: Function,
    categories: Array,
    data: Object,
})

let form = reactive({
    id: props.data?.id || 0,
    category_id: props.data?.category_id || 1,
    title: props.data?.title || '',
    description: props.data?.description || '',
    amount: props.data?.amount || 0
})

let modal = null

onMounted(() => {
    const el = document.getElementById("budgetModal")
    modal = new bootstrap.Modal(el)
    el.addEventListener('hidden.bs.modal', () => {
        props.onCloseModal()
    })
})

watch(() => props.show, (newVal, oldVal) => {
    if (newVal) {
        form = reactive({
            id: props.data?.id || 0,
            category_id: props.data?.category_id || 1,
            title: props.data?.title || '',
            description: props.data?.description || '',
            amount: props.data?.amount || 0
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
    if (form.name == '') return toast("Nama anggaran wajib diisi")
    if (!form.amount) return toast("Jumlah anggaran wajib diisi")
    if (form.amount <= 0) return toast("Jumlah anggaran tidak boleh kurang dari sama dengan 0")
    modal.hide()
    props.onSubmit(form)
}

</script>

<template>
    <Teleport to="body">
        <div class="modal fade text-left" id="budgetModal" tabindex="-1" role="dialog"
            aria-labelledby="myModalLabel33" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h4 class="modal-title" id="myModalLabel33">Kelola anggaran</h4>
                        <button type="button" class="close" data-bs-dismiss="modal" aria-label="Close">
                            <i data-feather="x"></i>
                        </button>
                    </div>
                    <form @submit.prevent="onSubmit">
                        <div class="modal-body">

                            <div class="form-group mandatory">
                                <label class="form-label" for="category">Kategori </label>
                                <select class="form-select" id="account" v-model="form.category_id">
                                    <option v-for="category in categories" :value="category.id">{{ category.name }}
                                    </option>
                                </select>
                            </div>
                            
                            <div class="form-group mandatory">
                                <label class="form-label" for="name">Nama Anggaran</label>
                                <input id="name" required="true" type="text" placeholder="Nama anggaran"
                                    class="form-control" v-model="form.title">
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