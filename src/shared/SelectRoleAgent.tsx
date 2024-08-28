import {BoxProps, Theme, ToggleButton, ToggleButtonGroup} from '@mui/material'
import React from 'react'
import {roleAgents, RoleAgents} from '../core/client/user/User'
import {SxProps} from '@mui/system'

interface SelectRoleAgentPros extends Omit<BoxProps, 'onChange'> {
  value: RoleAgents[]
  onChange: (_: RoleAgents[]) => void
}

const buttonStyle: SxProps<Theme> = {
  textTransform: 'none',
  paddingRight: 1.5,
  paddingLeft: 1.5,
  whiteSpace: 'nowrap',
  width: '100%',
}

export const SelectRoleAgent = ({value, onChange, ...props}: SelectRoleAgentPros) => {
  const parsedValue = value.length === 1 ? value[0] : ''

  return (
    <ToggleButtonGroup
      {...props}
      exclusive
      size="small"
      color="primary"
      style={{flexDirection: 'row'}}
      value={parsedValue}
      onChange={(e, value: string) => {
        value === 'DGAL' || value === 'DGCCRF' ? onChange([value]) : onChange(roleAgents.map(_ => _))
      }}
    >
      <ToggleButton sx={buttonStyle} value="DGCCRF">
        DGCCRF
      </ToggleButton>
      <ToggleButton sx={buttonStyle} value="DGAL">
        DGAL
      </ToggleButton>
      <ToggleButton sx={buttonStyle} value="">
        Tous
      </ToggleButton>
    </ToggleButtonGroup>
  )
}
