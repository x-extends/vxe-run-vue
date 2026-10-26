import { reactive } from 'vue'

export function useGanttStore (events?: any) {
  const ganttVersionList = ['4.9.3', '4.9.2', '4.9.1', '4.9.0', '4.8.2', '4.8.1', '4.8.0', '4.7.4', '4.7.3', '4.7.2', '4.6.10']
  const ganttLatestVersion = ganttVersionList[0]
  const ganttStableVersion = ganttLatestVersion
  const ganttVersionOptions = ganttVersionList.map(v => ({ label: v, value: v }))
  const ganttRender = reactive({
    name: 'VxeSelect',
    options: ganttVersionOptions,
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
    ganttVersionList,
    ganttLatestVersion,
    ganttStableVersion,
    ganttRender
  }
}
