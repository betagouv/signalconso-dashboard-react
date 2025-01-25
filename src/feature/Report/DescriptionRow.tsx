import React, { ReactNode } from 'react'
import { Tooltip } from '@mui/material'

interface DescriptionRowProps {
  label: ReactNode
  value: ReactNode
}

class DescriptionRow extends React.Component<DescriptionRowProps> {
  render() {
    const { label, value } = this.props

    return (
      <div className="flex flex-col w-full">
        <span className="min-w-[10%] font-bold">{label} :</span>
        <span className="">{value}</span>
      </div>
    )
  }
}

export default DescriptionRow
