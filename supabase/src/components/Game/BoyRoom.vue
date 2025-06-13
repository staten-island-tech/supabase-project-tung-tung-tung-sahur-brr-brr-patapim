<script setup lang="ts">
import BaseMap from './BaseMap.vue'
import EscapeMenu from '../UI/EscapeMenu.vue'
import DialogueBox from './DialogueBox.vue'
import InventoryUI from '../UI/InventoryUI.vue'
import { ref, reactive } from 'vue'
import { useGameStore } from '@/stores/game'

const gameStore = useGameStore()
gameStore.fetchUser()

const emit = defineEmits<{
  (e: 'changeMap', map: string): void
}>()

const showDialogue = ref(false)
const currentItem = ref('')

const handleItemInteraction = (itemName: string) => {
  currentItem.value = itemName
  showDialogue.value = true
}

const closeDialogue = () => {
  showDialogue.value = false
  currentItem.value = ''
}

const handleDialogueAction = (actionId: string, itemName: string) => {
  console.log('[BoyRoom] Received action:', actionId, 'for item:', itemName)
  
  // Handle taking the hammer
  if (actionId === 'take' && itemName === 'Hammer') {
    // Remove barrel from interactables
    const barrelTile = Object.entries(interactables).find(([_, value]) => value === 'A half cracked barrel')?.[0]
    if (barrelTile) {
      delete interactables[Number(barrelTile)]
    }
  }
  
  if (actionId === 'enter' && itemName === 'A bathroom door') {
    console.log('[BoyRoom] Changing map to BoyBathroom')
    emit('changeMap', 'BoyBathroom')
  }
}

const interactables = reactive<Record<number, string>>({
  17: 'A closet',
  25: 'A closet',
  18: 'A bookshelf',
  26: 'A bookshelf',
  27: 'A pile of scrolls',
  29: 'A pouch of golds',
  38: 'A bed',
  81: 'A cracked pot',
  85: 'A half cracked barrel',
  40: 'A bathroom door',
  91: 'The hallway door'
})

const mapConfig = {
  mapWidth: 8,
  mapHeight: 12,
  tileSize: 48,
  tilesetPath: '/maps/BoyRoom.png',
  initialPlayerPosition: gameStore.player.coordinates,
  collisionMap: [
    1, 1, 1, 1, 1, 1, 1, 1,
    1, 1, 1, 1, 1, 1, 1, 1,
    1, 1, 1, 1, 1, 1, 1, 1,
    1, 1, 1, 1, 0, 1, 1, 1,
    1, 0, 0, 0, 0, 0, 1, 1,
    0, 0, 0, 0, 0, 0, 0, 1,
    1, 0, 0, 0, 0, 0, 0, 1,
    1, 0, 0, 0, 0, 0, 0, 1,
    1, 0, 0, 0, 0, 0, 0, 1,
    1, 1, 0, 0, 0, 0, 1, 1,
    1, 1, 0, 0, 0, 1, 1, 1,
    1, 1, 1, 0, 1, 1, 1, 1
  ],
  get interactables() {
    return interactables
  }
}
</script>

<template>
  <div class="game-container">
    <BaseMap 
      v-bind="mapConfig" 
      @changeMap="(map) => {
        console.log('[BoyRoom] Received changeMap event:', map)
        emit('changeMap', map)
      }"
      @interact="handleItemInteraction"
    />
    <EscapeMenu />
    <DialogueBox
      :is-visible="showDialogue"
      :item-name="currentItem"
      :on-close="closeDialogue"
      @action="handleDialogueAction"
    />
    <InventoryUI />
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