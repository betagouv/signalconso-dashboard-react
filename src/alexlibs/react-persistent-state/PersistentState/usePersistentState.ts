import { Dispatch, SetStateAction, useEffect, useState } from 'react'

// We could store anything that is JSON-stringifiable
// but we narrow to the actual use cases we have so far
type Storable = boolean | string[]

export function usePersistentState<S extends Storable>(
  initialState: S,
  key: string,
): [S, Dispatch<SetStateAction<S>>] {
  const storageKey = 'react-persistant-state-' + key
  const [state, setState] = useState<S>(load<S>(storageKey) ?? initialState)
  useEffect(() => save(storageKey, state), [storageKey, state])
  return [state, setState]
}

function save<S extends Storable>(key: string, value: S): void {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (err) {
    console.error(err)
  }
}

function load<S extends Storable>(key: string): S | undefined {
  try {
    const resStr = localStorage.getItem(key)
    if (resStr) {
      return JSON.parse(resStr) as S
    }
  } catch (err) {
    console.error(err)
  }
  return undefined
}
