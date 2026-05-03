<script setup>
import { useCrud } from '~/composables/useCrud';
import { useTransaction } from '~/composables/useTransaction';
import Swal from 'sweetalert2';
import Pagination from '~/components/Pagination.vue';
import { rupiah } from '~/composables/utils';
import InstalmentModal from '~/components/instalment/InstalmentModal.vue';

const { fetchInstalment, fetchAccount } = useCrud()
const { fetchTransaction } = useTransaction()

const props = defineProps({
    setLoading: Function,
    setTab: Function,
    showData: Boolean
})

const bulan = ["--", "Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"]

props.setTab("instalment")

const instalments = ref()
const monthlyInstalments = ref()
const page = ref(1)
const pageMonthly = ref(1)
const totalData = ref(0)
const totalDataMonthly = ref(0)
const totalPage = ref(1)
const totalPageMonthly = ref(0)
const showModal = ref(false)
const modalData = ref()
const savings = ref()
const showPaidModal = ref(false)
const paidData = ref(0)

let paidMonth = 0
let paidYear = 0

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

        let response = await fetchTransaction.instalments(page.value, 5)
        instalments.value = response.data
        totalData.value = response.totalData
        totalPage.value = response.totalPage

        response = await fetchTransaction.monthlyInstalments(pageMonthly.value)
        monthlyInstalments.value = response.data
        totalDataMonthly.value = response.totalData
        totalPageMonthly.value = response.totalPage

        props.setLoading(false)
    } catch (e) {
        showErr(e)
    }
}

const getMonthlyData = async () => {
    props.setLoading(true)
    try {

        const response = await fetchTransaction.monthlyInstalments(pageMonthly.value)
        monthlyInstalments.value = response.data
        totalDataMonthly.value = response.totalData
        totalPageMonthly.value = response.totalPage

        props.setLoading(false)
    } catch (e) {
        showErr(e)
    }
}

const getFullData = async () => {
    props.setLoading(true)
    try {
        let response = await fetchTransaction.instalments(page.value, 5)
        instalments.value = response.data
        totalData.value = response.totalData
        totalPage.value = response.totalPage

        response = await fetchTransaction.monthlyInstalments(pageMonthly.value)
        monthlyInstalments.value = response.data
        totalDataMonthly.value = response.totalData
        totalPageMonthly.value = response.totalPage

        response = await fetchAccount.all(1, 999)
        savings.value = response.data

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

const setPageMonthly = async (newPage) => {
    pageMonthly.value = newPage
    await getMonthlyData()
}

const setModal = (data) => {
    modalData.value = data
    showModal.value = true
}

const onCloseModal = () => {
    showModal.value = false
}

const addData = async (data) => {
    if (hasLimit() && transactions.value.length >= 5) {
        return await Swal.fire({
            title: `Akses dibatasi`,
            text: "Akun demo hanya dapat memiliki maksimal 5 cicilan",
            icon: "danger",
            confirmButtonText: 'OK'
        })
    }

    props.setLoading(true)
    try {
        await fetchInstalment.add(data)
        await getData()
    } catch (e) {
        showErr(e)
    }
}

const removeData = async (data) => {
    const result = await Swal.fire({
        title: `Hapus cicilan "${data.name}" ?`,
        text: "Nominal cicilan perbulan juga akan ikut berubah !!!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: 'Ya, hapus!',
        cancelButtonText: 'Batal'
    })

    if (result.isConfirmed) {
        props.setLoading(true)
        try {
            await fetchInstalment.remove(data.id)
            await getData()
        } catch (e) {
            showErr(e)
        }
    }
}

const pay = (month, year, pay) => {
    paidMonth = month
    paidYear = year
    paidData.value = pay
    showPaidModal.value = true
}

const doPay = async (data) => {
    try {
        props.setLoading(true)
        await fetchTransaction.add({
            saving_id: data.saving_id,
            category_id: 1,
            title: `Pembayaran cicilan pada ${bulan[paidMonth]} ${paidYear}`,
            description: `Pembayaran cicilan pada ${bulan[paidMonth]} ${paidYear}`,
            amount: paidData.value,
            kind: "expenses",
            status: "paid",
            transaction_date: new Date()
        })
        await fetchTransaction.payInstalment(paidMonth, paidYear)
        await getFullData()
    } catch(e) {
        showErr(e)
    }
}

</script>

<template>
    <section class="section">
        <div class="row" id="basic-table">
            <InstalmentModal :show="showModal" :on-close-modal="onCloseModal" :on-submit="addData" :data="modalData" />
            <InstalmentPayModal :show="showPaidModal" :savings="savings" :paid="paidData" :on-submit="doPay" :on-close-modal="() => showPaidModal=false" />

            <div class="col-12 col-md-12">
                <div class="card">
                    <div class="card-content">
                        <div class="card-body">
                            <h4>Cicilan</h4>
                            <div class="buttons d-flex justify-content-end">
                                <button href="#" class="btn btn-light" @click="setModal(null)">Tambah</button>
                            </div>
                            <p class="card-text"></p>
                            <!-- Table with outer spacing -->
                            <div class="table-responsive">
                                <table class="table table-lg">
                                    <thead>
                                        <tr>
                                            <th>No</th>
                                            <th>Judul</th>
                                            <th>Bulan Mulai</th>
                                            <th>Tahun Mulai</th>
                                            <th>Total Bulan</th>
                                            <th>Cicilan per bulan</th>
                                            <th>Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="(i, idx) in instalments">
                                            <td>{{ idx + 1 }}</td>
                                            <td>{{ i.name }}</td>
                                            <td>{{ i.startmonth }}</td>
                                            <td>{{ i.startyear }}</td>
                                            <td>{{ i.totalmonth }}</td>
                                            <td>{{ rupiah(i.monthlypaid, props.showData) }}</td>
                                            <td>
                                                <div class="buttons">
                                                    <button href="#" class="btn icon btn-danger"
                                                        @click="removeData(i)">
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

            <div class="col-12 col-md-12">
                <div class="card">
                    <div class="card-content">
                        <div class="card-body">
                            <h4>Cicilan per bulan</h4>
                            <!-- Table with outer spacing -->
                            <div class="table-responsive">
                                <table class="table table-lg">
                                    <thead>
                                        <tr>
                                            <th>No</th>
                                            <th>Bulan</th>
                                            <th>Cicilan</th>
                                            <th>Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="(i, idx) in monthlyInstalments">
                                            <td>{{ idx + 1 }}</td>
                                            <td>{{ bulan[i.month] }} {{ i.year }}</td>
                                            <td>{{ rupiah(i.sum, props.showData) }}</td>
                                            <td>
                                                <div class="buttons">
                                                    <button href="#" class="btn icon btn-primary" @click="pay(i.month, i.year, i.sum)">
                                                        Bayar
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                                <Pagination :page="pageMonthly" :total-page="totalPageMonthly" :set-page="setPageMonthly" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    </section>
</template>