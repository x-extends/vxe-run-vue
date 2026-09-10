import { reactive } from 'vue'

export function useUIStore (events?: any) {
  const uiVersionList = ['4.18.9', '4.18.7', '4.18.6', '4.18.4', '4.17.30', '4.16.28', '4.15.28']
  const uiStableVersion = uiVersionList[0]
  const uiVersionOptions = uiVersionList.map(v => ({ label: v, value: v }))
  const uiRender = reactive({
    name: 'VxeSelect',
    options: uiVersionOptions,
    props: {
      width: 90
    },
    events
  })

  return {
    uiVersionList,
    uiStableVersion,
    uiRender
  }
}
