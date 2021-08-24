import {ReactNode, useMemo} from 'react'
import {makeStyles} from '@material-ui/core/styles'
import {Theme} from '@material-ui/core'

interface Props {
  children: ReactNode
  offset?: number
}

export const CenteredContent = ({children, offset = 0}: Props) => {
  const css = useMemo(
    () =>
      makeStyles((t: Theme) => ({
        root: {
          minHeight: `calc(100vh - ${offset}px)`,
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          '&:before, &:after': {
            content: '" "',
            display: 'block',
            flexGrow: 1,
            height: 24,
          },
        },
      })),
    [offset],
  )()

  return <div className={css.root}>{children}</div>
}
