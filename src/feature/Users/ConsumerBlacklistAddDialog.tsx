import {useForm} from 'react-hook-form'
import {Alert, Txt} from '../../alexlibs/mui-extension'
import {regexp} from '../../core/helper/regexp'
import {useI18n} from '../../core/i18n'
import {useToast} from '../../core/toast'
import {ScButton} from '../../shared/Button/Button'
import {ScInput} from '../../shared/Input/ScInput'

import {useFetcher} from 'alexlibs/react-hooks-lib'
import {useApiContext} from 'core/context/ApiContext'
import {ScOption} from 'core/helper/ScOption'
import {ScDialog} from '../../shared/Confirm/ScDialog'

export const ConsumerBlacklistAddDialog = ({onAdd}: {onAdd: () => unknown}) => {
  const {m} = useI18n()
  const {
    register,
    handleSubmit,
    formState: {errors, isValid},
  } = useForm<{email: string; comments: string}>({mode: 'onChange'})
  const {api} = useApiContext()
  const _addToBlacklist = useFetcher(api.secured.consumerBlacklist.add)
  const {toastSuccess} = useToast()

  const buttonText = m.add_email_to_blacklist
  const dialogTitle = m.add_email_to_blacklist
  const dialogDesc = m.add_email_to_blacklist_desc
  const dialogDescAlert = m.add_email_to_blacklist_desc_alert
  const emailRegexp = regexp.email
  const emailValidationMessage = m.invalidEmail

  return (
    <ScDialog
      maxWidth="xs"
      onConfirm={(event, close) => {
        handleSubmit(({email, comments}) => {
          _addToBlacklist
            .fetch({}, email, comments)
            .then(() => toastSuccess(m.added))
            .then(close)
            .then(() => onAdd())
        })()
      }}
      confirmLabel={m.add}
      loading={_addToBlacklist.loading}
      confirmDisabled={!isValid}
      title={dialogTitle}
      content={
        <>
          {ScOption.from(_addToBlacklist.error?.details?.id)
            .map(errId => (
              <Alert dense type="error" deletable gutterBottom>
                {m.apiErrorsCode[errId as keyof typeof m.apiErrorsCode]}
              </Alert>
            ))
            .toUndefined()}
          <Txt color="hint" block gutterBottom>
            {dialogDesc}
          </Txt>
          <Alert type="warning" sx={{mb: 2}} dense>
            <Txt bold>{dialogDescAlert}</Txt>
          </Alert>
          <ScInput
            autoFocus
            fullWidth
            label={m.email}
            error={!!errors.email}
            helperText={errors.email?.message}
            {...register('email', {
              required: m.required,
              pattern: {
                value: emailRegexp,
                message: emailValidationMessage,
              },
            })}
          />
          <Txt color="hint" block gutterTop>
            Inscrivez un petit commentaire pour se rappeler pourquoi il est indésirable :
          </Txt>
          <ScInput
            fullWidth
            type="text"
            label={'Commentaire'}
            error={!!errors.comments}
            helperText={errors.comments?.message}
            {...register('comments', {
              required: m.required,
              maxLength: {value: 50, message: m.textTooLarge(50)},
            })}
          />
        </>
      }
    >
      <ScButton icon="sentiment_very_dissatisfied" variant="contained" color="primary">
        {buttonText}
      </ScButton>
    </ScDialog>
  )
}
