import { reactive } from 'vue'

export function useVxeCoreStore (events?: any) {
  const vxeCoreVersionList = ['4.5.3', '4.5.2', '4.5.0', '4.4.42', '4.4.38', '4.4.37', '4.4.36', '4.4.35', '4.4.33', '4.4.32', '4.4.31', '4.4.29', '4.4.28', '4.4.27', '4.4.24', '4.4.20', '4.4.12']
  const vxeCoreLatestVersion = vxeCoreVersionList[0]
  const vxeCoreStableVersion = vxeCoreLatestVersion
  const vxeCoreVersionOptions = vxeCoreVersionList.map(v => ({ label: v, value: v }))
  const vxeCoreRender = reactive({
    name: 'VxeSelect',
    options: vxeCoreVersionOptions,
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
    vxeCoreVersionList,
    vxeCoreLatestVersion,
    vxeCoreStableVersion,
    vxeCoreRender
  }
}
