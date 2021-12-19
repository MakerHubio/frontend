import { PropsWithChildren, useContext, useEffect, useState } from 'react';
import {
    AppShell, Autocomplete,
    Avatar,
    Button,
    createStyles,
    Group,
    Header,
    Menu,
    Space,
    Text, Kbd,
    ThemeIcon,
    UnstyledButton,
    ActionIcon,
    Popover, Divider, Anchor
} from '@mantine/core';
import {
    IoAdd,
    IoChevronDown,
    IoHardwareChip,
    IoLogOut,
    IoNotifications,
    IoPerson,
    IoSearch,
    IoSettings, IoTrash,
} from 'react-icons/io5';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useMutation } from 'react-query';
import jwt_decode from 'jwt-decode';
import { globalContext } from '../../store';
import { LogoutUser } from '../../apis/authentication';
import getCookie from "../../utils/cookie";

type ShellProps = {};

const useStyles = createStyles((theme) => ({
    user: {
        borderRadius: theme.radius.sm,
        color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.black,

        '&:hover': {
            backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
        },
    },
    searchKdbContainer: {
        display: 'flex',
        alignContent: 'center',
    },
}));

export default function Shell(props: PropsWithChildren<ShellProps>) {
    const router = useRouter();
    const { classes } = useStyles();
    const { globalState } = useContext(globalContext);
    const [notificationsOpened, setNotificationsOpened] = useState(false);

    const logout = useMutation(() => LogoutUser(), {
        onSuccess: () => {
            document.cookie = '';
            setTimeout(() => window.location.reload(), 500);
        },
    });

    const { dispatch } = useContext(globalContext);

    useEffect(() => {
        const token = getCookie('mh_authorization');
        if (token === '') return;
        const cookie_data = jwt_decode(token);
        dispatch({
            type: 'SET_USER',
            payload: cookie_data,
        });
    }, []);

    return (
        <AppShell
          header={<Header
            height={60}
            padding="xs"
            sx={() => ({
                    display: 'flex',
                    alignItems: 'center',
                })}
          >
                <Group sx={theme => ({
                    marginLeft: theme.spacing.md,
                    marginRight: theme.spacing.md,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignContent: 'center',
                    width: '100%',
                })}
                >
                    <Group>
                        <Anchor component="a" href="/">
                            <Group spacing={0}>
                                <ThemeIcon variant="filled">
                                    <IoHardwareChip />
                                </ThemeIcon>
                                <Space w="sm" />
                                <Text size="xl" weight="bold">MakerHub</Text>
                            </Group>
                        </Anchor>
                        <Autocomplete
                          icon={<IoSearch />}
                          placeholder="Search projects..."
                          rightSectionWidth={72}
                          rightSection={
                                <div className={classes.searchKdbContainer}>
                                    <Kbd mr={2}>Ctrl</Kbd>
                                    <Kbd>K</Kbd>
                                </div>}
                          sx={() => ({
                                width: '480px',
                            })}
                          data={[
                                { value: 'Test' },
                                { value: '#3DBenchy - The jolly 3D printing torture-test by CreativeTools.se' },
                            ]}
                        />
                    </Group>
                    {globalState.loggedUser !== null ? (
                        <Group>
                            <Popover
                              opened={notificationsOpened}
                              onClose={() => setNotificationsOpened(false)}
                              target={
                                  <ActionIcon onClick={() => setNotificationsOpened(true)}>
                                      <IoNotifications size={20} />
                                  </ActionIcon>
                              }
                              styles={{ body: { width: 350 } }}
                              position="bottom"
                              placement="end"
                              spacing={0}
                              shadow="sm"
                              withArrow
                            >
                                <Group position="apart" m="xs">
                                    <Text size="sm">Notifications</Text>
                                    <ActionIcon size="sm"><IoTrash size={15} /></ActionIcon>
                                </Group>
                                <Divider my="sm" />
                                <Group my="lg" position="center">
                                    <Text color="dimmed">No further notifications</Text>
                                </Group>
                            </Popover>
                            <Menu
                              sx={() => ({
                                    display: 'flex',
                                })}
                              control={
                                    <ActionIcon><IoAdd size={20} /></ActionIcon>
                                }
                            >
                                <Menu.Item
                                  onClick={() => router.push('/project/add')}
                                >
                                    Add project
                                </Menu.Item>
                            </Menu>
                            <Menu
                              sx={() => ({
                                    display: 'flex',
                                })}
                              control={
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
                                <Menu.Item
                                  onClick={() => router.push(`/user/${globalState.loggedUser!.userId}`)}
                                  icon={<IoPerson />}
                                >
                                    Profile
                                </Menu.Item>
                                <Menu.Item onClick={() => router.push('/settings/profile')} icon={<IoSettings />}>
                                    Settings
                                </Menu.Item>
                                <Menu.Item onClick={() => logout.mutate()} icon={<IoLogOut />}>
                                    Logout
                                </Menu.Item>
                            </Menu>
                        </Group>
                    ) : (
                        <Link href={`/login?ref=${typeof window !== 'undefined' ? window.location : ''}`}>
                            <Button variant="light" component="a">
                                Login
                            </Button>
                        </Link>
                    )}
                </Group>
                  </Header>}
          styles={(theme) => ({
                root: {
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                },
                body: {
                    flexGrow: 1,
                },
                main: {
                    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0],
                    height: '100%',
                },
            })}
        >
            {props.children}
        </AppShell>
    );
}
