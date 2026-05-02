<script setup>
import { useCrud } from '~/composables/useCrud';
import Swal from 'sweetalert2';
import Pagination from '~/components/Pagination.vue';

const { fetchCategory, fetchBudget } = useCrud()

const props = defineProps({
    setLoading: Function,
    setTab: Function,
    showData: Boolean
})

props.setTab("budgets")

const budgets = ref()
const categories = ref()
const page = ref(1)
const totalData = ref(0)
const totalPage = ref(1)
const showModal = ref(false)
const modalData = ref()

let modalState = 'add'

const showErr = (e) => {
    props.setLoading(false)
    Swal.fire({
        title: "Gagal!",
        text: e.msg || e,
        icon: "warning",
        confirmButtonText: "OK"
    })
}

const getData = async () => {
    props.setLoading(true)
    try {
        let response = await fetchBudget.all(page.value, 10, {select: "*,categories(name)"})
        budgets.value = response.data
        totalData.value = response.totalData
        totalPage.value = response.totalPage

        response = await fetchCategory.all(1, 999)
        categories.value = response.data

        props.setLoading(false)
    } catch (e) {
        showErr(e)
    }
}

await getData()

const setPage = async (newPage) => {
    page.value = newPage
    await getData()
}

const setModal = (state, data) => {
    modalState = state
    modalData.value = data
    showModal.value = true
}

const onCloseModal = () => {
    showModal.value = false
}

const onModalSubmit = async (data) => {
    if (modalState == 'add') await addData(data)
    if (modalState == 'update') await updateData(data)
}

const addData = async (data) => {
    props.setLoading(true)
    try {
        await fetchBudget.add(data)
        await getData()
    } catch (e) {
        showErr(e)
    }
}

const updateData = async (data) => {
    props.setLoading(true)
    try {
        await fetchBudget.edit(data)
        await getData()
    } catch (e) {
        showErr(e)
    }
}

const removeData = async (data) => {
    const result = await Swal.fire({
        title: `Hapus anggaran "${data.name}" ?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: 'Ya, hapus!',
        cancelButtonText: 'Batal'
    })

    if (result.isConfirmed) {
        props.setLoading(true)
        try {
            await fetchBudget.remove(data.id)
            await getData()
        } catch (e) {
            showErr(e)
        }
    }
}

</script>

<template>
    <section class="section">
        <div class="row" id="basic-table">
            <BudgetModal :show="showModal" :on-close-modal="onCloseModal" :on-submit="onModalSubmit" :data="modalData" :categories="categories" />
            <div class="col-12 col-md-12">
                <div class="card">
                    <div class="card-content">
                        <div class="card-body">
                            <h4>Daftar anggaran per bulan</h4>
                            <div class="buttons d-flex justify-content-end">
                                <button href="#" class="btn btn-light" @click="setModal('add', null)">Tambah</button>
                            </div>
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
                                            <th>Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="(budget, idx) in budgets">
                                            <td>{{ idx + 1 }}</td>
                                            <td>{{ budget.title }}</td>
                                            <td>{{ budget.categories.name }}</td>
                                            <td>{{ rupiah(budget.amount, props.showData) }}</td>
                                            <td>
                                                <div class="buttons">
                                                    <button href="#" class="btn icon btn-primary"
                                                        @click="setModal('update', budget)">
                                                        <i class="bi bi-pencil"></i>
                                                    </button>
                                                    <button href="#" class="btn icon btn-danger"
                                                        @click="removeData(budget)">
                                                        <i class="bi bi-x"></i>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                                <Pagination :page="page" :total-page="totalPage" :set-page="setPage" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>