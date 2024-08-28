import { config } from '../conf/config'
import { Alert } from '../alexlibs/mui-extension'

export const InfoBanner = () => {
  if (config.infoBanner) {
    return (
      <Alert type={config.infoBannerSeverity} sx={{ mb: 2 }}>
        <span dangerouslySetInnerHTML={{ __html: config.infoBanner }} />
      </Alert>
    )
  }
  return null
}
