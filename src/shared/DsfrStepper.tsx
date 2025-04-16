// roughly mimics https://www.systeme-de-design.gouv.fr/composants-et-modeles/composants/indicateur-d-etapes/
export function DsfrStepper({
  currentStep,
  steps,
}: {
  currentStep: number
  steps: string[]
}) {
  const step = steps[currentStep]
  const isLastStep = currentStep === steps.length - 1
  const nextStep = isLastStep ? null : steps[currentStep + 1]
  return (
    <div className="mb-20 max-w-[500px]">
      <span className="text-gray-500 mb-5 text-sm">
        Étape {currentStep + 1} sur {steps.length}
      </span>
      <h2 className="font-bold text-xl mb-3">{step}</h2>
      <div className="flex gap-2 w-full mb-4">
        {steps.map((s, idx) => {
          return (
            <div
              key={idx}
              className={`h-2 grow ${idx > currentStep ? 'bg-gray-200' : 'bg-scbluefrance'}`}
            />
          )
        })}
      </div>
      {nextStep && (
        <p className="text-gray-500 text-xs">
          <span className="font-bold">Étape suivante :</span> {nextStep}
        </p>
      )}
    </div>
  )
}
