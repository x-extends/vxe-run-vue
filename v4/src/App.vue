<template>
  <div class="page-layout">
    <Header>
      <template #default>
        <vxe-form v-bind="formOptions"></vxe-form>
      </template>
    </Header>
    <div class="page-body">
      <Repl
        ref="replRef"
        :theme="theme"
        :editor="Monaco"
        @keydown.ctrl.s.prevent
        @keydown.meta.s.prevent
        :ssr="useSSRMode"
        :model-value="autoSave"
        :editorOptions="{ autoSaveText: false }"
        :store="store"
        :showCompileOutput="true"
        :showSsrOutput="useSSRMode"
        :showOpenSourceMap="true"
        :autoResize="true"
        :clearConsole="false"
        :preview-options="previewOptions"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue'
import { Repl, useStore, SFCOptions, useVueImportMap, mergeImportMap } from '@vue/repl'
import { useUIStore } from './common/ui'
import { useTableStore } from './common/table'
import { useGanttStore } from './common/gantt'
import { useDesignStore } from './common/design'
import { VxeUI } from 'vxe-pc-ui'
import Monaco from '@vue/repl/monaco-editor'
import Header from './Header.vue'
import XEUtils from 'xe-utils'

const createVxeVersionEvent = (name: string) => {
  return {
    change (_itemParams, eventParams) {
      const { value } = eventParams
      store.setImportMap({
        imports: {
          [name]: `${import.meta.env.VITE_APP_CDN_URL}${name}@${value}/dist/all.esm.js`
        }
      }, true)
    }
  }
}

const { uiVersionList, uiRender } = useUIStore(createVxeVersionEvent('vxe-pc-ui'))
const { tableVersionList, tableRender } = useTableStore(createVxeVersionEvent('vxe-table'))
const { ganttVersionList, ganttRender } = useGanttStore(createVxeVersionEvent('vxe-gantt'))
const { designVersionList, designRender } = useDesignStore(createVxeVersionEvent('vxe-design'))

const formOptions = reactive({
  data: {
    selectDesignVersion: designVersionList[0],
    selectGanttVersion: ganttVersionList[0],
    selectTableVersion: tableVersionList[0],
    selectUIVersion: uiVersionList[0]
  },
  items: [
    { field: 'selectUIVersion', title: 'vxe-pc-ui', itemRender: uiRender },
    { field: 'selectTableVersion', title: 'vxe-table', itemRender: tableRender },
    { field: 'selectGanttVersion', title: 'vxe-gantt', itemRender: ganttRender },
    { field: 'selectDesignVersion', title: 'vxe-design', itemRender: designRender }
  ]
})

const useSSRMode = ref(false)
const autoSave = ref(false)

const { productionMode, vueVersion, importMap } = useVueImportMap({
  runtimeDev: import.meta.env.PROD
    ? `${import.meta.env.VITE_APP_CDN_URL}vue@3.5.16/dist/vue.runtime.esm-browser.js`
    : `${location.origin}${import.meta.env.VITE_APP_BASE_PATH}/src/vue-dev-proxy`,
  runtimeProd: import.meta.env.PROD
    ? `${import.meta.env.VITE_APP_CDN_URL}vue@3.5.16/dist/vue.runtime.esm-browser.prod.js`
    : `${location.origin}${import.meta.env.VITE_APP_BASE_PATH}/src/vue-dev-proxy-prod`,
  serverRenderer: import.meta.env.PROD
    ? `${location.origin}/server-renderer.esm-browser.js`
    : `${location.origin}/src/vue-server-renderer-dev-proxy`
})

const sfcOptions = computed(
  (): SFCOptions => ({
    script: {
      inlineTemplate: productionMode.value,
      isProd: productionMode.value,
      propsDestructure: true
    },
    style: {
      isProd: productionMode.value
    },
    template: {
      isProd: productionMode.value,
      compilerOptions: {
        isCustomElement: (tag: string) =>
          tag === 'mjx-container' || tag.startsWith('custom-')
      }
    }
  })
)

const builtinImportMap = computed(() => mergeImportMap(importMap.value, {
  imports: {
    'xe-utils': `${import.meta.env.VITE_APP_CDN_URL}xe-utils@4.0.8/dist/all.esm.js`,
    'dom-zindex': `${import.meta.env.VITE_APP_CDN_URL}dom-zindex@1.0.6/dist/all.esm.js`,
    '@vxe-ui/core': `${import.meta.env.VITE_APP_CDN_URL}@vxe-ui/core@4.4.12/dist/all.esm.js`,
    'vxe-pc-ui': `${import.meta.env.VITE_APP_CDN_URL}vxe-pc-ui@4.14.21/dist/all.esm.js`,
    'vxe-table': `${import.meta.env.VITE_APP_CDN_URL}vxe-table@4.19.1/dist/all.esm.js`,
    'vxe-design': `${import.meta.env.VITE_APP_CDN_URL}vxe-design@4.1.4/dist/all.esm.js`,
    'vxe-gantt': `${import.meta.env.VITE_APP_CDN_URL}vxe-gantt@4.4.5/dist/all.esm.js`,
    axios: `${import.meta.env.VITE_APP_CDN_URL}axios@1.7.2/esm/axios.min.js`
  }
}))

const hash = location.hash.slice(1)
const store = useStore(
  {
    builtinImportMap,
    vueVersion,
    sfcOptions
  },
  hash
)

const theme = ref<'dark' | 'light'>('light')
// function toggleTheme(isDark: boolean) {
//   theme.value = isDark ? 'dark' : 'light'
// }

const isVaporSupported = ref(false)
const previewOptions = computed(() => ({
  headHTML: '<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/vxe-pc-ui@4.13.21/lib/style.min.css">',
  customCode: {
    importCode: `import { initCustomFormatter${isVaporSupported.value ? ', vaporInteropPlugin' : ''} } from 'vue'
    import VxeUI from 'vxe-pc-ui'`,
    useCode: `
      app.use(VxeUI)
      ${isVaporSupported.value ? 'app.use(vaporInteropPlugin)' : ''}
      if (window.devtoolsFormatters) {
        const index = window.devtoolsFormatters.findIndex((v) => v.__vue_custom_formatter)
        window.devtoolsFormatters.splice(index, 1)
        initCustomFormatter()
      } else {
        initCustomFormatter()
      }`
  }
}))

const parseFileInfo = (path: string) => {
  const [, filePath, fileType] = path.match(/(.*)\.(vue|js|jsx|ts|tsx)$/) || [path, '', 'vue']
  const name = filePath.split('/').slice(-1)
  return {
    path: filePath,
    name: name,
    fullName: `${name}.${fileType}`,
    type: fileType
  }
}

// 初始化代码
store.setFiles({
  'App.vue': '<template></template>'
})

/**
 * fiels=TestA.vue@url,TestB.vue@url
 */
const { searchQuery } = XEUtils.parseUrl(location.href)
if (searchQuery.files) {
  VxeUI.loading.open()
  const filesList: string[] = searchQuery.files.split(',')
  const newFiles = {}
  let mainFile = ''
  Promise.all(
    filesList.map((item: string) => {
      const rest = atob(item).split('@')
      let fileName = decodeURIComponent(rest[0] || '')
      const fileUrl = decodeURIComponent(rest[1] || '')
      const fileInfo = parseFileInfo(fileUrl)
      if (!fileName) {
        fileName = fileInfo.fullName
      }
      if (!mainFile) {
        mainFile = fileName
      }
      newFiles[fileName] = ''
      return fetch(`${fileUrl}?v=${import.meta.env.VITE_APP_DATE_NOW}`).then(res => res.text()).then(text => {
        newFiles[fileName] = text
      }).catch(() => {
      })
    })
  ).then(() => {
    // 初始化代码
    store.setFiles(newFiles, mainFile)
    VxeUI.loading.close()
  })
}
</script>
