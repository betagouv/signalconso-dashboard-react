import { Button, Icon } from '@mui/material'

// roughly mimics https://www.systeme-de-design.gouv.fr/composants-et-modeles/composants/indicateur-d-etapes/
export function DsfrStepper({
  currentStep,
  steps,
  onPrevious,
}: {
  currentStep: number
  steps: string[]
  onPrevious?: () => void
}) {
  const step = steps[currentStep]
  const isLastStep = currentStep === steps.length - 1
  const nextStep = isLastStep ? null : steps[currentStep + 1]
  return (
    <div className="mb-20">
      <span className="text-gray-500 mb-5 text-sm">
        Étape {currentStep + 1} sur {steps.length}
      </span>
      <h2 className="font-bold text-xl mb-3">{step}</h2>
      <div className="flex gap-2 w-full">
        {steps.map((_, idx) => {
          return (
            <div
              key={idx}
              className={`h-2 grow ${idx > currentStep ? 'bg-gray-200' : 'bg-scbluefrance'}`}
            />
          )
        })}
      </div>
      <div className="flex justify-between items-center">
        <Button
          startIcon={<Icon>keyboard_arrow_left</Icon>}
          className="!capitalize"
          onClick={onPrevious}
        >
          Précédent
        </Button>
        {nextStep && (
          <p className="text-gray-500 text-sm">
            <span className="font-bold">Étape suivante :</span> {nextStep}
          </p>
        )}
      </div>
    </div>
  )
}
