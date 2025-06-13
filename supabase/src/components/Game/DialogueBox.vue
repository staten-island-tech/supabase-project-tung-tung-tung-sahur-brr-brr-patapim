<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useGameStore } from '@/stores/game'
import { useRouter } from 'vue-router'

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

const props = defineProps<DialogueBoxProps>()
const router = useRouter()
const gameStore = useGameStore()

const emit = defineEmits<{
  (e: 'action', actionId: ActionType, itemName: string): void
}>()

const displayText = ref('')
const typingAudio = ref<HTMLAudioElement | null>(null)
const isTyping = ref(false)
const currentTypeInterval = ref<number | null>(null)
const canInteract = ref(true)

watch(() => props.itemName, (newItemName) => {
  if (newItemName && props.isVisible) {
    startTypewriterEffect(itemDescriptions[newItemName]?.description || '')
  }
}, { immediate: true })

watch(() => props.isVisible, (isVisible) => {
  if (isVisible && props.itemName) {
    startTypewriterEffect(itemDescriptions[props.itemName]?.description || '')
  } else {
    stopTypewriterEffect()
  }
})

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
  
  typingAudio.value.play().catch(error => {
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

const handleAction = (actionId: ActionType): void => {
  if (!canInteract.value) return
  
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
  
  if (props.itemName === 'A half cracked barrel' && actionId === 'search') {
    const hasHammer = gameStore.player.inventory.includes('Hammer')
    if (hasHammer) {
      displayText.value = 'The barrel is empty.'
      return
    }
    gameStore.addToInventory('Hammer')
    gameStore.saveProfileData()
    displayText.value = 'You found a hammer inside the barrel!'
    return
  }
  
  if (props.itemName === 'A closet' && actionId === 'search') {
    const hasHammer = gameStore.player.inventory.includes('Hammer')
    const hasKey = gameStore.player.inventory.includes('Front Door Key')
    
    if (hasKey) {
      displayText.value = 'The closet is empty.'
      return
    }
    
    if (hasHammer) {
      displayText.value = 'You used the hammer to wedge open the closet and reveal your front door key'
      gameStore.addToInventory('Front Door Key')
      gameStore.saveProfileData()
    } else {
      displayText.value = 'The closet seems to be stuck. You need something to pry it open.'
    }
    return
  }

  if (props.itemName === 'The hallway door' && actionId === 'tryOpen') {
    const hasKey = gameStore.player.inventory.includes('Front Door Key')
    if (hasKey) {
      displayText.value = 'You use the front door key to unlock the door...'
      setTimeout(() => {
        router.push('/end')
      }, 2000)
    } else {
      displayText.value = 'The door is locked. You need a key to open it.'
    }
    return
  }
  
  if (actionId === 'search') {
    displayText.value = 'Nothing to be found.'
    return
  }
  
  emit('action', actionId, props.itemName)
  
  switch (actionId) {
    case 'leave':
      props.onClose()
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
  }
}

onMounted(() => {
  if (typingAudio.value) {
    typingAudio.value.pause()
    typingAudio.value = null
  }
})
</script>

<template>
  <div v-if="isVisible" class="dialogue-popup">
    <div class="dialogue-box">
      <div class="dialogue-header">
        <h3>{{ itemName }}</h3>
        <button @click="onClose" class="close-button" :disabled="!canInteract">×</button>
      </div>
      
      <div class="dialogue-content">
        <p>{{ displayText }}<span v-if="isTyping" class="cursor">|</span></p>
        
        <div class="action-buttons" v-if="!isTyping">
          <button 
            v-for="action in itemDescriptions[itemName]?.actions"
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
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}

.close-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
