<script setup>
import { useCrud } from '~/composables/useCrud';
import Swal from 'sweetalert2';
import Pagination from '~/components/Pagination.vue';
import AccountModal from '~/components/account/AccountModal.vue';
import { rupiah } from '~/composables/utils';

const { fetchAccount } = useCrud()

const props = defineProps({
    setLoading: Function,
    setTab: Function
})

props.setTab("accounts")

const accounts = ref()
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
        text: e.msg,
        icon: "warning",
        confirmButtonText: "OK"
    })
}

const getData = async () => {
    props.setLoading(true)
    try {
        const response = await fetchAccount.all(page.value)
        accounts.value = response.data
        totalData.value = response.totalData
        totalPage.value = response.totalPage
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
        await fetchAccount.add(data)
        await getData()
    } catch (e) {
        showErr(e)
    }
}

const updateData = async (data) => {
    props.setLoading(true)
    try {
        await fetchAccount.edit(data)
        await getData()
    } catch (e) {
        showErr(e)
    }
}

const removeData = async (data) => {

    const result = await Swal.fire({
        title: `Hapus akun penyimpanan "${data.name}" ?`,
        text: "Semua data transaksi pada akun penyimpanan ini akan dihapus !!!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: 'Ya, hapus!',
        cancelButtonText: 'Batal'
    })

    if (result.isConfirmed) {
        props.setLoading(true)
        try {
            await fetchAccount.remove(data.id)
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
            <AccountModal :show="showModal" :on-close-modal="onCloseModal" :on-submit="onModalSubmit"
                :data="modalData" />
            <div class="col-12 col-md-12">
                <div class="card">
                    <div class="card-content">
                        <div class="card-body">
                            <h4>Daftar Akun Penyimpanan</h4>
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
                                            <th>Akun</th>
                                            <th>Nomor Akun</th>
                                            <th>Nominal</th>
                                            <th>Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="(account, idx) in accounts">
                                            <td>{{ idx + 1 }}</td>
                                            <td>{{ account.name }}</td>
                                            <td>{{ account.num ? account.num : '-' }}</td>
                                            <td>{{ rupiah(account.amount) }}</td>
                                            <td>
                                                <div class="buttons">
                                                    <button href="#" class="btn icon btn-primary"
                                                        @click="setModal('update', account)">
                                                        <i class="bi bi-pencil"></i>
                                                    </button>
                                                    <button href="#" class="btn icon btn-danger" v-if="account.id != 1"
                                                        @click="removeData(account)">
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