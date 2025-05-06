import { Controller, useForm } from 'react-hook-form'
import { Txt } from '../../alexlibs/mui-extension'
import {
  CompanyAccessLevel,
  CompanyAccessLevelCreatable,
  companyAccessLevelsCreatable,
  translateCompanyAccessLevel,
} from '../../core/client/company-access/CompanyAccess'
import { regexp } from '../../core/helper/regexp'
import { useI18n } from '../../core/i18n'
import { ScButton } from '../../shared/Button'
import { ScRadioGroup } from '../../shared/RadioGroup'
import { ScRadioGroupItem } from '../../shared/RadioGroupItem'
import { ScDialog } from '../../shared/ScDialog'
import { ScInput } from '../../shared/ScInput'

interface Props {
  loading: boolean
  onCreate: (email: string, level: CompanyAccessLevel) => Promise<any>
  title?: string
}

interface Form {
  email: string
  level: CompanyAccessLevelCreatable
}

export const CompanyAccessCreateBtn = ({ loading, onCreate, title }: Props) => {
  const { m } = useI18n()
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isValid },
    reset,
  } = useForm<Form>({ mode: 'onChange' })
  return (
    <ScDialog
      maxWidth="xs"
      title={m.invitNewUser}
      confirmLabel={m.create}
      loading={loading}
      confirmDisabled={!isValid}
      onConfirm={async (event, close) => {
        await handleSubmit(({ email, level }) => onCreate(email, level))()
        close()
        reset()
      }}
      content={
        <>
          <ScInput
            error={!!errors.email}
            helperText={errors.email?.message ?? ' '}
            fullWidth
            label={m.email}
            {...register('email', {
              pattern: { value: regexp.email, message: m.invalidEmail },
              required: { value: true, message: m.required },
            })}
          />

          <Txt block gutterBottom size="big">
            {m.authorization}
          </Txt>
          <Controller
            name="level"
            rules={{ required: { value: true, message: m.required } }}
            control={control}
            render={({ field }) => (
              <ScRadioGroup error={!!errors.level} {...field}>
                {companyAccessLevelsCreatable.map((level) => (
                  <ScRadioGroupItem
                    title={translateCompanyAccessLevel(level)}
                    description={m.companyAccessLevelDescription[level]}
                    value={level}
                    key={level}
                  />
                ))}
              </ScRadioGroup>
            )}
          />
        </>
      }
    >
      <ScButton
        loading={loading}
        icon="add"
        color="primary"
        variant="contained"
      >
        {title ?? 'Ajouter un utilisateur'}
      </ScButton>
    </ScDialog>
  )
}
