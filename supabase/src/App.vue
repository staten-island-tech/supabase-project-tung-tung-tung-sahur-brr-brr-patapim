<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import HelloWorld from './components/HelloWorld.vue'
</script>

<template>
  <canvas id="game-canvas"></canvas>
</template>

<style scoped>
html{
 padding: 0;
 margin: 0;
 overflow: hidden;
}

canvas{
  width: 100%;
  background: blue;
}
</style>
