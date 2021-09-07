import {Panel, PanelBody, PanelHead} from '../../../shared/Panel'
import {classes} from '../../../core/helper/utils'
import {AddressComponent} from '../../../shared/Address/Address'
import {fromNullable} from 'fp-ts/lib/Option'
import {Txt} from 'mui-extension/lib/Txt/Txt'
import {Icon, makeStyles, Theme, useTheme} from '@material-ui/core'
import {SelectCompany} from '../../../shared/SelectCompany/SelectCompany'
import {ScButton} from '../../../shared/Button/Button'
import React from 'react'
import {Report} from '../../../core/api'
import {useReportContext} from '../../../core/context/ReportContext'
import {useI18n} from '../../../core/i18n'
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

export const ReportCompany = ({report, canEdit}: Props) => {
  const _report = useReportContext()
  const {m} = useI18n()
  const css = useStyles()
  const cssUtils = useCssUtils()
  const theme = useTheme()
  return (
    <Panel stretch>
      <PanelHead action={
        canEdit && (
          <SelectCompany
            siret={report.companySiret}
            onChange={company => {
              _report.updateCompany.fetch({}, report.id, company)
            }}
          >
            <ScButton icon="edit" color="primary" loading={_report.updateCompany.loading}>
              {m.edit}
            </ScButton>
          </SelectCompany>
        )}
      >{m.company}</PanelHead>
      <PanelBody className={css.cardBody}>
        <div>
          <div className={cssUtils.txtBig} style={{marginBottom: theme.spacing(1 / 2)}}>
            {report.companySiret}
          </div>
          <div className={classes(cssUtils.colorTxtSecondary, cssUtils.txtSmall)}>
            <div className={cssUtils.txtBold}>{report.companyName}</div>
            <AddressComponent address={report.companyAddress}/>
          </div>
          <div>{report.vendor}</div>
          {fromNullable(report.websiteURL)
            .map(_ => (
              <Txt link block className={cssUtils.marginTop}>
                <a href={_} target="_blank">
                  {_}
                </a>
              </Txt>
            ))
            .toUndefined()}
        </div>
        <Icon className={css.cardBody_icon}>store</Icon>
      </PanelBody>
    </Panel>
  )
}
