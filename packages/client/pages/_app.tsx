import type { AppProps } from 'next/app'
import { ThemeProvider } from 'styled-components'

import { theme, Reset } from '@/styles'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Reset/>
      <ThemeProvider theme={theme}>
        <Component {...pageProps} />
      </ThemeProvider>
    </>
  )
}

export default MyApp
