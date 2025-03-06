import { useEffect } from 'react'

export const useEffectFn = <T>(dep: T | undefined, map: (_: T) => void) => {
  return useEffect(() => {
    if (dep !== undefined) map(dep)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dep])
}
