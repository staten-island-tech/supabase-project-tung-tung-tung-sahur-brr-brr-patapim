<template>
  <div>
    <button @click="toggleEscapeMenu" class="corner-button">≡</button>
    <div v-if="isEscapeMenuOpen" class="escape-menu">
      <div class="menu-content">
        <button @click="leaveGame" class="leave-button">Leave Game</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const isEscapeMenuOpen = ref(false)

function toggleEscapeMenu() {
  isEscapeMenuOpen.value = !isEscapeMenuOpen.value
}

function leaveGame() {
  router.push({ name: 'menu' })
}

function handleKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') {
    toggleEscapeMenu()
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
})
</script>

<style scoped>
.escape-menu {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
}

.menu-content {
  background: linear-gradient(180deg, #0f1f0f, #101a10);
  padding: 2rem;
  border-radius: 16px;
  text-align: center;
}

.leave-button {
  background: transparent;
  border: 2px solid #00ff00;
  color: #00ff00;
  padding: 1rem 2rem;
  font-size: 1.2rem;
  cursor: pointer;
  font-family: monospace;
  transition: all 0.3s ease;
}

.leave-button:hover {
  background: #00ff00;
  color: #000;
}

.corner-button {
  position: fixed;
  top: 20px;
  right: 20px;
  background: transparent;
  border: 2px solid #00ff00;
  color: #00ff00;
  width: 40px;
  height: 40px;
  font-size: 24px;
  cursor: pointer;
  z-index: 1999;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.corner-button:hover {
  background: #00ff00;
  color: #000;
}
</style>
