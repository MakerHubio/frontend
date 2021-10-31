import Head from 'next/head';
import {
    Container,
    Title,
    Card,
    Image,
    SimpleGrid,
    Text,
    Button,
    AppShell,
    Header,
    Group,
    ThemeIcon,
    Space, UnstyledButton, Avatar, createStyles, Menu,
} from '@mantine/core';
import { useMutation, useQuery } from 'react-query';
import { useContext, useEffect, useState } from 'react';
import { IoHeart, IoHeartOutline, IoAdd, IoHardwareChip, IoChevronDown, IoLogOut } from 'react-icons/io5';
import Link from 'next/link';
import jwt_decode from 'jwt-decode';
import { GetProjects, SetLikeProject } from '../apis/projects';
import { globalContext } from '../store';
import { LogoutUser } from '../apis/user';

const useStyles = createStyles((theme) => ({
    user: {
        borderRadius: theme.radius.sm,
        color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.black,

        '&:hover': {
            backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
        },
    },
}));

function getCookie(name: string): any {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts === undefined) return '';
    const cookie_value = parts.pop()
        ?.split(';')
        .shift();
    if (cookie_value === undefined) return '';
    return cookie_value;
}

export default function Home() {
    const { classes } = useStyles();
    const [projects, setProjects] = useState<any[]>([]);
    const {
        globalState,
        dispatch,
    } = useContext(globalContext);

    const { data } = useQuery('projects', GetProjects);
    const logout = useMutation(() => LogoutUser(), {
        onSuccess: () => {
            setTimeout(() => window.location.reload(), 500);
        },
    });

    const setLike = useMutation((like: any) =>
        SetLikeProject(like.project_id, like.user_id, like.like));

    useEffect(() => {
        if (data !== undefined) {
            setProjects(data.projects);
        }
    }, [data]);

    useEffect(() => {
        const token = getCookie('mh_authorization');
        if (token === '') return;
        const cookie_data = jwt_decode(token);
        dispatch({
            type: 'SET_USER',
            payload: cookie_data,
        });
    }, []);

    const projectCards: any = projects.map((project: any, index: number) =>
        <Card withBorder shadow="sm" padding="lg" radius="md" key={project.id}>
            <Card.Section>
                <Image src="https://picsum.photos/536/354" height={160} alt="Norway" />
            </Card.Section>
            <Text
              sx={(theme) => ({
                    marginTop: theme.spacing.sm,
                    marginBottom: theme.spacing.sm,
                })}
              weight={500}
            >{project.name}
            </Text>
            <SimpleGrid cols={2}>
                <Button
                  onClick={() => {
                        setLike.mutate({
                            project_id: project.id,
                            user_id: 1,
                            like: !project.isLiked,
                        });
                        projects[index].isLiked = !project.isLiked;
                        projects[index].likeCount += project.isLiked ? 1 : -1;
                    }}
                  leftIcon={project.isLiked ? <IoHeart size="24px" /> : <IoHeartOutline size="24px" />}
                  variant="light"
                  color="red"
                >
                    <Text sx={(theme) => ({ color: theme.colors.red[9] })}>
                        {project.likeCount}
                    </Text>
                </Button>
                <Button variant="light" color="blue">
                    <IoAdd size="24px" />
                </Button>
            </SimpleGrid>
        </Card>
    );

    return (
        <>
            <Head>
                <title>MakerHub - Home</title>
                <meta name="description" content="MakerHub - Home" />
                <link
                  rel="icon"
                  href="https://mantine.dev/favicon.svg?v=c7bf473b30e5d81722ea0acf3a11a107"
                  type="image/svg+xml"
                />
            </Head>

            <AppShell
              header={<Header
                height={60}
                padding="xs"
                sx={() => ({
                        display: 'flex',
                        alginItems: 'center',
                    })}
              >
                    <Group sx={theme => ({
                        marginLeft: theme.spacing.md,
                        marginRight: theme.spacing.md,
                        display: 'flex',
                        justifyContent: 'space-between',
                        width: '100%',
                    })}
                    >
                        <Group spacing={0}>
                            <ThemeIcon variant="filled">
                                <IoHardwareChip />
                            </ThemeIcon>
                            <Space w="sm" />
                            <Text size="xl" weight="bold">MakerHub</Text>
                        </Group>
                        <Group spacing={0}>
                            {globalState.loggedUser !== null ? (
                                <Menu control={
                                    <UnstyledButton sx={theme => ({
                                        root: {
                                            '&:hover': {
                                                backgroundColor: theme.colors.gray[1],
                                            },
                                        },
                                    })}
                                    >
                                        <Group className={classes.user}>
                                            <Avatar src="https://i.pravatar.cc/64" />
                                            <Text>{globalState.loggedUser.username}</Text>
                                            <IoChevronDown />
                                        </Group>
                                    </UnstyledButton>
                                }
                                >
                                    <Menu.Item onClick={() => logout.mutate()} icon={<IoLogOut />}>
                                        Logout
                                    </Menu.Item>
                                </Menu>
                            ) : (
                                <Link href={`/login?ref=${typeof window !== 'undefined' ? window.location : ''}`}>
                                    <Button variant="light" component="a">
                                        Sign in
                                    </Button>
                                </Link>
                            )}
                        </Group>
                    </Group>
                      </Header>}
              styles={(theme) => ({
                    main: {
                        backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0],
                        height: '100%',
                    },
                })}
            >
                <Container
                  size="xl"
                  style={{
                        paddingTop: 20,
                        paddingBottom: 120,
                    }}
                >
                    <Title style={{ marginBottom: 20 }}>Projects</Title>
                    <SimpleGrid
                      cols={4}
                      breakpoints={[
                            {
                                maxWidth: 'md',
                                cols: 3,
                                spacing: 'md',
                            },
                            {
                                maxWidth: 'sm',
                                cols: 2,
                                spacing: 'sm',
                            },
                            {
                                maxWidth: 'xs',
                                cols: 1,
                                spacing: 'sm',
                            },
                        ]}
                    >
                        {projectCards}
                    </SimpleGrid>
                </Container>
            </AppShell>

        </>
    );
}
