import { createApp } from 'vue'
import './styles/index.scss'
import App from './App.vue'

import VxeUIBase from 'vxe-pc-ui'
import 'vxe-pc-ui/es/style.css'

// @ts-expect-error Custom window property
window.VUE_DEVTOOLS_CONFIG = {
  defaultSelectedAppId: 'repl'
}

createApp(App).use(VxeUIBase).mount('#app')
