import {useFetcher} from '@alexandreannic/react-hooks-lib'
import {Skeleton} from '@mui/material'
import {useEffect} from 'react'
import {ScLineChart} from './Chart'

type Promises = readonly (() => Promise<any>)[] | []
// type Promises = ReadonlyArray<() =>  unknown>

type ThenArg<T> = T extends PromiseLike<infer U> ? U : T

interface ChartAsyncProps<T extends Promises> {
  readonly height?: number
  readonly promises: T
  readonly curves: {
    label: string
    key: string
    color?: string
    // @ts-ignore
    curve: (a: { -readonly [P in keyof T]: ThenArg<ReturnType<T[P]>> }) => {date: string; count: number}[]
  }[]
  // readonly data: { -readonly [P in keyof T]: ThenArg<ReturnType<T[P]>> }
}

export const ChartAsync = <T extends Promises>({
  promises,
  curves,
  height = 300,
}: ChartAsyncProps<T>) => {
  const fetchers = promises.map(_ => useFetcher(_))
  const loading = !!fetchers.find(_ => _.loading)
  useEffect(() => {
    fetchers.forEach(_ => _.fetch)
  }, [])

  return (
    <>
      {loading ? (
        <Skeleton variant="rectangular" height={height - 30} width="100%" sx={{borderRadius: '8px'}} />
      ) : (
        <ScLineChart curves={curves.map((c, i) => ({
          ...c,
          curve: c.curve(fetchers.map(_ => _.entity) as any),
        }))} />
      )}
    </>
  )
}
