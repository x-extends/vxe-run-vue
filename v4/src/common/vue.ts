import { reactive } from 'vue'

export function useVueStore (events?: any) {
  const vueVersionList = ['3.5.43', '3.5.42', '3.5.16']
  const vueLatestVersion = vueVersionList[0]
  const vueStableVersion = '3.5.16'
  const vueVersionOptions = vueVersionList.map(v => ({ label: v, value: v }))
  const vueRender = reactive({
    name: 'VxeSelect',
    options: vueVersionOptions,
    props: {
      width: 90,
      showBadge: false,
      badgeConfig: {
        text: 'New'
      }
    },
    events
  })

  return {
    vueVersionList,
    vueLatestVersion,
    vueStableVersion,
    vueRender
  }
}
