import {forwardRef, useState} from 'react'
import {Controller, useForm} from 'react-hook-form'
import {Alert} from '../../../alexlibs/mui-extension'
import {Enum} from '../../../alexlibs/ts-utils'
import {useI18n} from '../../../core/i18n'
import {ScButton} from '../../../shared/Button'
import {Panel} from '../../../shared/Panel'
import {PanelFoot} from '../../../shared/Panel/PanelFoot'
import {ScRadioGroup} from '../../../shared/RadioGroup'
import {ScRadioGroupItem} from '../../../shared/RadioGroupItem'
import {ScInput} from '../../../shared/ScInput'
import {ReportFiles} from '../File/ReportFiles'
import {ReportResponseFormItem} from './ReportResponseFormItem'

import {Box, Step, StepButton, Stepper} from '@mui/material'
import {useMutation} from '@tanstack/react-query'
import {ReportResponse, ReportResponseTypes} from '../../../core/client/event/Event'
import {FileOrigin} from '../../../core/client/file/UploadedFile'
import {Report} from '../../../core/client/report/Report'
import {useApiContext} from '../../../core/context/ApiContext'
import {Id} from '../../../core/model'
import {useToast} from '../../../core/toast'
import {CleanWidePanel} from 'shared/Panel/simplePanels'

interface Props {
  report: Report
  onConfirm?: (_: ReportResponse) => void
  ref: React.RefObject<HTMLDivElement>
}

const stepStyles = {
  mb: 4,
  mt: 2,
  '& .MuiStepIcon-root': {
    fontSize: '32px',
    mt: '-4px',
  },
  '& .MuiStepLabel-label': {
    fontSize: '20px',
  },
}

export const ReportResponseForm = forwardRef(({report, onConfirm, ...props}: Props, ref: any) => {
  const {m} = useI18n()
  const {
    register,
    handleSubmit,
    reset,
    control,
    watch,
    formState: {errors},
  } = useForm<ReportResponse>()
  const {api} = useApiContext()
  const _postResponse = useMutation({
    mutationFn: (params: {id: Id; response: ReportResponse}) => api.secured.reports.postResponse(params.id, params.response),
  })
  const {toastSuccess} = useToast()
  const maxDetailsCharLength = 10000

  const steps = [{label: m.responseToConsumer}, {label: m.responseToDGCCRF, optional: true}]
  const [activeStep, setActiveStep] = useState(0)
  const watchResponseType = watch('responseType')
  const watchConsumerDetails = watch('consumerDetails')
  const consumerStep = activeStep === 0
  const dgccrfStep = activeStep === 1

  const submitForm = async (form: ReportResponse) => {
    await _postResponse.mutateAsync({id: report.id, response: form})
    toastSuccess(m.proAnswerSent)
    onConfirm?.(form)
    reset()
  }

  return (
    <CleanWidePanel ref={ref}>
      <h1 className="font-bold text-3xl mb-8">Votre réponse</h1>
      <Stepper activeStep={activeStep} alternativeLabel sx={stepStyles}>
        {steps.map(({label}, index) => {
          return (
            <Step key={label}>
              <StepButton onClick={() => setActiveStep(index)}>{label}</StepButton>
            </Step>
          )
        })}
      </Stepper>
      {consumerStep ? (
        <>
          <ReportResponseFormItem>
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
      <PanelFoot spaceBetween={dgccrfStep} alignEnd={consumerStep}>
        {consumerStep ? (
          <>
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
              <ScButton loading={_postResponse.isPending} onClick={handleSubmit(submitForm)} color="primary" variant="contained">
                {m.confirm}
              </ScButton>
            </Box>
          </>
        )}
      </PanelFoot>
    </CleanWidePanel>
  )
})
