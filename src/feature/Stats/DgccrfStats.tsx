import * as React from 'react'
import { StatsDgccrfAccountPanel } from './StatsDgccrfAccountPanel'
import { StatsDgccrfSubscriptionsPanel } from './StatsDgccrfSubscriptionsPanel'

export const DgccrfStats = () => {
  return (
    <>
      <StatsDgccrfAccountPanel />
      <StatsDgccrfSubscriptionsPanel />
    </>
  )
}
