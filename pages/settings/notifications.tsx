import Head from 'next/head';
import {
    Container,
    Grid,
    Title,
    Col,
    Space,
    Text,
    Paper, Divider, TextInput, Group, Button, Center,
} from '@mantine/core';
import {IoAdd, IoMail} from 'react-icons/io5';
import Shell from '../../components/Shell/Shell';
import SettingsMenu from '../../components/Settings/Menu';

export default function NotificationsSettings() {
    return <Shell>
        <Head>
            <title>MakerHub - Notifications settings</title>
            <meta name="description" content="MakerHub - Notifications settings" />
            <link
              rel="icon"
              href="https://mantine.dev/favicon.svg?v=c7bf473b30e5d81722ea0acf3a11a107"
              type="image/svg+xml"
            />
        </Head>

        <Container size="xl">
            <Title>Settings</Title>
            <Space h="md" />
            <Grid>
                <Col span={3}>
                    <SettingsMenu active={5} />
                </Col>
                <Col span={9}>
                    <Paper radius="md" withBorder shadow="md" padding="sm">
                        <Title order={3}>Notifications</Title>
                        <Divider mb="sm" />
                    </Paper>
                </Col>
            </Grid>
        </Container>
           </Shell>;
}
