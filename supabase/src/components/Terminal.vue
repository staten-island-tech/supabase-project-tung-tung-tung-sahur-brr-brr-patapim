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
  logs.value.push(`
 __   __     ______     __    __     ______
/\\ "-.\\ \\   /\\  __ \\   /\\ "-./  \\   /\\  ___\\
\\ \\ \\-.  \\  \\ \\  __ \\  \\ \\ \\-./\\ \\  \\ \\  __\\
 \\ \\_\\"\\_\\  \\ \\_\\ \\_\\  \\ \\_\\ \\ \\_\\  \\ \\_____\\
  \\/_/ \\/_/   \\/_/\\/_/   \\/_/  \\/_/   \\/_____/

  `)
  logs.value.push('System ready. Type "help" for a list of commands.')
}
function handleCommand(command: string): void {
  logs.value.push(`> ${command}`)

  // Define a command map
  const commandMap: Record<string, () => void> = {
    start: () => logs.value.push('Starting the game...'),
    help: () => logs.value.push('Available commands: start, help, about'),
    about: () => logs.value.push('This is a terminal-based game interface.'),
    clear: () => logs.value.splice(0, logs.value.length),
  }

  // Execute the command if it exists in the map
  if (commandMap[command]) {
    commandMap[command]()
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
