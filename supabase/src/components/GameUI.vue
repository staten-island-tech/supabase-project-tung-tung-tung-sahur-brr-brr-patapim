<script lang="ts" setup>
import { supabase } from '../supabase.ts'
import { ref, onMounted, onUnmounted } from 'vue'
import BoyRoom from './Game/BoyRoom.vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const isGameStarted = ref(false)
const tvAudio = ref<HTMLAudioElement | null>(null)
const gameAudio = ref<HTMLAudioElement | null>(null)
const hoverAudio = ref<HTMLAudioElement | null>(null)

const showModal = ref(false)

function toggleModal() {
  showModal.value = !showModal.value
}

const initializeAudio = () => {
  tvAudio.value = new Audio('/audios/television.mp3')
  tvAudio.value.volume = 0.5
  tvAudio.value.play().catch((error: unknown) => {
    console.error('Error playing television sound:', error)
  })

  tvAudio.value.onended = () => {
    console.log('Television sound ended, starting game audio...')
    gameAudio.value = new Audio('/audios/eerie.mp3')
    gameAudio.value.loop = true
    gameAudio.value.volume = 0.3
    gameAudio.value.play().catch((error: unknown) => {
      console.error('Error playing game audio:', error)
    })
  }

  hoverAudio.value = new Audio('/sfx/hover.mp3')
  hoverAudio.value.volume = 0.2
}

const setupButtonSounds = () => {
  const buttons = document.querySelectorAll<HTMLButtonElement>('.buttons-container button')
  buttons.forEach((button) => {
    button.addEventListener('mouseenter', () => {
      if (hoverAudio.value) {
        hoverAudio.value.currentTime = 0
        hoverAudio.value.play().catch((error: unknown) => {
          console.error('Error playing hover sound:', error)
        })
      }
    })
    button.addEventListener('click', () => {
      const clickAudio = new Audio('/sfx/click.mp3')
      clickAudio.volume = 0.3
      clickAudio.play().catch((error: unknown) => {
        console.error('Error playing click sound:', error)
      })
    })
  })
}

import { useGameStore } from '@/stores/game.ts'

const gameFuncs = useGameStore()

async function redirectTo() {
  await gameFuncs.fetchUser()

  if (gameFuncs.username == null) {
    router.replace({ name: 'name' })
  } else {
    router.replace({ name: 'game' })
  }
}

onMounted(() => {
  const tvSound = new Audio('/audios/television.mp3')
  tvSound.volume = 0.5
  tvSound.play().catch((error: unknown) => {
    console.error('Error playing television sound:', error)
  })

  initializeAudio()
  setupButtonSounds()
})

onUnmounted(() => {
  if (tvAudio.value) {
    tvAudio.value.pause()
    tvAudio.value = null
  }
  if (gameAudio.value) {
    gameAudio.value.pause()
    gameAudio.value = null
  }
  if (hoverAudio.value) {
    hoverAudio.value.pause()
    hoverAudio.value = null
  }
})

const startGame = () => {
  isGameStarted.value = true

  if (gameAudio.value) {
    gameAudio.value.pause()
    gameAudio.value = null
  }

  tvAudio.value = new Audio('/audios/television.mp3')
  tvAudio.value.volume = 0.5
  tvAudio.value.play().catch((error: unknown) => {
    console.error('Error playing television sound:', error)
  })

  hoverAudio.value = new Audio('/sfx/hover.mp3')
  hoverAudio.value.volume = 0.2

  const buttons = document.querySelectorAll<HTMLButtonElement>('.buttons-container button')
  buttons.forEach((button) => {
    button.addEventListener('mouseenter', () => {
      if (hoverAudio.value) {
        hoverAudio.value.currentTime = 0
        hoverAudio.value.play().catch((error: unknown) => {
          console.error('Error playing hover sound:', error)
        })
      }
    })
    button.addEventListener('click', () => {
      const clickAudio = new Audio('/sfx/click.mp3')
      clickAudio.volume = 0.3
      clickAudio.play().catch((error: unknown) => {
        console.error('Error playing click sound:', error)
      })
    })
  })
}

async function signOut() {
  try {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
    router.replace({ name: 'home' })
  } catch (error) {
    if (error instanceof Error) {
      alert(error.message)
    } else {
      alert(String(error))
    }
  }
}
</script>

<template>
  <div class="crt-container" :class="{ 'game-mode': isGameStarted }">
    <div class="tv-screen" v-if="!isGameStarted">
      <div class="scanlines"></div>
      <div class="flicker-overlay"></div>
      <div class="overlay"></div>

      <div class="tv-content">
        <div class="background">
          <div class="red-eyes">
            <div class="eye left-eye"></div>
            <div class="eye right-eye"></div>
          </div>
          <div class="buttons-container">
            <button @click="redirectTo"><img src="/buttons/Start.png" alt="" class="rounded-3xl" /></button>
            <button @click="toggleModal"><img src="/buttons/Settings.png" alt="" class="rounded-3xl" /></button>
            <button @click="signOut"><img src="/buttons/Quit.png" alt="" class="rounded-3xl" /></button>
          </div>

          <div v-if="showModal" class="modal-overlay">
            <div class="modal-content">
              <h2 class="modal-title">User Controls</h2>
              <div class="controls-grid">
                <span>Up</span><span>W</span>
                <span>Down</span><span>S</span>
                <span>Left</span><span>A</span>
                <span>Right</span><span>D</span>
                <span>Interact</span><span>Space</span>
                <span>Inventory</span><span>E</span>
                <span>Confirm</span><span>Enter</span>
                <span>Pause</span><span>Esc</span>
              </div>
              <button class="close-button" @click="showModal = false">Close</button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="game-view">
      <BoyRoom />
    </div>
  </div>
</template>

<style scoped>
.crt-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: #121010;
  z-index: 1000;
}

.crt-container.game-mode {
  background-color: #000;
}

.tv-screen {
  position: relative;
  width: 100%;
  height: 100%;
}

.game-view {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #000;
}

.scanlines {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(rgba(18, 16, 16, 1) 50%, rgba(11, 10, 10, 0.75) 50%);
  background-size: 100% 2px;
  pointer-events: none;
  z-index: 1001;
}

.flicker-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(18, 16, 16, 0.1);
  z-index: 1002;
  pointer-events: none;
  animation: flicker 0.5s infinite;
}

.tv-content::before {
  content: '';
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    rgba(255, 0, 0, 0.06),
    rgba(0, 255, 0, 0.02),
    rgba(0, 0, 255, 0.06)
  );
  pointer-events: none;
  z-index: 1000;
}

.background {
  background-color: black;
  background-size: cover;
  background-repeat: no-repeat;
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.red-eyes {
  position: absolute;
  top: 20%;
  display: flex;
  justify-content: space-between;
  width: 15%;
  animation: eyes-fade 6s infinite alternate;
}

.eye {
  width: 50px;
  height: 50px;
  background-color: red;
  border-radius: 50%;
  box-shadow: 0 0 20px 10px red;
}

.left-eye {
  margin-right: 20px;
}

.right-eye {
  margin-left: 20px;
}

@keyframes eyes-fade {
  0% {
    opacity: 0.1;
    transform: scale(0.15);
  }
  50% {
    opacity: 1;
    transform: scale(0.2);
  }
  100% {
    opacity: 0.1;
    transform: scale(0.15);
  }
}

.buttons-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  transform: scale(0.3);
}

.buttons-container button:hover {
  transform: scale(1.05);
  transition: transform 0.3s ease;
  filter: brightness(3);
}

.buttons-container button {
  margin: 40px;
  cursor: pointer;
}

.crt-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: #121010;
  z-index: 1000;
}

.tv-screen {
  position: relative;
  width: 100%;
  height: 100%;
}

.scanlines {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(rgba(18, 16, 16, 1) 50%, rgba(11, 10, 10, 0.75) 50%);
  background-size: 100% 2px;
  pointer-events: none;
  z-index: 1001;
}

.flicker-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(18, 16, 16, 0.1);
  z-index: 1002;
  pointer-events: none;
  animation: flicker 0.5s infinite;
}

.tv-content::before {
  content: '';
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    rgba(255, 0, 0, 0.06),
    rgba(0, 255, 0, 0.02),
    rgba(0, 0, 255, 0.06)
  );
  pointer-events: none;
  z-index: 1000;
}

@keyframes flicker {
  0% {
    opacity: 0.9;
  }
  5% {
    opacity: 0.7;
  }
  10% {
    opacity: 0.8;
  }
  15% {
    opacity: 0.5;
  }
  20% {
    opacity: 0.9;
  }
  25% {
    opacity: 0.6;
  }
  30% {
    opacity: 0.8;
  }
  35% {
    opacity: 0.4;
  }
  40% {
    opacity: 0.8;
  }
  45% {
    opacity: 0.7;
  }
  50% {
    opacity: 0.6;
  }
  55% {
    opacity: 0.9;
  }
  60% {
    opacity: 0.5;
  }
  65% {
    opacity: 0.8;
  }
  70% {
    opacity: 0.7;
  }
  75% {
    opacity: 0.6;
  }
  80% {
    opacity: 0.9;
  }
  85% {
    opacity: 0.4;
  }
  90% {
    opacity: 0.7;
  }
  95% {
    opacity: 0.8;
  }
  100% {
    opacity: 0.9;
  }
}

.tv-screen {
  animation: turn-on 11s linear;
  animation-fill-mode: forwards;
}

@keyframes turn-on {
  0% {
    transform: scale(1, 0.8) translate3d(0, 0, 0);
    filter: brightness(30);
    opacity: 1;
  }
  3.5% {
    transform: scale(1, 0.8) translate3d(0, 100%, 0);
  }
  3.6% {
    transform: scale(1, 0.8) translate3d(0, -100%, 0);
    opacity: 1;
  }
  9% {
    transform: scale(1.3, 0.6) translate3d(0, 100%, 0);
    filter: brightness(30);
    opacity: 0;
  }
  11% {
    transform: scale(1, 1) translate3d(0, 0, 0);
    filter: contrast(0) brightness(0);
    opacity: 0;
  }
  100% {
    transform: scale(1, 1) translate3d(0, 0, 0);
    filter: contrast(1) brightness(2) saturate(1.3);
    opacity: 1;
  }
}

.tv-screen::after {
  content: '';
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  box-shadow:
    inset 0 0 60px rgba(0, 0, 0, 0.8),
    inset 0 0 150px rgba(0, 0, 0, 0.4);
  pointer-events: none;
  z-index: 1003;
}

.tv-screen::before {
  content: '';
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.05'/%3E%3C/svg%3E");
  pointer-events: none;
  z-index: 1001;
}

.modal-overlay {
  position: fixed;
  top: 0; left: 0; width: 100%; height: 100%;
  display: flex; justify-content: center; align-items: center;
  z-index: 2000; padding: 1rem; box-sizing: border-box;
}

.modal-content {
  background:linear-gradient(180deg, #0f1f0f, #101a10);
  color: #00ff00;
  padding: 2rem;
  border-radius: 16px;
  width: 100%; max-width: 500px;
  max-height: 90vh; overflow-y: auto;
  font-family: monospace;
  font-size: 1.5rem;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.modal-title {
  font-size: 2rem;
  margin-bottom: 1.5rem;
  text-align: center;
  color: #00ff00;
}

.close-button {
  margin-top: 2rem;
  background: transparent; border: none;
  color: #00ff00; font-size: 1.2rem; cursor: pointer;
  align-self: center; padding: 0.5rem 1.5rem;
}

.controls-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  row-gap: 1rem;
  column-gap: 2rem;
  width: 100%;
  text-align: left;
}

.controls-grid span {
  color: #00ff00;
}

.controls-grid span:nth-child(even) {
  text-align: right;
}
</style>


