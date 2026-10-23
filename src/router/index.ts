import { createRouter, createWebHistory } from 'vue-router'
import { useSession } from '../composables/useSession'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/login', name: 'login', component: () => import('../views/LoginView.vue') },
    { path: '/', redirect: '/customers' },
    {
      path: '/customers',
      name: 'customers',
      component: () => import('../views/CustomerListView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/pending',
      name: 'pending-list',
      component: () => import('../views/PendingListView.vue'),
      meta: { requiresAuth: true, requiresManager: true },
    },
    {
      path: '/pending/:id',
      name: 'pending-detail',
      component: () => import('../views/PendingApprovalDetail.vue'),
      props: true,
      meta: { requiresAuth: true, requiresManager: true },
    },
    {
      path: '/my-requests',
      name: 'my-requests',
      component: () => import('../views/MyRequestsView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/requests/new',
      name: 'request-new',
      component: () => import('../views/SubmitRequestView.vue'),
      meta: { requiresAuth: true },
    },
  ],
})

router.beforeEach((to) => {
  const { isLoggedIn, isManager } = useSession()
  if (to.meta.requiresAuth && !isLoggedIn.value) return { name: 'login' }
  if (to.name === 'login' && isLoggedIn.value) return { name: 'customers' }
  if (to.meta.requiresManager && !isManager.value) return { name: 'customers' }
})

export default router
