<template>
  <div>
    <span>> </span>
    <input
      v-model="displayValue"
      @input="handleInput"
      @keyup.enter="submitCommand"
      class="command-input"
      :type="isPasswordMode ? 'password' : 'text'"
      autofocus
    />
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'
import { defineProps, defineEmits } from 'vue'

const props = defineProps<{
  isPasswordMode?: boolean
}>()

const command = ref<string>('')
const displayValue = ref<string>('')

const emit = defineEmits<{
  (event: 'command-entered', command: string): void
}>()

watch(command, (newCommand) => {
  if (props.isPasswordMode) {
    displayValue.value = '*'.repeat(newCommand.length)
  } else {
    displayValue.value = newCommand
  }
})

function handleInput(event: Event): void {
  const input = event.target as HTMLInputElement
  command.value = input.value
}

function submitCommand(): void {
  if (command.value.trim() !== '') {
    emit('command-entered', command.value.trim())
    command.value = ''
    displayValue.value = ''
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
