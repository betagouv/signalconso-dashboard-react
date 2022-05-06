import {Box} from "@mui/material";


export const DataEconomie = () => {
  return (
    <Box sx={{
      position: 'relative',
      paddingBottom: '500%',
      // paddingTop: '35px',
      height: '0',
      overflow: 'hidden'
    }}>
      <Box component={'iframe'} sx={{
        position: 'absolute',
        top: '0',
        left: '0',
        width: '100%',
        height: '100%'
      }} frameBorder='0'  sandbox='allow-scripts allow-same-origin'
           src="https://opendatamef.opendatasoft.com/pages/signal-conso-vue-restreinte/?headless=true"/>
    </Box>
  )
}