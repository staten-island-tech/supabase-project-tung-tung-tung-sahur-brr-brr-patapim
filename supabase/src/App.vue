<template>
  <div id="app">
    <Canvas/>
  </div>
</template>

<script lang="ts" setup>
import Canvas from './components/Canvas.vue'; // Import the Canvas component
import Test from './components/Test.vue'
</script>

<style scoped>
#app {
  width: 100vw;
  height: 100vh;
}
</style>
