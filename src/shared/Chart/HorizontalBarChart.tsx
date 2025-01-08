import { Icon, Theme, Tooltip } from '@mui/material'
import withStyles from '@mui/styles/withStyles'
import { mapFor } from 'core/helper'
import { ReactNode, useMemo, useState } from 'react'
import { useI18n } from '../../core/i18n'

export interface HorizontalBarChartData {
  label: ReactNode
  value: number
  color?: string
}

interface Props {
  data?: HorizontalBarChartData[]
  alwaysExpanded?: boolean
}

export const HorizontalBarChart = ({ data, alwaysExpanded = false }: Props) => {
  const [expanded, setExpanded] = useState<boolean>(alwaysExpanded)
  const { m, formatLargeNumber } = useI18n()
  const maxValue = useMemo(
    () => data && Math.max(...data.map((_) => _.value)),
    [data],
  )
  const sumValue = useMemo(
    () => data && data.reduce((sum, _) => _.value + sum, 0),
    [data],
  )
  const firstColumnWidth = 220
  const nbGridColumns = 8

  const filteredData = data?.filter((_) => maxValue && _.value / maxValue > 0.1)
  const displayedData = expanded ? data : filteredData
  const canToggleExpansion = !!(
    filteredData &&
    data &&
    maxValue &&
    !alwaysExpanded &&
    filteredData.length !== data.length
  )

  return (
    <div className="overflow-hidden">
      {displayedData && maxValue && sumValue ? (
        displayedData.map((item, i: number) => {
          const percentOfMax = (item.value / maxValue) * 100
          const percentOfAll = (item.value / sumValue) * 100
          return (
            <div key={i} className="flex my-2 hover:bg-gray-200">
              <div
                className="pr-2 text-right overflow-ellipsis whitespace-nowrap"
                style={{ width: firstColumnWidth, minWidth: firstColumnWidth }}
              >
                {item.label}
              </div>
              <LightTooltip
                title={
                  <div>
                    <div className="text-lg">{item.label}</div>
                    <div className="text-right text-scbluefrance">
                      <p className="text-xl font-bold">
                        {formatLargeNumber(item.value)}{' '}
                        <span className="font-normal text-base">
                          ({Math.ceil(percentOfAll)}%)
                        </span>
                      </p>
                    </div>
                  </div>
                }
              >
                <div style={{ flex: 1 }} className="mt-[-9px]">
                  <div
                    className="text-xs font-bold flex items-center justify-end min-h-[24px] text-scbluefrance border-solid border-b-scbluefrance border-b-4"
                    style={{
                      width: `calc(${percentOfMax}%)`,
                      ...(item.color
                        ? { color: item.color, borderColor: item.color }
                        : null),
                    }}
                  >
                    {percentOfMax > 5 && (
                      <div className="bg-white">
                        {formatLargeNumber(item.value)}
                      </div>
                    )}
                  </div>
                </div>
              </LightTooltip>
            </div>
          )
        })
      ) : (
        <p>{m.noDataAtm} </p>
      )}
      {displayedData && displayedData.length > 0 && (
        <div className="flex my-2">
          <div
            className="self-end "
            style={{ width: firstColumnWidth, minWidth: firstColumnWidth }}
          />
          <div className="relative w-full">
            {mapFor(nbGridColumns, (i) => (
              <div
                key={i}
                className="w-[1px] h-[1000px] bg-gray-300 absolute bottom-0 right-0 z-[-10]"
                style={{
                  left: `calc(${i * (100 / nbGridColumns)}% - 1px)`,
                }}
              />
            ))}
          </div>
        </div>
      )}
      {displayedData && data && canToggleExpansion && (
        <div className="flex justify-center">
          <button
            className="underline flex items-center"
            onClick={() => {
              setExpanded((x) => !x)
            }}
          >
            <Icon>{expanded ? 'unfold_less' : 'unfold_more'}</Icon>
            {expanded ? 'réduire' : 'afficher tout'}
          </button>
        </div>
      )}
    </div>
  )
}

const LightTooltip = withStyles((theme: Theme) => ({
  tooltip: {
    backgroundColor: theme.palette.common.white,
    color: 'rgba(0, 0, 0, 0.87)',
    boxShadow: theme.shadows[1],
    fontSize: 11,
  },
}))(Tooltip)
