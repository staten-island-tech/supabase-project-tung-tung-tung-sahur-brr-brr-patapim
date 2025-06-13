<script setup lang="js">
import { RouterLink, RouterView } from 'vue-router'
import Terminal from './components/Terminal.vue'
import GameUI from './components/GameUI.vue'
import EscapeMenu from './components/UI/EscapeMenu.vue'
import GameCanvas from './components/GameCanvas.vue'
import { onMounted, ref } from 'vue'
import { supabase } from './supabase.ts'
import EndScreen from './components/UI/EndScreen.vue'
</script>

<template>
  <!-- <EndScreen /> -->
  <RouterView /> 

  <!-- <EscapeMenu />-->
</template>

<style>
.app {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}
</style>
