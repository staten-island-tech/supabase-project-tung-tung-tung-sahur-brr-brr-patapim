import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { createClient } from '@supabase/supabase-js'
const supabaseUrl = 'https://rjkjqvosqgduopywremy.supabase.co'
const supabaseKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJqa2pxdm9zcWdkdW9weXdyZW15Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM3MDA2NTYsImV4cCI6MjA1OTI3NjY1Nn0.OiPj-SLgHxVc7IFqLykiOM2z7MOLTkyvv161uJrSf5w'

const supabase = createClient(supabaseUrl, supabaseKey)

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
  const username = ref<string | null>(null)
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
      await loadProfileData() // Load game data for the logged-in user
    } else {
      userId.value = null
    }
  }

  async function loadProfileData() {
    if (!userId.value) return

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId.value)
      .single()

    if (error) {
      console.error('Error loading profile data:', error.message)
    } else if (data) {
      username.value = data.username
    }
  }

  async function saveProfileData() {
    if (!userId.value) return

    const { error } = await supabase.from('profiles').upsert({
      id: userId.value,
      username: username.value,
    })
    
    if (error) {
      console.error('Error saving profile data:', error.message)
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
    username,
    player,
    gameStarted,
    inventory,
    sanity,
    storyFlags,
    fetchUser,
    loadProfileData,
    saveProfileData,
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
