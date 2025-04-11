<template>
  <div>
    <canvas ref="gameCanvas" id="game-canvas" width="320" height="180"></canvas>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, watch } from 'vue';
import { resources } from '../Resources.ts'; // Import Resources class

const gameCanvas = ref<HTMLCanvasElement | null>(null);

// Function to draw images on the canvas
const draw = () => {
  if (gameCanvas.value) {
    const ctx = gameCanvas.value.getContext('2d');
    if (ctx) {
      const sky = resources.images.sky;
      console.log(sky)
      if (sky.isLoaded) {
        console.log("thing")
        ctx.drawImage(sky.image, 0,0,50,50,0, 0, 320, 180);
      }

      const g = resources.images.g;
      if (g.isLoaded) {
        ctx.drawImage(g.image, 0,0,0,0, 0, 0, 320,180);
      }
    }
  }
};

// Wait for the images to be loaded before starting the drawing process
onMounted(() => {
  const checkLoaded = () => {
    const allLoaded = Object.values(resources.images).every(img => img.isLoaded);
    if (allLoaded) {
      // Once all resources are loaded, start drawing
      setInterval(() => {
        console.log('draw');
        draw();
      }, 300);
    } else {
      // If not all resources are loaded, keep checking
      setTimeout(checkLoaded, 1000);
    }
  };

  // Start the checking loop after mounted
  checkLoaded();
});

setInterval(() => {
        console.log('draw');
        draw();
      }, 300);
</script>

<style scoped>
#game-canvas {
  width: 100%;
  background-color: blue;
}
</style>
