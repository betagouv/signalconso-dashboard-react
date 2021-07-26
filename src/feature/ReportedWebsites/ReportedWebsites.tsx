import React from 'react'
import {Page, PageTitle} from '../../shared/Layout'
import {useI18n} from '../../core/i18n'
import {Redirect, Route, Switch, useRouteMatch} from "react-router-dom";
import {siteMap} from "../../core/siteMap";
import {PageTab, PageTabs} from "../../shared/Layout/Page/PageTabs";
import {ReportedUnknownWebsites} from "./ReportedUnknownWebsites";
import {ReportedCompaniesWebsites} from "./ReportedCompaniesWebsites";


export const ReportedWebsites = () => {

    const {m,} = useI18n()
    const {path} = useRouteMatch()

    return (
        <Page>
            <PageTitle>{m.reportedWebsites}</PageTitle>
            <PageTabs>
                <PageTab to={siteMap.reportedCompanyWebsites} label={m.reportedCompaniesWebsites}/>
                <PageTab to={siteMap.reportedWebsites_unknown} label={m.reportedUnknownWebsites}/>
            </PageTabs>
            <Switch>
                <Redirect exact from={path} to={siteMap.reportedCompanyWebsites}/>
                <Route path={siteMap.reportedCompanyWebsites} component={ReportedCompaniesWebsites}/>
                <Route path={siteMap.reportedWebsites_unknown} component={ReportedUnknownWebsites}/>
            </Switch>
        </Page>
    )

}
