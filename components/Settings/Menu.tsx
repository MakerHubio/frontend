import { Button, createStyles, Divider, Group, Paper, ThemeIcon } from '@mantine/core';
import { IoBan, IoCube, IoLockClosed, IoNotifications, IoPerson, IoShield, IoSunny } from 'react-icons/io5';
import { useRouter } from 'next/router';

type SettingsMenuProps = {
    active: number;
};

const useStyles = createStyles(() => ({
    menuButton: {
        border: 'none',
    },
}));

export default function SettingsMenu({ active }: SettingsMenuProps) {
    const router = useRouter();
    const { classes } = useStyles();

    return <Paper radius="md" withBorder shadow="md" padding="sm">
        <Group direction="column" spacing={2} grow>
            <Button
              className={classes.menuButton}
              variant="outline"
              onClick={() => router.push('/settings/profile')}
              color={active === 0 ? 'blue' : 'gray'}
              fullWidth
              leftIcon={<ThemeIcon color={active === 0 ? 'blue' : 'gray'} variant="light"><IoPerson /></ThemeIcon>}
              styles={() => ({
                    root: {
                        padding: '0px 5px',
                    },
                    inner: {
                        justifyContent: 'left',
                    },
                })}
            >
                Profile
            </Button>
            <Button
              className={classes.menuButton}
              variant="outline"
              onClick={() => router.push('/settings/account')}
              color={active === 1 ? 'blue' : 'gray'}
              fullWidth
              leftIcon={<ThemeIcon color={active === 1 ? 'blue' : 'gray'} variant="light"><IoShield /></ThemeIcon>}
              styles={() => ({
                    root: {
                        padding: '0px 5px',
                    },
                    inner: {
                        justifyContent: 'left',
                    },
                })}
            >
                Account
            </Button>
            <Button
              className={classes.menuButton}
              variant="outline"
              onClick={() => router.push('/settings/projects')}
              color={active === 2 ? 'blue' : 'gray'}
              fullWidth
              leftIcon={<ThemeIcon color={active === 2 ? 'blue' : 'gray'} variant="light"><IoCube /></ThemeIcon>}
              styles={() => ({
                    root: {
                        padding: '0px 5px',
                    },
                    inner: {
                        justifyContent: 'left',
                    },
                })}
            >
                Projects
            </Button>
            <Button
              className={classes.menuButton}
              variant="outline"
              onClick={() => router.push('/settings/appearance')}
              color={active === 3 ? 'blue' : 'gray'}
              fullWidth
              leftIcon={<ThemeIcon color={active === 3 ? 'blue' : 'gray'} variant="light"><IoSunny /></ThemeIcon>}
              styles={() => ({
                    root: {
                        padding: '0px 5px',
                    },
                    inner: {
                        justifyContent: 'left',
                    },
                })}
            >
                Appearance
            </Button>
            <Button
              className={classes.menuButton}
              variant="outline"
              onClick={() => router.push('/settings/security')}
              color={active === 4 ? 'blue' : 'gray'}
              fullWidth
              leftIcon={<ThemeIcon color={active === 4 ? 'blue' : 'gray'} variant="light"><IoLockClosed /></ThemeIcon>}
              styles={() => ({
                    root: {
                        padding: '0px 5px',
                    },
                    inner: {
                        justifyContent: 'left',
                    },
                })}
            >
                Account security
            </Button>
            <Button
              className={classes.menuButton}
              variant="outline"
              onClick={() => router.push('/settings/notifications')}
              color={active === 5 ? 'blue' : 'gray'}
              fullWidth
              leftIcon={<ThemeIcon color={active === 5 ? 'blue' : 'gray'} variant="light"><IoNotifications /></ThemeIcon>}
              styles={() => ({
                    root: {
                        padding: '0px 5px',
                    },
                    inner: {
                        justifyContent: 'left',
                    },
                })}
            >
                Notifications
            </Button>
            <Divider
              label="Moderation"
              my="sm"
            />
            <Button
              className={classes.menuButton}
              variant="outline"
              onClick={() => router.push('/settings/blocked')}
              color={active === 7 ? 'blue' : 'gray'}
              fullWidth
              leftIcon={<ThemeIcon color={active === 6 ? 'blue' : 'gray'} variant="light"><IoBan /></ThemeIcon>}
              styles={() => ({
                    root: {
                        padding: '0px 5px',
                    },
                    inner: {
                        justifyContent: 'left',
                    },
                })}
            >
                Blocked Users
            </Button>
        </Group>
           </Paper>;
}
