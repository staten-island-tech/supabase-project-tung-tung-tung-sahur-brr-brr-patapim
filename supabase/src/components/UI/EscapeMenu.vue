<template>
  <div class="h-full w-full">
    <div class="escape-menu" style="margin-top: 50px; margin-left: 50px">
      <button @click="toggleEscapeMenu"><i class="pi pi-bars"></i></button>
      <div v-if="isEscapeMenuOpen" class="menu-content">
        <ul class="flex flex-row space-x-4">
          <li><a href="#">Home</a></li>
          <li><a href="#">About</a></li>
          <li><a href="#">Contact</a></li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const isEscapeMenuOpen = ref(false)

function toggleEscapeMenu() {
  isEscapeMenuOpen.value = !isEscapeMenuOpen.value
}

function handleKeydown(event) {
  if (event.key === 'Escape') {
    isEscapeMenuOpen.value = !isEscapeMenuOpen.value
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
})
</script>
