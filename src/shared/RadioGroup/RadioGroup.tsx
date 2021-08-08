import React, {forwardRef, ReactElement, useEffect, useState} from 'react'
import {ScRadioGroupItemProps} from './RadioGroupItem'

interface Props {
  dense?: boolean
  children: React.ReactNode //ReactElement<ScRadioGroupItemProps>[]
  value?: string
  error?: boolean
  onChange?: (_: string) => void
  className?: string
}

export const ScRadioGroup = forwardRef(({error, className, children, dense, value, onChange}: Props, ref: any) => {
  const [innerValue, setInnerValue] = useState<string>()

  useEffect(() => {
    setInnerValue(value)
  }, [])

  return (
    <div className={className} ref={ref}>
      {React.Children.map(children as ReactElement<ScRadioGroupItemProps>[], child =>
        React.cloneElement(child, {
          ...child.props,
          dense,
          error,
          selected: innerValue === child.props.value,
          onClick: (e: any) => {
            setInnerValue(child.props.value)
            if (child.props.onClick) child.props.onClick(e)
            if (onChange) onChange(child.props.value)
          },
        }),
      )}
    </div>
  )
})
