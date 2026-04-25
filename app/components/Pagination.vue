<script setup>
const props = defineProps({
    page: Number,
    totalPage: Number,
    setPage: Function
})

</script>

<template>
    <nav aria-label="Page navigation example">
        <ul class="pagination pagination-primary justify-content-end">

            <li class="page-item"><button @click="props.setPage(page-1)" class="page-link" :class="page == 1 ? 'disabled': ''">Prev</button></li>
            <li v-if="page > 3" class="page-item"><button @click="props.setPage(1)" class="page-link"><<</button></li>
            <li v-if="page > 2" class="page-item"><button @click="props.setPage(page-2)" class="page-link disabled">...</button></li>
            <li v-if="page > 1"  class="page-item"><button @click="props.setPage(page-1)" class="page-link">{{ page - 1 }}</button></li>
            <li class="page-item active"><button class="page-link">{{ page }}</button></li>
            <li v-if="totalPage - page > 0" class="page-item"><button @click="props.setPage(page+1)" class="page-link">{{ page + 1 }}</button></li>
            <li v-if="totalPage - page > 1" class="page-item"><button @click="props.setPage(page+2)" class="page-link disabled">...</button></li>
            <li v-if="totalPage - page > 2" class="page-item"><button @click="props.setPage(totalPage)" class="page-link">>></button></li>
            <li class="page-item"><button @click="props.setPage(page+1)" class="page-link" :class="page == totalPage ? 'disabled': ''">Next</button></li>

        </ul>
    </nav>
</template>