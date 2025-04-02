import { Switch } from '@mui/material'
import { styled } from '@mui/material/styles'
import { colorBlueFrance } from 'alexlibs/mui-extension/color'

// Exactly the same props as MUI Switch component
// but custom style to look more like the DSFR
// and without annoying margin/padding that wrecks everything around
export const ScSwitch = styled(Switch)((props) => {
  const [height, width, checkboxSize] =
    props.size === 'small' ? [18, 27, 12] : [22, 36, 14]
  return {
    width,
    height,
    padding: 0,
    display: 'flex',
    '& .MuiSwitch-switchBase': {
      padding: 0,
      '&.Mui-checked': {
        transform: `translateX(${width - height}px)`,
        '& + .MuiSwitch-track': {
          opacity: 1,
          backgroundColor: colorBlueFrance,
        },
        '& .MuiSwitch-thumb:before': {
          backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="${checkboxSize}" width="${checkboxSize}" viewBox="0 0 24 24"><path fill="${encodeURIComponent(colorBlueFrance)}" d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z"/></svg>')`,
          content: '""',
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: checkboxSize,
          height: checkboxSize,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
        },
      },
      '&.Mui-disabled': {
        '& .MuiSwitch-thumb': {
          opacity: 0.2,
        },
        '& + .MuiSwitch-track': {
          opacity: 0.2,
        },
        '&.Mui-checked': {
          '& .MuiSwitch-thumb': {},
          '& + .MuiSwitch-track': {
            backgroundColor: '#ccc',
          },
        },
      },
    },
    '& .MuiSwitch-thumb': {
      boxShadow: 'none',
      width: height,
      height: height,
      borderRadius: height / 2,
      backgroundColor: 'white',
      border: `1px solid ${colorBlueFrance}`,
    },
    '& .MuiSwitch-track': {
      borderRadius: height / 2,
      border: `1px solid ${colorBlueFrance}`,
      opacity: 1,
      backgroundColor: 'white',
    },
  }
})
