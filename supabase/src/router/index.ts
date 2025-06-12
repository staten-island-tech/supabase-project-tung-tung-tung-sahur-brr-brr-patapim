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
      component: () => import('../components/TestComponent.vue'),
      children: [
      {
        path: 'test1', // becomes /game/placeholdernames
        name: 'test1',
        component: () => import('../components/Test1.vue'),
      },
    // You can add more child routes here
  ],
    }
  ],
})

export default router
