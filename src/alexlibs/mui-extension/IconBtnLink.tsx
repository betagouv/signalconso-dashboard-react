import { IconBtn, IconBtnProps } from './IconBtn'
import React from 'react'
import { createLink, LinkComponent } from '@tanstack/react-router'

const MUILinkComponent = React.forwardRef<
  HTMLButtonElement,
  Omit<IconBtnProps, 'href'>
>((props, ref) => {
  const { children, ...rest } = props

  return (
    <IconBtn component="a" ref={ref} {...rest}>
      {children}
    </IconBtn>
  )
})

const CreatedLinkComponent = createLink(MUILinkComponent)

export const IconBtnLink: LinkComponent<typeof MUILinkComponent> = (props) => {
  return <CreatedLinkComponent preload={'intent'} {...props} />
}
