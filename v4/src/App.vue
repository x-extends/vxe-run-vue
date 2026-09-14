<template>
  <div class="page-layout">
    <Header>
      <template #middle>
        <vxe-button status="primary" icon="vxe-icon-flow-branch" :loading="forkLoading" @click="forkEvent">Fork</vxe-button>
        <vxe-button v-if="playgroundObj && playgroundObj.privilege" status="success" icon="vxe-icon-save" :loading="saveLoading" @click="saveEvent">Save</vxe-button>
        <vxe-button v-if="playgroundObj && searchQuery.k" icon="vxe-icon-copy" @click="copyUrlEvent">Copy URL</vxe-button>
        <vxe-link v-if="showeNewWinBtn" icon="vxe-icon-send" style="margin-left: 12px;" @click="openUrlEvent">新窗口打开</vxe-link>
      </template>
      <template #right>
        <vxe-form v-bind="formOptions"></vxe-form>
      </template>
    </Header>
    <div class="page-body">
      <Repl
        ref="replRef"
        :theme="theme"
        :editor="Monaco" :ssr="useSSRMode"
        :model-value="autoSave"
        :editor-options="{ autoSaveText: false }"
        :store="store"
        :show-compile-output="true"
        :show-ssr-output="useSSRMode"
        :show-open-source-map="true"
        :auto-resize="true"
        :clear-console="false"
        :preview-options="previewOptions"
        @keydown.ctrl.s.prevent
        @keydown.meta.s.prevent
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue'
import { Repl, useStore, SFCOptions, useVueImportMap, mergeImportMap } from '@vue/repl'
import { useUtilsStore } from './common/utils'
import { useVueStore } from './common/vue'
import { useVxeCoreStore } from './common/vxeCore'
import { useUIStore } from './common/ui'
import { useTableStore } from './common/table'
import { useGanttStore } from './common/gantt'
import { useDesignStore } from './common/design'
import { VxeUI } from 'vxe-pc-ui'
import Monaco from '@vue/repl/monaco-editor'
import Header from './Header.vue'
import XEUtils from 'xe-utils'

interface PlaygroundVO {
  key: string
  name: string
  content: string
  privilege: boolean
  utilsVersion: string
  vueVersion: string
  coreVersion: string
  uiVersion: string
  tableVersion: string
  ganttVersion: string
  designVersion: string
}

const showeNewWinBtn = ref(self !== top)

const playgroundObj = ref<PlaygroundVO | null>(null)

const setEsmUrl = (name: string, version: string) => {
  if (!name || !version) {
    return
  }
  let esmUrl: string
  if (name === 'vue') {
    esmUrl = `${import.meta.env.VITE_APP_CDN_URL}${name}@${version}/dist/vue.runtime.esm-browser.prod.js`
  } else {
    esmUrl = `${import.meta.env.VITE_APP_CDN_URL}${name}@${version}/dist/all.esm.js`
  }
  store.setImportMap({
    imports: {
      [name]: esmUrl
    }
  }, true)
}

const createVxeVersionEvent = (name: string) => {
  return {
    change (_itemParams, eventParams) {
      const { value } = eventParams
      setEsmUrl(name, value)
    }
  }
}

const { utilsStableVersion } = useUtilsStore()
const { vueStableVersion, vueRender } = useVueStore(createVxeVersionEvent('vue'))
const { vxeCoreStableVersion } = useVxeCoreStore()
const { uiStableVersion, uiRender } = useUIStore(createVxeVersionEvent('vxe-pc-ui'))
const { tableStableVersion, tableRender } = useTableStore(createVxeVersionEvent('vxe-table'))
const { ganttStableVersion, ganttRender } = useGanttStore(createVxeVersionEvent('vxe-gantt'))
const { designStableVersion } = useDesignStore(createVxeVersionEvent('vxe-design'))

const forkLoading = ref(false)
const saveLoading = ref(false)

const formOptions = reactive({
  data: {
    selectUtilsVersion: utilsStableVersion,
    selectVueVersion: vueStableVersion,
    selectCoreVersion: vxeCoreStableVersion,
    selectUIVersion: uiStableVersion,
    selectTableVersion: tableStableVersion,
    selectGanttVersion: ganttStableVersion,
    selectDesignVersion: designStableVersion
  },
  items: [
    { field: 'selectVueVersion', title: 'vue', itemRender: vueRender },
    { field: 'selectUIVersion', title: 'vxe-pc-ui', itemRender: uiRender },
    { field: 'selectTableVersion', title: 'vxe-table', itemRender: tableRender },
    { field: 'selectGanttVersion', title: 'vxe-gantt', itemRender: ganttRender }
    // { field: 'selectDesignVersion', title: 'vxe-design', itemRender: designRender }
  ]
})

const useSSRMode = ref(false)
const autoSave = ref(true)

const { productionMode, vueVersion, importMap } = useVueImportMap({
  runtimeDev: import.meta.env.PROD
    ? `${import.meta.env.VITE_APP_CDN_URL}vue@${vueStableVersion}/dist/vue.runtime.esm-browser.js`
    : `${location.origin}${import.meta.env.VITE_APP_BASE_PATH}/src/vue-dev-proxy`,
  runtimeProd: import.meta.env.PROD
    ? `${import.meta.env.VITE_APP_CDN_URL}vue@${vueStableVersion}/dist/vue.runtime.esm-browser.prod.js`
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
    'xe-utils': `${import.meta.env.VITE_APP_CDN_URL}xe-utils@${formOptions.data.selectUtilsVersion}/dist/all.esm.js`,
    'dom-zindex': `${import.meta.env.VITE_APP_CDN_URL}dom-zindex@1.0.6/dist/all.esm.js`,
    '@vxe-ui/core': `${import.meta.env.VITE_APP_CDN_URL}@vxe-ui/core@${formOptions.data.selectCoreVersion}/dist/all.esm.js`,
    'vxe-pc-ui': `${import.meta.env.VITE_APP_CDN_URL}vxe-pc-ui@${formOptions.data.selectUIVersion}/dist/all.esm.js`,
    'vxe-table': `${import.meta.env.VITE_APP_CDN_URL}vxe-table@${formOptions.data.selectTableVersion}/dist/all.esm.js`,
    'vxe-design': `${import.meta.env.VITE_APP_CDN_URL}vxe-design@${formOptions.data.selectDesignVersion}/dist/all.esm.js`,
    'vxe-gantt': `${import.meta.env.VITE_APP_CDN_URL}vxe-gantt@${formOptions.data.selectGanttVersion}/dist/all.esm.js`,
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
  headHTML: `
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/vxe-pc-ui@${formOptions.data.selectUIVersion}/lib/style.min.css">
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/vxe-table@${formOptions.data.selectTableVersion}/lib/style.min.css">
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/vxe-design@${formOptions.data.selectDesignVersion}/lib/style.min.css">
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/vxe-gantt@${formOptions.data.selectGanttVersion}/lib/style.min.css">
  `,
  customCode: {
    importCode: `
    import { initCustomFormatter${isVaporSupported.value ? ', vaporInteropPlugin' : ''} } from 'vue'
    import VxeUIBase from 'vxe-pc-ui'
    import VxeUITable from 'vxe-table'
    import VxeUIDesign from 'vxe-design'
    import VxeUIGantt from 'vxe-gantt'
    `,
    useCode: `
      app.use(VxeUIBase)
      app.use(VxeUITable)
      app.use(VxeUIDesign)
      app.use(VxeUIGantt)
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

const mainFile = 'App.vue'

// 初始化代码
store.setFiles({
  ['src/' + mainFile]: '<template></template>'
})

interface ParseTemplateObj {
  code: string
  content: string
}

interface ParseScriptObj {
  lang: string
  setup: boolean
  code: string
  content: string
}

interface ParseStyleObj {
  lang: string
  scoped: boolean
  code: string
  content: string
}

function parseVueWithDOMParser (source: string) {
  const wrapped = `<root>${source || ''}</root>`
  const parser = new DOMParser()
  const doc = parser.parseFromString(wrapped, 'text/html')
  const templateEl = doc.querySelector('template')
  const scriptEl = doc.querySelector('script')
  const styleEl = doc.querySelector('style')
  const allStyles = doc.querySelectorAll('style')
  return {
    template: {
      code: templateEl ? templateEl.innerHTML : '',
      content: templateEl ? templateEl.outerHTML : ''
    },
    script: {
      lang: scriptEl ? scriptEl.getAttribute('lang') || 'js' : 'js',
      setup: scriptEl ? scriptEl.hasAttribute('setup') : false,
      code: scriptEl ? scriptEl.innerHTML : '',
      content: scriptEl ? scriptEl.outerHTML.replace('setup=""', 'setup') : ''
    },
    style: {
      code: styleEl ? styleEl.innerHTML : '',
      content: styleEl ? styleEl.outerHTML : ''
    },
    styles: Array.from(allStyles).map(el => {
      const styleObj: ParseStyleObj = {
        lang: el.getAttribute('lang') || 'css',
        scoped: el.hasAttribute('scoped'),
        code: el.innerHTML,
        content: el.outerHTML
      }
      return styleObj
    })
  }
}

function reconstructVue (templateObj: ParseTemplateObj, scriptObj: ParseScriptObj, styleObjs: ParseStyleObj[]) {
  const parts: string[] = []
  if (templateObj) {
    parts.push(templateObj.content)
  }
  if (scriptObj) {
    parts.push(scriptObj.content)
  }
  if (styleObjs && styleObjs.length > 0) {
    for (const styleObj of styleObjs) {
      parts.push(`<style ${styleObj.scoped ? 'scoped' : ''}>\n${styleObj.code}\n</style>`)
    }
  }

  return parts.join('\n\n') // 用空行分隔各部分，更美观
}

const { searchQuery } = XEUtils.parseUrl(location.href)

/**
 * fiels=TestA.vue@url,TestB.vue@url
 */
async function init () {
  if (searchQuery.k) {
    VxeUI.loading.open()
    try {
      const response = await fetch(`${import.meta.env.VITE_APP_SERVEICE_API_URL}/storeapi/api/playground/find/${searchQuery.k}`, {
        headers: {
          token: localStorage.getItem('VXE_RUN_TOKEN') || '',
          now: `${Date.now()}`
        }
      })
      if (response.ok) {
        const data = await response.json()
        if (data && data.result) {
          const restObj: PlaygroundVO = data.result
          const newFiles = {}
          newFiles['src/' + mainFile] = restObj.content

          if (restObj.utilsVersion) {
            formOptions.data.selectUtilsVersion = restObj.utilsVersion
            setEsmUrl('xe-utils', restObj.utilsVersion)
          }
          if (restObj.vueVersion) {
            formOptions.data.selectVueVersion = restObj.vueVersion
            setEsmUrl('vue', restObj.vueVersion)
          }
          if (restObj.coreVersion) {
            formOptions.data.selectCoreVersion = restObj.coreVersion
            setEsmUrl('core', restObj.coreVersion)
          }
          if (restObj.uiVersion) {
            formOptions.data.selectUIVersion = restObj.uiVersion
            setEsmUrl('vxe-pc-ui', restObj.uiVersion)
          }
          if (restObj.tableVersion) {
            formOptions.data.selectTableVersion = restObj.tableVersion
            setEsmUrl('vxe-table', restObj.tableVersion)
          }
          if (restObj.ganttVersion) {
            formOptions.data.selectGanttVersion = restObj.ganttVersion
            setEsmUrl('vxe-gantt', restObj.ganttVersion)
          }
          if (restObj.designVersion) {
            formOptions.data.selectDesignVersion = restObj.designVersion
            setEsmUrl('vxe-design', restObj.designVersion)
          }

          store.setFiles(newFiles, mainFile)
          playgroundObj.value = restObj
        } else {
          playgroundObj.value = null
          VxeUI.modal.message({
            content: data.message || '链接已失效',
            status: 'error'
          })
        }
      } else {
        playgroundObj.value = null
        VxeUI.modal.message({
          content: '无效的链接',
          status: 'error'
        })
      }
    } catch (e) {
      VxeUI.modal.message({
        content: '错误',
        status: 'error'
      })
    }
    VxeUI.loading.close()
  } else if (searchQuery.files) {
    VxeUI.loading.open()
    const filesList: string[] = searchQuery.files.split(',')
    const newFiles = {}
    Promise.all(
      filesList.map((item: string, i) => {
        const rest = atob(item).split('@')
        let fileName = decodeURIComponent(rest[0] || '')
        const fileUrl = decodeURIComponent(rest[1] || '')
        const fileInfo = parseFileInfo(fileUrl)
        if (!fileName) {
          fileName = fileInfo.fullName
        }
        if (!i) {
          fileName = mainFile
        }
        newFiles['src/' + fileName] = ''
        return fetch(`${fileUrl}?v=${import.meta.env.VITE_APP_DATE_NOW}`).then(res => res.text()).then(text => {
          newFiles['src/' + fileName] = text
        }).catch(() => {
        })
      })
    ).then(() => {
      const fileRest = parseVueWithDOMParser(newFiles['src/' + mainFile])
      if (fileRest.style) {
        newFiles['src/' + mainFile] = reconstructVue(fileRest.template, fileRest.script, fileRest.styles.map(obj => {
          if (['scss', 'sass'].includes(obj.lang)) {
            return {
              ...obj,
              code: (window as any).compileScss(obj.code)
            }
          }
          return obj
        }))
      }
      // 初始化代码
      store.setFiles(newFiles, mainFile)
      VxeUI.loading.close()
    })
  }
}

const handleSave = async (isFork?: boolean) => {
  const fileMaps = store.getFiles()
  const mainContent = fileMaps[mainFile]
  if (mainContent && mainContent.length > 5000) {
    VxeUI.modal.message({
      content: '代码字符限制 5000 字符内',
      status: 'error'
    })
    return
  }
  if (isFork) {
    forkLoading.value = true
  } else {
    saveLoading.value = true
  }
  try {
    const response = await fetch(`${import.meta.env.VITE_APP_SERVEICE_API_URL}/storeapi/api/playground/${isFork ? 'fork' : 'save'}`, {
      method: 'POST',
      headers: {
        token: localStorage.getItem('VXE_RUN_TOKEN') || '',
        now: `${Date.now()}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        key: searchQuery.k,
        name: mainFile,
        content: mainContent,
        utilsVersion: formOptions.data.selectUtilsVersion,
        vueVersion: formOptions.data.selectVueVersion,
        coreVersion: formOptions.data.selectCoreVersion,
        uiVersion: formOptions.data.selectUIVersion,
        tableVersion: formOptions.data.selectTableVersion,
        ganttVersion: formOptions.data.selectGanttVersion,
        designVersion: formOptions.data.selectDesignVersion
      })
    })
    if (response.ok) {
      const data = await response.json()
      if (data && data.result) {
        const restObj = data.result
        if (isFork) {
          localStorage.setItem('VXE_RUN_TOKEN', restObj.token)
          location.search = `?k=${restObj.key}`
        } else {
          VxeUI.modal.message({
            content: 'Save success',
            status: 'success'
          })
        }
      } else {
        VxeUI.modal.message({
          content: data.message || 'Error',
          status: 'error'
        })
      }
    } else {
      VxeUI.modal.message({
        content: 'Error unauthorized',
        status: 'error'
      })
    }
  } catch (e) {
    VxeUI.modal.message({
      content: 'Error',
      status: 'error'
    })
  }
  if (isFork) {
    forkLoading.value = false
  } else {
    saveLoading.value = false
  }
}

const saveEvent = () => {
  handleSave()
}

const forkEvent = () => {
  handleSave(true)
}

const copyUrlEvent = () => {
  if (VxeUI.clipboard.copy(location.href)) {
    VxeUI.modal.message({
      content: '链接已复制到剪贴板，用于提交 issues 演示的复现链接',
      status: 'success'
    })
  }
}

const openUrlEvent = () => {
  open(location.href)
}

init()
</script>

<style>
.vue-repl {
  .file-selector {
    .add,
    .import-map-wrapper {
      display: none;
    }
  }
}
</style>
