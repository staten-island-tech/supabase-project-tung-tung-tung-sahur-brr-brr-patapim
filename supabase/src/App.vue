<script setup lang="js">
import { RouterLink, RouterView } from 'vue-router'
import Terminal from './components/Terminal.vue'
import GameUI from './components/GameUI.vue'
import ReusableModal from './components/UI/ReusableModal.vue'
import { onMounted, ref } from 'vue'
import { supabase } from './supabase.ts'
</script>

<template>
  <RouterView/>
</template>
