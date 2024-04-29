import React from 'react'
import {Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button, Modal} from '@mui/material'
import pics from './contact.png'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import MarkEmailReadIcon from '@mui/icons-material/MarkEmailRead'
import {ReportResponseTypes} from 'core/client/event/Event'
import {useI18n} from 'core/i18n'

interface SuccessModalProps {
  open: boolean
  onClose: () => void
  responseType?: ReportResponseTypes
}

const SuccessModal: React.FC<SuccessModalProps> = ({open, onClose, responseType}) => {
  const {m} = useI18n()
  const renderContentBasedOnResponseType = () => {
    switch (responseType) {
      case ReportResponseTypes.Accepted:
        return (
          <div>
            <img src={pics} alt="Accepted" className="w-1/2 mx-auto" />
            <div className="flex justify-center">
              <CheckCircleIcon className="text-green-500" sx={{fontSize: '5rem'}} />
            </div>
            <p className="text-xl font-bold mb-2">{m.promisedAction}</p>
          </div>
        )
      case ReportResponseTypes.Rejected:
        return (
          <div>
            <img src={pics} alt="Rejected" className="w-1/2 mx-auto" />
            <div className="flex justify-center">
              <MarkEmailReadIcon className="text-green-500" sx={{fontSize: '5rem'}} />
            </div>
            <p className="text-xl font-bold mb-2">{m.claimDeemedUnfounded}</p>
          </div>
        )

      case ReportResponseTypes.NotConcerned:
        return (
          <div>
            <img src={pics} alt="NotConcerned" className="w-1/2 mx-auto" />
            <div className="flex justify-center">
              <MarkEmailReadIcon className="text-green-500" sx={{fontSize: '5rem'}} />
            </div>
            <p className="text-xl font-bold mb-2">{m.claimNotConcernedYourEstablishment}</p>
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
          <p>{m.responseSentToConsumer}</p>
          <br />
          {responseType === 'ACCEPTED' ? <p>{m.consumerReviewInvitationForAccepted}</p> : <p>{m.consumerReviewInvitation}</p>}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          {m.close}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default SuccessModal
