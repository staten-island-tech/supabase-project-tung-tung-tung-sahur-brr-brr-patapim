<script setup lang="ts">
import BaseMap from './BaseMap.vue'

// Map-specific configuration
const mapConfig = {
  mapWidth: 5,
  mapHeight: 8,
  tileSize: 48,
  tilesetPath: '/maps/BoyBathroom.png',
  initialPlayerPosition: { x: 4, y: 4 }, // Tile 37 = (5,4) because 37 = 4 * 8 + 5
  collisionMap: [
    1, 1, 1, 1, 1, // Row 0
    1, 1, 1, 1, 1, // Row 1
    1, 1, 1, 1, 1, // Row 2
    1, 1, 0, 0, 1, // Row 3
    1, 0, 0, 0, 0, // Row 4
    1, 0, 0, 0, 1, // Row 5
    1, 1, 0, 0, 1, // Row 6
    1, 1, 1, 1, 1  // Row 7
  ],
  interactables: {

  }
}
</script>

<template>
  <BaseMap v-bind="mapConfig" />
</template> 