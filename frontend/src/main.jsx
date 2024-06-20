import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx'
import './index.css'
import { ChakraProvider,ColorModeScript } from '@chakra-ui/react'
import theme from './theme'
import { RecoilRoot } from 'recoil';


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RecoilRoot>
      <BrowserRouter>
      <ChakraProvider theme={theme}>
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
        <App />
      </ChakraProvider>
      </BrowserRouter>
    </RecoilRoot>
  </React.StrictMode>
)
