import { Box } from '@mui/material'
import { Dispatch, SetStateAction, useEffect, useMemo, useState } from 'react'
import { CleanWidePanel } from 'shared/Panel/simplePanels'
import { Txt } from '../../alexlibs/mui-extension'
import { ApiError } from '../../core/client/ApiClient'
import { ReportTag } from '../../core/client/report/Report'
import { useConnectedContext } from '../../core/context/connected/connectedContext'
import { useI18n } from '../../core/i18n'
import { styleUtils } from '../../core/theme'
import { Panel, PanelBody } from '../../shared/Panel'
import { PanelProps } from '../../shared/Panel/Panel'
import { SelectMonth } from '../../shared/SelectMonth'
import { useGetDateForMonthAndPreviousOne } from './useGetDateForMonthAndPreviousOne'

interface AsyncPercent {
  loading: boolean
  error?: string
  value?: {
    reportsInternets: number
    reportsInternetsWithCompany: number
    reportsInternetsWithCountry: number
    reportsInternetsWithoutAnything: number
  }
}

export const StatsReportsInternetPanel = () => {
  const { api: api } = useConnectedContext()
  const { m } = useI18n()

  const currentMonth = useMemo(() => new Date().getMonth(), [])
  const [selectedMonth, setSelectedMonth] = useState<number>(currentMonth)

  const [asyncPercent, setAsyncPercent] = useState<AsyncPercent>({
    loading: false,
  })
  const [asyncPercentLastMonth, setAsyncPercentLastMonth] =
    useState<AsyncPercent>({ loading: false })

  const dates = useGetDateForMonthAndPreviousOne(selectedMonth)

  const fetch = (start: Date, end: Date) => {
    return Promise.all([
      api.secured.stats
        .getReportCount({
          start,
          end,
        })
        .then((_) => _.value),
      api.secured.stats
        .getReportCount({
          start,
          end,
          withTags: [ReportTag.Internet],
        })
        .then((_) => _.value),
      api.secured.stats
        .getReportCount({
          start,
          end,
          withTags: [ReportTag.Internet],
          hasCompany: true,
        })
        .then((_) => _.value),
      api.secured.stats
        .getReportCount({
          start,
          end,
          withTags: [ReportTag.Internet],
          hasCompany: false,
          hasForeignCountry: true,
        })
        .then((_) => _.value),
      api.secured.stats
        .getReportCount({
          start,
          end,
          withTags: [ReportTag.Internet],
          hasCompany: false,
          hasForeignCountry: false,
        })
        .then((_) => _.value),
    ])
  }

  const getValues = async (
    start: Date,
    end: Date,
    setState: Dispatch<SetStateAction<AsyncPercent>>,
  ) => {
    setState((prev) => ({ ...prev, loading: true }))
    fetch(start, end)
      .then(
        ([
          reports,
          reportsInternets,
          reportsInternetsWithCompany,
          reportsInternetsWithCountry,
          reportsInternetsWithoutAnything,
        ]) => {
          setState({
            loading: false,
            error: undefined,
            value: {
              reportsInternets: (+reportsInternets / +reports) * 100,
              reportsInternetsWithCompany:
                (+reportsInternetsWithCompany / +reportsInternets) * 100,
              reportsInternetsWithCountry:
                (+reportsInternetsWithCountry / +reportsInternets) * 100,
              reportsInternetsWithoutAnything:
                (+reportsInternetsWithoutAnything / +reportsInternets) * 100,
            },
          })
        },
      )
      .catch((err: ApiError) =>
        setState((prev) => ({ ...prev, error: err.message })),
      )
  }

  useEffect(() => {
    setAsyncPercentLastMonth((prev) => ({ ...prev, loading: true }))
    getValues(dates.current.start, dates.current.end, setAsyncPercent)
    getValues(
      dates.lastMonth.start,
      dates.lastMonth.end,
      setAsyncPercentLastMonth,
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dates])

  return (
    <CleanWidePanel
      loading={asyncPercent.loading || asyncPercentLastMonth.loading}
    >
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-xl font-bold">{m.statsInternetsTitle}</h2>
        <SelectMonth value={selectedMonth} onChange={setSelectedMonth} />
      </div>
      <div>
        {asyncPercent.value && asyncPercentLastMonth.value && (
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'space-around',
              alignItems: 'center',
            }}
          >
            <StatsCard
              sx={{ mr: 1 }}
              title={m.statsInternets_all}
              desc={m.statsInternets_all_desc}
              value={asyncPercent.value.reportsInternets}
              previousValue={asyncPercentLastMonth.value.reportsInternets}
            />
            <Box
              sx={{
                fontSize: 220,
                color: (t) => t.palette.divider,
              }}
            >
              {'{'}
            </Box>
            <Box sx={{ ml: 1 }}>
              <StatsCard
                title={m.statsInternets_withCompany}
                value={asyncPercent.value.reportsInternetsWithCompany}
                previousValue={
                  asyncPercentLastMonth.value.reportsInternetsWithCompany
                }
              />
              <StatsCard
                title={m.statsInternets_withCountry}
                desc={m.statsInternets_withCountry_desc}
                value={asyncPercent.value.reportsInternetsWithCountry}
                previousValue={
                  asyncPercentLastMonth.value.reportsInternetsWithCountry
                }
              />
              <StatsCard
                title={m.statsInternets_withNothing}
                desc={m.statsInternets_withNothing_desc}
                value={asyncPercent.value.reportsInternetsWithoutAnything}
                previousValue={
                  asyncPercentLastMonth.value.reportsInternetsWithoutAnything
                }
              />
            </Box>
          </div>
        )}
      </div>
    </CleanWidePanel>
  )
}

interface StatsCardProps extends PanelProps {
  value: number
  previousValue: number
  title: string
  desc?: string
}

const StatsCard = ({
  sx,
  value,
  previousValue,
  title,
  desc,
  ...props
}: StatsCardProps) => {
  const evolution = useMemo(() => {
    return Math.round(value - previousValue)
  }, [value, previousValue])

  return (
    <Panel elevation={2} sx={{ maxWidth: 300, ...sx }} {...props}>
      <PanelBody>
        <div
          style={{
            lineHeight: 1.5,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <span>
            <span style={{ fontSize: 36 }}>{Math.round(value)}</span>
            <span style={{ fontSize: 22 }}> %</span>
          </span>
          <Box
            component="span"
            sx={{
              fontSize: (t) => styleUtils(t).fontSize.big,
              fontWeight: (t) => t.typography.fontWeightBold,
              color: (t) =>
                evolution > 0 ? t.palette.success.light : t.palette.error.main,
            }}
          >
            {evolution > 0 ? '+' : '-'}
            {Math.abs(evolution)}
          </Box>
        </div>
        <Txt block bold>
          {title}
        </Txt>
        <Txt block color="hint" size="small">
          {desc}
        </Txt>
      </PanelBody>
    </Panel>
  )
}
