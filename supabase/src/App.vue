<script setup lang="js">
import { RouterLink, RouterView } from 'vue-router'
import Terminal from './components/Terminal.vue'
import GameUI from './components/GameUI.vue'
import ReusableModal from './components/UI/ReusableModal.vue'
import GameCanvas from './components/GameCanvas.vue'
import { onMounted, ref } from 'vue'
import { supabase } from './supabase.ts'
</script>

<template>
  <div class="app">
    <MainPage v-if="session"
    <Terminal />
    <RouterView/>
  </div>
</template>

<style>
.app {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}
</style>
