import * as React from 'react'
import {useI18n} from '../../../core/i18n'
import {useMemoFn} from '../../../shared/hooks/UseMemoFn'
import {Enum} from '@alexandreannic/ts-utils/lib/common/enum/Enum'
import {Box, Icon, Skeleton, Tooltip} from '@mui/material'
import {Panel, PanelBody, PanelHead} from '../../../shared/Panel'
import {HorizontalBarChart} from '../../../shared/HorizontalBarChart/HorizontalBarChart'
import {ReportStatus, ReportStatusPro} from '@signal-conso/signalconso-api-sdk-js'
import {Emoticon} from '../../../shared/Emoticon/Emoticon'
import {useCompanyStats} from '../useCompanyStats'
import {useEffect} from 'react'
import {useEffectFn} from '../../../shared/hooks/UseEffectFn'
import {fromNullable} from 'fp-ts/es6/Option'
import {Txt} from 'mui-extension/lib/Txt/Txt'
import {useCssUtils} from '../../../core/helper/useCssUtils'
import {useToast} from '../../../core/toast'

interface Props {
  companyId: string
}

export const ReviewDistribution = <T extends ReportStatus | ReportStatusPro>({companyId}: Props) => {
  const {m} = useI18n()
  const _stats = useCompanyStats(companyId)
  const cssUtils = useCssUtils()
  const {toastError} = useToast()
  useEffect(() => {
    _stats.responseReviews.fetch()
  }, [companyId])

  useEffectFn(_stats.responseReviews.error, toastError)

  const reviewDistribution = useMemoFn(_stats.responseReviews.entity, _ =>
    _.positive > 0 || _.negative > 0 || _.neutral > 0
      ? [
          {
            label: (
              <Box sx={{display: 'flex', alignItems: 'center'}}>
                <Emoticon sx={{fontSize: 30}} label="happy">
                  😀
                </Emoticon>
                <Tooltip title={m.positive}>
                  <Icon
                    fontSize="small"
                    sx={{
                      verticalAlign: 'middle',
                      color: t => t.palette.text.disabled,
                      marginLeft: t => t.spacing(1),
                    }}
                  >
                    help
                  </Icon>
                </Tooltip>
              </Box>
            ),
            value: _.positive,
            color: '#4caf50',
          },
          {
            label: (
              <Box sx={{display: 'flex', alignItems: 'center'}}>
                <Emoticon sx={{fontSize: 30}} label="neutral">
                  😐
                </Emoticon>
                <Tooltip title={m.neutral}>
                  <Icon
                    fontSize="small"
                    sx={{
                      verticalAlign: 'middle',
                      color: t => t.palette.text.disabled,
                      marginLeft: t => t.spacing(1),
                    }}
                  >
                    help
                  </Icon>
                </Tooltip>
              </Box>
            ),
            value: _.neutral,
            color: '#f57c00',
          },
          {
            label: (
              <Box sx={{display: 'flex', alignItems: 'center'}}>
                <Emoticon sx={{fontSize: 30}} label="sad">
                  🙁
                </Emoticon>
                <Tooltip title={m.negative}>
                  <Icon
                    fontSize="small"
                    sx={{
                      verticalAlign: 'middle',
                      color: t => t.palette.text.disabled,
                      marginLeft: t => t.spacing(1),
                    }}
                  >
                    help
                  </Icon>
                </Tooltip>
              </Box>
            ),
            value: _.negative,
            color: '#d32f2f',
          },
        ]
      : [],
  )

  return (
    <Panel>
      <PanelHead>{m.consumerReviews}</PanelHead>
      {fromNullable(_stats.responseReviews.entity)
        .map(_ => (
          <PanelBody>
            <Txt color="hint" block className={cssUtils.marginBottom3}>
              {m.consumerReviewsDesc}
            </Txt>
            <HorizontalBarChart width={80} data={reviewDistribution} grid />
          </PanelBody>
        ))
        .getOrElse(
          <PanelBody>
            <Skeleton height={66} width="100%" />
          </PanelBody>,
        )}
    </Panel>
  )
}
