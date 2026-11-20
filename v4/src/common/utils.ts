import { reactive } from 'vue'

export function useUtilsStore (events?: any) {
  const utilsVersionList = ['4.3.0', '4.2.3', '4.1.4', '4.1.3', '4.1.1', '4.0.13']
  const utilsLatestVersion = utilsVersionList[0]
  const utilsStableVersion = '4.2.3'
  const utilsVersionOptions = utilsVersionList.map(v => ({ label: v, value: v }))
  const utilsRender = reactive({
    name: 'VxeSelect',
    options: utilsVersionOptions,
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
    utilsVersionList,
    utilsLatestVersion,
    utilsStableVersion,
    utilsRender
  }
}
