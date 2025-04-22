<template>
  <div>
    <p v-for="(log, index) in logs" :key="index">{{ log }}</p>
  </div>
</template>

<script lang="ts" setup>
import { defineProps } from 'vue'

defineProps<{
  logs: string[]
}>()
</script>
