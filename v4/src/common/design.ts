import { reactive } from 'vue'

export function useDesignStore (events?: any) {
  const designVersionList = ['4.1.6', '4.1.5', '4.1.3']
  const designVersionOptions = designVersionList.map(v => ({ label: v, value: v }))
  const designRender = reactive({
    name: 'VxeSelect',
    options: designVersionOptions,
    events
  })

  return {
    designVersionList,
    designRender
  }
}
