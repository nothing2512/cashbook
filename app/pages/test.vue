<script setup>
import { useApi } from '~/composables/useApi';

const { fetchLogin } = useApi()
const loginResponses = ref()

// onMounted(async () => {
//   try {
//     loginResponses.value = fetchLogin("robet.personal@gmail.com", "1ff28023cca")
//     console.log(loginResponses.value)
//   } catch(err) {
//     console.log(err)
//   }
// })

const getData = async () => {
  try {
    loginResponses.value = await fetchLogin("robet.personal@gmail.com", "password")
    console.log(loginResponses.value)
  } catch(err) {
    console.log(err)
  }
}

</script>

<template>
  <div>
        <p>Test</p>
        <button @click="getData">ASD</button>
  </div>
</template>
