<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useGameStore } from '@/stores/game'
const gameFuncs = useGameStore()

await gameFuncs.fetchUser()
await gameFuncs.fetchMapData()
// Type definitions
type ActionType = 'enter' | 'search' | 'leave' | 'rest' | 'take' | 'tryOpen'
type ActionButtonType = 'primary' | 'secondary'

interface ItemAction {
  id: ActionType
  label: string
  type: ActionButtonType
  available: boolean
}

interface ItemDescription {
  description: string
  searchable: boolean
  actions: ItemAction[]
}

interface DialogueBoxProps {
  isVisible: boolean
  itemName: string
  onClose: () => void
}

// Props with type safety
const props = defineProps<DialogueBoxProps>()

const emit = defineEmits<{
  (e: 'action', actionId: ActionType, itemName: string): void
}>()

// Typewriter effect state
const displayText = ref('')
const typingAudio = ref<HTMLAudioElement | null>(null)
const isTyping = ref(false)
const currentTypeInterval = ref<number | null>(null)
const canInteract = ref(true)

// Track searched items so searching only happens once per item
const searchedItems = ref<Set<string>>(new Set())

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
  'The hallway door': {
    description: 'The door leading to the hallway. It seems to be locked from the outside.',
    searchable: false,
    actions: [
      { id: 'tryOpen', label: 'Try to Open', type: 'primary', available: true },
      { id: 'leave', label: 'Leave', type: 'secondary', available: true }
    ]
  }
}

// Create a computed version of the item description with disabled search if already searched
const computedItemDescription = computed(() => {
  if (!props.itemName) return null
  const base = itemDescriptions[props.itemName]
  if (!base) return null

  // Clone actions, disable search if already searched
  const clonedActions = base.actions.map(action => {
    if (action.id === 'search' && searchedItems.value.has(props.itemName)) {
      return { ...action, available: false }
    }
    return action
  })

  return {
    ...base,
    actions: clonedActions
  }
})

// Watch for changes in itemName or visibility to trigger typewriter effect
watch(
  () => props.itemName,
  (newItemName) => {
    if (props.isVisible && newItemName) {
      startTypewriterEffect(itemDescriptions[newItemName]?.description || '')
    } else {
      stopTypewriterEffect()
    }
  },
  { immediate: true }
)


// Typewriter effect functions
const startTypewriterEffect = (text: string) => {
  stopTypewriterEffect()

  displayText.value = ''
  isTyping.value = true
  canInteract.value = false

  if (!typingAudio.value) {
    typingAudio.value = new Audio('/sfx/typing.mp3')
    typingAudio.value.loop = true
    typingAudio.value.volume = 0.3
  }

  typingAudio.value.play().catch((error) => {
    console.error('Error playing typing sound:', error)
  })

  let currentIndex = 0
  currentTypeInterval.value = window.setInterval(() => {
    if (currentIndex < text.length) {
      displayText.value += text[currentIndex]
      currentIndex++
    } else {
      clearInterval(currentTypeInterval.value!)
      currentTypeInterval.value = null
      isTyping.value = false
      canInteract.value = true

      if (typingAudio.value) {
        typingAudio.value.pause()
        typingAudio.value.currentTime = 0
      }
    }
  }, 50)
}

const stopTypewriterEffect = () => {
  if (currentTypeInterval.value) {
    clearInterval(currentTypeInterval.value)
    currentTypeInterval.value = null
  }
  if (typingAudio.value) {
    typingAudio.value.pause()
    typingAudio.value.currentTime = 0
  }
  isTyping.value = false
  canInteract.value = true
}

// Define action handlers for unique events per item and action
const actionHandlers: Record<string, Partial<Record<ActionType, () => void>>> = {
  'A closet': {
    search: () => {
      console.log('You rummage through the closet and find a rusty key.')
    },
    leave: () => {
      props.onClose()
    }
  },
  'A bookshelf': {
    search: () => {
      console.log('You find an old diary hidden behind the books.')
    },
    leave: () => {
      props.onClose()
    }
  },
  'A pouch of golds': {
    search: () => {
      console.log('You open the pouch and find some gold coins inside.')
    },
    leave: () => {
      props.onClose()
    }
  },
  'A bed': {
    rest: () => {
      console.log('You take a short rest and feel refreshed.')
    },
    leave: () => {
      props.onClose()
    }
  },
  'A fire extinguisher': {
    take: () => {
      console.log('You take the fire extinguisher with you.')
      gameFuncs.addToInventory('Fire Extinguisher')
      gameFuncs.changeMapData('boyroom', ['Key'], 'unlocked')
      gameFuncs.saveProfileData()
    },
    leave: () => {
      props.onClose()
    }
  },
  'The hallway door': {
    tryOpen: () => {
      gameFuncs.loadProfileData()
      if (gameFuncs.player.inventory)
      console.log('The door is locked. You need a key to open it.')
      
    },
    leave: () => {
      props.onClose()
    }
  }
  // Add more as needed...
}

// Type-safe action handler
const handleAction = (actionId: ActionType): void => {
  if (!canInteract.value) return // Prevent interaction while typing

  const itemName = props.itemName
  if (!itemName) {
    console.error('No item selected.')
    return
  }

  const item = computedItemDescription.value
  if (!item) {
    console.error(`No description found for item: ${itemName}`)
    return
  }

  const action = item.actions.find(a => a.id === actionId)
  if (!action) {
    console.error(`No action found with id: ${actionId}`)
    return
  }

  if (!action.available) {
    console.log(`Action ${actionId} is not available for ${itemName}`)
    return
  }

  console.log(`Action "${actionId}" on ${itemName}`)

  emit('action', actionId, itemName)

  const itemHandler = actionHandlers[itemName]?.[actionId]
  if (itemHandler) {
    itemHandler()
  }

  // Mark item as searched to disable future search actions
  if (actionId === 'search') {
    searchedItems.value.add(itemName)
  }

  if (actionId === 'leave') {
    props.onClose()
  }
}

// Cleanup on unmount
onMounted(() => {
  if (typingAudio.value) {
    typingAudio.value.pause()
    typingAudio.value = null
  }
})
</script>

<template>
  <div v-if="props.isVisible" class="dialogue-popup">
    <div class="dialogue-box">
      <div class="dialogue-header">
        <h3>{{ props.itemName }}</h3>
        <button @click="props.onClose" class="close-button" :disabled="!canInteract">×</button>
      </div>

      <div class="dialogue-content">
        <p>{{ displayText }}<span v-if="isTyping" class="cursor">|</span></p>

        <div class="action-buttons" v-if="!isTyping">
          <button
            v-for="action in computedItemDescription?.actions"
            :key="action.id"
            @click="handleAction(action.id)"
            class="action-button"
            :class="action.type"
            :disabled="!action.available || !canInteract"
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
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1000;
  pointer-events: auto;
  width: 60%;
  max-width: 600px;
}

.dialogue-box {
  background-color: #2a2a2a;
  border: 2px solid #444;
  border-radius: 8px;
  padding: 15px;
  color: #fff;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
  font-family: 'Press Start 2P', 'Courier New', monospace;
  image-rendering: pixelated;
}

.dialogue-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  border-bottom: 2px solid #444;
  padding-bottom: 8px;
}

.dialogue-header h3 {
  margin: 0;
  color: #fff;
  font-size: 0.9em;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.close-button {
  background: none;
  border: none;
  color: #fff;
  font-size: 20px;
  cursor: pointer;
  padding: 0 5px;
  line-height: 1;
  font-family: 'Press Start 2P', 'Courier New', monospace;
}

.close-button:hover {
  color: #ff4444;
}

.dialogue-content {
  margin-top: 8px;
}

.dialogue-content p {
  margin: 0 0 15px 0;
  font-size: 0.8em;
  line-height: 1.4;
  letter-spacing: 0.5px;
}

.action-buttons {
  display: flex;
  gap: 10px;
  justify-content: center;
  margin-top: 15px;
}

.action-button {
  padding: 8px 16px;
  border: 2px solid #444;
  border-radius: 4px;
  color: #fff;
  cursor: pointer;
  font-size: 0.8em;
  min-width: 100px;
  transition: all 0.2s ease;
  font-family: 'Press Start 2P', 'Courier New', monospace;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.action-button.primary {
  background-color: #2c5282;
}

.action-button.primary:hover {
  background-color: #2b6cb0;
  transform: translateY(-2px);
}

.action-button.secondary {
  background-color: #4a5568;
}

.action-button.secondary:hover {
  background-color: #2d3748;
  transform: translateY(-2px);
}

.action-button:disabled {
  background-color: #2d3748;
  opacity: 0.5;
  cursor: not-allowed;
  transform: none !important;
}

.action-button:active {
  transform: scale(0.95);
}

.cursor {
  display: inline-block;
  width: 2px;
  height: 1em;
  background-color: #fff;
  margin-left: 2px;
  animation: blink 0.7s infinite;
}

@keyframes blink {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0;
  }
}

.close-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
