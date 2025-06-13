import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { createClient } from '@supabase/supabase-js'
import { supabase } from '../supabase.ts'

type InventoryItem = string

interface Player {
  coordinates: number
  direction: 'north' | 'south' | 'west' | 'east'
  inventory: InventoryItem[]
  map: string
}

interface MapData {
  map: string;
  items: string[];
  accessibility: string;
}

const initialMapData: MapData[] = [
  { map: 'attic', items: [], accessibility: 'unlocked'},
  { map: 'atticentrance', items: [], accessibility: 'locked'},
  { map: 'boybathroom', items: [], accessibility: 'unlocked'},
  { map: 'boyroom', items: [], accessibility: 'unlocked'},
  { map: 'church', items: [], accessibility: 'locked'},
  { map: 'diningroom', items: [], accessibility: 'unlocked'},
  { map: 'dungeon', items: [], accessibility: 'unlocked'},
  { map: 'flooronemain', items: [], accessibility: 'unlocked'},
  { map: 'floortwohallway', items: [], accessibility: 'unlocked'},
  { map: 'kitchen', items: [], accessibility: 'unlocked'},
  { map: 'livingroom', items: [], accessibility: 'locked'},
  { map: 'parentbathroom', items: [], accessibility: 'unlocked'},
  { map: 'parentroom', items: [], accessibility: 'unlocked'},
]

export const useGameStore = defineStore('game', () => {

  const userId = ref<string | null>(null) 
  const username = ref<string | null>(null)
  const player = ref<Player>({
    coordinates: 37,
    direction: 'south',
    map: 'boyroom',
    inventory: []
  })
  const items = ref<string[]>([])
  const accessibility = ref<string | null>(null)


  async function fetchUser() {
    const { data, error } = await supabase.auth.getSession()

    if (error) {
      console.log('Error fetching user:', error.message)
    } else if (data.session) {
      userId.value = data.session.user.id
      await loadProfileData()
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
      player.value.inventory = data.inventory
      player.value.direction = data.direction
      player.value.coordinates = data.coordinates
      player.value.map = data.map
    }
  }

  async function saveProfileData() {
    if (!userId.value) return

    const { error } = await supabase.from('profiles').upsert({
      id: userId.value,
      username: username.value,
      inventory: player.value.inventory,
      direction: player.value.direction,
      coordinates: player.value.coordinates,
      map: player.value.map,
    })
    
    if (error) {
      console.error('Error saving profile data:', error.message)
    }
  }
  

  function clearProfileData() {
    userId.value = null
    player.value = { coordinates: 0, direction: 'south', map: 'boyroom', inventory: [] }
  }

  // Inventory Management
  function addToInventory(item: InventoryItem) {
    player.value.inventory.push(item)
    saveProfileData() 
  } // will need to remove it from the map at that point while player is universal.

  function removeFromInventory(item: InventoryItem) {
    player.value.inventory = player.value.inventory.filter(object => object != item)
    saveProfileData() // Save changes to Supabase
  }

  async function fetchMapData(map: string) {
    if (!userId.value) return

    const { data, error } = await supabase
      .from(`${map}`)
      .select('*')
      .eq('id', userId.value)
      .single()

    if (error) {
      console.error('Error loading map data:', error.message)
    } else if (data) {
      items.value = data.items
      accessibility.value = data.accessibility
    }
  }

  async function changeMapData(map: string, items: string[] | null, accessibility: string | null) {
    if (!userId.value) return

    const { error } = await supabase.from(`${map}`).upsert({
      id: userId.value,
      items: items,
      accessibility: accessibility
    })
    
    if (error) {
      console.error('Error adding map data:', error.message)
    }
  }

  async function startGame() {
    for (const location of initialMapData) {
      await changeMapData(location.map, location.items, location.accessibility);
    }
  }

  return {
    userId,
    username,
    player,
    items,
    accessibility,
    fetchUser,
    loadProfileData,
    saveProfileData,
    clearProfileData,
    addToInventory,
    removeFromInventory,
    fetchMapData,
    changeMapData,
    startGame,
  }
})
