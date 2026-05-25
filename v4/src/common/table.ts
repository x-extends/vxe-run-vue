import { reactive } from 'vue'

export function useTableStore (events?: any) {
  const tableVersionList = ['4.19.1', '4.18.13']
  const tableVersionOptions = tableVersionList.map(v => ({ label: v, value: v }))
  const tableRender = reactive({
    name: 'VxeSelect',
    options: tableVersionOptions,
    events
  })

  return {
    tableVersionList,
    tableRender
  }
}
