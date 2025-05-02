
<script setup lang="js">
import { RouterLink, RouterView } from 'vue-router'
import Terminal from './components/Terminal.vue'
import Account from './components/Account.vue'
import Login from './components/Login.vue'
import { onMounted, ref } from 'vue'
import { supabase } from './supabase.ts'

const session = ref()

onMounted(() => {
  supabase.auth.getSession().then(({ data }) => {
    session.value = data.session
  })

  supabase.auth.onAuthStateChange((_, _session) => {
    session.value = _session
  })
})
</script>

<template>
  <Account v-if="session" :session="session"/>
  <Terminal v-else/>
  <RouterView />
</template>

