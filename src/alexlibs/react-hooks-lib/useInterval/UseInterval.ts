import { useEffect, useRef } from 'react'

export const useInterval = <F extends (...args: unknown[]) => void>(
  callback: F,
  ms: number,
) => {
  const savedCallback = useRef<F>(undefined)

  useEffect(() => {
    savedCallback.current = callback
  })

  useEffect(() => {
    const tick = () => savedCallback.current!()
    const id = setInterval(tick, ms)
    return () => clearInterval(id)
  }, [ms])
}
