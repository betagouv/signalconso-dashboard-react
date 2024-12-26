import { Skeleton } from '@mui/material'
import { Cell, Legend, Pie, PieChart, ResponsiveContainer } from 'recharts'

export function ScPieChart({
  data,
}: {
  data:
    | {
        name: string
        value: number
        color: string
      }[]
    | undefined
}) {
  const applyHeight = !data || data.length > 0
  return (
    <div className={applyHeight ? 'h-[200px]' : ''}>
      {data ? (
        data.length === 0 ? (
          'Pas de données'
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart margin={{ top: 15 }}>
              <Pie
                dataKey="value"
                data={data}
                fill="red"
                label
                innerRadius={45}
              >
                {data?.map((entry, index) => (
                  <Cell key={entry.name + index} fill={entry.color} />
                ))}
              </Pie>
              <Legend wrapperStyle={{ paddingTop: '5px' }} />
            </PieChart>
          </ResponsiveContainer>
        )
      ) : (
        <Skeleton
          variant="rectangular"
          height="100%"
          width="100%"
          sx={{ borderRadius: '8px' }}
        />
      )}
    </div>
  )
}
