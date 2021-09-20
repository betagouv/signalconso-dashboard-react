import {Txt} from 'mui-extension/lib/Txt/Txt'
import {Panel, PanelBody} from 'shared/Panel'
import {CompaniesDbSyncInfo} from '../../core/api/client/companies-db-sync/CompaniesDbSync'
import {alpha, CircularProgress, Grid, makeStyles, Theme, useTheme} from '@material-ui/core'
import {useMemo} from 'react'
import {styleUtils} from '../../core/theme'
import {useI18n} from '../../core/i18n'
import {PanelFoot} from '../../shared/Panel/PanelFoot'
import {ScButton} from '../../shared/Button/Button'
import {UseAsync} from '@alexandreannic/react-hooks-lib/lib'
import {useCssUtils} from '../../core/helper/useCssUtils'
import {classes} from '../../core/helper/utils'

interface Props {
  info: CompaniesDbSyncInfo
  start: UseAsync<() => Promise<void>>
  cancel: UseAsync<() => Promise<void>>
}

const progressSize = 110

const useStyles = makeStyles((t: Theme) => ({
  progressContainer: {
    marginBottom: t.spacing(2),
    height: progressSize,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  percent: {
    position: 'absolute',
    fontSize: styleUtils(t).fontSize.big,
  },
  percentActive: {
    fontWeight: t.typography.fontWeightBold,
    color: t.palette.primary.main,
  },
  circleBackground: {
    color: alpha(t.palette.primary.light, 0.2),
    height: progressSize,
    width: progressSize,
    position: 'absolute',
  },
}))

export const CompaniesDbSyncCard = ({info, start, cancel}: Props) => {
  const css = useStyles()
  const theme = useTheme()
  const cssUtils = useCssUtils()
  const {m, dateFromNow} = useI18n()
  const percent = useMemo(() => {
    return info.linesDone / (info.linesCount + info.linesDone) * 100
  }, [info.linesCount, info.linesDone])

  return (
    <Panel>
      <PanelBody>
        <div className={css.progressContainer}>
          <CircularProgress
            value={100} size={progressSize}
            variant={info.endedAt ? 'determinate' : 'indeterminate'}
            className={css.circleBackground}
          />
          <CircularProgress value={percent} size={progressSize} variant="determinate"/>
          <div className={classes(css.percent, !info.endedAt && css.percentActive)}>{Math.round(percent)} %</div>
        </div>
        <Txt block bold size="big">{info.fileName}</Txt>
        <a href={info.fileUrl}>
          <Txt block truncate gutterBottom link>{info.fileUrl}</Txt>
        </a>

        <Grid container style={{marginTop: 20}}>
          <Grid item xs={6}>
            <Txt block color="hint" uppercase>{m.beginning}</Txt>
            <Txt block size="big">{dateFromNow(info.startedAt)}</Txt>
          </Grid>
          <Grid item xs={6} style={{textAlign: 'right'}}>
            {info.endedAt ? (
              <>
                <Txt block color="hint" uppercase>{m.end}</Txt>
                <Txt block size="big">{dateFromNow(info.endedAt)}</Txt>
              </>
            ) : (
              <Txt block size="title" bold className={cssUtils.colorWarning}>{m.inProgress}</Txt>
            )}
          </Grid>
        </Grid>
      </PanelBody>
      <PanelFoot border>
        {info.endedAt && (
          <ScButton color="primary" icon="play_arrow" onClick={start.call} loading={start.loading}>{m.startUp}</ScButton>
        )}
        {!info.endedAt && (
          <ScButton className={cssUtils.colorError} icon="stop" onClick={cancel.call} loading={cancel.loading}>{m.cancel}</ScButton>
        )}
      </PanelFoot>
    </Panel>
  )
}
