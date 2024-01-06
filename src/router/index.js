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
        icon: 'mdi-plus',
        to: '/setup'
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
      index: true
    }
  }, {
    path: '/setup',
    component: () => import('@/views/ContactsPlus.vue')
  }, {
    path: '/chat',
    component: () => import('@/views/store/Chats.vue')
  }, {
    path: '/contact',
    component: () => import('@/views/sub/Contact.vue')
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
  }
  return true
})

export default router
