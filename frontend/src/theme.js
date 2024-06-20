// theme.js
import { extendTheme } from '@chakra-ui/react'
import { mode } from '@chakra-ui/theme-tools'

const styles = {
    global: (props) => ({
        body: {
        color: mode('gray.800', 'whiteAlpha.900')(props),
        bg: mode('gray.100', '#101010')(props),
        },
    }),
}
const config = {
    initialColorMode: 'light',
    useSystemColorMode: false,
  }
  const colors = {
    gray:{
      light:"#616161",
      dark:"#1e1e1e",
    }
  }
const theme = extendTheme({ styles, config, colors })

export default theme
