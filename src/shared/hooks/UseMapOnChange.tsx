import {useMemo} from 'react'

export const useMapOnChange = <T, R>(dep: T | undefined, map: (_: T) => R) => {
  return useMemo(() => {
    return dep ? map(dep) : undefined
  }, [dep])
}
