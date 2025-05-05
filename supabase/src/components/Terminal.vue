<template>
  <div class="terminal">
    <BootSequence v-if="isBooting" @boot-complete="handleBootComplete" />
    <div v-else>
      <OutputLog :logs="logs" />
      <CommandLine
        v-if="!isSearching && !isCreatingUser && !isRequestingPassword"
        @command-entered="handleCommand"
      />
      <div v-else-if="isSearching" class="searching">
        Searching for existing user<span>{{ dots }}</span>
      </div>
      <div v-else-if="isCreatingUser" class="creating-user">
        Enter a email:
        <CommandLine @command-entered="handleEmailInput" />
      </div>
      <div v-else-if="isRequestingPassword" class="requesting-password">
        Enter a password:
        <CommandLine @command-entered="handlePasswordInput" :isPasswordMode="true" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import BootSequence from './BootSequence.vue'
import CommandLine from './CommandLine.vue'
import OutputLog from './OutputLog.vue'
import { supabase } from '../supabase.ts'

const isBooting = ref(true)
const isSearching = ref(false)
const isCreatingUser = ref(false)
const isRequestingPassword = ref(false)
const logs = ref<string[]>([])
const dots = ref('')
const loggedIn = ref(false)
const email_supabase = ref('')
const password_supabase = ref('')

const router = useRouter()

function handleBootComplete(): void {
  isBooting.value = false
  logs.value.push(`
    JARVIS LI OS
  `)
  logs.value.push('System ready. Type "help" for a list of commands.')
}

function handleCommand(command: string): void {
  logs.value.push(`> ${command}`)

  const commandMap: Record<string, () => void> = {
    'start-game': () => startSearch(),
    help: () => logs.value.push('Available commands: start-game, help, about, create-user'),
    about: () => logs.value.push('This is a terminal-based game interface.'),
    clear: () => logs.value.splice(0, logs.value.length),
    clr: () => logs.value.splice(0, logs.value.length),
    'create-user': () => startUserCreation(),
  }

  if (commandMap[command]) {
    commandMap[command]()
  } else {
    logs.value.push(`Unknown command: ${command}`)
  }
}

function startUserCreation(): void {
  isCreatingUser.value = true
}

function handleEmailInput(email: string): void {
  logs.value.push(`> ${email}`)

  if (email.trim()) {
    logs.value.push(`Email "${email}" accepted. Please enter a password.`)
    isCreatingUser.value = false
    isRequestingPassword.value = true
    email_supabase.value = email.trim()
  } else {
    logs.value.push('Empty email. Please try again.')
  }

}

function handlePasswordInput(password: string): void {
  logs.value.push(`> ${'*'.repeat(password.length)}`)

  if (password.trim()) {
    logs.value.push('Password set successfully.')
    isRequestingPassword.value = false
    password_supabase.value = password.trim()
  } else {
    logs.value.push('Empty password. Please try again.')
  }

  handleAuth()
}


function clearTerminal(): void {
  logs.value.splice(0, logs.value.length)
}
function startSearch(): void {
  isSearching.value = true
  let dotCount = 0

  const interval = setInterval(() => {
    dotCount = (dotCount + 1) % 4
    dots.value = '.'.repeat(dotCount)
  }, 500)

  setTimeout(() => {
    clearInterval(interval)
    isSearching.value = false
    logs.value.push('NO LOGGED IN USER FOUND! PLEASE LOGIN')
  }, 3000)
}

function checkUserAuthentication(): boolean {
  if (loggedIn.value) {
    return true
  } else {
    return false
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

.searching {
  font-family: monospace;
  color: lime;
  margin-top: 10px;
}

.creating-user {
  font-family: monospace;
  color: lime;
  margin-top: 10px;
}

.requesting-password {
  font-family: monospace;
  color: lime;
  margin-top: 10px;
}
</style>
