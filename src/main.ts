import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './style.css'
import   './styles/theme.css'
import App from './App.vue'
import router from "./router";
import { VueQueryPlugin, QueryClient } from "@tanstack/vue-query"
import { Toaster } from 'vue-sonner'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import 'primeicons/primeicons.css';
import * as fas from '@fortawesome/free-solid-svg-icons'
import * as far from '@fortawesome/free-regular-svg-icons'
import * as fab from '@fortawesome/free-brands-svg-icons'
const app = createApp(App)
const allIcons = { ...fas, ...far, ...fab }
Object.values(allIcons)
  .filter(i => i && typeof i === 'object' && 'iconName' in i)
  .forEach(icon => library.add(icon as any))
app.component('Toaster', Toaster)
const queryClient = new QueryClient()
app.use(createPinia())
app.use(VueQueryPlugin, { queryClient })
app.use(router)
app.component('FontAwesomeIcon', FontAwesomeIcon)
app.mount("#app")
