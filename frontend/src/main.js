import { createApp } from 'vue'
import Toast from "vue-toastification";

import './style.css'
import App from './App.vue'
import { store } from './store'
import route from './routers'
import "vue-toastification/dist/index.css";

const options = {
  transition: "Vue-Toastification__bounce",
  maxToasts: 20,
  newestOnTop: true
}

createApp(App)
  .use(route)
  .use(store)
  .use(Toast, options)
  .mount('#app')
