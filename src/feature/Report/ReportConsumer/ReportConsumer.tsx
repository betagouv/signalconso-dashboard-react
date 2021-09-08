import {Panel, PanelBody, PanelHead} from '../../../shared/Panel'
import {EditConsumerDialog} from './EditConsumerDialog'
import {ScButton} from '../../../shared/Button/Button'
import {fromNullable} from 'fp-ts/lib/Option'
import {capitalize, classes} from '../../../core/helper/utils'
import {Icon, makeStyles, Theme, useTheme} from '@material-ui/core'
import React from 'react'
import {Report} from '../../../core/api'
import {useI18n} from '../../../core/i18n'
import {useReportContext} from '../../../core/context/ReportContext'
import {useCssUtils} from '../../../core/helper/useCssUtils'

interface Props {
  report: Report
  canEdit?: boolean
}

const useStyles = makeStyles((t: Theme) => ({
  cardBody: {
    display: 'flex',
    justifyContent: 'space-between',
    // alignItems: 'center',
  },
  cardBody_icon: {
    fontSize: 64,
    // color: t.palette.primary.main,
    color: t.palette.divider,
  },
}))

export const ReportConsumer = ({report, canEdit}: Props) => {
  const _report = useReportContext()
  const {m} = useI18n()
  const css = useStyles()
  const cssUtils = useCssUtils()
  const theme = useTheme()

  return (
    <Panel stretch>
      <PanelHead
        action={
          canEdit && (
            <EditConsumerDialog
              report={report}
              onChange={user =>
                _report.updateConsumer.fetch({}, report.id, user.firstName, user.lastName, user.email, user.contactAgreement)
              }
            >
              <ScButton icon="edit" color="primary" loading={_report.updateConsumer.loading}>
                {m.edit}
              </ScButton>
            </EditConsumerDialog>
          )
        }
      >
        {m.consumer}
      </PanelHead>
      <PanelBody className={css.cardBody}>
        <div>
          <div className={cssUtils.txtBig}>
            {fromNullable(report.firstName)
              .map(_ => capitalize(_))
              .getOrElse('')}
            &nbsp;
            {fromNullable(report.lastName)
              .map(_ => _.toLocaleUpperCase())
              .getOrElse('')}
          </div>
          <div className={cssUtils.colorTxtSecondary}>{report.email}</div>
          {!report.contactAgreement && (
            <div className={classes(cssUtils.colorError)} style={{marginTop: theme.spacing(0.5)}}>
              <Icon className={cssUtils.inlineIcon}>warning</Icon>
              &nbsp;
              {m.reportConsumerWantToBeAnonymous}
            </div>
          )}
        </div>
        <Icon className={css.cardBody_icon}>person</Icon>
      </PanelBody>
    </Panel>
  )
}
