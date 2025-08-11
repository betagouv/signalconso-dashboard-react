import { Box } from '@mui/material'
import { Txt } from '../../alexlibs/mui-extension'
import { styleUtils } from '../../core/theme'
import { Link } from '@tanstack/react-router'

type CompanyNameDetailsProps = {
  companyId: string | undefined
  isDGAL: boolean
  isSSMVM: boolean
  companyName: string | undefined
  additionalLabel: string | undefined
}

const removeProtocol = (url: string) => {
  return url.replace(/^(http|https):\/\//, '')
}

export const CompanyNameDetails: React.FC<CompanyNameDetailsProps> = ({
  companyId,
  isDGAL,
  isSSMVM,
  companyName,
  additionalLabel,
}) => {
  return (
    <Box component="span" sx={{ marginBottom: '-1px' }}>
      {companyId && !isDGAL && !isSSMVM ? (
        <Link to="/entreprise/$companyId/bilan" params={{ companyId }}>
          <Txt link>{companyName}</Txt>
        </Link>
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
