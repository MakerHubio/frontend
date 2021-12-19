import Head from 'next/head';
import {
    Container,
    Grid,
    Title,
    Col,
    Space,
    Paper,
    Divider,
    Image,
    Group,
    Button,
    Text,
    TextInput,
    Textarea, Select,
} from '@mantine/core';
import { IoGlobe, IoInformationCircle, IoLocation, IoLogoTwitter, IoPerson, IoSave } from 'react-icons/io5';
import { SelectDataItem } from '@mantine/core/lib/components/Select/types';
import Shell from '../../components/Shell/Shell';
import SettingsMenu from '../../components/Settings/Menu';
import { CountryListAllIsoData } from '../../const';

export default function ProfileSettings() {
    const getSelectData = (): SelectDataItem[] =>
        CountryListAllIsoData.map<SelectDataItem>(country => ({
            value: country.code,
            label: country.name,
        }));

    return <Shell>
        <Head>
            <title>MakerHub - Profile settings</title>
            <meta name="description" content="MakerHub - Profile settings" />
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
                    <SettingsMenu active={0} />
                </Col>
                <Col span={9}>
                    <Paper radius="md" withBorder shadow="md" padding="sm">
                        <Title order={3}>Avatar</Title>
                        <Divider mb="sm" />
                        <Group align="start">
                            <Image src="https://i.pravatar.cc/200?img=5" height={200} width={200} radius="md" />
                            <div>
                                <Group>
                                    <Button>Upload a photo</Button>
                                    <Text color="dimmed">or</Text>
                                    <Button color="gray">Generate avatar</Button>
                                </Group>
                                <Space h="sm" />
                                <Text color="dimmed">You can use drag an drop to change your avatar.</Text>
                                <Text color="dimmed">Preferred resolution is 256x256.</Text>
                            </div>
                        </Group>
                        <Space h="lg" />
                        <Title order={3}>Personal information</Title>
                        <Divider mb="sm" />
                        <TextInput label="Username" description="This username is the displayed name, visible to all users on MakerHub" icon={<IoPerson />} />
                        <Space h="md" />
                        <Textarea label="Bio" autosize minRows={4} maxRows={8} description="This will be shown in the 'About' section on your profile" icon={<IoInformationCircle />} />
                        <Space h="md" />
                        <TextInput label="Website" icon={<IoGlobe />} />
                        <Space h="md" />
                        <TextInput label="Twitter" icon={<IoLogoTwitter />} />
                        <Space h="md" />
                        <Select
                          id="country"
                          label="Location"
                          searchable
                          icon={<IoLocation />}
                          data={getSelectData()}
                        />
                        <Space h="md" />
                        <Group position="right">
                            <Button leftIcon={<IoSave />}>Save</Button>
                        </Group>
                    </Paper>
                </Col>
            </Grid>
        </Container>
           </Shell>;
}
