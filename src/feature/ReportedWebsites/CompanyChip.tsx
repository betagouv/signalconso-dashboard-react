import {Box, BoxProps, Chip, Theme, Tooltip} from '@mui/material'
import {Txt} from 'mui-extension/lib/Txt/Txt'
import React, {ReactElement} from 'react'
import {useI18n} from '../../core/i18n'
import {Company, CompanySearchResult, Country, Id} from '@signal-conso/signalconso-api-sdk-js'
import {makeSx} from "mui-extension";

interface Props extends BoxProps{
  company?: Company
}

const sx = makeSx({
  tdName_desc: t => ({
      fontSize: t.typography.fontSize * 0.875,
      color: t.palette.text.disabled,
  })
})

export const CompanyChip = ({company, ...props}: Props) => {
  const {m} = useI18n()

  return (
    <Tooltip title={m.linkCountry}>
      <Chip
        onClick={props.onClick}
        variant={'outlined'}
        sx={{ height: 42, borderRadius: 42 }}
        label={
            company ? (
              <Box component="div">
                <Txt truncate sx={{
                  fontWeight: 'bold',
                  marginBottom: -1,
                  maxWidth: 200,
                }} block>
                  {company.name}
                </Txt>
                <Box component="span" sx={sx.tdName_desc}>{company.siret}</Box>
              </Box>
            ) : (
                <Box sx={sx.tdName_desc}>{m.noAssociation}</Box>
            )}
      />
    </Tooltip>
  )
}
