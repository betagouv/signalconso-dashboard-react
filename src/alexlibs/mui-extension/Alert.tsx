import { Box, BoxProps, darken, Icon, IconButton } from '@mui/material'
import { CSSProperties, ReactNode, useState } from 'react'
import { usePersistentState } from '../react-persistent-state'
import {
  colorBlueFrance,
  colorDsfrSuccessGreen,
  colorError,
  colorInfo,
  colorSuccess,
  colorWarning,
} from './color'

const height = (dense?: boolean) => (dense ? 44 : 52)

interface AlertProps extends BoxProps {
  style?: CSSProperties
  type: 'info' | 'error' | 'warning' | 'success'
  icon?: string
  deletable?: boolean
  // if an id is set, the deletion is persisted in local storage
  // the id is used to choose the local storage key
  persistentDeleteId?: string
  action?: ReactNode
  dense?: boolean
  gutterTop?: boolean
  gutterBottom?: boolean
}

function useIsVisible(
  persistentDeleteId: string | undefined,
): [boolean, (_: boolean) => void] {
  const regularState = useState<boolean>(true)
  const persistedState = usePersistentState<boolean>(
    true,
    persistentDeleteId ?? '',
  )
  if (!persistentDeleteId) {
    return regularState
  }
  const [persistedIsVisible, persistedSetIsVisible] = persistedState
  return [persistedIsVisible, persistedSetIsVisible]
}

export const Alert = ({
  type,
  dense,
  icon,
  action,
  deletable,
  persistentDeleteId,
  sx,
  gutterTop,
  gutterBottom,
  children,
  dangerouslySetInnerHTML,
  ...props
}: AlertProps) => {
  const [isVisible, setIsVisible] = useIsVisible(persistentDeleteId)

  const getIconFromType = () => {
    switch (type) {
      case 'info':
        return 'info'
      case 'error':
        return 'error'
      case 'warning':
        return 'warning'
      case 'success':
        return 'check_circle'
      default:
        return 'info'
    }
  }

  return (
    <Box
      {...props}
      sx={{
        // paddingLeft: t.spacing(2),
        // paddingRight: t.spacing(2),
        // [t.breakpoints.up('sm')]: {
        //   paddingLeft: t.spacing(3),
        //   paddingRight: t.spacing(3),
        // },
        transition: (t) => t.transitions.create('all'),
        // @ts-expect-error: Property 'dense' does not exist
        minHeight: height(props.dense),
        display: 'flex',
        alignItems: 'center',
        overflow: 'hidden',
        borderRadius: '4px',
        paddingLeft: dense ? 1 : 2,
        paddingRight: dense ? 1 : 2,
        ...{
          success: {
            background: 'rgba(50, 255, 150, .08)', //'#e1ffe1',
            color: darken(colorDsfrSuccessGreen, 0.1),
          },
          info: {
            background: colorInfo,
            color: colorBlueFrance,
          },
          error: {
            background: 'rgba(255, 0, 0, .08)', //'#ffdede',
            color: darken(colorError, 0.1),
          },
          warning: {
            background: 'rgba(255, 128, 0, .08)',
            color: darken(colorWarning, 0.1),
          },
        }[type],
        ...(!isVisible && {
          minHeight: '0 !important',
          height: '0 !important',
          opacity: '0 !important',
          margin: '0 !important',
        }),
        ...(gutterTop && {
          mt: 1,
        }),
        ...(gutterBottom && {
          mb: 1,
        }),
        ...sx,
      }}
    >
      <Icon
        sx={{
          mr: dense ? 0 : 1,
          height: `${height(dense)}px !important`,
          display: 'flex',
          alignItems: 'center',
          alignSelf: 'flex-start',
        }}
      >
        {icon ? icon : getIconFromType()}
      </Icon>
      <Box
        children={children}
        dangerouslySetInnerHTML={dangerouslySetInnerHTML}
        sx={{
          flex: 1,
          py: dense ? 1 : 2,
          px: 1,
        }}
      />
      {action ||
        (deletable && (
          <Box
            sx={{
              textAlign: 'right',
              mt: 1,
              ml: 0,
              mb: 1,
              mr: -1,
            }}
          >
            {action}
            {deletable && (
              <IconButton
                onClick={() => {
                  setIsVisible(false)
                }}
                size="large"
                aria-label="Fermer la zone d'information"
              >
                <Icon>clear</Icon>
              </IconButton>
            )}
          </Box>
        ))}
    </Box>
  )
}
