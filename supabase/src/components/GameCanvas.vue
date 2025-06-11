<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

// Game state
const canvasRef = ref<HTMLCanvasElement | null>(null)
const ctx = ref<CanvasRenderingContext2D | null>(null)
const mapImage = ref<HTMLImageElement | null>(null)
const isLoaded = ref(false)
const loadingError = ref<string | null>(null)

// Game settings
const TILE_SIZE = 48 // RPG Maker MV default tile size
const MAP_WIDTH = 20 // Adjust based on your map size
const MAP_HEIGHT = 15 // Adjust based on your map size

// Load the map image
const loadMap = async () => {
  try {
    console.log('Starting to load map...')
    loadingError.value = null
    
    // Create new image
    const img = new Image()
    
    // Set up event handlers before setting src
    img.onload = () => {
      console.log('Map image loaded successfully!', {
        width: img.width,
        height: img.height,
        naturalWidth: img.naturalWidth,
        naturalHeight: img.naturalHeight
      })
      mapImage.value = img
      isLoaded.value = true
      drawMap()
    }
    
    img.onerror = (e) => {
      console.error('Error loading map image:', e)
      loadingError.value = 'Failed to load map image'
    }

    // Set the source
    const imagePath = '/maps/BoyRoom.png'
    console.log('Attempting to load image from:', imagePath)
    img.src = imagePath
    
  } catch (error) {
    console.error('Error in loadMap:', error)
    loadingError.value = error instanceof Error ? error.message : 'Unknown error'
  }
}

// Draw the map
const drawMap = () => {
  if (!ctx.value || !mapImage.value || !isLoaded.value) {
    console.log('Cannot draw map:', { 
      hasContext: !!ctx.value, 
      hasImage: !!mapImage.value, 
      isLoaded: isLoaded.value,
      error: loadingError.value
    })
    return
  }

  console.log('Drawing map...', {
    canvasWidth: canvasRef.value?.width,
    canvasHeight: canvasRef.value?.height,
    imageWidth: mapImage.value.width,
    imageHeight: mapImage.value.height
  })

  // Clear the canvas
  ctx.value.clearRect(0, 0, canvasRef.value?.width || 0, canvasRef.value?.height || 0)

  // Draw the map
  ctx.value.drawImage(
    mapImage.value,
    0,
    0,
    MAP_WIDTH * TILE_SIZE,
    MAP_HEIGHT * TILE_SIZE
  )
  console.log('Map drawn!')
}

// Initialize the game
onMounted(() => {
  console.log('GameCanvas mounted')
  if (canvasRef.value) {
    ctx.value = canvasRef.value.getContext('2d')
    if (!ctx.value) {
      console.error('Failed to get 2D context')
      return
    }
    canvasRef.value.width = MAP_WIDTH * TILE_SIZE
    canvasRef.value.height = MAP_HEIGHT * TILE_SIZE
    console.log('Canvas initialized with dimensions:', {
      width: canvasRef.value.width,
      height: canvasRef.value.height
    })
    loadMap()
  } else {
    console.error('Canvas reference is null')
  }
})

// Cleanup
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
