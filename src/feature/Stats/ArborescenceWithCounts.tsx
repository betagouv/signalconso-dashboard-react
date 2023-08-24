import React, {useEffect, useMemo, useState} from 'react'
import {useFetcher} from '../../alexlibs/react-hooks-lib'
import {useLogin} from '../../core/context/LoginContext'
import {Panel, PanelBody, PanelHead} from '../../shared/Panel'
import {PeriodPicker} from '../../shared/PeriodPicker'
import {DebouncedInput} from '../../shared/DebouncedInput'
import {ReportNode} from '../../core/client/report/ReportNode'
import {Badge, Box, Grid, Icon, useTheme} from '@mui/material'
import {IconBtn, Txt} from '../../alexlibs/mui-extension'
import {useI18n} from '../../core/i18n'
import {ScButton} from '../../shared/Button'
import {Page} from '../../shared/Page'
import {parseInt} from 'lodash'
import {SelectDepartments} from '../../shared/SelectDepartments/SelectDepartments'
import {AccountEventActions, ActionResultNames, EventCategories, Matomo, StatisticsActions} from '../../core/plugins/Matomo'

const compare = (a?: string[], b?: string[]): number => {
  if (!a || !b) return 0
  else if (a.length === 0 || b.length === 0) return 0
  else if (a[0] === b[0]) return compare(a.slice(1), b.slice(1))
  else return parseInt(a[0]) - parseInt(b[0])
}
const sortById = (reportNode1: ReportNode, reportNode2: ReportNode) =>
  compare(reportNode1.id?.split('.'), reportNode2.id?.split('.'))

export const ArborescenceWithCounts = () => {
  const {apiSdk: api} = useLogin()
  const {m} = useI18n()

  const begin = new Date()
  begin.setDate(begin.getDate() - 90)

  const [openAll, setOpenAll] = useState(false)
  const [start, setStart] = useState<Date | undefined>(begin)
  const [end, setEnd] = useState<Date | undefined>(undefined)
  const [departments, setDepartments] = useState<string[] | undefined>(undefined)

  const countBySubCategories = useFetcher(api.secured.reports.getCountBySubCategories)

  useEffect(() => {
    countBySubCategories
      .fetch({force: true}, {start, end, departments})
      .then(_ =>
        Matomo.trackEvent(EventCategories.statistics, StatisticsActions.reportCountsBySubcategories, ActionResultNames.success),
      )
  }, [start, end, departments])

  const resetFilters = () => {
    setStart(undefined)
    setEnd(undefined)
    setDepartments(undefined)
  }

  const badgeCount = start && end ? 2 : start || end ? 1 : 0

  return (
    <Page>
      <Panel>
        <PanelHead>{m.dateFilters}</PanelHead>
        <PanelBody>
          <Grid container spacing={1}>
            <Grid item sm={6} xs={12}>
              <DebouncedInput<[Date | undefined, Date | undefined]>
                value={[start, end]}
                onChange={([start, end]) => {
                  setStart(start)
                  setEnd(end)
                }}
              >
                {(value, onChange) => <PeriodPicker value={value} onChange={onChange} sx={{mr: 1}} fullWidth />}
              </DebouncedInput>
            </Grid>
            <Grid item sm={6} xs={12}>
              <SelectDepartments
                label={m.departments}
                value={departments}
                onChange={departments => setDepartments(departments)}
                sx={{mr: 1}}
                fullWidth
              />
            </Grid>
          </Grid>
          <Box
            sx={{
              mt: 2,
              display: 'flex',
              justifyContent: 'flex-end',
              '& > *': {
                mb: 1,
                ml: 1,
              },
            }}
          >
            <Badge color="error" badgeContent={badgeCount} hidden={badgeCount === 0}>
              <ScButton icon="clear" onClick={resetFilters} variant="outlined" color="primary">
                {m.removeAllFilters}
              </ScButton>
            </Badge>
          </Box>
        </PanelBody>
      </Panel>
      <Panel loading={countBySubCategories.loading}>
        <PanelHead>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            {m.statsCountBySubCategories}
            <ScButton onClick={() => setOpenAll(!openAll)} variant="contained" color="primary">
              {m.expandAll}
            </ScButton>
          </Box>
        </PanelHead>
        <PanelBody>
          {countBySubCategories.entity?.sort(sortById).map(reportNode => (
            <Node open={openAll} reportNode={reportNode} />
          ))}
        </PanelBody>
      </Panel>
    </Page>
  )
}

const Node = ({reportNode, open}: {reportNode: ReportNode; open?: boolean}) => {
  const iconWidth = 40
  const iconMargin = 8
  const theme = useTheme()
  const [isOpen, setIsOpen] = useState(false)
  useEffect(() => {
    setIsOpen(!!open)
  }, [open])

  return (
    <Box sx={{display: 'flex', alignItems: 'flex-start', mb: 2}}>
      <Box
        sx={{
          width: iconWidth,
          marginRight: `${iconMargin}px`,
        }}
      >
        {reportNode.children.length !== 0 ? (
          <IconBtn color="primary" onClick={() => setIsOpen(_ => !_)}>
            <Icon>{isOpen ? 'keyboard_arrow_down' : 'keyboard_arrow_right'}</Icon>
          </IconBtn>
        ) : (
          <IconBtn disabled>
            <Icon>remove</Icon>
          </IconBtn>
        )}
      </Box>
      <Box>
        <Box sx={{minHeight: 42, display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
          {reportNode.id ? (
            <Box>
              <Txt>{reportNode.name}</Txt> <Txt color="hint">{reportNode.id}</Txt>
            </Box>
          ) : (
            <Box>
              <Txt color="hint">{reportNode.name}</Txt> <Txt color="hint">(Ancienne catégorie)</Txt>
            </Box>
          )}
          <Txt color="primary"> Signalements : {reportNode.count}</Txt>
          <Txt color="primary"> Réclamations : {reportNode.reclamations}</Txt>
          <Box>
            {reportNode.tags?.map(tag => (
              <Box
                sx={{
                  mr: 1,
                  borderRadius: 100,
                  height: 26,
                  px: 1.5,
                  backgroundColor: t => t.palette.action.disabledBackground,
                  display: 'inline-flex',
                  alignItems: 'center',
                  fontSize: theme.typography.fontSize,
                  // fontWeight: t => t.typography.fontWeightBold,
                  color: t => t.palette.text.secondary,
                }}
                key={tag}
              >
                {tag}
              </Box>
            ))}
          </Box>
        </Box>
        {isOpen && reportNode.children.length !== 0 && (
          <Box
            sx={{
              my: 1,
              position: 'relative',
              '&:before': {
                content: "' '",
                height: '100%',
                width: '1px',
                position: 'absolute',
                background: t => t.palette.divider,
                left: -iconWidth / 2 - iconMargin,
                // borderLeft: t => `1px solid ${t.palette.divider}`
              },
            }}
          >
            {reportNode.children.sort(sortById).map(reportNode => (
              <Node open={open} reportNode={reportNode} />
            ))}
          </Box>
        )}
      </Box>
    </Box>
  )
}
