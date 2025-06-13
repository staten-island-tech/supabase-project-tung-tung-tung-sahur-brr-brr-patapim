<template>
  <div>
    <p v-for="(line, index) in bootMessages" :key="index">{{ line }}</p>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, defineEmits } from 'vue'

const bootMessages = ref<string[]>([])
const isLoggedIn = ref<boolean>(false) 
const allMessages: string[] = [
  'Initializing system...',
  'Loading assets...',
  'Connecting to server...',
  'Checking if user is logged in...',
  'Verifying user credentials...',
  'System boot complete.',
]

const emit = defineEmits(['boot-complete'])

function startBootSequence(): void {
  playBootSound()
  let index = 0
  const interval = setInterval(() => {
    if (index < allMessages.length) {
      bootMessages.value.push(allMessages[index])
      index++
    } else {
      clearInterval(interval)
      emit('boot-complete')
    }
  }, 1250)
}

function playBootSound(): void {
  console.log('Playing boot sound...')
  const audio = new Audio('/audios/boot.mp3')
  audio.play().catch((error) => {
    console.error('Error playing boot sound:', error)
  })
}

onMounted(() => {
  startBootSequence()
})
</script>
