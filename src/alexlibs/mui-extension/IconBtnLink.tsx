import React, { ReactNode } from 'react'
import { createLink, LinkComponentProps } from '@tanstack/react-router'
import { IconButton, IconButtonProps } from '@mui/material'

interface IconBtnLinkProps extends IconButtonProps<'a'> {
  children: ReactNode
}

const MUILinkComponent = React.forwardRef<HTMLAnchorElement, IconBtnLinkProps>(
  (props, ref) => {
    const { children, ...rest } = props

    return (
      <IconButton ref={ref} component="a" {...rest}>
        {children}
      </IconButton>
    )
  },
)

export const CreatedLinkComponent = createLink(MUILinkComponent)

export const IconBtnLink: React.ForwardRefExoticComponent<
  React.PropsWithoutRef<LinkComponentProps<typeof MUILinkComponent>> &
    React.RefAttributes<any>
> = React.forwardRef<any, LinkComponentProps<typeof MUILinkComponent>>(
  (props, ref) => {
    return <CreatedLinkComponent preload={'intent'} ref={ref} {...props} />
  },
)
