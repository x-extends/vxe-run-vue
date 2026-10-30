import { reactive } from 'vue'

export function useUIStore (events?: any) {
  const uiVersionList = ['4.20.35', '4.20.34', '4.20.33', '4.20.31', '4.20.26', '4.20.25', '4.20.24', '4.20.23', '4.20.22', '4.20.19', '4.20.18', '4.20.17', '4.20.16', '4.20.15', '4.20.14', '4.20.13', '4.20.12', '4.20.11', '4.20.10', '4.20.9', '4.20.8', '4.20.7', '4.20.6', '4.20.5', '4.20.2', '4.20.1', '4.20.0', '4.19.8', '4.19.7', '4.19.6', '4.19.5', '4.19.4', '4.19.3', '4.19.2', '4.19.1', '4.18.23', '4.18.22', '4.18.21', '4.18.20', '4.18.19', '4.18.18', '4.18.16', '4.18.14', '4.18.12', '4.18.11', '4.18.9', '4.18.7', '4.18.6', '4.18.4', '4.17.30', '4.16.28', '4.15.28']
  const uiLatestVersion = uiVersionList[0]
  const uiStableVersion = uiLatestVersion
  const uiVersionOptions = uiVersionList.map(v => ({ label: v, value: v }))
  const uiRender = reactive({
    name: 'VxeSelect',
    options: uiVersionOptions,
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
    uiVersionList,
    uiLatestVersion,
    uiStableVersion,
    uiRender
  }
}
