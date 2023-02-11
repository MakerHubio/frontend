import { AppProps } from 'next/app';
import Head from 'next/head';
import { MantineProvider, ColorScheme, ColorSchemeProvider } from '@mantine/core';
import { NotificationsProvider } from '@mantine/notifications';
import { Hydrate, QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import '../styles.css';
import { useState } from 'react';
import { useLocalStorage } from '@mantine/hooks';
import { ModalsProvider } from '@mantine/modals';
import { GlobalStore } from '../store';

export default function App(props: AppProps) {
  const {
    Component,
    pageProps,
  } = props;

  const [queryClient] = useState(() => new QueryClient());

  const [lsColorScheme] = useLocalStorage<ColorScheme>({
    key: 'color-scheme',
    defaultValue: 'dark',
  });
  const [colorScheme, setColorScheme] = useState(lsColorScheme);
  const toggleColorScheme = (value?: ColorScheme) =>
    setColorScheme(value || (colorScheme === 'dark' ? 'light' : 'dark'));

  return (
    <>
      <Head>
        <title>Page title</title>
        <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
      </Head>

      <ColorSchemeProvider
        colorScheme={colorScheme as ColorScheme}
        toggleColorScheme={toggleColorScheme}
      >
        <MantineProvider withNormalizeCSS withGlobalStyles
                         theme={{ colorScheme: colorScheme as ColorScheme }}>
          <ModalsProvider>
            <GlobalStore>
              <NotificationsProvider>
                <QueryClientProvider client={queryClient}>
                  <Hydrate state={pageProps.dehydratedState}>
                    <Component {...pageProps} />
                    <ReactQueryDevtools initialIsOpen/>
                  </Hydrate>
                </QueryClientProvider>
              </NotificationsProvider>
            </GlobalStore>
          </ModalsProvider>
        </MantineProvider>
      </ColorSchemeProvider>
    </>
  );
}
