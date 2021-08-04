import {Page, PageTitle} from '../../shared/Layout'
import {useI18n} from '../../core/i18n'
import React, {useEffect} from 'react'
import {Panel, PanelBody} from '../../shared/Panel'
import {AnimateList, Btn} from 'mui-extension/lib'
import {createStyles, Grid, Icon, makeStyles, Theme} from '@material-ui/core'
import {useCompaniesContext} from '../../core/context/CompaniesContext'
import {Txt} from 'mui-extension/lib/Txt/Txt'
import {useCssUtils} from '../../core/helper/useCssUtils'
import {classes} from '../../core/helper/utils'
import {PanelFoot} from '../../shared/Panel/PanelFoot'
import {EntityIcon} from '../../core/EntityIcon'

export const CompaniesPro = () => {
  const {m} = useI18n()
  const _companies = useCompaniesContext()
  const cssUtils = useCssUtils()

  useEffect(() => {
    _companies.accessesByPro.fetch()
  }, [])

  return (
    <Page>
      <PageTitle>{m.myCompanies}</PageTitle>

      <Grid container spacing={2}>
        <AnimateList delay={100}>
          {_companies.accessesByPro.entity?.map(company =>
            <Grid item xs={12} sm={6} md={4} key={company.id}>
              <Panel style={{marginBottom: 0}}>
                <PanelBody>
                  <Txt block gutterBottom size="title">{company.name}</Txt>
                  <Row icon="gavel">{company.siret}</Row>
                  <Row icon="location_on" className={cssUtils.colorTxtSecondary}>
                    {company.address.number}&nbsp;
                    {company.address.street}&nbsp;
                    {company.address.addressSupplement}
                    <br/>
                    {company.address.postalCode}&nbsp;
                    {company.address.city}
                  </Row>
                </PanelBody>
                <PanelFoot>
                  <Btn variant="outlined" color="primary" icon="vpn_key">{m.accesses}</Btn>
                  <Btn variant="outlined" color="primary" icon={EntityIcon.report}>{m.reports}</Btn>
                </PanelFoot>
              </Panel>
            </Grid>,
          )}
        </AnimateList>
      </Grid>
    </Page>
  )
}

interface RowProps {
  icon: string
  children: any
  className?: string
}

const useRowStyles = makeStyles((t: Theme) => createStyles({
  root: {
    display: 'flex',
    marginBottom: t.spacing(2),
  },
  icon: {
    color: t.palette.text.secondary,
    marginRight: t.spacing(2),
  },
}))

const Row = ({icon, children, className}: RowProps) => {
  const css = useRowStyles()
  return (
    <div className={classes(css.root, className)}>
      <Icon className={css.icon}>{icon}</Icon>
      <div>{children}</div>
    </div>
  )
}
