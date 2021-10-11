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
import {Id, ReviewOnReportResponse} from '@betagouv/signalconso-api-sdk-js'
import {useAsync} from '@alexandreannic/react-hooks-lib'
import React, {useEffect, useState} from 'react'
import {useParams} from 'react-router'
import {stringToBoolean} from '../../core/helper/utils'
import {fromNullable} from 'fp-ts/es6/Option'
import {useToast} from '../../core/toast'
import {Alert} from 'mui-extension'

interface Props {
  onSubmit: (reportId: Id, review: ReviewOnReportResponse) => Promise<any>
}

interface Form {
  positive: string
  details?: string
}

export const ConsumerReview = ({onSubmit}: Props) => {
  const {reportId} = useParams<{reportId: Id}>()
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

  const _post = useAsync(onSubmit)

  const submit = async (form: Form) => {
    await _post.call(reportId, {...form, positive: stringToBoolean(form.positive)!})
    setDone(true)
  }

  useEffect(() => {
    fromNullable(_post.error).map(toastError)
  }, [_post.error])

  return (
    <Page size="small">
      {done ? (
        <Alert type="success" className={cssUtils.marginBottom2}>
          {m.thanksForSharingYourMind}
        </Alert>
      ) : (
        <form onSubmit={handleSubmit(submit)}>
          <Panel>
            <PanelHead>{m.shareYourMind}</PanelHead>
            <PanelBody>
              <Txt block gutterBottom color="hint">
                {m.didTheCompanyAnsweredWell}
              </Txt>
              <Controller
                name="positive"
                rules={{required: {value: true, message: m.required}}}
                control={control}
                render={({field}) => (
                  <ScRadioGroup dense error={!!errors.positive} {...field}>
                    <ScRadioGroupItem title={m.yes} value="true" />
                    <ScRadioGroupItem title={m.no} value="false" />
                  </ScRadioGroup>
                )}
              />

              <Txt
                className={cssUtils.marginTop3}
                block
                color="hint"
                dangerouslySetInnerHTML={{__html: m.youCanAddCommentForDGCCRF}}
              />
              <ScInput {...register('details')} multiline fullWidth rows={5} maxRows={12} />
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
