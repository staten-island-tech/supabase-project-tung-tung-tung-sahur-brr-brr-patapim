<script setup lang="js">
import { RouterLink, RouterView } from 'vue-router'
import Terminal from './components/Terminal.vue'
import GameUI from './components/GameUI.vue'
import EscapeMenu from './components/UI/EscapeMenu.vue'
import CanvasMap from './components/Game/CanvasMap.vue'
import ReusableModal from './components/UI/ReusableModal.vue'
import GameCanvas from './components/GameCanvas.vue'
import { onMounted, ref } from 'vue'
import { supabase } from './supabase.ts'
</script>

<template>
<<<<<<< HEAD
  <div class="app">
    <MainPage v-if="session"
    <Terminal />
    <RouterView/>
  </div>
=======
  <GameUI v-if="session" :session="session" />
  <Terminal v-else />
  <RouterView /> -->
  <!-- <ReusableModal></ReusableModal> -->
  <!-- <EscapeMenu />
  <!-- <CanvasMap /> -->
>>>>>>> Eric
</template>

<style>
.app {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}
</style>
