import { createRouter, createWebHistory } from 'vue-router'
import { supabase } from '../supabase.ts'
import HomeView from '../views/HomeView.vue'
import { useGameStore } from '@/stores/game'

// Add type declaration for import.meta.env
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

// Navigation guard
router.beforeEach(async (to, from, next) => {
  // Check if the route requires authentication
  if (to.matched.some(record => record.meta.requiresAuth)) {
    // Get the current session
    const { data: { session } } = await supabase.auth.getSession()
    
    if (!session) {
      // If no session, redirect to home/login page
      next({ name: 'home' })
    } else {
      // If session exists, allow access
      next()
    }
  } else {
    // If route doesn't require auth, allow access
    next()
  }
})

export default router
