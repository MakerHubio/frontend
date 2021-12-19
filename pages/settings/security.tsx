import Head from 'next/head';
import {
    Container,
    Grid,
    Title,
    Col,
    Space,
    Anchor,
    Paper, Divider, TextInput, Group, Button, Text, ThemeIcon,
} from '@mantine/core';
import { IoLockClosed } from 'react-icons/io5';
import Shell from '../../components/Shell/Shell';
import SettingsMenu from '../../components/Settings/Menu';

export default function SecuritySettings() {
    return <Shell>
        <Head>
            <title>MakerHub - Security settings</title>
            <meta name="description" content="MakerHub - Security settings" />
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
                    <SettingsMenu active={4} />
                </Col>
                <Col span={9}>
                    <Paper radius="md" withBorder shadow="md" padding="sm">
                        <Title order={3}>Change password</Title>
                        <Divider mb="sm" />
                        <TextInput label="Old password" icon={<IoLockClosed />} />
                        <Space h="sm" />
                        <TextInput label="New password" icon={<IoLockClosed />} />
                        <Space h="sm" />
                        <TextInput label="Confirm new password" icon={<IoLockClosed />} />
                        <Space h="sm" />
                        <Text color="dimmed" size="sm">Your password should at least have 8 characters including a number and a lowercase letter.</Text>
                        <Space h="sm" />
                        <Group position="right">
                            <Anchor>I forgot my password</Anchor>
                            <Button>Update Password</Button>
                        </Group>
                        <Space h="md" />
                        <Title order={3}>Two-factor authentication</Title>
                        <Divider mb="sm" />
                        <Group my="lg" position="center" direction="column" spacing={1}>
                            <ThemeIcon my="lg" variant="light"><IoLockClosed size={20} /></ThemeIcon>
                            <Text size="xl" weight="bold">Two factor authentication is not enabled yet.</Text>
                            <Text color="dimmed">Two-factor authentication adds an additional layer of security to your account by requiring more than just a password to sign in.</Text>
                            <Space h="md" />
                            <Button>Enable two-factor authentication</Button>
                        </Group>
                    </Paper>
                </Col>
            </Grid>
        </Container>
           </Shell>;
}
