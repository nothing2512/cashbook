<script setup>
useHead({
  meta: [
    { name: 'viewport', content: 'width=device-width, initial-scale=1' }
  ],
  link: [
    { rel: 'icon', href: '/mazer/assets/compiled/svg/logo.svg' },
    { rel: "stylesheet", href: "mazer/assets/compiled/css/app.css" },
    { rel: "stylesheet", href: "mazer/assets/compiled/css/app-dark.css" },
    { rel: "stylesheet", href: "mazer/assets/compiled/css/iconly.css" },
  ],
  htmlAttrs: {
    lang: 'en'
  },
  script: [
    { defer: true, src: "mazer/assets/static/js/components/dark.js" },
    { defer: true, src: "mazer/assets/extensions/perfect-scrollbar/perfect-scrollbar.min.js" },
    { defer: true, src: "mazer/assets/compiled/js/app.js" },
    { defer: true, src: "mazer/assets/extensions/apexcharts/apexcharts.min.js" },
    { defer: true, src: "mazer/assets/static/js/pages/dashboard.js" },
  ]
})

const title = 'Cashbook'
const description = 'Cashbook apps'

useSeoMeta({
  title,
  description,
  ogTitle: title,
  ogDescription: description,
  ogImage: '/mazer/assets/compiled/svg/logo.svg',
  twitterCard: 'summary_large_image'
})

onMounted(async () => {
  const theme = localStorage.getItem('theme')

  if (theme) 
    document.documentElement.setAttribute('data-bs-theme', theme)
})

const token = useCookie('token')
if (token.value == null) {
  navigateTo("/login")   
}

</script>

<script>

const pageTitle = ref('Dashboard')

const setPageTitle = (value) => {
    if (value == 'dashboard') pageTitle.value = "Dashboard";
    if (value == 'incomes') pageTitle.value = "Pemasukan";
    if (value == 'expenses') pageTitle.value = "Pengeluaran";
    if (value == 'debts') pageTitle.value = "Hutang";
    if (value == 'receivables') pageTitle.value = "Piutang";
}

</script>

<template>
    <div id="app">
        <Sidebar @change="setPageTitle" />
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
                <NuxtPage />
            </div>

            <Footer />
        </div>
    </div>
</template>
