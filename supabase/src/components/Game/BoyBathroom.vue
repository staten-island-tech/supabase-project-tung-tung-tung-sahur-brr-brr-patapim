<script setup lang="ts">
import BaseMap from './BaseMap.vue'

const mapConfig = {
  mapWidth: 5,
  mapHeight: 8,
  tileSize: 48,
  tilesetPath: '/maps/BoyBathroom.png',
  initialPlayerPosition: { x: 4, y: 4 },
  collisionMap: [
    1, 1, 1, 1, 1,
    1, 1, 1, 1, 1,
    1, 1, 1, 1, 1,
    1, 1, 0, 0, 1,
    1, 0, 0, 0, 0,
    1, 0, 0, 0, 1,
    1, 1, 0, 0, 1,
    1, 1, 1, 1, 1
  ],
  interactables: {

  }
}
</script>

<template>
  <BaseMap v-bind="mapConfig" />
</template> 
