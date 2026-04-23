<script setup>

import { useApi } from '~/composables/useApi';
import Swal from 'sweetalert2';

const { fetchLogin } = useApi()

definePageMeta({
    layout: 'auth'
})

const email = ref('')
const password = ref('')

const login = async () => {
    try {
        const { data } = await fetchLogin(email.value, password.value)
        document.cookie = `token=${data.access_token}; path=/; max-age=${data.expires_in}; samesite=strict`
        navigateTo('/')
    } catch (e) {
        Swal.fire({
            title: "Gagal!",
            text: e.msg,
            icon: "warning",
            confirmButtonText: "OK"
        })
    }
}

</script>
<template>
    <div>
        <h1 class="auth-title">Log in.</h1>
        <p class="auth-subtitle mb-5">Log in with your data that you entered during registration.</p>

        <form @submit.prevent="login">
            <div class="form-group position-relative has-icon-left mb-4">
            <input type="email" class="form-control form-control-xl" placeholder="Email" v-model="email">
            <div class="form-control-icon">
                <i class="bi bi-envelope"></i>
            </div>
        </div>
        <div class="form-group position-relative has-icon-left mb-4">
            <input type="password" class="form-control form-control-xl" placeholder="Password" v-model="password">
            <div class="form-control-icon">
                <i class="bi bi-shield-lock"></i>
            </div>
        </div>
        <div class="form-check form-check-lg d-flex align-items-end">
            <input class="form-check-input me-2" type="checkbox" value="" id="flexCheckDefault">
            <label class="form-check-label text-gray-600" for="flexCheckDefault">
                Keep me logged in
            </label>
        </div>
        <button class="btn btn-primary btn-block btn-lg shadow-lg mt-5">Log in</button>
        </form>
    </div>
</template>