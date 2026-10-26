import { reactive } from 'vue'

export function useDesignStore (events?: any) {
  const designVersionList = ['4.1.9', '4.1.8', '4.1.7', '4.1.6']
  const designLatestVersion = designVersionList[0]
  const designStableVersion = designLatestVersion
  const designVersionOptions = designVersionList.map(v => ({ label: v, value: v }))
  const designRender = reactive({
    name: 'VxeSelect',
    options: designVersionOptions,
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
    designVersionList,
    designLatestVersion,
    designStableVersion,
    designRender
  }
}
