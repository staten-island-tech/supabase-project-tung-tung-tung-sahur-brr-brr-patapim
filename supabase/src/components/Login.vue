<script setup>
import { ref } from 'vue'
import { supabase } from '../supabase.ts'

const loading = ref(false)
const email = ref('')
const password = ref('')
const isLogin = ref(true) // Toggle between login and sign-up

const handleAuth = async () => {
  try {
    loading.value = true
    const { error } = isLogin.value
      ? await supabase.auth.signInWithPassword({ email: email.value, password: password.value })
      : await supabase.auth.signUp({ email: email.value, password: password.value })

    if (error) throw error

    alert(
      isLogin.value
        ? 'Logged in successfully!'
        : 'Signed up successfully! Check your email to confirm your account.'
    )
  } catch (error) {
    if (error instanceof Error) {
    alert(error.message)
    }
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <form class="row flex-center flex" @submit.prevent="handleAuth">
    <div class="col-6 form-widget">
      <h1 class="header">Supabase + Vue 3</h1>
      <p class="description">{{ isLogin ? 'Log in with email' : 'Sign up with email and password' }}</p>

      <div>
        <input class="inputField" required type="email" placeholder="Your email" v-model="email" />
      </div>
      <div>
        <input class="inputField" required type="password" placeholder="Your password" v-model="password" />
      </div>
      <div>
        <input
          type="submit"
          class="button block"
          :value="loading ? 'Loading...' : isLogin ? 'Log In' : 'Sign Up'"
          :disabled="loading"
        />
      </div>

      <p style="margin-top: 1rem">
        <button class="link" type="button" @click="isLogin = !isLogin">
          {{ isLogin ? "Don't have an account? Sign up" : 'Already have an account? Log in' }}
        </button>
      </p>
    </div>
  </form>
</template>
