import {useEffect, useMemo, useState} from 'react'
import {debounce} from '../../core/lodashNamedExport'

interface DebouncedInputProps<V> {
  value?: V
  onChange: (e: V) => void
  children: (value: V | undefined, onChange: (e: V) => void) => any
}

const debounceTime = 450

export const DebouncedInput = <V>({value, onChange, children}: DebouncedInputProps<V>) => {
  const [innerValue, setInnerValue] = useState<V | undefined>(value)

  const debouncedOnChange = useMemo(() => {
    return debounce(onChange, debounceTime)
  }, [onChange])

  useEffect(() => {
    setInnerValue(value)
  }, [value])

  const innerOnChange = (newValue: V) => {
    setInnerValue(newValue)
    debouncedOnChange(newValue)
  }
  return children(innerValue, innerOnChange)
}
