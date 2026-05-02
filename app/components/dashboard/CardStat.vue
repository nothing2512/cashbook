<script setup>

const props = defineProps({
    title: String,
    value: String,
    icon: String,
    color: String,
    bg: String,
    href: String,
})

</script>

<template>
    <div class="col">
        <NuxtLink :href="href">
            <div class="card" :class="bg != undefined ? `bg-${bg}` : ''">
                <div class="card-body px-4 py-4-5">
                    
                    <i v-if="href" class="bi bi-box-arrow-up-right position-absolute top-0 end-0 m-3"></i>

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
        </NuxtLink>
    </div>
</template>