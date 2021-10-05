import {Txt} from 'mui-extension/lib/Txt/Txt'
import {Panel, PanelBody} from 'shared/Panel'
import {CompaniesDbSyncInfo} from '@betagouv/signalconso-api-sdk-js'
import {alpha, CircularProgress, Grid, makeStyles, Theme, useTheme} from '@material-ui/core'
import {styleUtils} from '../../core/theme'
import {useI18n} from '../../core/i18n'
import {PanelFoot} from '../../shared/Panel/PanelFoot'
import {ScButton} from '../../shared/Button/Button'
import {UseAsync} from '@alexandreannic/react-hooks-lib/lib'
import {useCssUtils} from '../../core/helper/useCssUtils'
import {useMemoFn} from '../../shared/hooks/UseMemoFn'
import {classes} from '../../core/helper/utils'

interface Props {
  name: string
  info?: CompaniesDbSyncInfo
  start: UseAsync<() => Promise<void>>
  cancel: UseAsync<() => Promise<void>>
}

const progressSize = 110

const useStyles = makeStyles((t: Theme) => ({
  progressContainer: {
    marginBottom: t.spacing(1),
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

export const CompaniesDbSyncCard = ({name, info, start, cancel}: Props) => {
  const css = useStyles()
  const theme = useTheme()
  const cssUtils = useCssUtils()
  const {m, dateFromNow, formatLargeNumber} = useI18n()

  const percent = useMemoFn(info, _ => _.linesDone / _.linesCount * 100)

  return (
    <Panel>
      <PanelBody>
        <div className={css.progressContainer}>
          <CircularProgress
            value={100} size={progressSize}
            variant={info && !info.endedAt ? 'indeterminate' : 'determinate'}
            className={css.circleBackground}
          />
          <CircularProgress value={percent} size={progressSize} variant="determinate"/>
          <div className={classes(css.percent, !info?.endedAt && css.percentActive)}>{Math.round(percent ?? 0)} %</div>
        </div>
        <div style={{textAlign: 'center'}}>
          <Txt size="big">{formatLargeNumber(info?.linesDone ?? 0)}</Txt>
          <Txt color="hint">
            &nbsp;/&nbsp;
            {formatLargeNumber(info?.linesCount ?? 0)}
          </Txt>
        </div>

        <Txt block bold size="big" className={cssUtils.marginTop3}>{info?.fileName ?? name}</Txt>
        <a href={info?.fileUrl ?? '#'}>
          <Txt block truncate gutterBottom link>{info?.fileUrl ?? ''}</Txt>
        </a>

        {info && (
          <Grid container className={cssUtils.marginTop2}>
            <Grid item xs={6}>
              <Txt block size="small" color="hint" uppercase>{m.beginning}</Txt>
              <Txt block size="big">{dateFromNow(info.startedAt)}</Txt>
            </Grid>
            <Grid item xs={6} style={{textAlign: 'right'}}>
              {info.endedAt ? (
                <>
                  <Txt block size="small" color="hint" uppercase>{m.end}</Txt>
                  <Txt block size="big">{dateFromNow(info.endedAt)}</Txt>
                </>
              ) : (
                <Txt block size="title" bold className={cssUtils.colorWarning}>{m.inProgress}</Txt>
              )}
            </Grid>
          </Grid>
        )}
      </PanelBody>
      <PanelFoot border>
        {(!info || info.endedAt) && (
          <ScButton color="primary" icon="play_arrow" onClick={start.call} loading={start.loading}>
            {m.startUp}
          </ScButton>
        )}
        {info && !info.endedAt && (
          <ScButton className={cssUtils.colorError} icon="stop" onClick={cancel.call} loading={cancel.loading}>
            {m.cancel}
          </ScButton>
        )}
      </PanelFoot>
    </Panel>
  )
}
