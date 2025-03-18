import { Icon } from '@mui/material'
import { createLink, LinkComponent } from '@tanstack/react-router'
import { ReportSearch } from 'core/client/report/ReportSearch'
import * as React from 'react'

// This file follow the pattern here
// https://tanstack.com/router/latest/docs/framework/react/guide/custom-link
// to create a custom link component

const className = 'text-scbluefrance text-sm'

function IconAndLabel({
  label,
  icon,
  isExternal = false,
}: {
  label: string
  icon?: 'search' | 'forward'
  isExternal?: boolean
}) {
  return (
    <>
      {icon && (
        <Icon style={{ fontSize: '1.2em' }} className="mb-[-5px]">
          {icon}
        </Icon>
      )}
      {label}
      {isExternal && (
        <Icon style={{ fontSize: '1.2em' }} className="mb-[-4px] ml-0.5">
          open_in_new
        </Icon>
      )}
    </>
  )
}

type Props = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  label: string
  icon?: 'search' | 'forward'
}

const UnderlyingComponent = React.forwardRef<HTMLAnchorElement, Props>(
  (props, ref) => {
    const { icon, label, ...rest } = props
    return (
      <a ref={ref} {...rest} className={className} target="_blank">
        <IconAndLabel {...{ icon, label }} />
      </a>
    )
  },
)

const CreatedLinkComponent = createLink(UnderlyingComponent)

export const QuickSmallLink: LinkComponent<typeof UnderlyingComponent> = (
  props,
) => {
  return <CreatedLinkComponent preload={'intent'} {...props} />
}

export const QuickSmallExternalLink = (props: {
  label: string
  href: string
}) => {
  return (
    <a href={props.href} target="_blank" rel="noreferrer" className={className}>
      <IconAndLabel label={props.label} isExternal />
    </a>
  )
}

export const QuickSmallReportSearchLink = (props: {
  reportSearch: Partial<ReportSearch>
  icon?: boolean
  label?: string
}) => {
  const withIcon = props.icon === undefined || props.icon === true
  return (
    <QuickSmallLink
      {...props}
      label={props.label ?? 'autres signalements'}
      to="/suivi-des-signalements"
      search={props.reportSearch}
      icon={withIcon ? 'search' : undefined}
    />
  )
}
