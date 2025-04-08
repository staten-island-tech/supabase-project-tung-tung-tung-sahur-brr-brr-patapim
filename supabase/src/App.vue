<template>
  <div id="app">
    <Canvas />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Canvas from './components/Canvas.vue'; // Import the Canvas component

export default defineComponent({
  name: 'App',
  components: {
    Canvas,
  },
});
</script>