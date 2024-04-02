import React from 'react'
import {Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button} from '@mui/material'

interface SuccessModalProps {
  open: boolean
  onClose: () => void
}

const SuccessModal: React.FC<SuccessModalProps> = ({open, onClose}) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>
        <h1>Vous venez de faire une promesse d’action et nous vous en félicitons !</h1>
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          <p>Nous avons envoyé votre réponse au consommateur. Elle est également visible par la DGCCRF.</p>
          <p>Le consommateur sera invité à donner son avis sur votre réponse et les actions mises en œuvre.</p>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Fermer
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default SuccessModal
