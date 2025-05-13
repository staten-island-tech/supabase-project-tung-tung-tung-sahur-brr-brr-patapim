<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import Terminal from './components/Terminal.vue'
import GameUI from './components/GameUI.vue'
</script>

<template>
  <!-- <Terminal /> -->
  <GameUI />
  <RouterView />
</template>
