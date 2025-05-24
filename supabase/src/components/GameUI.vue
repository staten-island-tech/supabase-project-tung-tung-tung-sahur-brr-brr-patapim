<script lang="ts" setup>
import { onMounted } from 'vue'

onMounted(() => {
  const tvAudio = new Audio('/audios/television.mp3')

  tvAudio.play().catch((error: unknown) => {
    console.error('Error playing television sound:', error)
  })

  tvAudio.onended = () => {
    console.log('Television sound ended, starting game audio...')
    const gameAudio = new Audio('/audios/eerie.mp3') // Adjust path as needed
    gameAudio.loop = true
    gameAudio.play().catch((error: unknown) => {
      console.error('Error playing game audio:', error)
    })
  }

  let hoverAudio: InstanceType<typeof Audio> | null = null

  const buttons = document.querySelectorAll<HTMLButtonElement>('.buttons-container button')
  buttons.forEach((button) => {
    button.addEventListener('mouseenter', () => {
      if (hoverAudio && !hoverAudio.ended) {
        return
      }
      hoverAudio = new Audio('/sfx/hover.mp3')
      hoverAudio.play().catch((error: unknown) => {
        console.error('Error playing hover sound:', error)
      })
    })
    button.addEventListener('click', () => {
      const clickAudio = new Audio('/sfx/click.mp3')
      clickAudio.play().catch((error: unknown) => {
        console.error('Error playing click sound:', error)
      })
    })
  })
})
</script>

<template>
  <div class="crt-container">
    <div class="tv-screen">
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
            <button>
              <img src="/buttons/Start.png" alt="" class="rounded-3xl" />
            </button>
            <button><img src="/buttons/Saves.png" alt="" class="rounded-3xl" /></button>
            <button><img src="/buttons/Keymap.png" alt="" class="rounded-3xl" /></button>
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

/* TV turn-on animation */
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
