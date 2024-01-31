import {Box} from '@mui/material'
import {NavLink} from 'react-router-dom'
import {Txt} from '../../alexlibs/mui-extension'
import {siteMap} from '../../core/siteMap'
import {styleUtils} from '../../core/theme'

type CompanyNameDetailsProps = {
  companyId: string | undefined
  isDGAL: boolean
  companyName: string | undefined
  companyBrand: string | undefined
}

const CompanyNameDetails: React.FC<CompanyNameDetailsProps> = ({companyId, isDGAL, companyName, companyBrand}) => {
  return (
    <Box component="span" sx={{marginBottom: '-1px'}}>
      {companyId && !isDGAL ? (
        <>
          <NavLink to={siteMap.logged.company(companyId)}>
            <Txt link>{companyName}</Txt>
          </NavLink>
          {companyBrand && (
            <>
              <br />
              <Txt
                component="span"
                sx={{
                  fontSize: t => styleUtils(t).fontSize.small,
                  fontStyle: 'italic',
                  color: t => t.palette.text.primary,
                }}
              >
                {companyBrand}
              </Txt>
            </>
          )}
        </>
      ) : (
        <span>{companyName}</span>
      )}
    </Box>
  )
}

export default CompanyNameDetails
