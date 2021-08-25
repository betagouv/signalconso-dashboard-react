import {ScInput} from '../../shared/Input/ScInput'
import React, {ReactElement} from 'react'
import {ScDialog} from '../../shared/Confirm/ScDialog'
import {useI18n} from '../../core/i18n'
import {Controller, useForm} from 'react-hook-form'
import {useCssUtils} from '../../core/helper/useCssUtils'
import {classes} from '../../core/helper/utils'
import {Checkbox, createStyles, FormControlLabel, makeStyles, Theme} from '@material-ui/core'
import {Address} from '../../core/api/model/Address'
import {Alert} from 'mui-extension'

interface EditAddressDialogProps {
  children: ReactElement<any>
  address: Address
  onChange: (_: Form) => Promise<any>
  onChangeError?: string
}

interface Form {
  number: string
  street: string
  addressSupplement?: string
  postalCode: string
  city: string
  activationDocumentRequired?: boolean
}

const useStyles = makeStyles((t: Theme) =>
  createStyles({
    inputNumber: {
      maxWidth: 80,
    },
    inputCP: {
      maxWidth: 100,
    },
  }),
)
export const EditAddressDialog = ({address, children, onChange, onChangeError}: EditAddressDialogProps) => {
  const {m} = useI18n()
  const css = useStyles()
  const cssUtils = useCssUtils()

  const {
    register,
    handleSubmit,
    getValues,
    control,
    formState: {errors, isValid},
  } = useForm<Form>({mode: 'onChange'})

  return (
    <ScDialog
      maxWidth="xs"
      confirmDisabled={!isValid}
      title={m.editAddress}
      onConfirm={(event, close) => {
        onChange(getValues())
        close()
      }}
      content={close => (
        <>
          {onChangeError && <Alert type="error">{onChangeError}</Alert>}
          <div className={cssUtils.flex}>
            <ScInput
              defaultValue={address.number}
              error={!!errors.number}
              helperText={errors.number?.message ?? ' '}
              className={classes(css.inputNumber, cssUtils.marginRight)}
              placeholder={m.numberShort}
              {...register('number', {
                required: {value: true, message: m.required},
              })}
            />
            <ScInput
              defaultValue={address.street}
              error={!!errors.street}
              helperText={errors.street?.message ?? ' '}
              fullWidth
              placeholder={m.street}
              {...register('street', {
                required: {value: true, message: m.required},
              })}
            />
          </div>
          <ScInput
            defaultValue={address.addressSupplement}
            error={!!errors.addressSupplement}
            helperText={errors.addressSupplement?.message ?? ' '}
            fullWidth
            placeholder={m.addressSupplement}
            {...register('addressSupplement')}
          />
          <div className={cssUtils.flex}>
            <ScInput
              defaultValue={address.postalCode}
              error={!!errors.postalCode}
              helperText={errors.postalCode?.message ?? ' '}
              className={classes(css.inputCP, cssUtils.marginRight)}
              fullWidth
              placeholder={m.postalCode}
              {...register('postalCode', {
                required: {value: true, message: m.required},
              })}
            />
            <ScInput
              defaultValue={address.city}
              error={!!errors.city}
              helperText={errors.city?.message ?? ' '}
              fullWidth
              placeholder={m.city}
              {...register('city', {
                required: {value: true, message: m.required},
              })}
            />
          </div>
          <Controller
            name="activationDocumentRequired"
            control={control}
            render={({field}) => (
              <FormControlLabel control={<Checkbox {...field} checked={field.value} />} label={m.contactAgreement} />
            )}
          />
        </>
      )}
      confirmLabel={m.edit}
    >
      {children}
    </ScDialog>
  )
}
