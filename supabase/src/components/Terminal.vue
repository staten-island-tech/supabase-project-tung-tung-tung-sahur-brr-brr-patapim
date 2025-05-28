<template>
  <div class="terminal">
    <BootSequence v-if="isBooting" @boot-complete="handleBootComplete" />
    <div v-else>
      <OutputLog :logs="logs" />
      <CommandLine
        v-if="!isSearching && !isAssigningUser && !isRequestingPassword"
        @command-entered="handleCommand"
      />
      <div v-else-if="isSearching" class="searching">
        Searching for existing user<span>{{ dots }}</span>
      </div>
      <div v-else-if="isAssigningUser" class="input-user">
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
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import BootSequence from './BootSequence.vue'
import CommandLine from './CommandLine.vue'
import OutputLog from './OutputLog.vue'
import { supabase } from '../supabase.ts'

const isBooting = ref<boolean>(true)
const isSearching = ref<boolean>(false)
const isAssigningUser = ref<boolean>(false)
const isRequestingPassword = ref<boolean>(false)
const isLoggingIn = ref<boolean>(false)
const logs = ref<string[]>([])
const dots = ref<string>('')
const loggedIn = ref<boolean>(false)
const email_supabase = ref<string>('')
const password_supabase = ref<string>('')
const emailExists = ref<boolean>(false)

const router = useRouter()

function handleBootComplete(): void {
  isBooting.value = false
  logs.value.push(`
    JARVIS LI OS
  `)
  logs.value.push(
    'System ready. Type "help" for a list of commands. Press "esc" to cancel any command.',
  )
}

function handleCommand(command: string): void {
  logs.value.push(`> ${command}`)

  const commandMap: Record<string, () => void> = {
    'start-game': () => startSearch(),
    help: () =>
      logs.value.push('Available commands: start-game, help, about, create-user, login-user'),
    about: () => logs.value.push('This is a terminal-based game interface.'),
    clear: () => logs.value.splice(0, logs.value.length),
    clr: () => logs.value.splice(0, logs.value.length),
    'create-user': () => startUserAssignment(),
    'login-user': () => startUserLogin(),
  }

  if (commandMap[command]) {
    commandMap[command]()
  } else {
    logs.value.push(`Unknown command: ${command}`)
  }
}

function startUserAssignment(): void {
  isAssigningUser.value = true
}

function startUserLogin(): void {
  startUserAssignment()
  isLoggingIn.value = true
}

async function handleEmailInput(email: string): Promise<void> {
  logs.value.push(`> ${email}`)

  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  if (re.test(email.toLowerCase()) == true) {
    email_supabase.value = email.trim()

    await checkIfEmailExists()

    if (!emailExists.value) {
      logs.value.push(`Email "${email}" accepted. Please enter a password.`)
      isAssigningUser.value = false
      isRequestingPassword.value = true
    } else {
      logs.value.push('Email already exists. Please try again.')
      email_supabase.value = ''
      emailExists.value = false
      return
    }
  } else {
    logs.value.push(`Invalid email format. Please try again.`)
    return
  }
}

function handlePasswordInput(password: string): void {
  logs.value.push(`> ${'*'.repeat(password.length)}`)

  if (password.length >= 6) {
    logs.value.push('Password entered successfully.')
    isRequestingPassword.value = false
    password_supabase.value = password.trim()
  } else {
    logs.value.push('Password must be of length 6 or greater. Please try again.')
    return
  }

  handleAuth()
}

const handleAuth = async () => {
  try {
    const { error } = isLoggingIn.value
      ? await supabase.auth.signInWithPassword({
          email: email_supabase.value,
          password: password_supabase.value,
        })
      : await supabase.auth.signUp({
          email: email_supabase.value,
          password: password_supabase.value,
        })

    if (error) throw error

    if (isLoggingIn.value) {
      logs.value.push('Login successful.')
    } else {
      logs.value.push('Signup successful.')
      logs.value.push('Account Created!') // Terminal log
      console.log('Added to supabase') // Console log
    }

    isLoggingIn.value = false
    loggedIn.value = true
  } catch (error) {
    if (error instanceof Error) {
      console.log(error)
      logs.value.push(`${error.message}. Please try again.`)
    }
  }
}

const checkIfEmailExists = async () => {
  const { data, error } = await supabase
    .from('user_emails')
    .select('id')
    .ilike('email', email_supabase.value)

  if (error) {
    console.error('Error checking email:', error)
    return
  }

  if (data.length > 0) {
    emailExists.value = true
  }
}

function clearTerminal(): void {
  logs.value.splice(0, logs.value.length)
}

function startSearch(): void {
  router.push({ name: 'game' })
  //temporarily disabled the search to test rerouting to the startgame page 05/24 Eric Chen
  // isSearching.value = true
  // let dotCount = 0
  // const interval = setInterval(() => {
  //   dotCount = (dotCount + 1) % 4
  //   dots.value = '.'.repeat(dotCount)
  // }, 500)
  // setTimeout(() => {
  //   clearInterval(interval)
  //   isSearching.value = false
  //   logs.value.push('NO LOGGED IN USER FOUND! PLEASE LOGIN')
  // }, 3000)
}

function checkUserAuthentication(): boolean {
  if (loggedIn.value) {
    return true
  } else {
    return false
  }
}

function handleKeydown(event: KeyboardEvent): void {
  const key = event.key.toLowerCase()

  if (key === 'escape') {
    if (isAssigningUser.value || isRequestingPassword.value) {
      logs.value.push('Operation cancelled.')
      isAssigningUser.value = false
      isRequestingPassword.value = false
      email_supabase.value = ''
      password_supabase.value = ''
    }
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeydown)
})
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

.input-user {
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
