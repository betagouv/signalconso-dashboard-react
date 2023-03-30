import {Page} from 'shared/Layout'
import {Panel, PanelBody, PanelHead} from '../../shared/Panel'
import {ScRadioGroup} from '../../shared/RadioGroup/RadioGroup'
import {useI18n} from '../../core/i18n'
import {ScRadioGroupItem} from '../../shared/RadioGroup/RadioGroupItem'
import {ScInput} from '../../shared/Input/ScInput'
import {Txt} from '../../alexlibs/mui-extension'
import {ScButton} from '../../shared/Button/Button'
import {PanelFoot} from '../../shared/Panel/PanelFoot'
import {Controller, useForm} from 'react-hook-form'
import {useAsync} from '../../alexlibs/react-hooks-lib'
import React, {useEffect, useMemo, useState} from 'react'
import {useLocation, useParams} from 'react-router'
import {useToast} from '../../core/toast'
import {Alert} from '../../alexlibs/mui-extension'
import {QueryString} from '../../core/helper/useQueryString'
import {Box} from '@mui/material'
import {useLayoutContext} from '../../core/Layout/LayoutContext'
import {Emoticon} from '../../shared/Emoticon/Emoticon'
import {Id, ResponseConsumerReview, ResponseConsumerReviewExists, ResponseEvaluation} from '../../core/model'
import {ApiError} from '../../core/client/ApiClient'

interface Props {
  onSubmit: (reportId: Id, review: ResponseConsumerReview) => Promise<any>
  reviewExists: (reportId: Id) => Promise<any>
}

interface Form {
  evaluation: ResponseEvaluation
  details?: string
}

export const ConsumerReview = ({onSubmit, reviewExists}: Props) => {
  const {reportId} = useParams<{reportId: Id}>()
  const {m} = useI18n()
  const {toastError, toastErrorIfDefined} = useToast()
  const [done, setDone] = useState(false)
  const [evaluation, setEvaluation] = useState<ResponseEvaluation | undefined>(undefined)
  const {
    register,
    handleSubmit,
    control,
    formState: {errors, isValid},
  } = useForm<Form>()
  const {search} = useLocation()

  const getEvaluationFromQueryString = (qs: string): ResponseEvaluation | undefined => {
    const parsed = QueryString.parse(qs.replace(/^\?/, '')).evaluation as unknown as ResponseEvaluation
    return ResponseEvaluation[parsed]
  }

  const _saveReview = useAsync(onSubmit)
  const _reviewExists = useAsync(reviewExists)
  const {isMobileWidth} = useLayoutContext()

  const submit = async (form: Form) => {
    await _saveReview.call(reportId, {...form})
    setDone(true)
  }

  useEffect(() => {
    toastErrorIfDefined(_saveReview.error)
  }, [_saveReview.error])

  useMemo(() => {
    const parsed = QueryString.parse(search.replace(/^\?/, '')).evaluation as unknown as ResponseEvaluation
    setEvaluation(parsed)
  }, [])

  useEffect(() => {
    _reviewExists
      .call(reportId)
      .then((exists: ResponseConsumerReviewExists) => {
        setDone(exists.value)
        return exists.value
      })
      .then(exist => {
        if (evaluation && !exist) {
          _saveReview.call(reportId, {evaluation: evaluation}).then(_ => console.log('POST DONE'))
        }
      })
  }, [done])

  return (
    <Page size="s">
      {done ? (
        <Alert type="success" sx={{mb: 2}}>
          {m.thanksForSharingYourMind}
        </Alert>
      ) : (
        <form onSubmit={handleSubmit(submit)}>
          <Panel>
            <PanelHead>{m.shareYourMind}</PanelHead>

            <PanelBody>
              <Txt block gutterBottom color="hint" dangerouslySetInnerHTML={{__html: m.didTheCompanyAnsweredWell}} />
              <Controller
                name="evaluation"
                defaultValue={evaluation}
                rules={{required: {value: true, message: m.required}}}
                control={control}
                render={({field}) => (
                  <ScRadioGroup sx={{mt: 3}} inline={!isMobileWidth} error={!!errors.evaluation} {...field}>
                    <ScRadioGroupItem value={ResponseEvaluation.Positive}>
                      <Emoticon sx={{fontSize: 50}} aria-label="happy">
                        😀
                      </Emoticon>
                    </ScRadioGroupItem>
                    <ScRadioGroupItem value={ResponseEvaluation.Neutral}>
                      <Emoticon sx={{fontSize: 50}} aria-label="neutral">
                        😐
                      </Emoticon>
                    </ScRadioGroupItem>
                    <ScRadioGroupItem value={ResponseEvaluation.Negative}>
                      <Emoticon sx={{fontSize: 50}} aria-label="sad">
                        🙁
                      </Emoticon>
                    </ScRadioGroupItem>
                  </ScRadioGroup>
                )}
              />

              <Txt sx={{mt: 3}} block color="hint" dangerouslySetInnerHTML={{__html: m.youCanAddCommentForDGCCRF}} />
              <ScInput {...register('details')} multiline fullWidth rows={5} maxRows={12} />
            </PanelBody>
            <PanelFoot alignEnd>
              <ScButton loading={_saveReview.loading} type="submit" icon="send" variant="contained" color="primary">
                {m.send}
              </ScButton>
            </PanelFoot>
          </Panel>
        </form>
      )}
      <div>
        <Txt block gutterBottom color="disabled">
          {m.youCanNoteSignalConso}
        </Txt>
        <Box
          component="a"
          sx={{mt: 1}}
          href="https://monavis.numerique.gouv.fr/Demarches/2071?&view-mode=formulaire-avis&nd_mode=en-ligne-enti%C3%A8rement&nd_source=button&key=5a58254dab900906fe4924e37c1c5bba"
        >
          <img
            src="https://monavis.numerique.gouv.fr/monavis-static/bouton-bleu.png"
            alt="Je donne mon avis sur voxusagers.gouv.fr"
            title="Je donne mon avis sur cette démarche"
          />
        </Box>
      </div>
    </Page>
  )
}
