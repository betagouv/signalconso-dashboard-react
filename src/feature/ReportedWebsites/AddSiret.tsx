import { FormHelperText } from '@mui/material'
import { useMutation } from '@tanstack/react-query'
import { ReactElement } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { CompanySearchResult } from '../../core/client/company/Company'
import { useApiContext } from '../../core/context/ApiContext'
import { useToast } from '../../core/context/toast/toastContext'
import { useI18n } from '../../core/i18n'
import { ScDialog } from '../../shared/ScDialog'
import { ScInput } from '../../shared/ScInput'
import { SelectCompany } from '../../shared/SelectCompany/SelectCompany'

interface Props {
  children: ReactElement<any>
}

interface Form {
  host: string
  company: CompanySearchResult
}

export const AddSiret = ({ children }: Props) => {
  const { m } = useI18n()
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<Form>()
  const { api } = useApiContext()
  const { toastError, toastSuccess } = useToast()

  const _websiteCreate = useMutation({
    mutationFn: api.secured.website.create,
    onSuccess: () => toastSuccess(m.websiteCreated),
  })

  return (
    <ScDialog
      maxWidth="sm"
      title={m.createWebsite}
      content={(close) => (
        <>
          <ScInput
            error={!!errors.host}
            helperText={errors.host?.message ?? ' '}
            fullWidth
            placeholder="Site web"
            {...register('host', {
              required: { value: true, message: m.required },
            })}
          />
          <Controller
            name="company"
            rules={{
              required: m.required,
            }}
            control={control}
            render={({ field }) => (
              <>
                <SelectCompany
                  siret={field.value?.siret}
                  onChange={field.onChange}
                  openOnly={true}
                />
                {errors.company && (
                  <FormHelperText error={true} sx={{ marginLeft: '14px' }}>
                    {m.required}
                  </FormHelperText>
                )}
              </>
            )}
          />
        </>
      )}
      onConfirm={(e, close) => {
        handleSubmit((form: Form) => {
          const {
            siret,
            name,
            address,
            activityCode,
            isOpen,
            isHeadOffice,
            isPublic,
          } = form.company
          if (name && address && siret) {
            _websiteCreate.mutate({
              host: form.host,
              company: {
                siret,
                name,
                address,
                activityCode,
                isOpen,
                isHeadOffice,
                isPublic,
              },
            })
            close()
          } else {
            toastError({ message: m.cannotCreateCompanyMissingInfo })
          }
        })()
      }}
      confirmLabel={m.validate}
    >
      {children}
    </ScDialog>
  )
}
