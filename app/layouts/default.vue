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
    { src: "mazer/assets/static/js/components/dark.js" },
    { src: "mazer/assets/extensions/perfect-scrollbar/perfect-scrollbar.min.js" },
    { src: "mazer/assets/compiled/js/app.js" },
    { src: "mazer/assets/extensions/apexcharts/apexcharts.min.js" },
    { src: "mazer/assets/static/js/pages/dashboard.js" },
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

onMounted(async () => {
  const theme = localStorage.getItem('theme')

  if (theme) 
    document.documentElement.setAttribute('data-bs-theme', theme)
})

const token = useCookie('token')
if (!token.value) {
  console.log(token)
  console.log(token.value)
  alert("No Token")
}

</script>

<script>

const pageTitle = ref('Dashboard')
const loading = ref(false)
const tab = ref("dashboard")

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
}

</script>

<template>
    <div id="app">
        <Loading :loading="loading" />
        <Sidebar :tab="tab" />
        <div id="main">
            <header class="mb-3">
                <a href="#" class="burger-btn d-block d-xl-none">
                    <i class="bi bi-justify fs-3"></i>
                </a>
            </header>

            <div class="page-heading">
                <h3>{{ pageTitle }}</h3>
            </div>
            <div class="page-content">
                <NuxtPage :setLoading="setLoading" :setTab="setTab" />
            </div>

            <Footer />
        </div>
    </div>
</template>
