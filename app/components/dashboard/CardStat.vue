<script setup>

const props = defineProps({
    title: String,
    value: String,
    icon: String,
    color: String,
})

</script>

<template>
    <div class="col">
        <div class="card">
            <div class="card-body px-4 py-4-5">
                <div class="row">
                    <div class="col-md-4 col-lg-12 col-xl-12 col-xxl-5 d-flex justify-content-start ">
                        <div class="stats-icon mb-2" :class="props.color || 'purple'">
                            <i :class="props.icon || 'iconly-boldShow'"></i>
                        </div>
                    </div>
                    <div class="col-md-8 col-lg-12 col-xl-12 col-xxl-7">
                        <h6 class="text-muted font-semibold">{{ props.title }}</h6>
                        <h6 class="font-extrabold mb-0">{{ props.value }}</h6>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>