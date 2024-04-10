import {Checkbox} from '@mui/material'
import {ChangeEvent, useState} from 'react'

interface DelayedCheckboxProps {
  delayedAction: (event: ChangeEvent<HTMLInputElement>) => void
}

export const DelayedCheckbox = ({delayedAction}: DelayedCheckboxProps) => {
  const [timerId, setTimerId] = useState<number | null>(null)
  const [toggle, setToggle] = useState<boolean>(false)

  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (timerId) {
      clearTimeout(timerId)
      setTimerId(null)
    } else if (!toggle) {
      const t = window.setTimeout(() => {
        delayedAction(event)
        setTimerId(null)
      }, 1000)
      setTimerId(t)
    }
    setToggle(!toggle)
  }

  return <Checkbox checked={toggle} onChange={onChange} />
}
