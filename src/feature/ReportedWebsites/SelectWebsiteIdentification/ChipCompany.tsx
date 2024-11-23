import { Box, BoxProps, Icon, Tooltip } from '@mui/material'
import { Txt } from '../../../alexlibs/mui-extension'
import React from 'react'
import { useI18n } from '../../../core/i18n'
import { ScChip } from '../../../shared/ScChip'
import { Company } from '../../../core/client/company/Company'

interface Props extends BoxProps {
  company: Company
}

export const ChipCompany = ({ company, ...props }: Props) => {
  const { m } = useI18n()

  return (
    <Tooltip title={m.linkCountry}>
      <ScChip
        onClick={props.onClick}
        sx={{
          minHeight: 40,
        }}
        label={
          <Box sx={{ mx: 0.5 }}>
            <div className="flex flex-grow">
              <Txt
                block
                truncate
                bold
                sx={{
                  marginBottom: -0.5,
                  maxWidth: 200,
                }}
              >
                {company.name}
              </Txt>
              {!company.isOpen && (
                <Txt
                  block
                  truncate
                  bold
                  sx={{
                    marginBottom: -0.5,
                    marginLeft: 0.5,
                    maxWidth: 200,
                    color: 'red',
                  }}
                >
                  (FERMÉ)
                </Txt>
              )}
            </div>
            <Txt fontSize="small">{company.siret}</Txt>
          </Box>
        }
      />
    </Tooltip>
  )
}
