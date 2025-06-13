<script setup lang="ts">
import BaseMap from './BaseMap.vue'
import EscapeMenu from '../UI/EscapeMenu.vue'

const emit = defineEmits<{
  (e: 'changeMap', map: string): void
}>()

// Map-specific configuration
const mapConfig = {
  mapWidth: 8,
  mapHeight: 12,
  tileSize: 48,
  tilesetPath: '/maps/BoyRoom.png',
  initialPlayerPosition: { x: 5, y: 4 }, // Tile 37 = (5,4) because 37 = 4 * 8 + 5
  collisionMap: [
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
  ],
  interactables: {
    17: 'A closet',
    25: 'A closet',
    18: 'A bookshelf',
    26: 'A bookshelf',
    27: 'A pile of scrolls',
    29: 'A pouch of golds',
    38: 'A bed',
    73: 'A fire extinguisher',
    81: 'A cracked pot',
    85: 'A half cracked barrel',
    40: 'A bathroom door',
    91: 'The hallway door'
  }
}
</script>

<template>
  <div class="game-container">
    <BaseMap v-bind="mapConfig" @changeMap="(map) => {
      console.log('[BoyRoom] Received changeMap event:', map)
      emit('changeMap', map)
    }" />
    <EscapeMenu />
  </div>
</template>

<style scoped>
.game-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #000;
  overflow: hidden;
}
</style> 