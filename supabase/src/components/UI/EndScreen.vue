<script setup lang="ts">
import { onMounted } from 'vue'
import gsap from 'gsap'
import { useRouter } from 'vue-router'
import { ScrambleTextPlugin } from 'gsap/ScrambleTextPlugin'
import { CustomEase } from 'gsap/CustomEase'

gsap.registerPlugin(ScrambleTextPlugin, CustomEase)

const router = useRouter()

const goToMenu = () => {
  console.log('Menu button clicked')
  router.push('/menu')
}

// Create custom ease for more dynamic animations
const glitchEase = CustomEase.create("glitchEase", "M0,0 C0.126,0.382 0.282,0.674 0.378,0.752 0.486,0.84 0.602,0.902 0.722,0.938 0.842,0.974 0.966,1 1,1")

onMounted(() => {
  // Initial state
  gsap.set('.end-screen', { opacity: 0, scale: 0.5, rotation: -10 })
  gsap.set('.credits', { opacity: 0, y: 50, scale: 0.8 })
  gsap.set('.glitch-text', { opacity: 0 })
  gsap.set('.particles', { opacity: 0 })
  gsap.set('.terminal', { opacity: 0 })
  gsap.set('.note', { opacity: 0 })
  gsap.set('.menu-button', { opacity: 0, scale: 0.8 })

  // Animation sequence
  const tl = gsap.timeline()

  // Terminal effect with scramble text
  tl.to('.terminal', {
    opacity: 1,
    duration: 2,
    ease: 'power2.in'
  })
  .to('.line', {
    duration: 1,
    scrambleText: {
      text: "> Initializing system...",
      chars: "01",
      speed: 0.3,
      revealDelay: 0.5
    },
    ease: "none"
  }, 0.5)
  .to('.line:nth-child(2)', {
    duration: 1,
    scrambleText: {
      text: "> Loading completion sequence...",
      chars: "01",
      speed: 0.3,
      revealDelay: 0.5
    },
    ease: "none"
  }, 1.5)
  .to('.line:nth-child(3)', {
    duration: 1,
    scrambleText: {
      text: "> Accessing memory banks...",
      chars: "01",
      speed: 0.3,
      revealDelay: 0.5
    },
    ease: "none"
  }, 2.5)
  .to('.line:nth-child(4)', {
    duration: 1,
    scrambleText: {
      text: "> Processing final data...",
      chars: "01",
      speed: 0.3,
      revealDelay: 0.5
    },
    ease: "none"
  }, 3.5)
  .to('.line:nth-child(5)', {
    duration: 1,
    scrambleText: {
      text: "> System ready.",
      chars: "01",
      speed: 0.3,
      revealDelay: 0.5
    },
    ease: "none"
  }, 4.5)
  .to('.terminal', {
    opacity: 0,
    duration: 1,
    ease: 'power2.out'
  }, 6)
  // Main text animation with dramatic entrance
  .to('.end-screen', {
    opacity: 1,
    scale: 1.2,
    rotation: 5,
    duration: 1.5,
    ease: glitchEase
  })
  .to('.end-screen', {
    scale: 1,
    rotation: 0,
    duration: 0.5,
    ease: 'power2.inOut'
  })
  .to('.glitch-text', {
    opacity: 1,
    duration: 0.5,
    onComplete: () => {
      // Enhanced glitch effect
      gsap.to('.glitch-text', {
        x: '10px',
        duration: 0.05,
        repeat: 5,
        yoyo: true,
        ease: 'none'
      })
      gsap.to('.glitch-text', {
        y: '5px',
        duration: 0.05,
        repeat: 5,
        yoyo: true,
        ease: 'none',
        delay: 0.1
      })
    }
  })
  .to('.particles', {
    opacity: 1,
    duration: 1,
    stagger: 0.05
  })
  .to('.end-screen', {
    opacity: 0,
    scale: 0.8,
    rotation: -5,
    duration: 1,
    delay: 2,
    ease: 'power2.inOut'
  })
  .to('.credits', {
    opacity: 1,
    y: 0,
    scale: 1,
    duration: 1.5,
    ease: glitchEase,
    onComplete: () => {
      // Continuous subtle animation for credits
      gsap.to('.credits', {
        y: '5px',
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
      })
      // Start typewriter effect for note
      gsap.to('.note', {
        opacity: 1,
        duration: 0.1,
        onComplete: () => {
          const note = document.querySelector('.note') as HTMLElement
          if (note) {
            note.classList.add('typing')
            // Show menu button after typing animation
            setTimeout(() => {
              gsap.to('.menu-button', {
                opacity: 1,
                scale: 1,
                duration: 0.5,
                ease: glitchEase
              })
            }, 3000)
          }
        }
      })
    }
  })
})
</script>

<template>
  <div class="end-screen-container">
    <div class="terminal">
      <div class="scanline"></div>
      <div class="terminal-text">
        <div class="line"></div>
        <div class="line"></div>
        <div class="line"></div>
        <div class="line"></div>
        <div class="line"></div>
      </div>
    </div>
    <div class="particles">
      <div v-for="n in 30" :key="n" class="particle"></div>
    </div>
    <div class="end-screen">
      <h1 class="glitch-text">Thanks for completing our demo game</h1>
    </div>
    <div class="credits">
      <h2>By Eric and Jarvis</h2>
      <div class="note">-This project was only a demo. Pay to play the real game</div>
      <button class="menu-button hover:bg-green-500" @click="goToMenu">Go back to menu</button>
    </div>
  </div>
</template>

<style scoped>
.end-screen-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: radial-gradient(circle at center, #0a0a0a 0%, #000000 100%);
  color: #00ff00;
  font-family: 'Courier New', monospace;
  overflow: hidden;
  z-index: 1;
}

.terminal {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.9);
  z-index: 1;
  overflow: hidden;
}

.scanline {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 2px;
  background: rgba(0, 255, 0, 0.3);
  animation: scanline 8s linear infinite;
}

.terminal-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 80%;
  max-width: 600px;
}

.line {
  min-height: 1.5em;
  margin: 10px 0;
  opacity: 0;
  animation: typewriter 0.5s steps(40) forwards;
}

.line:nth-child(1) { animation-delay: 0.5s; }
.line:nth-child(2) { animation-delay: 1.5s; }
.line:nth-child(3) { animation-delay: 2.5s; }
.line:nth-child(4) { animation-delay: 3.5s; }
.line:nth-child(5) { animation-delay: 4.5s; }

@keyframes scanline {
  0% {
    top: 0;
  }
  100% {
    top: 100%;
  }
}

@keyframes typewriter {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.end-screen h1 {
  font-size: 3.5rem;
  text-align: center;
  margin: 0;
  padding: 1rem;
  text-shadow: 0 0 15px #00ff00;
  letter-spacing: 3px;
  transform-origin: center;
}

.credits h2 {
  font-size: 2.2rem;
  text-align: center;
  margin: 0;
  padding: 1rem;
  color: #00ff00;
  text-shadow: 0 0 12px #00ff00;
  letter-spacing: 2px;
}

.glitch-text {
  position: relative;
  animation: glitch 0.5s infinite;
}

.particles {
  position: absolute;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.particle {
  position: absolute;
  width: 3px;
  height: 3px;
  background: #00ff00;
  border-radius: 50%;
  animation: float 4s infinite;
  box-shadow: 0 0 10px #00ff00;
}

.particle:nth-child(odd) {
  animation-duration: 5s;
  width: 2px;
  height: 2px;
}

.particle:nth-child(even) {
  animation-duration: 6s;
  width: 4px;
  height: 4px;
}

@keyframes float {
  0% {
    transform: translateY(0) translateX(0) rotate(0deg);
    opacity: 0;
  }
  25% {
    opacity: 0.8;
  }
  50% {
    transform: translateY(-50vh) translateX(50px) rotate(180deg);
  }
  75% {
    opacity: 0.8;
  }
  100% {
    transform: translateY(-100vh) translateX(100px) rotate(360deg);
    opacity: 0;
  }
}

@keyframes glitch {
  0% {
    text-shadow: 3px 0 #00ff00, -3px 0 #ff0000;
    transform: skew(0deg);
  }
  25% {
    text-shadow: -3px 0 #00ff00, 3px 0 #ff0000;
    transform: skew(2deg);
  }
  50% {
    text-shadow: 3px 0 #00ff00, -3px 0 #ff0000;
    transform: skew(-2deg);
  }
  75% {
    text-shadow: -3px 0 #00ff00, 3px 0 #ff0000;
    transform: skew(1deg);
  }
  100% {
    text-shadow: 3px 0 #00ff00, -3px 0 #ff0000;
    transform: skew(0deg);
  }
}

.note {
  font-size: 1.2rem;
  color: #00ff00;
  margin-top: 1rem;
  text-align: center;
  opacity: 0;
  white-space: nowrap;
  overflow: hidden;
  border-right: 2px solid #00ff00;
}

.typing {
  animation: typing 3s steps(50, end),
             blink-caret 0.75s step-end infinite;
}

@keyframes typing {
  from { width: 0 }
  to { width: 100% }
}

@keyframes blink-caret {
  from, to { border-color: transparent }
  50% { border-color: #00ff00 }
}

.menu-button {
  margin-top: 2rem;
  padding: 1rem 2rem;
  font-size: 1.2rem;
  font-family: 'Courier New', monospace;
  background: transparent;
  border: 2px solid #00ff00;
  color: #00ff00;
  cursor: pointer;
  transition: all 0.3s ease;
  opacity: 0;
  transform: scale(0.8);
  position: relative;
  z-index: 1000;
}

.menu-button:hover {
  background: #00ff00;
  color: #000;
  box-shadow: 0 0 20px #00ff00;
  transform: scale(1.1);
  animation: buttonGlitch 0.3s infinite;
  cursor: pointer;
}

@keyframes buttonGlitch {
  0% {
    transform: scale(1.1) translate(0);
    text-shadow: 2px 0 #00ff00, -2px 0 #ff0000;
  }
  25% {
    transform: scale(1.1) translate(-2px, 2px);
    text-shadow: -2px 0 #00ff00, 2px 0 #ff0000;
  }
  50% {
    transform: scale(1.1) translate(2px, -2px);
    text-shadow: 2px 0 #00ff00, -2px 0 #ff0000;
  }
  75% {
    transform: scale(1.1) translate(-2px, -2px);
    text-shadow: -2px 0 #00ff00, 2px 0 #ff0000;
  }
  100% {
    transform: scale(1.1) translate(0);
    text-shadow: 2px 0 #00ff00, -2px 0 #ff0000;
  }
}

.credits {
  position: relative;
  z-index: 999;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}
</style>    