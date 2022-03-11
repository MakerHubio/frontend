import Head from 'next/head';
import {
    Container,
    Grid,
    Title,
    Col,
    Space,
    Text,
    Paper, Divider, TextInput, Group, Button,
} from '@mantine/core';
import { IoMail } from 'react-icons/io5';
import Shell from '../../components/Shell/Shell';
import SettingsMenu from '../../components/Settings/Menu';

export default function AccountSettings() {
    return <Shell>
        <Head>
            <title>MakerHub - Account settings</title>
            <meta name="description" content="MakerHub - Account settings" />
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
                    <SettingsMenu active={1} />
                </Col>
                <Col span={9}>
                    <Paper radius="md" withBorder shadow="md" p="sm">
                        <Title order={3}>E-Mail</Title>
                        <Divider mb="sm" />
                        <TextInput label="E-Mail Address" icon={<IoMail />} disabled />
                        <Space h="sm" />
                        <Group position="right">
                            <Button>Change E-Mail</Button>
                        </Group>
                        <Space h="md" />
                        <Title
                          order={3}
                          sx={theme => ({
                            color: theme.colors.red[5],
                        })}
                        >Delete Account
                        </Title>
                        <Divider mb="sm" />
                        <Text>
                            After deleting your account, your data will still be available for 1 week.
                            Within this week you&apos;re able to undo this action. After this week all of your data
                            including you&apos;re projects and any other data will be deleted <Text component="span" weight="bold">irrevocable</Text>.
                        </Text>
                        <Group position="right">
                            <Button color="red">Delete your account</Button>
                        </Group>
                    </Paper>
                </Col>
            </Grid>
        </Container>
           </Shell>;
}
