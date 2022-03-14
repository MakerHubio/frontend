import { AppProps } from 'next/app';
import Head from 'next/head';
import { MantineProvider, NormalizeCSS, GlobalStyles, ColorScheme, ColorSchemeProvider } from '@mantine/core';
import { NotificationsProvider } from '@mantine/notifications';
import { Hydrate, QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import '../styles.css';
import { useState } from 'react';
import { useLocalStorageValue } from '@mantine/hooks';
import { ModalsProvider } from '@mantine/modals';
import { GlobalStore } from '../store';

export default function App(props: AppProps) {
    const {
        Component,
        pageProps,
    } = props;

    const queryClient = new QueryClient();

    const [lsColorScheme] = useLocalStorageValue<ColorScheme>({
        key: 'color-scheme',
        defaultValue: 'dark',
    });
    const [colorScheme, setColorScheme] = useState(lsColorScheme);
    const toggleColorScheme = (value?: ColorScheme) =>
        setColorScheme(value || (colorScheme === 'dark' ? 'light' : 'dark'));

    return (
        <>
            <Head>
                <title>Mantine next example</title>
                <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width, user-scalable=no" />
            </Head>

            <ColorSchemeProvider
              colorScheme={colorScheme as ColorScheme}
              toggleColorScheme={toggleColorScheme}
            >
                <MantineProvider theme={{ colorScheme: colorScheme as ColorScheme }}>
                    <ModalsProvider>
                        <NormalizeCSS />
                        <GlobalStyles />
                        <GlobalStore>
                            <NotificationsProvider>
                                <QueryClientProvider client={queryClient}>
                                    <Hydrate state={pageProps.dehydratedState}>
                                        <Component {...pageProps} />
                                        <ReactQueryDevtools initialIsOpen />
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
