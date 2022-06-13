import {useCallback, useEffect, useState} from 'react'
import {debounce} from '../../core/lodashNamedExport'

interface DebouncedInputProps<V> {
  debounce?: number
  value?: V
  onChange: (e: V) => void
  children: (value: V | undefined, onChange: (e: V) => void) => any
}

export const DebouncedInput = <V>({debounce: debounceTime = 450, value, onChange, children}: DebouncedInputProps<V>) => {
  const [innerValue, setInnerValue] = useState<V | undefined>(value)
  const debounced = useCallback(debounce(onChange, debounceTime), [onChange])

  useEffect(() => {
    if (value !== innerValue) {
      setInnerValue(value)
    }
  }, [value])

  const innerOnChange = (newValue: V) => {
    setInnerValue(newValue)
    debounced(newValue)
  }
  return children(innerValue, innerOnChange)
}
