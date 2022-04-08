import {Page} from 'shared/Layout'
import {Panel, PanelBody, PanelHead} from '../../shared/Panel'
import {ScRadioGroup} from '../../shared/RadioGroup/RadioGroup'
import {useI18n} from '../../core/i18n'
import {ScRadioGroupItem} from '../../shared/RadioGroup/RadioGroupItem'
import {ScInput} from '../../shared/Input/ScInput'
import {Txt} from 'mui-extension/lib/Txt/Txt'
import {useCssUtils} from '../../core/helper/useCssUtils'
import {ScButton} from '../../shared/Button/Button'
import {PanelFoot} from '../../shared/Panel/PanelFoot'
import {Controller, useForm} from 'react-hook-form'
import {Id, ResponseConsumerReview, ResponseEvaluation} from '@signal-conso/signalconso-api-sdk-js'
import {useAsync} from '@alexandreannic/react-hooks-lib'
import React, {useEffect, useMemo, useState} from 'react'
import {useLocation, useParams} from 'react-router'
import {fromNullable} from 'fp-ts/es6/Option'
import {useToast} from '../../core/toast'
import {Alert} from 'mui-extension'
import {QueryString} from "../../core/helper/useQueryString";
import {Box, Icon, Theme} from "@mui/material";
import {useLayoutContext} from "../../core/Layout/LayoutContext";
import {Emoticon} from "../../shared/Emoticon/Emoticon";
import makeStyles from "@mui/styles/makeStyles";

interface Props {
  onSubmit: (reportId: Id, review: ResponseConsumerReview) => Promise<any>
}

interface Form {
  evaluation: ResponseEvaluation
  details?: string
}

const useStyles = makeStyles((t: Theme) => ({
  large: {
    fontSize: 50,
  },
}))

export const ConsumerReview = ({onSubmit}: Props) => {
  const {reportId} = useParams<{ reportId: Id }>()
  const {m} = useI18n()
  const cssUtils = useCssUtils()
  const {toastError} = useToast()
  const [done, setDone] = useState(false)
  const {
    register,
    handleSubmit,
    control,
    formState: {errors, isValid},
  } = useForm<Form>()
  const {search} = useLocation()
  const css = useStyles()

  const getEvaluationFromQueryString = (qs: string): ResponseEvaluation | undefined => {
    const parsed = QueryString.parse(qs.replace(/^\?/, '')) as unknown as ResponseEvaluation
    return ResponseEvaluation[parsed]
  }

  const defaultValueProps = useMemo(() => {
    getEvaluationFromQueryString(search)
  }, [])

  const _post = useAsync(onSubmit)
  const {isMobileWidth} = useLayoutContext()


  const submit = async (form: Form) => {
    await _post.call(reportId, {...form})
    setDone(true)
  }
  useEffect(() => {
    fromNullable(_post.error).map(toastError)
  }, [_post.error])

  return (
    <Page size="s">
      {done ? (
        <Alert type="success" className={cssUtils.marginBottom2}>
          {m.thanksForSharingYourMind}
        </Alert>
      ) : (
        <form onSubmit={handleSubmit(submit)}>
          <Panel>
            <PanelHead>{m.shareYourMind}</PanelHead>

            <PanelBody>
              <Txt block gutterBottom color="hint" dangerouslySetInnerHTML={{__html: m.didTheCompanyAnsweredWell}}/>
              <Controller
                name="evaluation"
                {...defaultValueProps}
                rules={{required: {value: true, message: m.required}}}
                control={control}
                render={({field}) => (
                  <ScRadioGroup className={cssUtils.marginTop3} inline={!isMobileWidth} error={!!errors.evaluation} {...field}>
                    <ScRadioGroupItem value={ResponseEvaluation.Positive}><Emoticon sx={{fontSize: 50}} label="happy">😀</Emoticon></ScRadioGroupItem>
                    <ScRadioGroupItem value={ResponseEvaluation.Neutral}><Emoticon sx={{fontSize: 50}} label="neutral">😐</Emoticon></ScRadioGroupItem>
                    <ScRadioGroupItem value={ResponseEvaluation.Negative}><Emoticon sx={{fontSize: 50}} label="sad">🙁</Emoticon></ScRadioGroupItem>
                  </ScRadioGroup>
                )}
              />

              <Txt
                className={cssUtils.marginTop3}
                block
                color="hint"
                dangerouslySetInnerHTML={{__html: m.youCanAddCommentForDGCCRF}}
              />
              <ScInput {...register('details')} multiline fullWidth rows={5} maxRows={12}/>
            </PanelBody>
            <PanelFoot alignEnd>
              <ScButton loading={_post.loading} type="submit" icon="send" variant="contained" color="primary">
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
        <a
          className={cssUtils.marginTop}
          href="https://monavis.numerique.gouv.fr/Demarches/2071?&view-mode=formulaire-avis&nd_mode=en-ligne-enti%C3%A8rement&nd_source=button&key=5a58254dab900906fe4924e37c1c5bba"
        >
          <img
            src="https://monavis.numerique.gouv.fr/monavis-static/bouton-bleu.png"
            alt="Je donne mon avis sur voxusagers.gouv.fr"
            title="Je donne mon avis sur cette démarche"
          />
        </a>
      </div>
    </Page>
  )
}
