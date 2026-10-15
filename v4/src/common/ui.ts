import { reactive } from 'vue'

export function useUIStore (events?: any) {
  const uiVersionList = ['4.20.5', '4.20.2', '4.20.1', '4.20.0', '4.19.8', '4.19.7', '4.19.6', '4.19.5', '4.19.4', '4.19.3', '4.19.2', '4.19.1', '4.18.23', '4.18.22', '4.18.21', '4.18.20', '4.18.19', '4.18.18', '4.18.16', '4.18.14', '4.18.12', '4.18.11', '4.18.9', '4.18.7', '4.18.6', '4.18.4', '4.17.30', '4.16.28', '4.15.28']
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
