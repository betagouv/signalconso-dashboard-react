import {Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField} from '@material-ui/core'
import {useI18n} from '../../core/i18n'
import {Btn} from 'mui-extension/lib'

export interface ReportsFiltersProps {
 open?: boolean
}

export const ReportFilters = ({open}: ReportsFiltersProps) => {
  const {m} = useI18n()
  const handleClose = () => {}
  return (
    <Dialog open={open ?? false} onClose={handleClose} aria-labelledby="form-dialog-title">
      <DialogTitle>Subscribe</DialogTitle>
      <DialogContent>
        <DialogContentText>
          To subscribe to this website, please enter your email address here. We will send updates
          occasionally.
        </DialogContentText>
        <TextField
          autoFocus
          margin="dense"
          id="name"
          label="Email Address"
          type="email"
          fullWidth
        />
      </DialogContent>
      <DialogActions>
        <Btn onClick={handleClose} color="primary">
          Cancel
        </Btn>
        <Btn onClick={handleClose} color="primary">
          Subscribe
        </Btn>
      </DialogActions>
    </Dialog>
  )
}
