import { useMemo } from 'react'

export const useMemoFn = <T, R>(
  dep: T | undefined,
  map: (_: T) => R,
): R | undefined => {
  return useMemo(() => {
    return dep ? map(dep) : undefined
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dep])
}
