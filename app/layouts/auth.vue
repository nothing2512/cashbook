<script setup>
useHead({
    meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' }
    ],
    link: [
        { rel: 'icon', href: 'dist/assets/compiled/svg/logo.svg' },
        { rel: "stylesheet", href: "dist/assets/compiled/css/app.css" },
        { rel: "stylesheet", href: "dist/assets/compiled/css/app-dark.css" },
        { rel: "stylesheet", href: "dist/assets/compiled/css/auth.css" },
    ],
    htmlAttrs: {
        lang: 'en'
    },
    script: [
        { defer: true, src: "dist/assets/static/js/components/dark.js" },
        { defer: true, src: "dist/assets/extensions/perfect-scrollbar/perfect-scrollbar.min.js" },
        { defer: true, src: "dist/assets/compiled/js/app.js" },
        { defer: true, src: "dist/assets/extensions/apexcharts/apexcharts.min.js" },
        { defer: true, src: "dist/assets/static/js/pages/dashboard.js" },
    ]
})

const title = 'Cashbook'
const description = 'Cashbook apps'

useSeoMeta({
    title,
    description,
    ogTitle: title,
    ogDescription: description,
    ogImage: 'dist/assets/compiled/svg/logo.svg',
    twitterCard: 'summary_large_image'
})

const token = useCookie('token')
if (token.value != null) {
    navigateTo('/')
}

</script>
<template>
    <div id="auth">

        <div class="row h-100">
            <div class="col-lg-5 col-12">
                <div id="auth-left">
                    <div class="auth-logo">
                        <a href="#"><img src="/dist/assets/compiled/svg/logo.svg" alt="Logo"></a>
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