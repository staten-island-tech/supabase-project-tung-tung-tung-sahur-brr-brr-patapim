<template>
  <div>
    <div v-for="(log, index) in logs" :key="index">
      <pre v-if="log.includes('\n')">{{ log }}</pre>
      <p v-else>{{ log }}</p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { defineProps } from 'vue'

defineProps<{
  logs: string[]
}>()
</script>
