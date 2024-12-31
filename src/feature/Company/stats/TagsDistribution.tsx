import { Icon } from '@mui/material'
import { CleanInvisiblePanel } from 'shared/Panel/simplePanels'

export function TagsDistribution({
  tagsDistribution,
}: {
  tagsDistribution:
    | {
        label: string
        value: number
      }[]
    | undefined
}) {
  const data = tagsDistribution?.sort((a, b) => b.value - a.value)
  const allValues = data?.map((_) => _.value)
  const max = allValues && allValues.length ? Math.max(...allValues) : 1
  return (
    <CleanInvisiblePanel>
      <h2 className="font-bold text-2xl mb-2">Fréquence des tags</h2>
      <div className="flex flex-wrap gap-x-4 gap-y-2 items-baseline">
        {data &&
          (data.length === 0
            ? 'Pas de données'
            : data.map((entry) => {
                const fontSizePercentage = Math.max(
                  50 + 100 * (entry.value / max),
                  80,
                )
                return (
                  <div
                    key={entry.label}
                    className="px-2 py-1 rounded-full border border-solid border-gray-300
                    flex items-center gap-1"
                  >
                    <Icon
                      style={{
                        fontSize: `${fontSizePercentage}%`,
                      }}
                      className="text-gray-500"
                    >
                      sell
                    </Icon>
                    <span
                      style={{
                        fontSize: `${fontSizePercentage}%`,
                      }}
                    >
                      {entry.label}{' '}
                      <span
                        className="text-gray-500"
                        style={{
                          fontSize: `0.8em`,
                        }}
                      >
                        ({entry.value})
                      </span>
                    </span>
                  </div>
                )
              }))}
      </div>
    </CleanInvisiblePanel>
  )
}
