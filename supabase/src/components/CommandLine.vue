<template>
  <div>
    <span>> </span>
    <input v-model="command" @keyup.enter="submitCommand" class="command-input" autofocus />
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { defineEmits } from 'vue'

const command = ref<string>('')
const emit = defineEmits<{
  (event: 'command-entered', command: string): void
}>()

function submitCommand(): void {
  if (command.value.trim() !== '') {
    emit('command-entered', command.value.trim())
    command.value = ''
  }
}
</script>

<style>
.command-input {
  background: black;
  color: green;
  border: none;
  outline: none;
  font-family: monospace;
  width: 90%;
}
</style>
