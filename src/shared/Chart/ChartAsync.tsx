import {Skeleton} from '@mui/material'
import {memo, useEffect, useState} from 'react'
import {ScLineChart} from './Chart'
import {ApiError} from '@signal-conso/signalconso-api-sdk-js'
import {useToast} from '../../core/toast'
import {useEffectFn} from '@alexandreannic/react-hooks-lib'

type Promises = readonly (() => Promise<any>)[] | []

type ThenArg<T> = T extends PromiseLike<infer U> ? U : T

interface ChartAsyncProps<T extends Promises> {
  readonly fetchDeps?: any[]
  readonly height?: number
  readonly promises: T
  readonly curves: {
    label: string
    key: string
    color?: string
    // @ts-ignore
    curve: (resolvedPromises: { -readonly [P in keyof T]: ThenArg<ReturnType<T[P]>> }) => {date: string; count: number}[]
  }[]
}

export const ChartAsync = <T extends Promises>({
  promises,
  curves,
  height = 300,
  fetchDeps = [],
}: ChartAsyncProps<T>) => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<ApiError | undefined>()
  const {toastError} = useToast()
  // @ts-ignore
  const [data, setData] = useState<undefined | { -readonly [P in keyof T]: ThenArg<ReturnType<T[P]>> }>()
  useEffect(() => {
    console.log('refresh', promises)
    setLoading(true)
    Promise.all(promises.map(_ => _()))
      .then(_ => setData(_ as any))
      .then(() => setLoading(false))
      .catch(setError)
  }, fetchDeps)

  useEffectFn(error, toastError)

  return (
    <>
      {loading || !data ? (
        <Skeleton variant="rectangular" height={height} width="100%" sx={{borderRadius: '8px'}} />
      ) : (
        <ScLineChart curves={curves.map((c, i) => ({
          ...c,
          curve: c.curve(data),
        }))} />
      )}
    </>
  )
}
