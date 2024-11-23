import React from 'react'

import { Form } from './ProLoginForm'
import { ScButton } from '../../shared/Button'

// Define the component props with the typed onLogin function
interface PredefinedUsersPanelProps {
  onLogin: (form: Form) => Promise<void>
}

const PredefinedUsersPanel: React.FC<PredefinedUsersPanelProps> = ({
  onLogin,
}) => {
  const buttonConfigs = [
    {
      email: 'dev.signalconso+SAMPLE_PRO1@gmail.com',
      label: 'PRO avec filiales, signalements et utilisateurs',
    },
    {
      email: 'dev.signalconso+SAMPLE_PRO5@gmail.com',
      label: 'PRO avec signalements et utilisateurs',
    },
    {
      email: 'dev.signalconso+SAMPLE_PRO3@gmail.com',
      label: 'PRO avec signalements',
    },
    {
      email: 'dev.signalconso+SAMPLE_PRO4@gmail.com',
      label: 'PRO sans signalements',
    },
  ]

  const defaultPassword = 'test'

  return (
    <div className={`p-6 mb-4`}>
      <h1 className="text-xl mb-4 font-bold justify-items-center">
        Utilisateurs prédéfinis
      </h1>
      <div className="flex flex-col items-start">
        {buttonConfigs.map((config, index) => (
          <ScButton
            key={index}
            icon="person"
            onClick={() =>
              onLogin({
                email: config.email,
                password: defaultPassword,
                apiError: '',
              })
            }
          >
            {config.label}
          </ScButton>
        ))}
      </div>
    </div>
  )
}

export default PredefinedUsersPanel
