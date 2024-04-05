import React from 'react'
import {Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button, Modal} from '@mui/material'
import pics from './contact.png'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import ConnectWithoutContactIcon from '@mui/icons-material/ConnectWithoutContact'
import MarkEmailReadIcon from '@mui/icons-material/MarkEmailRead'
import {ReportResponseTypes} from 'core/client/event/Event'

interface SuccessModalProps {
  open: boolean
  onClose: () => void
  responseType?: ReportResponseTypes
}

const SuccessModal: React.FC<SuccessModalProps> = ({open, onClose, responseType}) => {
  const renderContentBasedOnResponseType = () => {
    switch (responseType) {
      case ReportResponseTypes.Accepted:
        return (
          <div>
            <img src={pics} alt="Accepted" className="w-1/2 mx-auto" />
            <div className="flex justify-center">
              <CheckCircleIcon className="text-green-500" sx={{fontSize: '5rem'}} />
            </div>
            <p className="text-xl font-bold mb-2">Vous venez de faire une promesse d’action et nous vous en félicitons !</p>
          </div>
        )
      case ReportResponseTypes.Rejected:
        return (
          <div>
            <img src={pics} alt="Rejected" className="w-1/2 mx-auto" />
            <div className="flex justify-center">
              <MarkEmailReadIcon className="text-green-500" sx={{fontSize: '5rem'}} />
            </div>
            <p className="text-xl font-bold mb-2">Vous avez estimé que ce signalement est infondé</p>
          </div>
        )

      case ReportResponseTypes.NotConcerned:
        return (
          <div>
            <img src={pics} alt="NotConcerned" className="w-1/2 mx-auto" />
            <div className="flex justify-center">
              <MarkEmailReadIcon className="text-green-500" sx={{fontSize: '5rem'}} />
            </div>
            <p className="text-xl font-bold mb-2">Vous avez estimé que ce signalement ne concerne pas votre établissement</p>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogContent>
        {renderContentBasedOnResponseType()}
        <DialogContentText>
          <p>Nous avons envoyé votre réponse au consommateur. Elle est également visible par la DGCCRF.</p>
          {responseType === 'ACCEPTED' ? (
            <p>Le consommateur sera invité à donner son avis sur votre réponse et les actions mises en œuvre.</p>
          ) : (
            <p>Le consommateur sera invité à donner son avis sur votre réponse dès sa réception.</p>
          )}
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
