<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import DialogueBox from './DialogueBox.vue'

// Constants
const TILE_SIZE = 48 // RPG Maker MV default tile size
const MAP_WIDTH = 8  // Changed from 15 to 8
const MAP_HEIGHT = 12 // Changed from 14 to 12
const SPRITE_SIZE = 80 // Size of each sprite frame (320/4 frames)
const ANIMATION_SPEED = 1000 // Milliseconds between frame changes
const SPRITE_SCALE = 3 // Scale factor for the sprite

// Game state
const canvasRef = ref<HTMLCanvasElement | null>(null)
const ctx = ref<CanvasRenderingContext2D | null>(null)
const tilesetImage = ref<HTMLImageElement | null>(null)
const spriteImage = ref<HTMLImageElement | null>(null)
const isLoaded = ref(false)
const tiles = ref<ImageData[]>([])
const playerTile = ref(37) // The tile where our "sprite" is located
const playerDirection = ref('down') // Track which way the player is facing
const currentFrame = ref(0) // Current animation frame
const lastFrameTime = ref(0) // For animation timing
const morningAudio = ref<HTMLAudioElement | null>(null)

// Dialogue state
const showDialogue = ref(false)
const currentInteractable = ref('')

// Collision map (0 = walkable, 1 = blocked)
const collisionMap = [
  1, 1, 1, 1, 1, 1, 1, 1,  // Row 0
  1, 1, 1, 1, 1, 1, 1, 1,  // Row 1
  1, 1, 1, 1, 1, 1, 1, 1,  // Row 2
  1, 1, 1, 1, 0, 1, 1, 1,  // Row 3
  1, 0, 0, 0, 0, 0, 1, 1,  // Row 4
  0, 0, 0, 0, 0, 0, 0, 1,  // Row 5
  1, 0, 0, 0, 0, 0, 0, 1,  // Row 6
  1, 0, 0, 0, 0, 0, 0, 1,  // Row 7
  1, 0, 0, 0, 0, 0, 0, 1,  // Row 8
  1, 1, 0, 0, 0, 0, 1, 1,  // Row 9
  1, 1, 0, 0, 0, 1, 1, 1,  // Row 10
  1, 1, 1, 0, 1, 1, 1, 1   // Row 11
]

// Handle keyboard input
const handleKeyDown = (event: KeyboardEvent) => {
  if (event.key === ' ') {
    // Handle interaction
    const playerX = playerTile.value % MAP_WIDTH
    const playerY = Math.floor(playerTile.value / MAP_WIDTH)
    
    // Check tiles in 1 tile radius (up, down, left, right)
    const adjacentTiles = [
      playerTile.value - MAP_WIDTH, // up
      playerTile.value + MAP_WIDTH, // down
      playerTile.value - 1,         // left
      playerTile.value + 1          // right
    ]
    
    // Check each adjacent tile for interactable objects
    for (const tileIndex of adjacentTiles) {
      let interactableInfo = null
      if ([17, 25].includes(tileIndex)) {
        interactableInfo = 'A closet'
      } else if ([18, 26].includes(tileIndex)) {
        interactableInfo = 'A bookshelf'
      } else if (tileIndex === 27) {
        interactableInfo = 'A pile of scrolls'
      } else if (tileIndex === 29) {
        interactableInfo = 'A pouch of golds'
      } else if (tileIndex === 38) {
        interactableInfo = 'A bed'
      } else if (tileIndex === 73) {
        interactableInfo = 'A fire extinguisher'
      } else if (tileIndex === 81) {
        interactableInfo = 'A cracked pot'
      } else if (tileIndex === 85) {
        interactableInfo = 'A half cracked barrel'
      } else if (tileIndex === 40) {
        interactableInfo = 'A bathroom door'
      } else if (tileIndex === 91) {
        interactableInfo = 'The front door'
      }
      
      if (interactableInfo) {
        console.log(`Interacted with ${interactableInfo}`)
        currentInteractable.value = interactableInfo
        showDialogue.value = true
        return // Stop after first interaction
      }
    }

    // Check if player is standing on a door
    if (playerTile.value === 40) {
      console.log('Interacting with bathroom door')
      currentInteractable.value = 'A bathroom door'
      showDialogue.value = true
    } else if (playerTile.value === 91) {
      console.log('Interacting with front door')
      currentInteractable.value = 'The front door'
      showDialogue.value = true
    }
    return
  }

  const currentX = playerTile.value % MAP_WIDTH
  const currentY = Math.floor(playerTile.value / MAP_WIDTH)
  let newX = currentX
  let newY = currentY

  switch (event.key) {
    case 'ArrowUp':
      newY = currentY - 1
      playerDirection.value = 'up'
      break
    case 'ArrowDown':
      newY = currentY + 1
      playerDirection.value = 'down'
      break
    case 'ArrowLeft':
      newX = currentX - 1
      playerDirection.value = 'left'
      break
    case 'ArrowRight':
      newX = currentX + 1
      playerDirection.value = 'right'
      break
  }

  // Calculate new tile index
  const newTile = newY * MAP_WIDTH + newX
  
  // Check if the new position is valid (within bounds and not blocked)
  if (newX >= 0 && newX < MAP_WIDTH && 
      newY >= 0 && newY < MAP_HEIGHT && 
      collisionMap[newTile] === 0) {
    playerTile.value = newTile
    drawMap()
  }
}

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
    tilesetImage.value.src = '/maps/BoyRoom.png'
    
    // Load sprite
    spriteImage.value = new Image()
    spriteImage.value.src = '/sprites/idle.png'
    console.log('Attempting to load sprite from:', '/sprites/idle.png')
    
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
          console.log('Sprite dimensions:', spriteImage.value?.width, 'x', spriteImage.value?.height)
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

      // // Draw collision debug overlay (optional)
      // if (collisionMap[y * MAP_WIDTH + x] === 1) {
      //   ctx.value.fillStyle = 'rgba(255, 0, 0, 0.2)' // Semi-transparent red for blocked tiles
      //   ctx.value.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE)
      // }

    }
  }

  // Draw the player sprite
  if (spriteImage.value) {
    const playerX = (playerTile.value % MAP_WIDTH) * TILE_SIZE
    const playerY = Math.floor(playerTile.value / MAP_WIDTH) * TILE_SIZE
    
    console.log('Drawing sprite at:', playerX, playerY, 'direction:', playerDirection.value)
    
    // Calculate source position based on direction
    let sourceY = 0
    switch (playerDirection.value) {
      case 'right':
        sourceY = 0 // First row (facing right)
        break
      case 'down':
        sourceY = 80 // Second row (facing down)
        break
      case 'up':
        sourceY = 160 // Third row (facing up)
        break
      case 'left':
        sourceY = 0 // First row (facing right, will be flipped)
        break
    }
    
    // Update animation frame
    const now = Date.now()
    if (now - lastFrameTime.value > ANIMATION_SPEED) {
      currentFrame.value = (currentFrame.value + 1) % 4 // 4 frames per animation
      lastFrameTime.value = now
    }
    
    const sourceX = currentFrame.value * SPRITE_SIZE
    const scaledSize = TILE_SIZE * SPRITE_SCALE
    const offsetX = (TILE_SIZE - scaledSize) / 2 // Center horizontally
    const offsetY = TILE_SIZE - scaledSize + TILE_SIZE // Offset down by one tile
    
    // Draw the sprite at current interpolated position
    if (playerDirection.value === 'left') {
      // Flip horizontally for left-facing sprite
      ctx.value.save()
      ctx.value.translate(playerX + TILE_SIZE, playerY)
      ctx.value.scale(-1, 1)
      ctx.value.drawImage(
        spriteImage.value,
        sourceX, sourceY,
        SPRITE_SIZE, SPRITE_SIZE,
        offsetX, offsetY,
        scaledSize, scaledSize
      )
      ctx.value.restore()
    } else {
      ctx.value.drawImage(
        spriteImage.value,
        sourceX, sourceY,
        SPRITE_SIZE, SPRITE_SIZE,
        playerX + offsetX, playerY + offsetY,
        scaledSize, scaledSize
      )
    }
  } else {
    console.log('Sprite image not loaded')
  }
}

// Handle canvas click
const handleCanvasClick = (event: MouseEvent) => {
  console.log('Canvas clicked!')
  if (!canvasRef.value) {
    console.log('Canvas ref is null')
    return
  }

  const rect = canvasRef.value.getBoundingClientRect()
  const x = event.clientX - rect.left
  const y = event.clientY - rect.top
  console.log('Click coordinates:', { x, y })

  // Convert click position to tile coordinates
  const tileX = Math.floor(x / TILE_SIZE)
  const tileY = Math.floor(y / TILE_SIZE)
  const tileIndex = tileY * MAP_WIDTH + tileX
  console.log('Tile coordinates:', { tileX, tileY, tileIndex })

  // Get tile information
  const isBlocked = collisionMap[tileIndex] === 1
  const isPlayerTile = tileIndex === playerTile.value

  // Check if tile is interactable
  let interactableInfo = null
  if ([17, 25].includes(tileIndex)) {
    interactableInfo = 'A closet'
  } else if ([18, 26].includes(tileIndex)) {
    interactableInfo = 'A bookshelf'
  } else if (tileIndex === 27) {
    interactableInfo = 'A pile of scrolls'
  } else if (tileIndex === 29) {
    interactableInfo = 'A pouch of golds'
  } else if (tileIndex === 38) {
    interactableInfo = 'A bed'
  } else if (tileIndex === 73) {
    interactableInfo = 'A fire extinguisher'
  } else if (tileIndex === 81) {
    interactableInfo = 'A cracked pot'
  } else if (tileIndex === 85) {
    interactableInfo = 'A half cracked barrel'
  } else if (tileIndex === 40) {
    interactableInfo = 'A bathroom door'
  } else if (tileIndex === 91) {
    interactableInfo = 'The front door'
  }

  // Log tile information
  console.log('Clicked tile:', {
    x: tileX,
    y: tileY,
    index: tileIndex,
    isBlocked,
    isPlayerTile,
    tileType: isBlocked ? 'Wall' : 'Floor',
    interactable: interactableInfo
  })

  // Show dialogue for interactable objects
  if (interactableInfo) {
    currentInteractable.value = interactableInfo
    showDialogue.value = true
  }
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
    canvasRef.value.addEventListener('click', handleCanvasClick)
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
  if (canvasRef.value) {
    canvasRef.value.removeEventListener('click', handleCanvasClick)
  }
})
</script>

<template>
  <div class="game-container">
    <canvas
      ref="canvasRef"
      class="game-canvas"
    ></canvas>
    <DialogueBox
      :is-visible="showDialogue"
      :item-name="currentInteractable"
      :on-close="() => showDialogue = false"
    />
  </div>
</template>

<style scoped>
.game-container {
  position: relative;
  width: 100%;
  height: 100%;
  background-color: #000;
  display: flex;
  justify-content: center;
  align-items: center;
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
