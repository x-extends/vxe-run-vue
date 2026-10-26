import { reactive } from 'vue'

export function useZIndexStore (events?: any) {
  const zIndexVersionList = ['1.0.8', '1.0.7']
  const zIndexLatestVersion = zIndexVersionList[0]
  const zIndexStableVersion = zIndexLatestVersion
  const zIndexVersionOptions = zIndexVersionList.map(v => ({ label: v, value: v }))
  const zIndexRender = reactive({
    name: 'VxeSelect',
    options: zIndexVersionOptions,
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
    zIndexVersionList,
    zIndexLatestVersion,
    zIndexStableVersion,
    zIndexRender
  }
}
