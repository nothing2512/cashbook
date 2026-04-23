<script setup>
const props = defineProps({
    loading: Boolean
})

onMounted(() => {
    lottie.loadAnimation({
        container: document.getElementById('lottie'),
        renderer: 'svg',
        loop: true,
        autoplay: true,
        path: '/loading.json' // taruh file di public folder atau URL
    });

})

</script>
<template>
    <div style="
        position: fixed;
        inset: 0;
        background: rgba(0,0,0,0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
        " :style="loading ? 'display: flex' : 'display: none'">
        <div id="lottie" style="width:100px;height:100px;"></div>
    </div>
</template>