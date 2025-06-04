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
      path: '/about',
      name: 'about',
      component: () => import('../components/MainPage.vue'),
    },
    {
      path: '/game',
      name: 'game',
      component: () => import('../components/GameUI.vue'),
    },
  ],
})

export default router
