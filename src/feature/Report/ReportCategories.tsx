import {useCssUtils} from '../../core/helper/useCssUtils'
import {Icon, Theme} from '@mui/material'
import makeStyles from '@mui/styles/makeStyles'
import {styleUtils} from '../../core/theme'
import {classes} from '../../core/helper/utils'
import React from 'react'

const useReportCategoryStyles = makeStyles((t: Theme) => ({
  root: {
    display: 'inline-flex',
    alignItems: 'center',
    marginBottom: t.spacing(0.5),
    border: '1px solid ' + t.palette.divider,
    borderRadius: 40,
    padding: styleUtils(t).spacing(0.5, 1, 0.5, 1),
  },
  icon: {
    fontSize: 20,
    // color: t.palette.divider,
    color: t.palette.primary.main,
    marginRight: t.spacing(0.5),
  },
}))

const ReportCategory = ({children}: {children: any}) => {
  const css = useReportCategoryStyles()
  const cssUtils = useCssUtils()

  return (
    <div className={css.root}>
      <Icon className={classes(css.icon)}>check_circle</Icon>
      {children}
    </div>
  )
}

export interface ReportCategoriesProps {
  categories: any[]
}

const useReportCategoriesStyles = makeStyles((t: Theme) => ({
  root: {
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  separator: {
    color: t.palette.divider,
    // marginRight: t.spacing(.5),
    // marginLeft: t.spacing(.5),
    display: 'inline',
  },
}))

export const ReportCategories = ({categories}: ReportCategoriesProps) => {
  const css = useReportCategoriesStyles()
  return (
    <div className={css.root}>
      {categories.map((category, i) => (
        <React.Fragment key={i}>
          <ReportCategory>{category}</ReportCategory>
          {i < categories.length - 1 && <Icon className={css.separator}>chevron_right</Icon>}
        </React.Fragment>
      ))}
    </div>
  )
}
