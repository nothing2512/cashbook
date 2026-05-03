<script setup>
useHead({
    meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' }
    ],
    link: [
        { rel: 'icon', href: '/mazer/assets/compiled/png/logo.png' },
        { rel: "stylesheet", href: "mazer/assets/compiled/css/app.css" },
        { rel: "stylesheet", href: "mazer/assets/compiled/css/app-dark.css" },
        { rel: "stylesheet", href: "mazer/assets/compiled/css/auth.css" },
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
        { src: "https://cdnjs.cloudflare.com/ajax/libs/lottie-web/5.12.2/lottie.min.js" },
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

const loading = ref(false)

const setLoading = (status) => {
    loading.value = status
}

provide('setLoading', setLoading)

</script>
<template>
    <div id="auth">
        <Loading :loading="loading" />

        <div class="row h-100">
            <div class="col-lg-5 col-12">
                <div id="auth-left">
                    <div class="auth-logo">
                        <a href="#"><img style="width: 4rem; height: auto;" src="/mazer/assets/compiled/png/logo.png" alt="Logo"></a>
                    </div>
                    <NuxtPage />
                </div>
            </div>
            <div class="col-lg-7 d-none d-lg-block">
                <div id="auth-right">

                </div>
            </div>
        </div>

    </div>
</template>