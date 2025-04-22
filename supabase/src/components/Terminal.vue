<template>
  <div class="terminal">
    <BootSequence v-if="isBooting" @boot-complete="handleBootComplete" />
    <div v-else>
      <OutputLog :logs="logs" />
      <CommandLine @command-entered="handleCommand" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import BootSequence from './BootSequence.vue'
import CommandLine from './CommandLine.vue'
import OutputLog from './OutputLog.vue'

const isBooting = ref(true)
const logs = ref<string[]>([])

function handleBootComplete(): void {
  isBooting.value = false
  logs.value.push('System ready. Type "help" for a list of commands.')
}

function handleCommand(command: string): void {
  logs.value.push(`> ${command}`)
  if (command === 'start') {
    logs.value.push('Starting the game...')
  } else if (command === 'help') {
    logs.value.push('Available commands: start, help')
  } else {
    logs.value.push(`Unknown command: ${command}`)
  }
}
</script>

<style>
.terminal {
  background-color: black;
  color: lime;
  font-family: monospace;
  padding: 20px;
  height: 100vh;
  overflow-y: auto;
}
</style>
