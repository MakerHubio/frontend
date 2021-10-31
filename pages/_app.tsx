import { AppProps } from 'next/app';
import Head from 'next/head';
import { MantineProvider, NormalizeCSS, GlobalStyles } from '@mantine/core';
import { NotificationsProvider } from '@mantine/notifications';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import '../styles.css';
import { GlobalStore } from '../store';

export default function App(props: AppProps) {
    const {
        Component,
        pageProps,
    } = props;

    const queryClient = new QueryClient();

    return (
        <>
            <Head>
                <title>Mantine next example</title>
                <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
            </Head>

            <MantineProvider
              theme={{
                    /** Put your mantine theme override here */
                    colorScheme: 'light',
                }}
            >
                <NormalizeCSS />
                <GlobalStyles />
                <GlobalStore>
                    <NotificationsProvider>
                        <QueryClientProvider client={queryClient}>
                            <Component {...pageProps} />
                            <ReactQueryDevtools initialIsOpen />
                        </QueryClientProvider>
                    </NotificationsProvider>
                </GlobalStore>
            </MantineProvider>
        </>
    );
}
