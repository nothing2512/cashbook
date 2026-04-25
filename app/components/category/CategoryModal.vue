<script setup>

var props = defineProps({
    show: Boolean,
    onSubmit: Function,
    onCloseModal: Function,
    data: Object,
})

let form = reactive({
    id: props.data?.id || 0,
    name: props.data?.name || ''
})

let modal = null

onMounted(() => {
    const el = document.getElementById("categoryForm")
    modal = new bootstrap.Modal(el)
    el.addEventListener('hidden.bs.modal', () => {
        props.onCloseModal()
    })
})

watch(() => props.show, (newVal, oldVal) => {
    if (newVal) {
        form = reactive({
            id: props.data?.id || 0,
            name: props.data?.name || ''
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
    if (form.name == '') return toast("nama kategori wajib diisi")
    modal.hide()
    props.onSubmit(form)
}

</script>

<template>
    <Teleport to="body">
        <div class="modal fade text-left" id="categoryForm" tabindex="-1" role="dialog" aria-labelledby="myModalLabel33"
            aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h4 class="modal-title" id="myModalLabel33">Kelola Kategori</h4>
                        <button type="button" class="close" data-bs-dismiss="modal" aria-label="Close">
                            <i data-feather="x"></i>
                        </button>
                    </div>
                    <form @submit.prevent="onSubmit">
                        <div class="modal-body">
                            <div class="form-group mandatory">
                                <label class="form-label" for="name">Nama kategori </label>
                                <input id="name" required="true" type="text" placeholder="Nama kategori"
                                    class="form-control" v-model="form.name">
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