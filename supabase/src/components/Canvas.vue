<template>
    <div>
      <canvas ref="gameCanvas" id="game-canvas" width="800" height="600"></canvas>
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent, onMounted, ref } from 'vue';
  import { resources } from './Resources'; // Import resources as needed
  
  export default defineComponent({
    name: 'Canvas',
    setup() {
      const gameCanvas = ref<HTMLCanvasElement | null>(null);
  
      const draw = () => {
        if (gameCanvas.value) {
          const ctx = gameCanvas.value.getContext('2d');
          if (ctx) {
            const sky = resources.images.sky;
            if (sky.isLoaded) {
              ctx.drawImage(sky.image, 0, 0);
            }
  
            const g = resources.images.g;
            if (g.isLoaded) {
              ctx.drawImage(g.image, 0, 0);
            }
          }
        }
      };
  
      onMounted(() => {
        
        setInterval(() => {
          console.log('draw');
          draw();
        }, 300);
      });
  
      return {
        gameCanvas,
      };
    },
  });
  </script>
  
  <style scoped>
  
  #game-canvas {
    border: 1px solid #000;
    background-color: blue;
  }
  </style>
  