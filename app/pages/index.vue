<script lang="ts">

onMounted(async () => {
  const body = document.body;
  const theme = localStorage.getItem('theme')

  if (theme) 
    document.documentElement.setAttribute('data-bs-theme', theme)
})

</script>

<template>
  <div>
    <p>Halo</p>
  </div>
</template>
