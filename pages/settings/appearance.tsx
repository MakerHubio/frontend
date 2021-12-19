import Head from 'next/head';
import {
    Container,
    Grid,
    Title,
    Col,
    Space,
    Paper,
    Text,
    Select,
    Badge,
    Group,
    Card,
    Image, UnstyledButton, ColorScheme, useMantineColorScheme, Divider,
} from '@mantine/core';
import { useLocalStorageValue } from '@mantine/hooks';
import Shell from '../../components/Shell/Shell';
import SettingsMenu from '../../components/Settings/Menu';

export default function AppearanceSettings() {
    const [, setLSColorScheme] = useLocalStorageValue<ColorScheme>({ key: 'color-scheme', defaultValue: 'dark' });
    const { colorScheme, toggleColorScheme } = useMantineColorScheme();
    const setColorScheme = (value? : ColorScheme) => {
        if (value === undefined) return;
        setLSColorScheme(value);
        toggleColorScheme(value);
    };

    return <Shell>
        <Head>
            <title>MakerHub - Appearance settings</title>
            <meta name="description" content="MakerHub - Appearance settings" />
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
                    <SettingsMenu active={3} />
                </Col>
                <Col span={9}>
                    <Paper radius="md" withBorder shadow="md" padding="sm">
                        <Title order={3}>Theme</Title>
                        <Divider mb="sm" />
                        <Text>Choose how MakerHub looks to you. You can select a single theme,
                            or sync with your system and automatically
                            switch between light and dark themes.
                        </Text>
                        <Space h="md" />
                        <Select
                          defaultValue="single"
                          label="Theme mode"
                          data={[
                            { value: 'single', label: 'Single theme' },
                            { value: 'sync', label: 'Sync with system' },
                        ]}
                        />
                        <Space h="md" />
                        <Group>
                            <UnstyledButton onClick={() => setColorScheme('light')}>
                                <Card radius="md" withBorder>
                                    <Card.Section>
                                        <Image src="https://github.githubassets.com/images/modules/settings/color_modes/light_preview.svg" />
                                    </Card.Section>
                                    <Card.Section>
                                        <Group position="apart">
                                            <Text m="sm">Light</Text>
                                            {colorScheme === 'light' ? <Badge mr="sm">Active</Badge> : null }
                                        </Group>
                                    </Card.Section>
                                </Card>
                            </UnstyledButton>
                            <UnstyledButton onClick={() => setColorScheme('dark')}>
                                <Card radius="md" withBorder>
                                    <Card.Section>
                                        <Image src="https://github.githubassets.com/images/modules/settings/color_modes/dark_preview.svg" />
                                    </Card.Section>
                                    <Card.Section>
                                        <Group position="apart">
                                            <Text m="sm">Dark</Text>
                                            {colorScheme === 'dark' ? <Badge mr="sm">Active</Badge> : null }
                                        </Group>
                                    </Card.Section>
                                </Card>
                            </UnstyledButton>
                        </Group>
                    </Paper>
                </Col>
            </Grid>
        </Container>
           </Shell>;
}
