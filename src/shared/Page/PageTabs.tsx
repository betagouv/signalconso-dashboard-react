import { Tab, TabProps, Tabs } from '@mui/material'
import * as React from 'react'
import { ReactElement, useMemo } from 'react'
import {
  RegisteredRouter,
  useLocation,
  useNavigate,
  useRouter,
  ValidateNavigateOptions,
} from '@tanstack/react-router'

interface Props {
  children: Array<ReactElement<PageTabProps> | undefined>
}

export const PageTabs = ({ children }: Props) => {
  const { pathname } = useLocation()
  const router = useRouter()
  const defaultTabIndex = 0
  const index = useMemo(() => {
    const currentTabIndex = children
      .map((child) => child?.props.navigateOptions)
      .findIndex(
        (options) =>
          options &&
          pathname.includes(
            router.buildLocation({ to: options.to, params: options.params })
              .pathname,
          ),
      )
    return currentTabIndex !== -1 ? currentTabIndex : defaultTabIndex
  }, [router, pathname, children])
  console.log([router, pathname, children])

  return (
    <Tabs
      value={index}
      indicatorColor="primary"
      textColor="primary"
      variant="scrollable"
      scrollButtons="auto"
      sx={{
        mb: 3,
        borderBottom: (t) => '1px solid ' + t.palette.divider,
      }}
    >
      {children}
    </Tabs>
  )
}

interface PageTabProps<
  TRouter extends RegisteredRouter = RegisteredRouter,
  TOptions = unknown,
> extends TabProps {
  label?: string
  icon?: string | React.ReactElement
  disabled?: boolean
  // routing typesafety
  // https://tanstack.com/router/latest/docs/framework/react/guide/type-utilities
  navigateOptions: ValidateNavigateOptions<TRouter, TOptions>
}

export function PageTab<TRouter extends RegisteredRouter, TOptions>({
  navigateOptions,
  ...props
}: PageTabProps<TRouter, TOptions>) {
  const navigate = useNavigate()
  return <Tab {...props} onClick={() => navigate(navigateOptions)} />
}
