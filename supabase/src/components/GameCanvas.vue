<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const canvasRef = ref<HTMLCanvasElement | null>(null)
const ctx = ref<CanvasRenderingContext2D | null>(null)
const mapImage = ref<HTMLImageElement | null>(null)
const isLoaded = ref(false)
const loadingError = ref<string | null>(null)

const TILE_SIZE = 48
const MAP_WIDTH = 20
const MAP_HEIGHT = 15

const loadMap = async () => {
  try {
    loadingError.value = null
    const img = new Image()
    img.onload = () => {
      mapImage.value = img
      isLoaded.value = true
      drawMap()
    }
    img.onerror = (e) => {
      loadingError.value = 'Failed to load map image'
    }
    const imagePath = '/maps/BoyRoom.png'
    img.src = imagePath
  } catch (error) {
    loadingError.value = error instanceof Error ? error.message : 'Unknown error'
  }
}

const drawMap = () => {
  if (!ctx.value || !mapImage.value || !isLoaded.value) {
    return
  }
  ctx.value.clearRect(0, 0, canvasRef.value?.width || 0, canvasRef.value?.height || 0)
  ctx.value.drawImage(
    mapImage.value,
    0,
    0,
    MAP_WIDTH * TILE_SIZE,
    MAP_HEIGHT * TILE_SIZE
  )
}

onMounted(() => {
  if (canvasRef.value) {
    ctx.value = canvasRef.value.getContext('2d')
    if (!ctx.value) {
      return
    }
    canvasRef.value.width = MAP_WIDTH * TILE_SIZE
    canvasRef.value.height = MAP_HEIGHT * TILE_SIZE
    loadMap()
  }
})

onUnmounted(() => {
  mapImage.value = null
  ctx.value = null
})
</script>

<template>
  <div class="game-container">
    <canvas
      ref="canvasRef"
      class="game-canvas"
      :width="MAP_WIDTH * TILE_SIZE"
      :height="MAP_HEIGHT * TILE_SIZE"
    ></canvas>
    <div v-if="loadingError" class="error-message">
      {{ loadingError }}
    </div>
  </div>
</template>

<style scoped>
.game-container {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #000;
}

.game-canvas {
  image-rendering: pixelated;
  image-rendering: crisp-edges;
  border: 2px solid red;
  max-width: 100%;
  max-height: 100%;
}

.error-message {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: red;
  background: rgba(0, 0, 0, 0.8);
  padding: 1rem;
  border-radius: 4px;
}
</style>
