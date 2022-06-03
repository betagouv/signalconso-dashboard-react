import {Box, BoxProps, Chip, Theme, Tooltip} from '@mui/material'
import {Txt} from 'mui-extension/lib/Txt/Txt'
import React, {ReactElement} from 'react'
import {useI18n} from '../../core/i18n'
import {Company, CompanySearchResult, Country, Id} from '@signal-conso/signalconso-api-sdk-js'
import {makeSx} from "mui-extension";

interface Props extends BoxProps{
  value?: string
}

export const StatusChip = ({value, ...props}: Props) => {
  const {m} = useI18n()

  return (
    <Tooltip title={m.linkCountry}>
      <Chip
        onClick={props.onClick}
        variant={'outlined'}
        sx={{ height: 42, borderRadius: 42 }}
        label={
                <Txt truncate sx={{
                  fontWeight: 'bold',
                  maxWidth: 200,
                }} block>
                  {value}
                </Txt>
            }
      />
    </Tooltip>
  )
}
