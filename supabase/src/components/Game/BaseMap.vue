<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import DialogueBox from './DialogueBox.vue'
import { useGameStore } from '@/stores/game'

const gameStore = useGameStore()
gameStore.fetchUser()

// Type definitions
interface MapConfig {
  mapWidth: number
  mapHeight: number
  tileSize: number
  collisionMap: number[]
  tilesetPath: string
  interactables: Record<number, string>
  initialPlayerPosition?: number | { x: number, y: number }
}

type Direction = 'up' | 'down' | 'left' | 'right'
type ActionType = 'enter' | 'search' | 'leave' | 'rest' | 'take' | 'tryOpen'

interface ActionEvent {
  actionId: ActionType
  itemName: string
}

// Props that each map will need to provide
const props = defineProps<MapConfig>()

// Constants
const TILE_SIZE = props.tileSize
const MAP_WIDTH = props.mapWidth
const MAP_HEIGHT = props.mapHeight
const SPRITE_SIZE = 80 // Size of each sprite frame (320/4 frames)
const ANIMATION_SPEED = 125 // Milliseconds between frame changes
const SPRITE_SCALE = 4.5 // Increased from 3 to 4 for a bigger sprite

// Game state
const canvasRef = ref<HTMLCanvasElement | null>(null)
const ctx = ref<CanvasRenderingContext2D | null>(null)
const tilesetImage = ref<HTMLImageElement | null>(null)
const spriteImage = ref<HTMLImageElement | null>(null)
const isLoaded = ref(false)
const tiles = ref<ImageData[]>([])
// Calculate initial player position based on props or use default
const playerTile = ref(gameStore.player.coordinates) // Default to tile 37 if no initial position provided
const playerDirection = ref<Direction>('down') // Track which way the player is facing
const currentFrame = ref(0) // Current animation frame
const lastFrameTime = ref(0) // For animation timing
const morningAudio = ref<HTMLAudioElement | null>(null)
const animationFrameId = ref<number | null>(null) // For tracking the animation frame

// Dialogue state
const showDialogue = ref(false)
const currentInteractable = ref('')

const emit = defineEmits<{
  (e: 'changeMap', map: string): void
  (e: 'interact', itemName: string): void
}>()

// Function to cut the tileset into individual tiles
const cutTilesetIntoTiles = (image: HTMLImageElement) => {
  const tempCanvas = document.createElement('canvas')
  const tempCtx = tempCanvas.getContext('2d')
  if (!tempCtx) return

  tempCanvas.width = image.width
  tempCanvas.height = image.height
  tempCtx.drawImage(image, 0, 0)

  const tiles: ImageData[] = []
  const tilesPerRow = Math.floor(image.width / TILE_SIZE)
  const tilesPerColumn = Math.floor(image.height / TILE_SIZE)

  for (let y = 0; y < tilesPerColumn; y++) {
    for (let x = 0; x < tilesPerRow; x++) {
      const tileData = tempCtx.getImageData(
        x * TILE_SIZE,
        y * TILE_SIZE,
        TILE_SIZE,
        TILE_SIZE
      )
      tiles.push(tileData)
    }
  }

  return tiles
}

// Load resources
const loadResources = async () => {
  try {
    console.log('Loading resources...')
    
    // Load tileset
    tilesetImage.value = new Image()
    tilesetImage.value.src = props.tilesetPath
    
    // Load sprite
    spriteImage.value = new Image()
    spriteImage.value.src = '/sprites/idle.png'
    
    // Initialize morning audio
    morningAudio.value = new Audio('/audios/morning.mp3')
    morningAudio.value.loop = true
    morningAudio.value.volume = 0.3
    
    // Wait for both images to load
    await Promise.all([
      new Promise((resolve) => {
        tilesetImage.value!.onload = () => {
          console.log('Tileset loaded successfully!')
          const cutTiles = cutTilesetIntoTiles(tilesetImage.value!)
          if (cutTiles) {
            tiles.value = cutTiles
            console.log(`Cut ${cutTiles.length} tiles from tileset`)
          }
          resolve(true)
        }
      }),
      new Promise((resolve) => {
        spriteImage.value!.onload = () => {
          console.log('Sprite loaded successfully!')
          resolve(true)
        }
      })
    ])
    
    console.log('All resources loaded!')
    isLoaded.value = true
    drawMap()
    
    // Play morning audio when everything is loaded
    if (morningAudio.value) {
      morningAudio.value.play().catch((error: unknown) => {
        console.error('Error playing morning audio:', error)
      })
    }
  } catch (error) {
    console.error('Error loading resources:', error)
  }
}

// Draw the map
const drawMap = () => {
  if (!ctx.value || !isLoaded.value || tiles.value.length === 0) {
    console.log('Cannot draw: ctx=', !!ctx.value, 'isLoaded=', isLoaded.value, 'tiles=', tiles.value.length)
    return
  }

  // Clear the canvas
  ctx.value.clearRect(0, 0, canvasRef.value?.width || 0, canvasRef.value?.height || 0)

  // Draw each tile
  for (let y = 0; y < MAP_HEIGHT; y++) {
    for (let x = 0; x < MAP_WIDTH; x++) {
      const tileIndex = (y * MAP_WIDTH + x) % tiles.value.length
      const tile = tiles.value[tileIndex]
      
      if (tile) {
        ctx.value.putImageData(tile, x * TILE_SIZE, y * TILE_SIZE)
      }
    }
  }

  // Draw the player sprite
  if (spriteImage.value) {
    const playerX = (playerTile.value % MAP_WIDTH) * TILE_SIZE
    const playerY = Math.floor(playerTile.value / MAP_WIDTH) * TILE_SIZE
    
    // Calculate source position based on direction
    let sourceY = 0
    switch (playerDirection.value) {
      case 'right':
        sourceY = 0 // First row (facing right)
        gameStore.player.direction = 'east'
        gameStore.player.coordinates = playerTile.value
        gameStore.saveProfileData()
        break
      case 'down':
        sourceY = 80 // Second row (facing down)
        gameStore.player.direction = 'south'
        gameStore.player.coordinates = playerTile.value
        gameStore.saveProfileData()
        break
      case 'up':
        sourceY = 160 // Third row (facing up)
        gameStore.player.direction = 'north'
        gameStore.player.coordinates = playerTile.value
        gameStore.saveProfileData()
        break
      case 'left':
        sourceY = 0 // First row (facing right, will be flipped)
        gameStore.player.direction = 'west'
        gameStore.player.coordinates = playerTile.value
        gameStore.saveProfileData()
        break
    }
    
    const sourceX = currentFrame.value * SPRITE_SIZE
    const scaledSize = TILE_SIZE * SPRITE_SCALE
    
    // Calculate position to center the larger sprite on the tile
    const drawX = playerX - (scaledSize - TILE_SIZE) / 2
    const drawY = playerY - (scaledSize - TILE_SIZE) / 2
    
    // Draw the sprite at current position
    if (playerDirection.value === 'left') {
      // Flip horizontally for left-facing sprite
      ctx.value.save()
      ctx.value.translate(drawX + scaledSize, drawY)
      ctx.value.scale(-1, 1)
      ctx.value.drawImage(
        spriteImage.value,
        sourceX, sourceY,
        SPRITE_SIZE, SPRITE_SIZE,
        0, 0,
        scaledSize, scaledSize
      )
      ctx.value.restore()
    } else {
      ctx.value.drawImage(
        spriteImage.value,
        sourceX, sourceY,
        SPRITE_SIZE, SPRITE_SIZE,
        drawX, drawY,
        scaledSize, scaledSize
      )
    }
  }
}

// Handle keyboard input
const handleKeyDown = (event: KeyboardEvent): void => {
  if (event.key === ' ') {
    // Handle interaction
    const playerX = playerTile.value % MAP_WIDTH
    const playerY = Math.floor(playerTile.value / MAP_WIDTH)
    
    // Check tiles in 1 tile radius (up, down, left, right)
    const adjacentTiles: number[] = [
      playerTile.value - MAP_WIDTH, // up
      playerTile.value + MAP_WIDTH, // down
      playerTile.value - 1,         // left
      playerTile.value + 1          // right
    ]
    
    // Check each adjacent tile for interactable objects
    for (const tileIndex of adjacentTiles) {
      const interactableInfo = props.interactables[tileIndex]
      if (interactableInfo) {
        console.log(`Interacted with ${interactableInfo}`)
        emit('interact', interactableInfo)
        return // Stop after first interaction
      }
    }

    // Check if player is standing on an interactable
    const currentTileInteractable = props.interactables[playerTile.value]
    if (currentTileInteractable) {
      console.log(`Interacting with ${currentTileInteractable}`)
      emit('interact', currentTileInteractable)
    }
    return
  }

  const currentX = playerTile.value % MAP_WIDTH
  const currentY = Math.floor(playerTile.value / MAP_WIDTH)
  let newX = currentX
  let newY = currentY
  let newDirection: Direction = playerDirection.value

  switch (event.key) {
    case 'ArrowUp':
      newY = currentY - 1
      newDirection = 'up'
      break
    case 'ArrowDown':
      newY = currentY + 1
      newDirection = 'down'
      break
    case 'ArrowLeft':
      newX = currentX - 1
      newDirection = 'left'
      break
    case 'ArrowRight':
      newX = currentX + 1
      newDirection = 'right'
      break
    default:
      return // Ignore other keys
  }

  // Calculate new tile index
  const newTile = newY * MAP_WIDTH + newX
  
  // Check if the new position is valid (within bounds and not blocked)
  if (newX >= 0 && newX < MAP_WIDTH && 
      newY >= 0 && newY < MAP_HEIGHT && 
      props.collisionMap[newTile] === 0) {
    playerTile.value = newTile
    playerDirection.value = newDirection
    drawMap()
  }
}

// Animation loop
const animate = () => {
  const now = Date.now()
  if (now - lastFrameTime.value > ANIMATION_SPEED) {
    currentFrame.value = (currentFrame.value + 1) % 4 // 4 frames per animation
    lastFrameTime.value = now
    drawMap() // Redraw the map with the new frame
  }
  animationFrameId.value = requestAnimationFrame(animate)
}

// Initialize the game
onMounted(() => {
  if (canvasRef.value) {
    ctx.value = canvasRef.value.getContext('2d')
    canvasRef.value.width = MAP_WIDTH * TILE_SIZE
    canvasRef.value.height = MAP_HEIGHT * TILE_SIZE
    loadResources()
    
    // Add event listeners
    window.addEventListener('keydown', handleKeyDown)
    
    // Start animation loop
    animate()
  }
})

// Cleanup
onUnmounted(() => {
  tilesetImage.value = null
  spriteImage.value = null
  ctx.value = null
  // Stop and cleanup morning audio
  if (morningAudio.value) {
    morningAudio.value.pause()
    morningAudio.value = null
  }
  // Remove event listeners
  window.removeEventListener('keydown', handleKeyDown)
  // Cancel animation frame
  if (animationFrameId.value) {
    cancelAnimationFrame(animationFrameId.value)
  }
})
</script>

<template>
  <div class="game-container">
    <canvas
      ref="canvasRef"
      class="game-canvas"
    ></canvas>
  </div>
</template>

<style scoped>
.game-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: #000;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}

.game-canvas {
  image-rendering: pixelated;
  image-rendering: crisp-edges;
  width: auto;
  height: auto;
  max-width: 100%;
  max-height: 100%;
  /* Add a border to make the grid more visible */
  border: 2px solid #333;
}
</style> 