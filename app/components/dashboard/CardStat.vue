<script setup>

const props = defineProps({
    title: String,
    value: String,
    icon: String,
    color: String,
    bg: String,
    href: String,
    tooltip: String,
})

const tooltipEl = ref(null)
onMounted(() => {
    if (props.tooltip) new bootstrap.Tooltip(tooltipEl.value)
})

</script>

<template>
    <div class="col">
        <div class="card" :class="bg != undefined ? `bg-${bg}` : ''">
            <div class="card-body px-4 py-4-5">
                <div class="position-absolute top-0 end-0 m-3">
                    <i class="bi bi-question-circle" :title="tooltip" ref="tooltipEl" data-bs-placement="bottom"></i>
                    <NuxtLink :href="href" v-if="href">
                        <i class="bi bi-box-arrow-up-right ms-2 text-white"></i>
                    </NuxtLink>
                </div>

                <div class="row">
                    <div class="col-md-2 col-lg-12 col-xl-12 col-xxl-3 d-flex justify-content-start ">
                        <div class="stats-icon mb-2" :class="props.color || 'purple'">
                            <i :class="props.icon || 'iconly-boldShow'"></i>
                        </div>
                    </div>
                    <div class="col-md-10 col-lg-12 col-xl-12 col-xxl-9">
                        <h6 class="text-muted font-semibold">{{ title }}</h6>
                        <h6 class="font-extrabold mb-0">{{ value }}</h6>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>