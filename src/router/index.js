// Composables
import {
  createRouter,
  createWebHistory
} from 'vue-router'
import {
  useAppStore
} from '../store/app'

const routes = [{
  path: '',
  component: () => import('@/layouts/default/Default.vue'),
  children: [{
    path: 'chats',
    meta: {
      barBtns: [{
        icon: 'mdi-cog-outline',
        to: '/settings'
      }],
      index: true
    },
    component: () => import('@/views/Chats.vue')
  }, {
    path: 'prompts',
    meta: {
      barBtns: [{
        icon: 'mdi-account-plus-outline',
        to: '/setup'
      }],
      index: true
    },
    component: () => import('@/views/Prompts.vue')
  }, {
    path: 'discover',
    component: () => import('@/views/Discover.vue'),
    meta: {
      barBtns: [{
        icon: 'mdi-github',
        href: 'https://github.com/weekend-project-space/vwman-chat'
      }],
      index: true
    }
  }, {
    path: 'setup',
    component: () => import('@/views/sub/PromptsAdd.vue')
  }, {
    path: 'chats/:id',
    component: () => import('@/views/sub/Chats.vue')
  }, {
    path: 'prompts/:id',
    component: () => import('@/views/sub/Prompts.vue')
  }, {
    path: 'settings',
    component: () => import('@/views/sub/Setting.vue')
  }, {
    path: 'discover/:id',
    component: () => import('@/views/sub/Discover.vue')
  }]

}]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

router.beforeEach((to) => {
  const {
    setBarBtns
  } = useAppStore();
  if (to.meta.barBtns) {
    setBarBtns(to.meta.barBtns)
  } else {
    setBarBtns([{
      icon: 'mdi-cog-outline',
      to: '/settings'
    }])
  }
  return true
})

export default router
