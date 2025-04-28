<script setup>
import { ref } from 'vue'
import { supabase } from '../supabase.ts'

const loading = ref(false)
const username = ref('')
const password = ref('')
const isLogin = ref(true)

const handleAuth = async () => {
  try {
    loading.value = true

    if (isLogin.value) {
      // Login logic
      const { data, error } = await supabase
        .from('users')
        .select('id, password')
        .eq('username', username.value)
        .single()

      if (error || !data) {
        throw new Error('User not found')
      }

      if (data.password !== password.value) {
        throw new Error('Incorrect password')
      }

      alert('Logged in successfully!')
    } else {
      // Sign-up logic
      const { error } = await supabase
        .from('users')
        .insert([
          {
            username: username.value,
            password: password.value // ⚠️ Plaintext password — not secure!
          }
        ])

      if (error) {
        throw error
      }

      alert('Signed up successfully!')
    }
  } catch (error) {
    alert(error.message)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <form class="row flex-center flex" @submit.prevent="handleAuth">
    <div class="col-6 form-widget">
      <h1 class="header">Supabase + Vue 3 (Username Auth)</h1>
      <p class="description">{{ isLogin ? 'Log in with username' : 'Sign up with username and password' }}</p>

      <div>
        <input class="inputField" required type="text" placeholder="Your username" v-model="username" />
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
