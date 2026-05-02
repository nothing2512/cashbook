<script setup>

useHead({
    meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' }
    ],
    link: [
        { rel: 'icon', href: '/mazer/assets/compiled/png/logo.png' },
        { rel: "stylesheet", href: "mazer/assets/compiled/css/app.css" },
        { rel: "stylesheet", href: "mazer/assets/compiled/css/app-dark.css" },
        { rel: "stylesheet", href: "mazer/assets/compiled/css/iconly.css" },
        { rel: "stylesheet", href: "mazer/assets/extensions/toastify-js/src/toastify.css" },
        { rel: "stylesheet", href: "mazer/assets/extensions/flatpickr/flatpickr.min.css" }
    ],
    htmlAttrs: {
        lang: 'en'
    },
    script: [
        { src: "mazer/assets/extensions/perfect-scrollbar/perfect-scrollbar.min.js" },
        { src: "mazer/assets/compiled/js/app.js" },
        { src: "mazer/assets/extensions/apexcharts/apexcharts.min.js" },
        { src: "https://cdnjs.cloudflare.com/ajax/libs/lottie-web/5.12.2/lottie.min.js" },
        { src: "mazer/assets/extensions/toastify-js/src/toastify.js" },
        { src: "mazer/assets/extensions/flatpickr/flatpickr.min.js" }
    ]
})

const title = 'Cashbook'
const description = 'Cashbook apps'

useSeoMeta({
    title,
    description,
    ogTitle: title,
    ogDescription: description,
    ogImage: '/mazer/assets/compiled/png/logo.png',
    twitterCard: 'summary_large_image'
})

const pageTitle = ref('Dashboard')
const loading = ref(false)
const tab = ref("dashboard")
const nowDateTime = ref('')
const showData = ref(false)

const { fetchSetting } = useCrud()

const setLoading = (status) => {
    loading.value = status
}

const setTab = (value) => {
    tab.value = value
    if (value == "dashboard") pageTitle.value = "Dashboard"
    if (value == "accounts") pageTitle.value = "Akun Penyimpanan"
    if (value == "categories") pageTitle.value = "Kategori"
    if (value == "debts") pageTitle.value = "Hutang"
    if (value == "expenses") pageTitle.value = "Pengeluaran"
    if (value == "incomes") pageTitle.value = "Pemasukan"
    if (value == "receivables") pageTitle.value = "Piutang"
    if (value == "instalment") pageTitle.value = "Cicilan"
    if (value == "budgets") pageTitle.value = "Anggaran Bulanan"
    closeSidebar()
}

const isSidebar = ref(false)
const closeSidebar = () => {
    isSidebar.value = false
}

const openSidebar = () => {
    isSidebar.value = true
}

onMounted(async () => {

    setInterval(() => {
        const now = new Date()
        const months = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
        const pad = (n) => String(n).padStart(2, "0");

        const dd = pad(now.getDate());
        const mm = months[now.getMonth()];
        const yy = String(now.getFullYear()).slice(-2);

        const HH = pad(now.getHours());
        const ii = pad(now.getMinutes());
        const ss = pad(now.getSeconds());

        nowDateTime.value = `${dd} ${mm} ${yy} ${HH}:${ii}:${ss}`;
    }, 1000)

    const { data } = await fetchSetting.detail(1)
    showData.value = data[0].show_digit
})

const setShowData = async () => {
    showData.value=!showData.value
    await fetchSetting.edit({id: 1, show_digit: showData.value})
}

</script>

<template>
    <div class="sidebar-backdrop" v-if="isSidebar" @click="closeSidebar"></div>
    <div id="app">
        <Loading :loading="loading" />
        <Sidebar :tab="tab" :active="isSidebar" :showData="showData" />
        <div id="main">
            <header class="mb-3">
                <a href="#" class="burger-btn d-block d-xl-none" @click.prevent="openSidebar">
                    <i class="bi bi-justify fs-3"></i>
                </a>
            </header>

            <div class="page-heading">
                <div class="row">
                    <div class="col">
                        <h3 class="d-inline-block me-3 mb-0">{{ pageTitle }} </h3>
                        <h4 @click="setShowData" class="d-inline-block mb-0" style="cursor: pointer;"><i class="bi" :class="showData ? 'bi-eye-fill' : 'bi-eye-slash-fill'"></i></h4>
                    </div>
                    <div class="col">
                        <h4 class="text-end text-secondary mb-0">{{ nowDateTime }}</h4>
                    </div>
                </div>

            </div>
            <div class="page-content">
                <NuxtPage :setLoading="setLoading" :setTab="setTab" :showData="showData" />
            </div>

            <Footer />
        </div>
    </div>
</template>
