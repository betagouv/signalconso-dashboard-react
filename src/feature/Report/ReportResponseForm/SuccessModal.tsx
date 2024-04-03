import React from 'react'
import {Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button} from '@mui/material'
import pics from './contact.png'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'

interface SuccessModalProps {
  open: boolean
  onClose: () => void
}

const SuccessModal: React.FC<SuccessModalProps> = ({open, onClose}) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogContent>
        <img src={pics} alt="Success" className="w-1/2 mx-auto" />
        <div className="flex justify-center">
          <CheckCircleIcon className="text-green-500" style={{fontSize: '6rem'}} />
        </div>
        <DialogTitle style={{margin: 0}}>Vous venez de faire une promesse d’action et nous vous en félicitons !</DialogTitle>

        <DialogContentText style={{marginLeft: 20}}>
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
