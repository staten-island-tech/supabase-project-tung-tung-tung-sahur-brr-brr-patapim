import { createRouter, createWebHistory } from 'vue-router'

import HomeView from '../views/HomeView.vue'
import { useGameStore } from '@/stores/game'
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
    },
    {
      path: '/menu',
      name: 'menu',
      component: () => import('../components/GameUI.vue'),
    },
    {
      path:'/game',
      name: 'game',
      component: () => import('../components/Game/BoyRoom.vue'),
    }
  ],
})

export default router
