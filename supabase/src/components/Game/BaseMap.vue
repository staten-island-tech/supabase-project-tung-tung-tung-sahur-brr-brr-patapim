<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import DialogueBox from './DialogueBox.vue'
import { useGameStore } from '@/stores/game'

const gameStore = useGameStore()

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

const showInventory = ref(false)
const props = defineProps<MapConfig>()
const TILE_SIZE = props.tileSize
const MAP_WIDTH = props.mapWidth
const MAP_HEIGHT = props.mapHeight
const SPRITE_SIZE = 80
const ANIMATION_SPEED = 125
const SPRITE_SCALE = 4.5

const canvasRef = ref<HTMLCanvasElement | null>(null)
const ctx = ref<CanvasRenderingContext2D | null>(null)
const tilesetImage = ref<HTMLImageElement | null>(null)
const spriteImage = ref<HTMLImageElement | null>(null)
const isLoaded = ref(false)
const tiles = ref<ImageData[]>([])
const playerTile = ref(gameStore.player.coordinates)
const playerDirection = ref<Direction>('down')
const currentFrame = ref(0)
const lastFrameTime = ref(0)
const morningAudio = ref<HTMLAudioElement | null>(null)
const animationFrameId = ref<number | null>(null)

const showDialogue = ref(false)
const currentInteractable = ref('')

const emit = defineEmits<{
  (e: 'changeMap', map: string): void
  (e: 'interact', itemName: string): void
}>()

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

const loadResources = async () => {
  try {
    tilesetImage.value = new Image()
    tilesetImage.value.src = props.tilesetPath

    spriteImage.value = new Image()
    spriteImage.value.src = '/sprites/idle.png'

    morningAudio.value = new Audio('/audios/morning.mp3')
    morningAudio.value.loop = true
    morningAudio.value.volume = 0.3

    await Promise.all([
      new Promise((resolve) => {
        tilesetImage.value!.onload = () => {
          const cutTiles = cutTilesetIntoTiles(tilesetImage.value!)
          if (cutTiles) {
            tiles.value = cutTiles
          }
          resolve(true)
        }
      }),
      new Promise((resolve) => {
        spriteImage.value!.onload = () => {
          resolve(true)
        }
      })
    ])

    isLoaded.value = true
    drawMap()

    if (morningAudio.value) {
      morningAudio.value.play().catch((error: unknown) => {
        console.error('Error playing morning audio:', error)
      })
    }
  } catch (error) {
    console.error('Error loading resources:', error)
  }
}

const drawMap = () => {
  if (!ctx.value || !isLoaded.value || tiles.value.length === 0) {
    return
  }

  ctx.value.clearRect(0, 0, canvasRef.value?.width || 0, canvasRef.value?.height || 0)

  for (let y = 0; y < MAP_HEIGHT; y++) {
    for (let x = 0; x < MAP_WIDTH; x++) {
      const tileIndex = (y * MAP_WIDTH + x) % tiles.value.length
      const tile = tiles.value[tileIndex]
      if (tile) {
        ctx.value.putImageData(tile, x * TILE_SIZE, y * TILE_SIZE)
      }
    }
  }

  if (spriteImage.value) {
    const playerX = (playerTile.value % MAP_WIDTH) * TILE_SIZE
    const playerY = Math.floor(playerTile.value / MAP_WIDTH) * TILE_SIZE

    let sourceY = 0
    switch (playerDirection.value) {
      case 'right':
        sourceY = 0
        gameStore.player.direction = 'east'
        gameStore.player.coordinates = playerTile.value
        gameStore.saveProfileData()
        break
      case 'down':
        sourceY = 80
        gameStore.player.direction = 'south'
        gameStore.player.coordinates = playerTile.value
        gameStore.saveProfileData()
        break
      case 'up':
        sourceY = 160
        gameStore.player.direction = 'north'
        gameStore.player.coordinates = playerTile.value
        gameStore.saveProfileData()
        break
      case 'left':
        sourceY = 0
        gameStore.player.direction = 'west'
        gameStore.player.coordinates = playerTile.value
        gameStore.saveProfileData()
        break
    }

    const sourceX = currentFrame.value * SPRITE_SIZE
    const scaledSize = TILE_SIZE * SPRITE_SCALE
    const drawX = playerX - (scaledSize - TILE_SIZE) / 2
    const drawY = playerY - (scaledSize - TILE_SIZE) / 2

    if (playerDirection.value === 'left') {
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

const handleKeyDown = (event: KeyboardEvent): void => {
  if (event.key === ' ') {
    const playerX = playerTile.value % MAP_WIDTH
    const playerY = Math.floor(playerTile.value / MAP_WIDTH)

    const adjacentTiles: number[] = [
      playerTile.value - MAP_WIDTH,
      playerTile.value + MAP_WIDTH,
      playerTile.value - 1,
      playerTile.value + 1
    ]

    for (const tileIndex of adjacentTiles) {
      const interactableInfo = props.interactables[tileIndex]
      if (interactableInfo) {
        emit('interact', interactableInfo)
        return
      }
    }

    const currentTileInteractable = props.interactables[playerTile.value]
    if (currentTileInteractable) {
      emit('interact', currentTileInteractable)
    }
    return
  }

  const currentX = playerTile.value % MAP_WIDTH
  const currentY = Math.floor(playerTile.value / MAP_WIDTH)
  let newX = currentX
  let newY = currentY
  let newDirection: Direction = playerDirection.value

  if (event.key === "i") {
    showInventory.value = !showInventory.value
    return
  }

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
      return
  }

  const newTile = newY * MAP_WIDTH + newX

  if (newX >= 0 && newX < MAP_WIDTH &&
      newY >= 0 && newY < MAP_HEIGHT &&
      props.collisionMap[newTile] === 0) {
    playerTile.value = newTile
    playerDirection.value = newDirection
    drawMap()
  }
}

const animate = () => {
  const now = Date.now()
  if (now - lastFrameTime.value > ANIMATION_SPEED) {
    currentFrame.value = (currentFrame.value + 1) % 4
    lastFrameTime.value = now
    drawMap()
  }
  animationFrameId.value = requestAnimationFrame(animate)
}

onMounted(() => {
  if (canvasRef.value) {
    ctx.value = canvasRef.value.getContext('2d')
    canvasRef.value.width = MAP_WIDTH * TILE_SIZE
    canvasRef.value.height = MAP_HEIGHT * TILE_SIZE
    loadResources()
    window.addEventListener('keydown', handleKeyDown)
    animate()
  }
})

onUnmounted(() => {
  tilesetImage.value = null
  spriteImage.value = null
  ctx.value = null
  if (morningAudio.value) {
    morningAudio.value.pause()
    morningAudio.value = null
  }
  window.removeEventListener('keydown', handleKeyDown)
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
  border: 2px solid #333;
}
</style> 
