import React, {ReactElement, useEffect, useState} from 'react'
import {ScRadioGroupItemProps} from './RadioGroupItem'

interface Props {
  children: React.ReactNode //ReactElement<ScRadioGroupItemProps>[]
  value?: string
  onChange?: (_: string) => void
}

export const ScRadioGroup = ({children, value, onChange}: Props) => {
  const [innerValue, setInnerValue] = useState<string>()

  useEffect(() => {
    setInnerValue(value)
  }, [])

  return (
    <div>
      {React.Children.map(children as ReactElement<ScRadioGroupItemProps>[], child =>
        React.cloneElement(child, {
          ...child.props,
          selected: innerValue === child.props.value,
          onClick: (e: any) => {
            setInnerValue(child.props.value)
            if (child.props.onClick) child.props.onClick(e)
            if (onChange) onChange(child.props.value)
          }
        })
      )}
    </div>
  )
}
