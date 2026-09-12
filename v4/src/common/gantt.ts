import { reactive } from 'vue'

export function useGanttStore (events?: any) {
  const ganttVersionList = ['4.7.4', '4.7.3', '4.7.2', '4.6.10']
  const ganttStableVersion = ganttVersionList[0]
  const ganttVersionOptions = ganttVersionList.map(v => ({ label: v, value: v }))
  const ganttRender = reactive({
    name: 'VxeSelect',
    options: ganttVersionOptions,
    props: {
      width: 90
    },
    events
  })

  return {
    ganttVersionList,
    ganttStableVersion,
    ganttRender
  }
}
