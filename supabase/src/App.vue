<script setup lang="js">
import { RouterLink, RouterView } from 'vue-router'
import Terminal from './components/Terminal.vue'
import GameUI from './components/GameUI.vue'
import EscapeMenu from './components/UI/EscapeMenu.vue'
import ReusableModal from './components/UI/ReusableModal.vue'
import GameCanvas from './components/GameCanvas.vue'
import { onMounted, ref } from 'vue'
import { supabase } from './supabase.ts'
</script>

<template>
  <RouterView /> 
  <!-- <ReusableModal></ReusableModal> -->
  <!-- <EscapeMenu />-->
</template>

<style>
.app {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}
</style>
