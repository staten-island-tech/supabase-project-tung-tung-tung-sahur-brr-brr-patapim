<template>
  <div>
    Test
  </div>
  <div>
    <RouterView/>
  </div>
</template>

<script lang="ts" setup>
import { RouterView } from 'vue-router';

// fetch user load profile at the start of game
import { useGameStore } from '@/stores/game.ts';
import { onMounted } from 'vue';
const gameFuncs = useGameStore()


onMounted(async () => {
  await gameFuncs.fetchUser()
})

</script>
