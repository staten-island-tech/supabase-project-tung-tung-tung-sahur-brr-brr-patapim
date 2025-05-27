import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { createClient } from '@supabase/supabase-js'

// Initialize Supabase client
const supabaseUrl = 'https://your-supabase-url.supabase.co'
const supabaseKey = 'your-supabase-anon-key'
const supabase = createClient(supabaseUrl, supabaseKey)

// Define types for the store
interface Player {
  x: number
  y: number
  speed: number
  direction: 'up' | 'down' | 'left' | 'right'
  currentMap: string
}

interface InventoryItem {
  id: string
  name: string
  description: string
  icon: string
  isKeyItem: boolean
  quantity?: number
}

interface StoryFlag {
  id: string
  value: boolean
}

export const useGameStore = defineStore('game', () => {
  // === State ===
  const userId = ref<string | null>(null) // Logged-in user's ID
  const player = ref<Player>({
    x: 100,
    y: 100,
    speed: 3,
    direction: 'down',
    currentMap: 'start',
  })
  const gameStarted = ref(false)
  const inventory = ref<InventoryItem[]>([])
  const sanity = ref(100)
  const storyFlags = ref<StoryFlag[]>([])

  // === Actions ===

  // Fetch the logged-in user's ID from Supabase
  async function fetchUser() {
    const { data, error } = await supabase.auth.getSession()
    if (data.session) {
      userId.value = data.session.user.id
      await loadGameData() // Load game data for the logged-in user
    } else {
      userId.value = null
    }
  }

  // Save game data to Supabase
  async function saveGameData() {
    if (!userId.value) return

    const { error } = await supabase.from('game_data').upsert({
      user_id: userId.value,
      player: player.value,
      inventory: inventory.value,
      sanity: sanity.value,
      story_flags: storyFlags.value,
    })

    if (error) {
      console.error('Error saving game data:', error.message)
    }
  }

  // Load game data from Supabase
  async function loadGameData() {
    if (!userId.value) return

    const { data, error } = await supabase
      .from('game_data')
      .select('*')
      .eq('user_id', userId.value)
      .single()

    if (error) {
      console.error('Error loading game data:', error.message)
    } else if (data) {
      player.value = data.player
      inventory.value = data.inventory
      sanity.value = data.sanity
      storyFlags.value = data.story_flags
    }
  }

  // Clear game data on logout
  function clearGameData() {
    userId.value = null
    player.value = { x: 100, y: 100, speed: 3, direction: 'down', currentMap: 'start' }
    inventory.value = []
    sanity.value = 100
    storyFlags.value = []
  }

  // Inventory Management
  function addToInventory(item: InventoryItem) {
    const existingItem = inventory.value.find((i) => i.id === item.id)
    if (existingItem && item.quantity) {
      existingItem.quantity = (existingItem.quantity || 1) + item.quantity
    } else {
      inventory.value.push(item)
    }
    saveGameData() // Save changes to Supabase
  }

  function removeFromInventory(itemId: string, quantity: number = 1) {
    const itemIndex = inventory.value.findIndex((i) => i.id === itemId)
    if (itemIndex !== -1) {
      const item = inventory.value[itemIndex]
      if (item.quantity && item.quantity > quantity) {
        item.quantity -= quantity
      } else {
        inventory.value.splice(itemIndex, 1)
      }
    }
    saveGameData() // Save changes to Supabase
  }

  // Sanity Management
  function adjustSanity(amount: number) {
    sanity.value = Math.max(0, Math.min(100, sanity.value + amount))
    saveGameData() // Save changes to Supabase
  }

  // Story Progression
  function setStoryFlag(flagId: string, value: boolean) {
    const existingFlag = storyFlags.value.find((flag) => flag.id === flagId)
    if (existingFlag) {
      existingFlag.value = value
    } else {
      storyFlags.value.push({ id: flagId, value })
    }
    saveGameData() // Save changes to Supabase
  }

  function getStoryFlag(flagId: string): boolean {
    const flag = storyFlags.value.find((flag) => flag.id === flagId)
    return flag ? flag.value : false
  }

  // === Getters ===
  const isPlayerMoving = computed(() => player.value.speed > 0)
  const inventoryCount = computed(() => inventory.value.length)
  const isGameOver = computed(() => sanity.value <= 0)

  return {
    userId,
    player,
    gameStarted,
    inventory,
    sanity,
    storyFlags,
    fetchUser,
    saveGameData,
    loadGameData,
    clearGameData,
    addToInventory,
    removeFromInventory,
    adjustSanity,
    setStoryFlag,
    getStoryFlag,
    isPlayerMoving,
    inventoryCount,
    isGameOver,
  }
})
