import {Box, BoxProps, Chip, Theme, Tooltip} from '@mui/material'
import makeStyles from '@mui/styles/makeStyles'
import {Txt} from 'mui-extension/lib/Txt/Txt'
import React, {ReactElement} from 'react'
import {useI18n} from '../../core/i18n'
import {CompanySearchResult, Country, Id} from '@signal-conso/signalconso-api-sdk-js'
import createStyles from '@mui/styles/createStyles'
import {classes} from '../../core/helper/utils'

interface Props extends BoxProps{
  country?: Country
}

const countryToFlag = (isoCode: string) => {
  return typeof String.fromCodePoint !== 'undefined'
    ? isoCode.toUpperCase().replace(/./g, char => String.fromCodePoint(char.charCodeAt(0) + 127397))
    : isoCode
}

// const useStyles = makeStyles((t: Theme) => {
//   return createStyles({
//     tdName_desc: {
//       fontSize: t.typography.fontSize * 0.875,
//       color: t.palette.text.disabled,
//     }
//   })
// })

const useStyles = makeStyles((t: Theme) => {
  const iconWidth = 50
  return createStyles({
    tdName_label: {
      fontWeight: 'bold',
      marginBottom: -1,
      maxWidth: 200,
    },
    tdName_desc: {
      fontSize: t.typography.fontSize * 0.875,
      color: t.palette.text.disabled,
    },
    chipEnterprise: {
      height: 42,
      borderRadius: 42,
    },
    flag: {
      color: 'rgba(0, 0, 0, 1)',
      fontSize: 18,
      textAlign: 'center',
    },
    iconWidth: {
      width: iconWidth,
    },
    status: {
      maxWidth: 180,
    },
  })
})

export const CountryChip = ({country}: Props) => {
  const {m} = useI18n()
  const css = useStyles()

  return (

    country ? (
    <Tooltip title={m.linkCountry}>
      <Chip
        variant={'outlined'}
        className={css.chipEnterprise}
        label={
          <div>
            <Txt truncate block>
              <span className={classes(css.flag, css.iconWidth)}>{countryToFlag(country.code)}</span>
              &nbsp;
              <span className={css.tdName_desc}>{country.name}</span>
            </Txt>
          </div>
        }
      />
    </Tooltip>
  ) : (
    <Tooltip title={m.linkCountry}>
      <Chip
        variant={'outlined'}
        className={css.chipEnterprise}
        label={
          <div>
            <span className={css.tdName_desc}>{m.noAssociation}</span>
          </div>
        }
      />
    </Tooltip>
  )

    // <Tooltip title={m.linkCountry}>
    //   <Chip
    //     variant={'outlined'}
    //     sx={{height: 42, borderRadius: 42}}
    //     label={
    //       <Box component="div">
    //         {country ? (
    //           <Txt truncate block>
    //             <Box
    //               sx={{
    //                 color: 'rgba(0, 0, 0, 1)',
    //                 fontSize: 18,
    //                 textAlign: 'center',
    //                 width: 50,
    //               }}
    //             >
    //               {countryToFlag(country.code)}
    //             </Box>
    //             &nbsp;
    //             <Box className={css.tdName_desc}>{country.name}</Box>
    //           </Txt>
    //         ) : (
    //           <Box component="div">
    //             <Box className={css.tdName_desc}>{m.noAssociation}</Box>
    //           </Box>
    //         )}
    //       </Box>
    //     }
    //   />
    // </Tooltip>
  )
}
