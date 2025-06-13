<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
const router = useRouter()

import { useGameStore } from '@/stores/game.ts';
const gameFuncs = useGameStore()

const name = ref('EXODUS')

const buttonLayout = [
  'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'DEL',
  'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'CLEAR', 'QUIT',
  'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'ENTER'
]

function nameAdd(value) {
  if (name.value.length < 6) {
    name.value += value
  }
}

async function handleClick(label) {
  await gameFuncs.fetchUser()

  if (label == 'DEL') {
    name.value = name.value.slice(0, -1)

  } else if (label == 'CLEAR') {
    name.value = ''

  } else if (label == 'ENTER') {

    if (name.value.length != 0) {

      gameFuncs.username = name.value

      gameFuncs.player.coordinates = 37
      gameFuncs.player.direction = 'south',
      gameFuncs.player.map = 'boyroom',
      gameFuncs.player.inventory = []

      await gameFuncs.saveProfileData()
      await gameFuncs.startGame()
      router.replace({ name: 'game' })
    } else {
      alert('Error: empty name input.')
    }

  } else if (label == 'QUIT') {
    router.replace({ name: 'menu' })

  } else {
    nameAdd(label)
  }
}
</script>

<template>
    <div class="crt-container">
    <div class="tv-screen">
      <div class="scanlines"></div>
      <div class="flicker-overlay"></div>
      <div class="overlay"></div>
      <div class="tv-content">
        <div class="background">
          <div class="name-display">
            <h1
              v-for="i in 6"
              :key="i"
              class="letter-box"
            >
            {{ name[i - 1] }}
            </h1>
          </div>
          <div class="keyboard-display">
            <button
              v-for="button in buttonLayout"
              :key="button"
              @click="handleClick(button)"
              :class="[
                'underline-hover',
                ['DEL', 'CLEAR', 'ENTER', 'QUIT'].includes(button) ? 'function-button' : 'letter-button'
              ]"
            >
              {{ button }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.background {
  background-color: black;
  background-size: cover;
  background-repeat: no-repeat;
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
}

.name-display {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 70%;
  height: 14%;
  color: #00FF00; 
  font-size: 36px; 
  margin: 1%;
}


.keyboard-display {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-evenly;
  align-items: center;
  margin-top: 2%;
  width: 70%;
  height: 49%;

}

.keyboard-display button:hover {
  filter: brightness(3);
}

.letter-button {
  font-size: 36px;
  width: 8%;
  aspect-ratio: 1 / 1;
  color:#00FF00;
  cursor: pointer;
  margin: 0.5%;
  background-color: #00ff000f;
}

.function-button {
  font-size: 36px;
  width: 12%;
  aspect-ratio: 1.5 / 1;
  color:#00FF00;
  cursor: pointer;
  margin: 0.5%;
  background-color: #00ff000f;
}

.letter-box {
  margin: 1%;
  width: 8%;
  aspect-ratio: 1 / 1;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #00ff000f;
  border-bottom: 3px solid #00FF00;
}

/* Shared underline hover effect */
.underline-hover {
  position: relative;
  color: #00FF00;
  border: none;
  cursor: pointer;
  padding: 0;
  overflow: hidden;
}

.underline-hover::after {
  content: '';
  position: absolute;
  bottom: 4px;
  left: 50%;
  width: 100%;
  height: 2px;
  background-color: #00FF00;
  transform: translateX(-50%) scaleX(0);
  transform-origin: center;
  transition: transform 0.3s ease;
}

.underline-hover:hover::after {
  transform: translateX(-50%) scaleX(1);
}

/* CRT TV effect */
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

/* Scanlines effect */
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

/* Fixed Flicker effect */
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

/* Color bleed effect */
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

/* Proper flicker animation */
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
  transform: scale(1, 1) translate3d(0, 0, 0);
  filter: contrast(1) brightness(2) saturate(1.3);
  opacity: 1;
}

/* Optional: TV border */
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

/* Noise effect */
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
</style>