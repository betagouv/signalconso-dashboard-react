import {useEffect, useState} from 'react'
import Modal from '@mui/material/Modal'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  p: 4,
}

export const RefreshBanner = () => {
  const [open, setOpen] = useState(false)

  const refreshCheck = () => {
    const lastRefreshTime = Number(sessionStorage.getItem('lastRefreshTime'))
    const currentTime = new Date().getTime()

    if (!lastRefreshTime) {
      sessionStorage.setItem('lastRefreshTime', String(currentTime))
      return false
    }

    const timeSinceLastRefresh = currentTime - (isNaN(lastRefreshTime) ? currentTime : lastRefreshTime)
    const twentyFourHours = 86400000

    if (timeSinceLastRefresh >= twentyFourHours) {
      sessionStorage.setItem('lastRefreshTime', String(currentTime))
      setOpen(true)
    }
  }

  useEffect(() => {
    refreshCheck()

    const interval = setInterval(() => {
      refreshCheck()
    }, 600000) // checks every 10 minutes if refresh is needed

    return () => clearInterval(interval)
  }, [])

  const handleRefresh = () => {
    window.location.reload() // Refresh the page
  }

  const handleClose = () => {
    setOpen(false) // Close the modal without refreshing
  }

  return (
    <Modal open={open} aria-labelledby="modal-title" aria-describedby="modal-description">
      <Box sx={modalStyle}>
        <div id="modal-title" className="text-xl font-semibold mb-4">
          Mise à jour du site disponible
        </div>
        <div id="modal-description" className="mt-4 space-y-2 leading-relaxed">
          <p>Rechargez la page pour bénéficier de la dernière version du site.</p>
          <p>
            <strong>
              Si vous avez des modifications en cours, cliquez sur "Fermer", terminez-les puis rafraîchissez la page.
            </strong>
          </p>
        </div>
        <div className="flex justify-between mt-4">
          <Button variant="contained" onClick={handleRefresh}>
            Recharger
          </Button>
          <Button variant="outlined" onClick={handleClose}>
            Fermer
          </Button>
        </div>
      </Box>
    </Modal>
  )
}
