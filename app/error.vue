<script setup>
defineProps({
    error: Object
})

useHead({
    meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' }
    ],
    link: [
        { rel: 'icon', href: '/mazer/assets/compiled/png/logo.png' },
        { rel: "stylesheet", href: "mazer/assets/compiled/css/app.css" },
        { rel: "stylesheet", href: "mazer/assets/compiled/css/error.css" },
    ],
    htmlAttrs: {
        lang: 'en'
    },
})

useSeoMeta({
    title: "Cashbook",
    description: "Cashbook apps",
    ogTitle: "Cashbook",
    ogDescription: "Cashbook apps",
    ogImage: '/mazer/assets/compiled/png/logo.png',
    twitterCard: 'summary_large_image'
})

onMounted(() => {
    const theme = localStorage.getItem('theme')

    if (theme)
        document.documentElement.setAttribute('data-bs-theme', theme)
})

</script>

<template>
    <div id="error" v-if="error?.statusCode === 404">
        <div class="error-page container">
            <div class="col-md-8 col-12 offset-md-2">
                <div class="text-center row">
                    <img class="img-error" src="/mazer/assets/compiled/svg/error-404.svg" alt="Not Found">
                    <h1 class="error-title">NOT FOUND</h1>
                    <p class='fs-5 text-gray-600'>The page you are looking not found.</p>
                    <NuxtLink href="/" class="btn btn-lg btn-outline-primary mt-3">Go Home</NuxtLink>
                </div>
            </div>
        </div>
    </div>

    <div id="error" v-if="error?.statusCode === 500">
        <div class="error-page container">
            <div class="col-md-8 col-12 offset-md-2">
                <div class="text-center row">
                    <img class="img-error" src="/mazer/assets/compiled/svg/error-500.svg" alt="Not Found">
                    <h1 class="error-title">System Error</h1>
                    <p class='fs-5 text-gray-600'>{{ error?.message }}</p>
                    <NuxtLink href="/" class="btn btn-lg btn-outline-primary mt-3">Go Home</NuxtLink>
                </div>
            </div>
        </div>
    </div>

</template>