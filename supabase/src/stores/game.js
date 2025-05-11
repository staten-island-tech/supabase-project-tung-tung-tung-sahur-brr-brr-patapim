import { defineStore } from 'pinia'
import { ref } from 'vue'
export const useGameStore = defineStore('game', () => {
  const player = ref({
    x: 100,
    y: 100,
    speed: 3,
    direction: 'down',
  })

  const gameStarted = ref(false)
  const inventory = ref([])
  const sanity = ref(100)

  function addtoInventory(item) {
    inventory.value.push(item)
  }

  return {
    player,
    gameStarted,
    inventory,
    sanity,
    addtoInventory,
  }
})
