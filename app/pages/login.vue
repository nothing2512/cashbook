<script setup>

import { useApi } from '~/composables/useApi';
import Swal from 'sweetalert2';

const { fetchLogin, fetchRefreshToken } = useApi()
const { fetchAccount, fetchCategory, fetchSetting } = useCrud()

definePageMeta({
    layout: 'auth'
})

const email = ref('')
const password = ref('')
const setLoading = inject('setLoading')
const rememberMe = ref(false)

onBeforeMount(async () => {
    const token = useCookie('token')
    if (token.value != null) {
        navigateTo('/')
    }

    const refreshToken = useCookie('refreshToken')
    if (refreshToken.value != null) {
        setLoading(true)
        try {
            const { data } = await fetchRefreshToken(refreshToken.value)
            setLoading(false)
            document.cookie = `token=${data.access_token}; path=/; max-age=${data.expires_in}; samesite=strict`
            document.cookie = `refreshToken=${data.refresh_token}; path=/; samesite=strict`

            const back = window.history.state.back
            if (back) {
                try {
                    const backUrl = new URL(back, window.location.origin)
                    if (backUrl.origin === window.location.origin) {
                        navigateTo(back)
                        return
                    }
                } catch (e) {
                    navigateTo("/")
                }
            }
            navigateTo("/")
        } catch (e) {
            setLoading(false)
            Swal.fire({
                title: "Gagal!",
                text: e.msg || e,
                icon: "warning",
                confirmButtonText: "OK"
            })
        }
    }
})

const login = async () => {
    setLoading(true)
    try {
        let { data } = await fetchLogin(email.value, password.value)
        setLoading(false)
        document.cookie = `token=${data.access_token}; path=/; max-age=${data.expires_in}; samesite=strict`
        if (rememberMe.value) document.cookie = `refreshToken=${data.refresh_token}; path=/; samesite=strict`

        let response = await fetchSetting.all(1, 1)
        data = response.data
        if (data.length == 0) {
            await fetchSetting.add({
                salary: 0,
                payday: 0,
                show_digit: false,
                theme: 'dark',
                auto_add_salary: false
            })

            await fetchAccount.add({
                name: 'Cash',
                num: '',
                amount: 0
            })

            await fetchCategory.add({name: 'default'})
        }

        navigateTo('/')
    } catch (e) {
        setLoading(false)
        Swal.fire({
            title: "Gagal!",
            text: e.msg || e,
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
                <input class="form-check-input me-2" type="checkbox" value="" id="flexCheckDefault"
                    v-model="rememberMe">
                <label class="form-check-label text-gray-600" for="flexCheckDefault">
                    Keep me logged in
                </label>
            </div>
            <button class="btn btn-primary btn-block btn-lg shadow-lg mt-5">Log in</button>
        </form>
    </div>
</template>