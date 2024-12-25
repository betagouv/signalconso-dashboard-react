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
      <h2 className="font-bold text-2xl mb-2">Répartition par tags</h2>
      <div className="flex flex-wrap gap-x-4 gap-y-2 items-baseline">
        {data &&
          data.map((entry) => {
            const fontSizePercentage = Math.max(
              50 + 100 * (entry.value / max),
              80,
            )
            return (
              <div
                className="bg-gray-200 px-2"
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
              </div>
            )
          })}
      </div>
    </CleanInvisiblePanel>
  )
}
