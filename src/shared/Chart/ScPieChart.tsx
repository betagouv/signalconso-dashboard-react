import { Skeleton } from '@mui/material'
import { Cell, Legend, Pie, PieChart, ResponsiveContainer } from 'recharts'

export function ScPieChart({
  data,
}: {
  data:
    | {
        label: string
        value: number
        color: string
      }[]
    | undefined
}) {
  const dataRenamed = data?.map(({ label, ...rest }) => ({
    name: label,
    ...rest,
  }))
  return (
    <div className="h-[200px]">
      {dataRenamed ? (
        <ResponsiveContainer width="100%" height="100%">
          <PieChart margin={{ top: 15 }}>
            <Pie
              dataKey="value"
              data={dataRenamed}
              fill="red"
              label
              innerRadius={45}
            >
              {dataRenamed?.map((entry, index) => (
                <Cell key={entry.name + index} fill={entry.color} />
              ))}
            </Pie>
            <Legend wrapperStyle={{ paddingTop: '5px' }} />
          </PieChart>
        </ResponsiveContainer>
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
