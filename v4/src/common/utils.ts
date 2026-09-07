
export function useUtilsStore (events?: any) {
  const utilsVersionList = ['4.0.13']
  const utilsStableVersion = utilsVersionList[0]

  return {
    utilsVersionList,
    utilsStableVersion
  }
}
