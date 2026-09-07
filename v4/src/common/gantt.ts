import { reactive } from 'vue'

export function useGanttStore (events?: any) {
  const ganttVersionList = ['4.7.2', '4.6.10']
  const ganttVersionOptions = ganttVersionList.map(v => ({ label: v, value: v }))
  const ganttRender = reactive({
    name: 'VxeSelect',
    options: ganttVersionOptions,
    events
  })

  return {
    ganttVersionList,
    ganttRender
  }
}
