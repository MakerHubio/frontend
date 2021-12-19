import {
    Container,
    Grid,
    Col,
    Card,
    Avatar,
    Space,
    Group,
    Text,
    Tab,
    Tabs,
    SimpleGrid,
    Button,
    Menu,
    Box,
    Badge,
    Paper,
    Image,
} from '@mantine/core';
import {
    IoBuild, IoFolder,
    IoHeart,
    IoHeartCircleOutline, IoPencil,
    IoPeople, IoSettings,
} from 'react-icons/io5';
import Head from 'next/head';
import Shell from '../../../components/Shell/Shell';
import ProjectCard from '../../../components/ProjectCard/ProjectCard';

export default function UserProfile() {
    return (<Shell>

        <Head>
            <title>MakerHub - Breadbombs profile</title>
            <meta name="description" content="MakerHub - Breadbombs profile" />
            <link
              rel="icon"
              href="https://mantine.dev/favicon.svg?v=c7bf473b30e5d81722ea0acf3a11a107"
              type="image/svg+xml"
            />
        </Head>

        <Container size="xl">
            <Card
              radius="md"
              shadow="md"
              padding="sm"
              withBorder
              sx={(theme) => ({
                    borderColor: theme.colors.blue[5],
                    borderWidth: 2,
                })}
            >
                <Group position="apart">
                    <Text>Welcome <Text component="span" weight="bold">Breadbomb</Text>, this is your profile.</Text>
                    <Group spacing={1}>
                        <Button m={0} mr="xs" color="gray" compact leftIcon={<IoSettings />}>Settings</Button>
                        {/* <Button m={0} compact leftIcon={<IoPencil />}>Edit</Button> */}
                    </Group>
                </Group>
            </Card>
            <Space h="md" />
            <Paper
              radius="md"
              shadow="md"
              sx={() => ({
                    overflow: 'hidden',
                })}
            >
                <Image height={300} src="https://picsum.photos/id/626/1288/300" />
            </Paper>
            <Space h="md" />
            <Grid>
                <Col
                  span={12}
                  lg={4}
                  md={4}
                  sm={12}
                  xs={12}
                  grow
                >
                    <Card
                      radius="md"
                      shadow="md"
                      withBorder
                      padding="md"
                      sx={() => ({
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'stretch',
                    })}
                    >
                            <Avatar src="https://i.pravatar.cc/68" size={68} />
                        <Space w="md" />
                            <Box sx={() => ({
                                display: 'flex',
                                flexDirection: 'column',
                                flexGrow: 1,
                            })}
                            >
                                <Text my={0} weight="bold">BreadBomb</Text>
                                <Text mt={0}>Joined 08.11.2021</Text>
                                <Group spacing="xs">
                                    <Badge color="teal">Dev</Badge>
                                </Group>
                            </Box>
                    </Card>
                    <Space h="md" />
                    <Card radius="md" shadow="md" withBorder padding="md">
                        <Text weight="bold">About</Text>
                        <Space h="sm" />
                        <Text>Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                            Aliquam animi commodi dicta doloribus est
                            fuga minima nostrum odio odit pariatur perspiciatis placeat possimus quasi,
                            rem rerum ullam vel vero, vitae.
                        </Text>
                    </Card>
                </Col>
                <Col
                  span={12}
                  lg={8}
                  md={8}
                  sm={12}
                  xs={12}
                  grow
                >
                    <Card radius="md" shadow="md" withBorder padding="sm">
                        <Group position="apart">
                            <Tabs variant="pills">
                                <Tab label="Projects" icon={<IoBuild />} />
                                <Tab label="Likes" icon={<IoHeart />} />
                                <Tab label="Follower" icon={<IoPeople />} />
                                <Tab label="Following" icon={<IoHeartCircleOutline />} />
                            </Tabs>
                            <Menu>
                                <Menu.Label>More</Menu.Label>
                                <Menu.Item icon={<IoFolder />}>Collections</Menu.Item>
                            </Menu>
                        </Group>
                    </Card>
                    <Space h="md" />
                    <SimpleGrid
                      cols={3}
                      breakpoints={[
                    { maxWidth: 'md', cols: 3, spacing: 'md' },
                    { maxWidth: 'sm', cols: 2, spacing: 'sm' },
                    { maxWidth: 'xs', cols: 1, spacing: 'sm' },
                    ]}
                    >
                        <ProjectCard project={{ name: 'Test' }} onLike={() => false} />
                        <ProjectCard project={{ name: 'Krasses Bauteil' }} onLike={() => false} />
                        <ProjectCard project={{ name: 'Lol' }} onLike={() => false} />
                    </SimpleGrid>
                </Col>
            </Grid>
        </Container>
            </Shell>);
}
