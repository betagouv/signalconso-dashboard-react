import React, {forwardRef, useEffect, useState} from 'react'
import {useI18n} from '../../../core/i18n'
import {ScRadioGroup} from '../../../shared/RadioGroup'
import {ScRadioGroupItem} from '../../../shared/RadioGroupItem'
import {Enum} from '../../../alexlibs/ts-utils'
import {Alert} from '../../../alexlibs/mui-extension'
import {ScInput} from '../../../shared/ScInput'
import {ReportResponseFormItem} from './ReportResponseFormItem'
import {Panel, PanelBody, PanelHead} from '../../../shared/Panel'
import {PanelFoot} from '../../../shared/Panel/PanelFoot'
import {ScButton} from '../../../shared/Button'
import {ReportFiles} from '../File/ReportFiles'
import {Controller, useForm} from 'react-hook-form'
import {useReportContext} from '../../../core/context/ReportContext'

import {useToast} from '../../../core/toast'
import {PanelProps} from '../../../shared/Panel/Panel'
import {ReportResponse, ReportResponseTypes} from '../../../core/client/event/Event'
import {FileOrigin} from '../../../core/client/file/UploadedFile'
import {Report} from '../../../core/client/report/Report'
import {ScOption} from 'core/helper/ScOption'
import {Box, Step, StepButton, Stepper} from '@mui/material'

interface Props extends PanelProps {
  report: Report
  onCancel: () => void
  onConfirm?: (_: ReportResponse) => void
}

const stepStyles = {
  mb: 4,
  mt: 2,
  '& .Mui-active': {
    '&.MuiStepIcon-root': {
      fontSize: '32px',
      mt: '-4px',
    },
    '&.MuiStepLabel-label': {
      fontSize: '20px',
    },
  },
}

export const ReportResponseForm = forwardRef(({report, onCancel, onConfirm, ...props}: Props, ref: any) => {
  const {m} = useI18n()
  const {
    register,
    handleSubmit,
    reset,
    control,
    watch,
    formState: {errors, isValid},
  } = useForm<ReportResponse>()
  const _report = useReportContext()
  const {toastError, toastSuccess} = useToast()
  const maxDetailsCharLength = 10000

  const steps = [{label: m.responseToConsumer}, {label: m.responseToDGCCRF, optional: true}]
  const [activeStep, setActiveStep] = useState(0)
  const watchResponseType = watch('responseType')
  const watchConsumerDetails = watch('consumerDetails')
  const consumerStep = activeStep === 0
  const dgccrfStep = activeStep === 1

  const submitForm = async (form: ReportResponse) => {
    await _report.postResponse.fetch({}, report.id, form)
    toastSuccess(m.proAnswerSent)
    onConfirm?.(form)
    reset()
  }

  useEffect(() => {
    ScOption.from(_report.postResponse.error).map(toastError)
  }, [_report.postResponse.error])

  return (
    <Panel elevation={5} ref={ref} {...props}>
      <PanelHead>{m.answer}</PanelHead>
      <PanelBody>
        <Stepper activeStep={activeStep} alternativeLabel sx={stepStyles}>
          {steps.map(({label, optional}, index) => {
            return (
              <Step key={label}>
                <StepButton onClick={() => setActiveStep(index)}>{label}</StepButton>
              </Step>
            )
          })}
        </Stepper>
        {consumerStep ? (
          <>
            <ReportResponseFormItem title={m.proAnswerResponseType}>
              <Controller
                name="responseType"
                rules={{required: {value: true, message: m.required}}}
                control={control}
                render={({field}) => (
                  <ScRadioGroup error={!!errors.responseType} dense sx={{mb: 2}} {...field}>
                    {Enum.values(ReportResponseTypes).map(responseType => (
                      <ScRadioGroupItem value={responseType} key={responseType}>
                        {m.reportResponseDesc[responseType]}
                      </ScRadioGroupItem>
                    ))}
                  </ScRadioGroup>
                )}
              />
            </ReportResponseFormItem>

            <ReportResponseFormItem title={m.proAnswerYourAnswer} desc={m.proAnswerYourAnswerDesc}>
              <ScInput
                {...register('consumerDetails', {
                  required: {value: true, message: m.required},
                  maxLength: {value: maxDetailsCharLength, message: m.textTooLarge(maxDetailsCharLength)},
                })}
                helperText={errors.consumerDetails?.message}
                error={!!errors.consumerDetails}
                fullWidth
                multiline
                rows={5}
                placeholder={m.text + '...'}
                maxRows={8}
              />
            </ReportResponseFormItem>
            <Alert type="info" deletable persistentDelete gutterBottom>
              {m.proAnswerVisibleByDGCCRF}
            </Alert>
          </>
        ) : (
          <>
            <ReportResponseFormItem title={m.proAnswerYourDGCCRFAnswer} desc={m.proAnswerYourDGCCRFAnswerDesc}>
              <ScInput
                {...register('dgccrfDetails', {
                  maxLength: {value: maxDetailsCharLength, message: m.textTooLarge(maxDetailsCharLength)},
                })}
                helperText={errors.dgccrfDetails?.message}
                error={!!errors.dgccrfDetails}
                fullWidth
                multiline
                rows={5}
                placeholder={m.text + '...'}
                maxRows={8}
              />
            </ReportResponseFormItem>
            <ReportResponseFormItem title={m.attachedFiles} desc={m.onlyVisibleByDGCCRF}>
              <Controller
                name="fileIds"
                control={control}
                render={({field}) => (
                  <ReportFiles
                    reportId={report.id}
                    fileOrigin={FileOrigin.Professional}
                    onNewFile={file => field.onChange([...(field.value ?? []), file.id])}
                  />
                )}
              />
            </ReportResponseFormItem>
          </>
        )}
      </PanelBody>
      <PanelFoot spaceBetween={dgccrfStep} alignEnd={consumerStep}>
        {consumerStep ? (
          <>
            <ScButton onClick={onCancel} color="primary">
              {m.close}
            </ScButton>
            <ScButton
              onClick={() => setActiveStep(1)}
              color="primary"
              variant="contained"
              disabled={!watchResponseType || !watchConsumerDetails}
            >
              {m.next}
            </ScButton>
          </>
        ) : (
          <>
            <ScButton onClick={() => setActiveStep(0)} color="primary">
              {m.previous}
            </ScButton>
            <Box sx={{pl: 2}}>
              <ScButton onClick={onCancel} color="primary">
                {m.close}
              </ScButton>
              <ScButton
                loading={_report.postResponse.loading}
                onClick={handleSubmit(submitForm)}
                color="primary"
                variant="contained"
              >
                {m.confirm}
              </ScButton>
            </Box>
          </>
        )}
      </PanelFoot>
    </Panel>
  )
})
