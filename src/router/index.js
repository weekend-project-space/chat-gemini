// Composables
import {
  createRouter,
  createWebHistory
} from 'vue-router'

const routes = [{
  path: '',
  component: () => import('@/layouts/default/Default.vue'),
  redirect: '/chats',
  children: [{
    path: 'chats',
    component: () => import('@/views/Chats.vue'),
    children: [{
      path: ':id',
      props: true,
      component: () => import('@/views/sub/Chat.vue')
    }]
  }, {
    path: 'prompts',
    component: () => import('@/views/Prompts.vue'),
    children: [{
      path: 'setup',
      component: () => import('@/views/sub/PromptsAdd.vue')
    }, {
      path: ':id',
      props: true,
      component: () => import('@/views/sub/Prompts.vue')
    }, ]
  }, {
    path: 'discover',
    component: () => import('@/views/Discover.vue'),
    children: [{
      path: ':id',
      component: () => import('@/views/sub/Discover.vue')
    }]
  }, {
    path: 'settings',
    component: () => import('@/views/Settings.vue'),
    children: [{
        path: '',
        component: () => import('@/views/sub/Setting.vue')
      }

    ]
  }]
}]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})



export default router
