import { reactive } from 'vue'

export function useVxeCoreStore (events?: any) {
  const vxeCoreVersionList = ['4.4.20']
  const vxeCoreStableVersion = vxeCoreVersionList[0]
  const vxeCoreVersionOptions = vxeCoreVersionList.map(v => ({ label: v, value: v }))
  const vxeCoreRender = reactive({
    name: 'VxeSelect',
    options: vxeCoreVersionOptions,
    props: {
      width: 100
    },
    events
  })

  return {
    vxeCoreVersionList,
    vxeCoreStableVersion,
    vxeCoreRender
  }
}
