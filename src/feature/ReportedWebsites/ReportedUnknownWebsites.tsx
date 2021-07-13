import React from 'react'
import {Page, PageTitle} from '../../shared/Layout'
import {useI18n} from '../../core/i18n'
import {useCssUtils} from "../../core/helper/useCssUtils";
import {makeStyles, Theme} from "@material-ui/core";
import {Redirect, Route, Switch, useRouteMatch} from "react-router-dom";
import {siteMap} from "../../core/siteMap";
import {PageTab, PageTabs} from "../../shared/Layout/Page/PageTabs";
import {CompaniesToActivate} from "../Companies/CompaniesToActivate";


const useStyles = makeStyles((t: Theme) => ({}))

export const ReportedUnknownWebsites = () => {

    const {m,} = useI18n()
    const cssUtils = useCssUtils()
    const css = useStyles()
    const {path} = useRouteMatch()

    return (
        <Page>
        </Page>
    )

}
