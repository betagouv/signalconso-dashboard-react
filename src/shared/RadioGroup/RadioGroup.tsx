import React, {forwardRef, ReactElement, useEffect, useState} from 'react'
import {ScRadioGroupItemProps} from './RadioGroupItem'
import {classes} from "../../core/helper/utils";
import makeStyles from "@mui/styles/makeStyles";
import {alpha, Theme} from "@mui/material";

interface Props {
  dense?: boolean
  children: React.ReactNode //ReactElement<ScRadioGroupItemProps>[]
  value?: string
  inline?: boolean
  border?: boolean
  error?: boolean
  onChange?: (_: string) => void
  className?: string
}

const useStyle = makeStyles((t: Theme) => ({
  rootFlex: {
    display: 'flex'
  },
}))

export const ScRadioGroup = forwardRef(({error, className, children, dense, value, inline,border, onChange}: Props, ref: any) => {
  const [innerValue, setInnerValue] = useState<string>()

  const css = useStyle()
  useEffect(() => {
    setInnerValue(value)
  }, [])



  return (
    <div className={classes(inline && css.rootFlex, className)} ref={ref}>
      {React.Children.map(children as ReactElement<ScRadioGroupItemProps>[], child =>
        React.cloneElement(child, {
          ...child.props,
          dense,
          inline,
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
