import { Button, Icon } from '@mui/material'

export function MassManageTinyButton({
  label,
  onClick,
}: {
  label: string
  onClick?: () => void
}) {
  return (
    <Button
      size="small"
      variant={'outlined'}
      className="!bg-white"
      {...{ onClick }}
    >
      {label}
    </Button>
  )
}

export function MassManageNextButton({
  onClick,
  disabled,
}: {
  onClick?: () => void
  disabled: boolean
}) {
  return (
    <div className="flex justify-end">
      <Button
        variant="contained"
        {...{ onClick, disabled }}
        size="large"
        type="submit"
        endIcon={<Icon>arrow_forward</Icon>}
      >
        Suivant
      </Button>
    </div>
  )
}
