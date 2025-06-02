<script setup lang="js">
import { RouterLink, RouterView } from 'vue-router'
import Terminal from './components/Terminal.vue'
import MainPage from './components/MainPage.vue'
import GameUI from './components/GameUI.vue'
import { onMounted, ref } from 'vue'
import { supabase } from './supabase.ts.env'

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
  <GameUI v-if="session" :session="session" />
  <Terminal v-else />
  <RouterView />
</template>
