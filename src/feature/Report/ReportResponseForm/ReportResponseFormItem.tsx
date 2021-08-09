import {Txt} from 'mui-extension/lib/Txt/Txt'
import React from 'react'
import {makeStyles, Theme} from '@material-ui/core'

interface ReportAnswerProItemProps {
  title: string
  desc?: string
  children?: any
}

const useStyles = makeStyles((t: Theme) => ({
  root: {
    marginBottom: t.spacing(2),
  },
  body: {
    marginTop: t.spacing(1 / 2),
  },
}))

export const ReportResponseFormItem = ({children, title, desc}: ReportAnswerProItemProps) => {
  const css = useStyles()
  return (
    <div className={css.root}>
      <Txt block size="big" bold>{title}</Txt>
      {desc && (
        <Txt color="hint">
          <span dangerouslySetInnerHTML={{__html: desc}}/>
        </Txt>
      )}
      <div className={css.body}>
        {children}
      </div>
    </div>
  )
}
