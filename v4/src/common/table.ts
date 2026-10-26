import { reactive } from 'vue'

export function useTableStore (events?: any) {
  const tableVersionList = ['4.23.7', '4.23.6', '4.23.5', '4.23.4', '4.23.3', '4.23.2', '4.23.1', '4.23.0', '4.22.3', '4.22.5', '4.22.2', '4.22.1', '4.22.0', '4.21.10', '4.21.9', '4.21.8', '4.21.7', '4.20.13', '4.19.25']
  const tableLatestVersion = tableVersionList[0]
  const tableStableVersion = '4.23.5'
  const tableVersionOptions = tableVersionList.map(v => ({ label: v, value: v }))
  const tableRender = reactive({
    name: 'VxeSelect',
    options: tableVersionOptions,
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
    tableVersionList,
    tableLatestVersion,
    tableStableVersion,
    tableRender
  }
}
