import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { ChakraProvider } from '@chakra-ui/react'
import { mode } from '@chakra-ui/theme-tools'
import { StepsStyleConfig as Steps } from 'chakra-ui-steps'
import { extendTheme } from '@chakra-ui/react'
import WalletContextProvider from 'components/WalletContextProvider'
import NextNProgress from "nextjs-progressbar"
import { AnimatePresence } from 'framer-motion'
import { baseURL } from 'config'

const colors = {
  brand: {
    900: '#1a365d',
    800: '#153e75',
    700: '#2a69ac',
  },
}
const styles = {
  global: props => ({
    body: {
      bg: mode('#F9FAFB', 'gray.900')(props),
    },
  }),
};
const theme = extendTheme({ 
  colors,
  components: {
    Steps,
  },
  styles,
})

function MyApp({ Component, pageProps, router }: AppProps) {
  const url = `${baseURL}${router.route}`
 
  return (
    <ChakraProvider theme={theme}>
      <WalletContextProvider>
      <NextNProgress height={2} color={'black'} />
      <AnimatePresence
        mode='wait'
        initial={false}
        onExitComplete={() => window.scrollTo(0, 0)}
      >
        <Component {...pageProps} key={url} />
      </AnimatePresence>
      </WalletContextProvider>
    </ChakraProvider>
  )
}

export default MyApp
