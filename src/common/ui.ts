import { reactive } from 'vue'

export function useUIStore (events?: any) {
  const uiVersionList = ['4.14.21', '4.13.29']
  const uiVersionOptions = uiVersionList.map(v => ({ label: v, value: v }))
  const uiRender = reactive({
    name: 'VxeSelect',
    options: uiVersionOptions,
    events
  })

  return {
    uiVersionList,
    uiRender
  }
}
