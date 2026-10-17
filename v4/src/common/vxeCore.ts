import { reactive } from 'vue'

export function useVxeCoreStore (events?: any) {
  const vxeCoreVersionList = ['4.4.36', '4.4.35', '4.4.33', '4.4.32', '4.4.31', '4.4.29', '4.4.28', '4.4.27', '4.4.24', '4.4.20', '4.4.12']
  const vxeCoreStableVersion = vxeCoreVersionList[0]
  const vxeCoreVersionOptions = vxeCoreVersionList.map(v => ({ label: v, value: v }))
  const vxeCoreRender = reactive({
    name: 'VxeSelect',
    options: vxeCoreVersionOptions,
    props: {
      width: 90
    },
    events
  })

  return {
    vxeCoreVersionList,
    vxeCoreStableVersion,
    vxeCoreRender
  }
}
