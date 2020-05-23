import { Box, CSSReset, ThemeProvider } from '@chakra-ui/core';
import Router from 'next/router';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import React from 'react';
import 'react-lazy-load-image-component/src/effects/blur.css';
import { ContentBox } from '../components/ContentBox';
import customTheme from '../config/theme';
import './styles.scss';

Router.events.on('routeChangeStart', () => NProgress.start());
Router.events.on('routeChangeComplete', () => NProgress.done());
Router.events.on('routeChangeError', () => NProgress.done());

// This default export is required in a new `pages/_app.js` file.
export default function MyApp({ Component, pageProps }) {
  return (
    <ThemeProvider theme={customTheme}>
      <CSSReset />

      <Box
        width={[
          '100%', // base
        ]}
      >
        <Component {...pageProps} />

        <ContentBox>
          <footer>
            <small>
              Feel free to drop us a message{' '}
              <a href="https://twitter.com/dosome_yoga" target="_blank" rel="noopener noreferrer">
                @dosome_yoga
              </a>{' '}
              | Made for you in 2020
            </small>
          </footer>
        </ContentBox>
      </Box>
    </ThemeProvider>
  );
}
