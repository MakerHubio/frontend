import { PropsWithChildren, useContext, useEffect, useRef, useState } from 'react';
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
  Popover, useMantineColorScheme, MediaQuery, MantineColor, MantineProvider, useMantineTheme,
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
import { useHotkeys } from '@mantine/hooks';
import { globalContext } from '../../store';
import { LogoutUser } from '../../apis/authentication';
import getCookie from '../../utils/cookie';
import JWTUser from '../../models/JWTUser';
import { GenerateAvatarUrl } from '../../apis/users';

type ShellProps = {
  noPadding?: boolean,
  background?: MantineColor,
  colorScheme?: 'dark',
  showSearch?: boolean,
};

const useStyles = createStyles((theme) => ({
  user: {
    borderRadius: theme.radius.sm,
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
  const [avatar, setAvatar] = useState('');
  const { toggleColorScheme } = useMantineColorScheme();
  const theme = useMantineTheme();

  const logout = useMutation(() => LogoutUser(), {
    onSuccess: () => {
      document.cookie = '';
      setTimeout(() => window.location.reload(), 500);
    },
  });

  const { dispatch } = useContext(globalContext);

  const searchRef = useRef<HTMLInputElement>(null);

  useHotkeys([
    ['ctrl+K', () => {
      searchRef.current?.focus();
    }],
    ['ctrl+J', () => toggleColorScheme()],
  ]);

  useEffect(() => {
    const token = getCookie('mh_authorization');
    if (token === '') return;
    const cookie_data: JWTUser = jwt_decode(token);
    dispatch({
      type: 'SET_USER',
      payload: cookie_data,
    });

    if (cookie_data.avatarId === '') {
      setAvatar(GenerateAvatarUrl(cookie_data.userId, 64));
    } else {
      setAvatar(`http://localhost:5001/files/${cookie_data.avatarId}?w=64&h=64`);
    }
  }, []);

  return (
    <AppShell
      header={<MantineProvider theme={{ colorScheme: props.colorScheme || theme.colorScheme }}>
        <Header
          height={60}
          p="xs"
          sx={() => ({
            display: 'flex',
            alignItems: 'center',
            backgroundColor: props.background,
            borderBottom: props.background ? 'none' : undefined,
          })}
        >
          <Group sx={t => ({
            marginLeft: t.spacing.md,
            marginRight: t.spacing.md,
            display: 'flex',
            justifyContent: 'space-between',
            alignContent: 'center',
            width: '100%',
          })}
          >
            <Group>
              <Link href="/" passHref>
                <UnstyledButton>
                  <Group spacing={0}>
                    <ThemeIcon variant="filled">
                      <IoHardwareChip/>
                    </ThemeIcon>
                    <Space w="sm"/>
                    <MediaQuery
                      smallerThan="md"
                      styles={{ display: 'none' }}
                    >
                      <Text size="xl" weight="bold">MakerHub</Text>
                    </MediaQuery>
                  </Group>
                </UnstyledButton>
              </Link>
            </Group>
            {
              props.showSearch !== undefined ?
                <MediaQuery
                  smallerThan="md"
                  styles={{ display: 'none' }}
                >
                  <Autocomplete
                    icon={<IoSearch/>}
                    placeholder="Search projects..."
                    rightSectionWidth={72}
                    ref={searchRef}
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
                </MediaQuery> : null
            }
            {globalState.loggedUser !== null ? (
              <Group>
                <Popover
                  opened={notificationsOpened}
                  onClose={() => setNotificationsOpened(false)}
                  target={
                    <ActionIcon onClick={() => setNotificationsOpened(true)}>
                      <IoNotifications size={20}/>
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
                    <Text sx={t => ({
                      color: t.colorScheme === 'light' ? 'black' : 'white',
                    })} weight="bold" size="sm">Notifications</Text>
                    <ActionIcon size="sm"><IoTrash size={15}/></ActionIcon>
                  </Group>
                  <Group my="lg" position="center">
                    <Text color="dimmed">No further notifications</Text>
                  </Group>
                </Popover>
                <Menu
                  sx={() => ({
                    display: 'flex',
                  })}
                  control={
                    <ActionIcon><IoAdd size={20}/></ActionIcon>
                  }
                >
                  <Menu.Item
                    onClick={() => router.push('/project/add')}
                  >
                    Add project
                  </Menu.Item>
                </Menu>
              <Menu
                  sx={t => ({
                    display: 'flex',
                    '&:hover': {
                      backgroundColor: t.colorScheme === 'light' ? t.colors.gray[1] : t.colors.dark[6],
                    },
                    borderRadius: t.radius.sm,
                    padding: 2,
                  })}
                  control={
                      <UnstyledButton>
                        <Group className={classes.user}>
                          <Avatar
                            src={avatar}
                          />
                          <MediaQuery
                            smallerThan="md"
                            styles={{ display: 'none' }}
                          >
                            <Text>{globalState.loggedUser.username}</Text>
                          </MediaQuery>
                          <IoChevronDown/>
                        </Group>
                      </UnstyledButton>
                  }
                >
                  <Menu.Item
                    onClick={() => router.push(`/user/${globalState.loggedUser!.userId}/profile`)}
                    icon={<IoPerson/>}
                  >
                    Profile
                  </Menu.Item>
                  <Menu.Item onClick={() => router.push('/settings/profile')} icon={<IoSettings/>}>
                    Settings
                  </Menu.Item>
                  <Menu.Item onClick={() => logout.mutate()} icon={<IoLogOut/>}>
                    Logout
                  </Menu.Item>
                </Menu>
              </Group>
            ) : (
              <Link href={`/login?ref=${typeof window !== 'undefined' ? window.location : ''}`} passHref>
                <Button variant="light" component="a">
                  Login
                </Button>
              </Link>
            )}
          </Group>
        </Header>
      </MantineProvider>}
      styles={(t) => ({
        root: {
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
        },
        body: {
          flexGrow: 1,
        },
        main: {
          backgroundColor: t.colorScheme === 'dark' ? t.colors.dark[8] : t.colors.gray[0],
          height: '100%',
        },
      })}
      padding={props.noPadding ? 0 : 'xs'}
    >
      {props.children}
    </AppShell>
  );
}
