import { createRouter, createWebHistory } from 'vue-router'
//import HomeView from '../views/HomeView.vue'
import RegisterComponent from '../components/RegisterComponent.vue'
import HomeComponent from '../components/HomeComponent.vue'
import AddContactComponent from '../components/AddContactComponent.vue'
import ChatComponent from '../components/ChatComponent.vue'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/register',
      name: 'RegisterComponent',
      component: RegisterComponent
    },
    {
      path: '/',
      name: 'HomeComponent',
      component: HomeComponent
    },
    {
      path: '/contacts/add',
      name: 'AddContactComponent',
      component: AddContactComponent
    },
    {
      path: '/chat/:email',
      name: 'ChatComponent',
      component: ChatComponent
    },
    {
      path: '/login',
      name: 'LoginComponent',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../components/LoginComponent.vue')
    }
  ]
})

export default router
