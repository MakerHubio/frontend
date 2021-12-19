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

export default function ProjectsSettings() {
    return <Shell>
        <Head>
            <title>MakerHub - Projects settings</title>
            <meta name="description" content="MakerHub - Projects settings" />
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
                    <SettingsMenu active={2} />
                </Col>
                <Col span={9}>
                    <Paper radius="md" withBorder shadow="md" padding="sm">
                        <Title order={3}>Projects</Title>
                        <Divider mb="sm" />
                        <Group direction="column" position="center" my="xl">
                            <Text>You don&apos;t have any project!</Text>
                            <Button leftIcon={<IoAdd size={20} />}>Create a project now!</Button>
                        </Group>
                    </Paper>
                </Col>
            </Grid>
        </Container>
           </Shell>;
}
