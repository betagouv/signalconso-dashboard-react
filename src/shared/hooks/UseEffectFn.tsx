import {useEffect} from 'react'

export const useEffectFn = <T, R>(dep: T | undefined, map: (_: T) => void) => {
  return useEffect(() => {
    if (dep) map(dep)
  }, [dep])
}
