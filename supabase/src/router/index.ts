import { createRouter, createWebHistory } from 'vue-router'
import { supabase } from '../supabase.ts'
import HomeView from '../views/HomeView.vue'
import { useGameStore } from '@/stores/game'

declare global {
  interface ImportMeta {
    env: {
      BASE_URL: string
    }
  }
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../components/Terminal.vue'),
    },
    {
      path: '/name',
      name: 'name',
      component: () => import('../components/EnterName.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/menu',
      name: 'menu',
      component: () => import('../components/GameUI.vue'),
      meta: { requiresAuth: true }
    },
    {
      path:'/game',
      name: 'game',
      component: () => import('../components/Game/BoyRoom.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/end',
      name: 'end',
      component: () => import('../components/UI/EndScreen.vue'),
      meta: { requiresAuth: true }
    }
  ],
})

router.beforeEach(async (to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      next({ name: 'home' })
      return
    }
    const gameStore = useGameStore()
    await gameStore.fetchUser()
    await gameStore.fetchMapData()
    if (!gameStore.username && to.name !== 'name' && to.name !== 'menu' ) {
      next({ name: 'name' })
      return
    }
    if (gameStore.username && to.name === 'name') {
      next({ name: 'game' })
      return
    }
    next()
  } else {
    next()
  }
})

export default router
