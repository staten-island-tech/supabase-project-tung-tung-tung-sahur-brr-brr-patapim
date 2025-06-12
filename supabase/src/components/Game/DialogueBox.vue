<script setup lang="ts">
import { ref } from 'vue'

// Type definitions
interface ItemDescription {
  description: string
  searchable: boolean
  actions: ItemAction[]
}

interface ItemAction {
  id: string
  label: string
  type: 'primary' | 'secondary'
  available: boolean
}

type ItemType = 'closet' | 'bookshelf' | 'scrolls' | 'gold' | 'bed' | 'extinguisher' | 'pot' | 'barrel'

// Props with type safety
const props = defineProps<{
  isVisible: boolean
  itemName: string
  onClose: () => void
}>()

// Item descriptions with type safety
const itemDescriptions: Record<string, ItemDescription> = {
  'A closet': {
    description: 'A wooden closet. You can search it for items.',
    searchable: true,
    actions: [
      { id: 'search', label: 'Search', type: 'primary', available: true },
      { id: 'leave', label: 'Leave', type: 'secondary', available: true }
    ]
  },
  'A bookshelf': {
    description: 'A tall bookshelf filled with old books. Maybe there\'s something interesting here.',
    searchable: true,
    actions: [
      { id: 'search', label: 'Search', type: 'primary', available: true },
      { id: 'leave', label: 'Leave', type: 'secondary', available: true }
    ]
  },
  'A pile of scrolls': {
    description: 'Ancient scrolls scattered on the floor. They might contain valuable information.',
    searchable: true,
    actions: [
      { id: 'search', label: 'Search', type: 'primary', available: true },
      { id: 'leave', label: 'Leave', type: 'secondary', available: true }
    ]
  },
  'A pouch of golds': {
    description: 'A small leather pouch. It jingles when you shake it.',
    searchable: true,
    actions: [
      { id: 'search', label: 'Search', type: 'primary', available: true },
      { id: 'leave', label: 'Leave', type: 'secondary', available: true }
    ]
  },
  'A bed': {
    description: 'A comfortable bed. You could rest here.',
    searchable: false,
    actions: [
      { id: 'rest', label: 'Rest', type: 'primary', available: true },
      { id: 'leave', label: 'Leave', type: 'secondary', available: true }
    ]
  },
  'A fire extinguisher': {
    description: 'A red fire extinguisher mounted on the wall. Better keep it handy.',
    searchable: false,
    actions: [
      { id: 'take', label: 'Take', type: 'primary', available: true },
      { id: 'leave', label: 'Leave', type: 'secondary', available: true }
    ]
  },
  'A cracked pot': {
    description: 'An old ceramic pot with cracks. It might break if handled roughly.',
    searchable: true,
    actions: [
      { id: 'search', label: 'Search', type: 'primary', available: true },
      { id: 'leave', label: 'Leave', type: 'secondary', available: true }
    ]
  },
  'A half cracked barrel': {
    description: 'A wooden barrel that\'s seen better days. It might contain something.',
    searchable: true,
    actions: [
      { id: 'search', label: 'Search', type: 'primary', available: true },
      { id: 'leave', label: 'Leave', type: 'secondary', available: true }
    ]
  },
  'A bathroom door': {
    description: 'A door leading to the bathroom. It\'s slightly ajar.',
    searchable: false,
    actions: [
      { id: 'enter', label: 'Enter', type: 'primary', available: true },
      { id: 'leave', label: 'Leave', type: 'secondary', available: true }
    ]
  },
  'The front door': {
    description: 'The main entrance to the house. It seems to be locked from the outside.',
    searchable: false,
    actions: [
      { id: 'tryOpen', label: 'Try to Open', type: 'primary', available: true },
      { id: 'leave', label: 'Leave', type: 'secondary', available: true }
    ]
  }
}

// Type-safe action handler
const handleAction = (actionId: string): void => {
  const item = itemDescriptions[props.itemName]
  if (!item) {
    console.error(`No description found for item: ${props.itemName}`)
    return
  }

  const action = item.actions.find(a => a.id === actionId)
  if (!action) {
    console.error(`No action found with id: ${actionId}`)
    return
  }

  if (!action.available) {
    console.log(`Action ${actionId} is not available for ${props.itemName}`)
    return
  }

  console.log(`Action "${actionId}" on ${props.itemName}`)
  
  switch (actionId) {
    case 'leave':
      props.onClose()
      break
    case 'search':
      console.log(`Searching ${props.itemName}...`)
      break
    case 'rest':
      console.log(`Resting on ${props.itemName}...`)
      break
    case 'take':
      console.log(`Taking ${props.itemName}...`)
      break
    case 'enter':
      console.log(`Entering ${props.itemName}...`)
      break
    case 'tryOpen':
      console.log(`Trying to open ${props.itemName}...`)
      break
    default:
      console.log(`Unknown action: ${actionId}`)
  }
}
</script>

<template>
  <div v-if="isVisible" class="dialogue-popup">
    <div class="dialogue-box">
      <div class="dialogue-header">
        <h3>{{ itemName }}</h3>
        <button @click="onClose" class="close-button">×</button>
      </div>
      
      <div class="dialogue-content">
        <p>{{ itemDescriptions[itemName]?.description }}</p>
        
        <div class="action-buttons">
          <button 
            v-for="action in itemDescriptions[itemName]?.actions"
            :key="action.id"
            @click="handleAction(action.id)"
            class="action-button"
            :class="action.type"
            :disabled="!action.available"
          >
            {{ action.label }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.dialogue-popup {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1000;
  pointer-events: auto;
}

.dialogue-box {
  background-color: #2a2a2a;
  border: 2px solid #444;
  border-radius: 8px;
  padding: 15px;
  width: 300px;
  color: #fff;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
}

.dialogue-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  border-bottom: 1px solid #444;
  padding-bottom: 5px;
}

.dialogue-header h3 {
  margin: 0;
  color: #fff;
  font-size: 1.1em;
}

.close-button {
  background: none;
  border: none;
  color: #fff;
  font-size: 20px;
  cursor: pointer;
  padding: 0 5px;
  line-height: 1;
}

.close-button:hover {
  color: #ff4444;
}

.dialogue-content {
  margin-top: 5px;
}

.dialogue-content p {
  margin: 0 0 15px 0;
  font-size: 0.9em;
  line-height: 1.4;
}

.action-buttons {
  display: flex;
  gap: 10px;
  justify-content: center;
}

.action-button {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  color: #fff;
  cursor: pointer;
  font-size: 0.9em;
  min-width: 80px;
  transition: all 0.2s ease;
}

.action-button.primary {
  background-color: #2c5282;
}

.action-button.primary:hover {
  background-color: #2b6cb0;
}

.action-button.secondary {
  background-color: #4a5568;
}

.action-button.secondary:hover {
  background-color: #2d3748;
}

.action-button:disabled {
  background-color: #2d3748;
  opacity: 0.5;
  cursor: not-allowed;
}

.action-button:active {
  transform: scale(0.95);
}
</style>
