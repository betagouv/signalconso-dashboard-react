import React from 'react'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  Icon,
} from '@mui/material'
import pics from './contact.png'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import MarkEmailReadIcon from '@mui/icons-material/MarkEmailRead'
import { ReportResponseTypes } from 'core/client/event/Event'
import { useI18n } from 'core/i18n'
import { EngagementReminderPeriod } from '../../../core/client/engagement/Engagement'
import { Btn } from '../../../alexlibs/mui-extension'

interface SuccessModalProps {
  open: boolean
  onClose: () => void
  responseType?: ReportResponseTypes
}

export const SuccessModal: React.FC<SuccessModalProps> = ({
  open,
  onClose,
  responseType,
}) => {
  const { m } = useI18n()
  const renderContentBasedOnResponseType = () => {
    switch (responseType) {
      case ReportResponseTypes.Accepted:
        return (
          <div>
            <img src={pics} alt="" className="w-1/2 mx-auto" />
            <div className="flex justify-center">
              <CheckCircleIcon
                className="text-green-500"
                sx={{ fontSize: '5rem' }}
              />
            </div>
            <p className="text-xl font-bold mb-2">{m.promisedAction}</p>
          </div>
        )
      case ReportResponseTypes.Rejected:
        return (
          <div>
            <img src={pics} alt="" className="w-1/2 mx-auto" />
            <div className="flex justify-center">
              <MarkEmailReadIcon
                className="text-green-500"
                sx={{ fontSize: '5rem' }}
              />
            </div>
            <p className="text-xl font-bold mb-2">{m.claimDeemedUnfounded}</p>
          </div>
        )

      case ReportResponseTypes.NotConcerned:
        return (
          <div>
            <img src={pics} alt="" className="w-1/2 mx-auto" />
            <div className="flex justify-center">
              <MarkEmailReadIcon
                className="text-green-500"
                sx={{ fontSize: '5rem' }}
              />
            </div>
            <p className="text-xl font-bold mb-2">
              {m.claimNotConcernedYourEstablishment}
            </p>
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
          {responseType === 'ACCEPTED' ? (
            <p>
              {m.consumerReviewInvitationForAccepted(EngagementReminderPeriod)}
            </p>
          ) : (
            <p>{m.consumerReviewInvitation}</p>
          )}
          <div className="mt-8 flex flex-col items-center">
            <p className="mb-2">
              Aidez nous à améliorer SignalConso en notant votre satisfaction !
            </p>
            <div>
              <Btn
                variant="outlined"
                data-tally-open="3llOOk"
                data-tally-emoji-text="👋"
                data-tally-emoji-animation="wave"
              >
                {m.Feedback}
                <Icon sx={{ ml: 1 }}>feedback</Icon>
              </Btn>
            </div>
          </div>
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
