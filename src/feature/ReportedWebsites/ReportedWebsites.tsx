import React, {useEffect} from 'react'
import {Page, PageTitle} from '../../shared/Layout'
import {useI18n} from '../../core/i18n'

export const ReportedWebsites = () => {
  const {m} = useI18n()

  useEffect(() => {
    // apiSdk.secured.website.search()
  }, [])

  return (
    <Page>
      <PageTitle>{m.menu_websites}</PageTitle>
    </Page>
  )
}
