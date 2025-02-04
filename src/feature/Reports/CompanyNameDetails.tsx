import { Box } from '@mui/material'
import { NavLink } from 'react-router'
import { Txt } from '../../alexlibs/mui-extension'
import { siteMap } from '../../core/siteMap'
import { styleUtils } from '../../core/theme'

type CompanyNameDetailsProps = {
  companyId: string | undefined
  isDGAL: boolean
  companyName: string | undefined
  additionalLabel: string | undefined
}

const removeProtocol = (url: string) => {
  return url.replace(/^(http|https):\/\//, '')
}

export const CompanyNameDetails: React.FC<CompanyNameDetailsProps> = ({
  companyId,
  isDGAL,
  companyName,
  additionalLabel,
}) => {
  return (
    <Box component="span" sx={{ marginBottom: '-1px' }}>
      {companyId && !isDGAL ? (
        <NavLink to={siteMap.logged.company(companyId).stats.valueAbsolute}>
          <Txt link>{companyName}</Txt>
        </NavLink>
      ) : (
        <span>{companyName}</span>
      )}
      {additionalLabel && (
        <>
          <br />
          <Txt
            sx={{
              fontSize: (t) => styleUtils(t).fontSize.small,
              fontStyle: 'italic',
              color: (t) => t.palette.text.primary,
            }}
          >
            {removeProtocol(additionalLabel)}
          </Txt>
        </>
      )}
    </Box>
  )
}
