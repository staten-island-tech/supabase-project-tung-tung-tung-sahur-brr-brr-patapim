<script setup lang="ts">
import { ref } from 'vue'
import { useGameStore } from '@/stores/game';
const gameFuncs = useGameStore()

interface InventoryItem {
  id: number;
  name: string;
  description: string;
  icon: string;
}

function handleInventoryKey(event: KeyboardEvent) {
  if (event.key === 'i' || event.key === 'I') {
    console.log('[Inventory] "i" key pressed while open — refreshing inventory')
    refreshInventory()
  }
}

async function refreshInventory() {
  await gameFuncs.loadProfileData()
  if (gameFuncs.player.inventory.includes("Fire Extinguisher") && inventoryItems.value.length < 4) {
    inventoryItems.value.push(
      {
        id: 4,
        name: "Fire Extinguisher",
        description: "A fire extinguisher to put out flames out cause a dent.",
        icon: "🧯"
      },
    )
  } else if (gameFuncs.player.inventory.includes("Key") && inventoryItems.value.length < 5) {
    inventoryItems.value.push(
      {
        id: 5,
        name: "Key",
        description: "A key for hallways.",
        icon: "🔑"
      },
    )
  }
}

const inventoryItems = ref<InventoryItem[]>([
  {
    id: 1,
    name: "Name Tag",
    description: "A name tag with your name on it.",
    icon: "📛"
  },
  {
    id: 2,
    name: "Flashlight",
    description: "A reliable flashlight with fresh batteries",
    icon: "🔦"
  },
  {
    id: 3,
    name: "First Aid Kit",
    description: "Contains bandages and basic medical supplies",
    icon: "🏥"
  },
  
])
</script>

<template>
  <div class="inventory">
    <h2>Inventory</h2>
    <div class="inventory-list">
      <div v-for="item in inventoryItems" :key="item.id" class="inventory-item">
        <span class="item-icon">{{ item.icon }}</span>
        <div class="item-info">
          <span class="item-name">{{ item.name }}</span>
          <span class="item-description">{{ item.description }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.inventory {
  background: rgba(0, 0, 0, 0.5);
  padding: 20px;
  border-radius: 0;
  color: white;
  max-width: 600px;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
  backdrop-filter: blur(5px);
  border: 4px solid #fff;
  image-rendering: pixelated;
  font-family: 'Press Start 2P', monospace;
}

h2 {
  margin: 0 0 20px 0;
  font-size: 1.2rem;
  color: #fff;
  text-shadow: 2px 2px 0 #000;
  text-transform: uppercase;
  letter-spacing: 2px;
}

.inventory-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.inventory-item {
  display: flex;
  align-items: center;
  padding: 12px;
  background: rgba(255, 255, 255, 0.05);
  border: 2px solid rgba(255, 255, 255, 0.2);
  transition: all 0.2s ease;
  image-rendering: pixelated;
}

.inventory-item:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.4);
  transform: translateX(4px);
}

.item-icon {
  font-size: 1.5rem;
  margin-right: 15px;
  image-rendering: pixelated;
  filter: drop-shadow(2px 2px 0 #000);
}

.item-info {
  display: flex;
  flex-direction: column;
}

.item-name {
  font-weight: bold;
  margin-bottom: 4px;
  text-shadow: 1px 1px 0 #000;
  font-size: 0.9rem;
}

.item-description {
  font-size: 0.7rem;
  color: #ccc;
  text-shadow: 1px 1px 0 #000;
}


.inventory::-webkit-scrollbar {
  width: 8px;
}

.inventory::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.3);
}

.inventory::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.3);
  border: 2px solid #000;
}

.inventory::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.5);
}
</style>