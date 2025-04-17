import { Button } from '@mui/material'

export function TinyButton({
  label,
  onClick,
}: {
  label: string
  onClick: () => void
}) {
  return (
    <Button
      size="small"
      variant="outlined"
      className="!bg-white"
      onClick={onClick}
    >
      {label}
    </Button>
  )
}
