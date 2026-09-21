import { reactive } from 'vue'

export function useUtilsStore (events?: any) {
  const utilsVersionList = ['4.1.1', '4.0.13']
  const utilsStableVersion = utilsVersionList[0]
  const utilsVersionOptions = utilsVersionList.map(v => ({ label: v, value: v }))
  const utilsRender = reactive({
    name: 'VxeSelect',
    options: utilsVersionOptions,
    props: {
      width: 90
    },
    events
  })

  return {
    utilsVersionList,
    utilsStableVersion,
    utilsRender
  }
}
