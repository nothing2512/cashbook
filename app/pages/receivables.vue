<script setup>
import { useCrud } from '~/composables/useCrud';
import { useTransaction } from '~/composables/useTransaction';
import Swal from 'sweetalert2';
import Pagination from '~/components/Pagination.vue';
import { rupiah } from '~/composables/utils';
import TransactionModal from '~/components/transaction/TransactionModal.vue';

const { fetchAccount, fetchCategory } = useCrud()
const { fetchTransaction } = useTransaction()

const props = defineProps({
    setLoading: Function,
    setTab: Function
})

props.setTab("receivables")

const accounts = ref()
const categories = ref()
const transactions = ref()
const page = ref(1)
const totalData = ref(0)
const totalPage = ref(1)
const showModal = ref(false)
const modalData = ref()
const listState = ref('all')

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

const getFullData = async () => {
    props.setLoading(true)
    try {
        let response = await fetchAccount.all(page.value, 200)
        accounts.value = response.data

        response = await fetchCategory.all(page.value, 200)
        categories.value = response.data

        await getData()

        props.setLoading(false)
    } catch (e) {
        showErr(e)
    }
}

const getData = async (state="all") => {
    listState.value = state
    props.setLoading(true)
    try {
        const response = await fetchTransaction.receivables(page.value, listState.value)
        transactions.value = response.data
        totalData.value = response.totalData
        totalPage.value = response.totalPage
        props.setLoading(false)
    } catch (e) {
        showErr(e)
    }
}

await getFullData()

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

const setDefault = (data) => {
    data.kind = "expenses"
    data.status = "unpaid"
    data.is_debt = true
    return data
}

const addData = async (data) => {
    props.setLoading(true)
    try {
        await fetchTransaction.add(setDefault(data))
        await getData()
    } catch (e) {
        showErr(e)
    }
}

const updateData = async (data) => {
    props.setLoading(true)
    try {
        await fetchTransaction.edit(setDefault(data))
        await getData()
    } catch (e) {
        showErr(e)
    }
}

const removeData = async (data) => {
    const result = await Swal.fire({
        title: `Hapus transaksi "${data.title}" ?`,
        text: "Nominal uang pada akun penyimpanan juga akan ikut berubah !!!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: 'Ya, hapus!',
        cancelButtonText: 'Batal'
    })

    if (result.isConfirmed) {
        props.setLoading(true)
        try {
            await fetchTransaction.remove(data.id)
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
            <TransactionModal :show="showModal" :on-close-modal="onCloseModal" :on-submit="onModalSubmit"
                :data="modalData" :categories="categories" :savings="accounts" expenses="true" />
            <div class="col-12 col-md-12">
                <div class="card">
                    <div class="card-content">
                        <div class="card-body">
                            <h4>Piutang</h4>
                            <div class="buttons d-flex justify-content-end">
                                <div class="input-group mb-3">
                                    <button href="#" class="input-group-text btn me-0" :class="listState == 'all' ? 'btn-primary' : 'btn-light'"
                                        @click="getData('all')">Semua</button>
                                    <button href="#" class="input-group-text btn me-0" :class="listState == 'paidoff' ? 'btn-primary' : 'btn-light'"
                                        @click="getData('paidoff')">Lunas</button>
                                    <button href="#" class="input-group-text btn me-0" :class="listState == 'unpaidoff' ? 'btn-primary' : 'btn-light'"
                                        @click="getData('unpaidoff')">Belum Lunas</button>
                                </div>
                                <button href="#" class="btn btn-light" @click="setModal('add', null)">Tambah</button>
                            </div>
                            <p class="card-text"></p>
                            <!-- Table with outer spacing -->
                            <div class="table-responsive">
                                <table class="table table-lg">
                                    <thead>
                                        <tr>
                                            <th>No</th>
                                            <th>Judul</th>
                                            <th>Nominal</th>
                                            <th>Status</th>
                                            <th>Kategori</th>
                                            <th>Akun</th>
                                            <th>Tanggal</th>
                                            <th>Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="(transaction, idx) in transactions">
                                            <td>{{ idx + 1 }}</td>
                                            <td>{{ transaction.title }}</td>
                                            <td>{{ rupiah(transaction.amount) }}</td>
                                            <td>
                                                <span class="badge" :class="transaction.paid_off ? 'bg-success' : 'bg-danger'" >{{ transaction.paid_off ? 'Lunas' : 'Belum Lunas' }}</span>
                                                <br>
                                                <span class="badge bg-info" v-if="!transaction.paid_off">- {{ rupiah(transaction.amount - transaction.child_amount) }}</span>
                                            </td>
                                            <td><span class="badge bg-primary">{{ transaction.categories.name }}</span>
                                            </td>
                                            <td><span class="badge bg-info">{{ transaction.savings.name }}</span></td>
                                            <td>{{ transaction.transaction_date }}</td>
                                            <td>
                                                <div class="buttons">
                                                    <NuxtLink :href="`/settlement/receivables/${transaction.id}`" class="btn icon btn-primary">
                                                        <span>Pelunasan</span>
                                                    </NuxtLink>
                                                    <button href="#" class="btn icon btn-primary"
                                                        @click="setModal('update', transaction)">
                                                        <i class="bi bi-pencil"></i>
                                                    </button>
                                                    <button href="#" class="btn icon btn-danger"
                                                        @click="removeData(transaction)">
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