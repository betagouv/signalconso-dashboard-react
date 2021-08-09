import {useCallback, useEffect, useState} from 'react'
import lodashDebounce from 'lodash.debounce'

interface DebouncedInputProps {
  debounce?: number
  value?: string
  onChange: (e: string) => void
  children: (value: string | undefined, onChange: (e: string) => void) => any
}

export const DebouncedInput = ({debounce = 0, value = '', onChange, children}: DebouncedInputProps) => {
  const [innerValue, setInnerValue] = useState(value)
  const debounced = useCallback(lodashDebounce(onChange, debounce), [])

  useEffect(() => {
    setInnerValue(value)
  }, [value])

  const innerOnChange = (event: string) => {
    setInnerValue(event)
    debounced(event)
  }
  return children(innerValue, innerOnChange)
}
