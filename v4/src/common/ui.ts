import { reactive } from 'vue'

export function useUIStore (events?: any) {
  const uiVersionList = ['4.18.2', '4.17.30', '4.16.28', '4.15.28']
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
