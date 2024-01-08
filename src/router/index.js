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
    path: '/chats',
    meta: {
      barBtns: [{
        icon: 'mdi-cog-outline',
        to: '/settings'
      }],
      index: true
    },
    component: import('@/views/Chats.vue')
  }, {
    path: '/contacts',
    meta: {
      barBtns: [{
        icon: 'mdi-account-plus-outline',
        to: '/setup'
      }],
      index: true
    },
    component: () => import('@/views/Contacts.vue')
  }, {
    path: '/discover',
    component: () => import('@/views/Discover.vue'),
    meta: {
      barBtns: [{
        icon: 'mdi-github',
        to: '/setup'
      }],
      index: true
    }
  }, {
    path: '/setup',
    component: () => import('@/views/sub/ContactsPlus.vue')
  }, {
    path: '/chats/:id',
    component: () => import('@/views/sub/Chats.vue')
  }, {
    path: '/contacts/:id',
    component: () => import('@/views/sub/Contact.vue')
  }, {
    path: '/settings',
    component: () => import('@/views/sub/Setting.vue')
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
