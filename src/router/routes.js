import loadRoutes from './loader'

const routesNotRequiresAuth = ['login', 'items', 'items/create']

const pages = loadRoutes().map(route => ({
  ...route,
  meta: {
    requiresAuth: !routesNotRequiresAuth.includes(route.name)
  }
}))

const routes = [
  {
    path: '/',
    component: () => import('components/Layouts/LayoutMain.vue'),
    children: [
      {
        path: '',
        name: 'home',
        component: () => import('pages/_home.vue')
      },
      {
        path: '/clients/:id/payments',
        name: 'clientPayments',
        component: () => import('pages/clients/_payments.vue'),
        meta: {
          requiresAuth: true
        }
      },
      {
        path: '/clients/:id/payment',
        name: 'clientPayment',
        component: () => import('pages/clients/_payment.vue'),
        meta: {
          requiresAuth: true
        }
      },
      {
        path: '/clients/:id/purchases',
        name: 'clientPurchases',
        component: () => import('pages/clients/_purchases.vue'),
        meta: {
          requiresAuth: true
        }
      },
      {
        path: '/clients/:id/purchases/:purchaseId',
        name: 'clientPurchase',
        component: () => import('pages/clients/_purchase.vue'),
        meta: {
          requiresAuth: true
        }
      },
      ...pages
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/_error404.vue')
  }
]

export default routes
