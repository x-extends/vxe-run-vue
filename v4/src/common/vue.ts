import { reactive } from 'vue'

export function useVueStore (events?: any) {
  const vueVersionList = ['3.5.42', '3.5.16']
  const vueStableVersion = '3.5.16'
  const vueVersionOptions = vueVersionList.map(v => ({ label: v, value: v }))
  const vueRender = reactive({
    name: 'VxeSelect',
    options: vueVersionOptions,
    props: {
      width: 90
    },
    events
  })

  return {
    vueVersionList,
    vueStableVersion,
    vueRender
  }
}
