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
import {
  AcceptedDetails,
  acceptedDetails,
  NotConcernedDetails,
  notConcernedDetails,
  RejectedDetails,
  rejectedDetails,
  ReportResponse,
  ReportResponseTypes,
} from '../../../core/client/event/Event'
import {FileOrigin} from '../../../core/client/file/UploadedFile'
import {Report} from '../../../core/client/report/Report'
import {useApiContext} from '../../../core/context/ApiContext'
import {Id} from '../../../core/model'
import {CleanWidePanel} from 'shared/Panel/simplePanels'
import CharacterCounter from './CharacterCounter'
import SuccessModal from './SuccessModal'

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
    setValue,
    formState: {errors},
  } = useForm<ReportResponse>()
  const {api} = useApiContext()
  const _postResponse = useMutation({
    mutationFn: (params: {id: Id; response: ReportResponse}) => api.secured.reports.postResponse(params.id, params.response),
  })
  const maxDetailsCharLength = 10000

  const steps = [{label: m.responseToConsumer}, {label: m.responseToDGCCRF, optional: true}]
  const [activeStep, setActiveStep] = useState(0)
  const watchResponseType = watch('responseType')
  const watchResponseDetails = watch('responseDetails')
  const watchOtherResponseDetails = watch('otherResponseDetails')
  const watchConsumerDetails = watch('consumerDetails') && watch('consumerDetails')?.length <= maxDetailsCharLength
  const consumerStep = activeStep === 0
  const dgccrfStep = activeStep === 1

  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false)
  const [submittedForm, setSubmittedForm] = useState<ReportResponse | null>(null)

  const submitForm = async (form: ReportResponse) => {
    await _postResponse.mutateAsync({id: report.id, response: form})
    if (form.responseType === 'ACCEPTED') {
      setSubmittedForm(form)
      setIsSuccessModalOpen(true)
    } else {
      onConfirm?.(form)
      reset()
    }
  }
  const handleModalClose = () => {
    if (submittedForm) {
      onConfirm?.(submittedForm)
      reset()
      setSubmittedForm(null)
    }
    setIsSuccessModalOpen(false)
  }

  const computeDetails = (responseType: ReportResponseTypes) => {
    switch (responseType) {
      case 'ACCEPTED':
        return acceptedDetails.map(_ => _)
      case 'REJECTED':
        return rejectedDetails.map(_ => _)
      default:
        return notConcernedDetails.map(_ => _)
    }
  }

  const computeDetailsTitle = (responseType: ReportResponseTypes) => {
    switch (responseType) {
      case 'ACCEPTED':
        return 'Quelle action allez-vous mener ?'
      case 'REJECTED':
        return 'Pourquoi ce signalement est-il infondé ?'
      default:
        return 'Pourquoi ce signalement ne vous concerne pas ?'
    }
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

      <div className={consumerStep ? 'visible' : 'hidden'}>
        <ReportResponseFormItem title="Que souhaitez-vous faire ?">
          <Controller
            name="responseType"
            rules={{required: {value: true, message: m.required}}}
            control={control}
            render={({field}) => (
              <ScRadioGroup error={!!errors.responseType} dense sx={{mb: 8}} {...field}>
                {Enum.values(ReportResponseTypes).map(responseType => (
                  <ScRadioGroupItem value={responseType} key={responseType}>
                    {m.reportResponseDesc[responseType]}
                  </ScRadioGroupItem>
                ))}
              </ScRadioGroup>
            )}
          />
        </ReportResponseFormItem>

        {watchResponseType && (
          <ReportResponseFormItem title={computeDetailsTitle(watchResponseType)}>
            <Controller
              name="responseDetails"
              rules={{required: {value: true, message: m.required}}}
              control={control}
              render={({field}) => (
                <ScRadioGroup
                  error={!!errors.responseDetails}
                  dense
                  sx={{mb: 2}}
                  {...field}
                  onChange={(event: any) => {
                    setValue('otherResponseDetails', undefined)
                    field.onChange(event)
                  }}
                >
                  {computeDetails(watchResponseType).map(responseDetails => (
                    <ScRadioGroupItem value={responseDetails} key={responseDetails}>
                      {m.responseDetails[responseDetails]}
                    </ScRadioGroupItem>
                  ))}
                </ScRadioGroup>
              )}
            />
          </ReportResponseFormItem>
        )}
        {watchResponseDetails === 'OTHER' && (
          <ReportResponseFormItem title="Pouvez-vous préciser ?">
            <ScInput
              {...register('otherResponseDetails', {
                required: {value: true, message: m.required},
                maxLength: {value: 1000, message: m.textTooLarge(1000)},
              })}
              helperText={errors.otherResponseDetails?.message}
              error={!!errors.otherResponseDetails}
              fullWidth
              placeholder="Votre raison en quelques mots..."
            />
          </ReportResponseFormItem>
        )}

        <ReportResponseFormItem title={m.proAnswerYourAnswer} desc={m.proAnswerYourAnswerDesc} sx={{mt: 8}}>
          <ScInput
            {...register('consumerDetails', {
              required: {value: true, message: m.required},
              maxLength: {value: maxDetailsCharLength, message: m.textTooLarge(maxDetailsCharLength)},
            })}
            helperText={
              errors.consumerDetails ? (
                errors.consumerDetails?.message
              ) : (
                <CharacterCounter currentLength={watch('consumerDetails')?.length} maxLength={maxDetailsCharLength} />
              )
            }
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
      </div>

      <div className={dgccrfStep ? 'visible' : 'hidden'}>
        <ReportResponseFormItem title={m.proAnswerYourDGCCRFAnswer} desc={m.proAnswerYourDGCCRFAnswerDesc}>
          <ScInput
            {...register('dgccrfDetails', {
              maxLength: {value: maxDetailsCharLength, message: m.textTooLarge(maxDetailsCharLength)},
            })}
            helperText={
              errors.dgccrfDetails ? (
                errors.dgccrfDetails?.message
              ) : (
                <CharacterCounter currentLength={watch('dgccrfDetails')?.length} maxLength={maxDetailsCharLength} />
              )
            }
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
      </div>

      <PanelFoot spaceBetween={dgccrfStep} alignEnd={consumerStep}>
        {consumerStep ? (
          <>
            <ScButton
              onClick={() => setActiveStep(1)}
              color="primary"
              variant="contained"
              disabled={
                !watchResponseType ||
                !watchConsumerDetails ||
                !watchResponseDetails ||
                (watchResponseDetails === 'OTHER' && !watchOtherResponseDetails)
              }
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

      <SuccessModal open={isSuccessModalOpen} onClose={handleModalClose} />
    </CleanWidePanel>
  )
})
