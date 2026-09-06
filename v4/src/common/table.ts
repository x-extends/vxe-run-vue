import { reactive } from 'vue'

export function useTableStore (events?: any) {
  const tableVersionList = ['4.21.7', '4.20.13', '4.19.25', '4.19.25', '4.18.15']
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
