import {
  ThemeIcon,
  Anchor,
  Box, Button, Center, createStyles, PasswordInput, Space, Text, TextInput, Title,
} from '@mantine/core';
import { useRouter } from 'next/router';
import {
  IoHardwareChip,
  IoLockClosed,
  IoMail,
  IoPerson,
} from 'react-icons/io5';
import { useForm } from '@mantine/hooks';
import jwtDecode from 'jwt-decode';
import { RegisterUser } from '../apis/authentication';
import { RegisterRequest } from '../models/authentication';
import JWTUser from '../models/JWTUser';

const useStyles = createStyles(theme => ({
  container: {
    height: '100%',
    width: '100%',
    overflow: 'hidden',
    display: 'flex',
    backgroundColor: theme.colorScheme === 'light' ? theme.white : theme.colors.dark[8],
  },
  bg: {
    padding: theme.spacing.lg,
    height: '100%',
    width: '40%',
    position: 'relative',
    overflow: 'hidden',
    img: {
      borderRadius: theme.radius.xl,
      boxShadow: theme.shadows.md,
    },
    [theme.fn.smallerThan('md')]: {
      display: 'none',
      width: '0%',
    },
  },
  content: {
    width: '60%',
    [theme.fn.smallerThan('md')]: {
      width: '100%',
    },
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    [theme.fn.smallerThan('md')]: {
      justifyContent: 'start',
      padding: theme.spacing.md,
    },
  },
}));

export default function Register() {
  const router = useRouter();
  const { classes } = useStyles();

  const form = useForm({
    initialValues: {
      username: '',
      email: '',
      password: '',
    },
    validationRules: {
      // imposter validation rule is noop and will be ignored, ts will complain
      username: (value) => value !== '',
      email: (value) => value !== '' && /^\S+@\S+$/.test(value),
      password: (value) => value !== '',
    },
  });

  const register = (reg: RegisterRequest) => {
    RegisterUser(reg).then(result => {
      if (result.status === 200) {
        const jwtUser: JWTUser = jwtDecode(result.data);
        router.push(`/user/${jwtUser.userId}/profile`);
      }
    });
  };

  return (
    <Box className={classes.container}>
      <Box className={classes.content}>
        <Center className={classes.form}>
          <ThemeIcon variant="filled" color="primary" size={60}>
            <IoHardwareChip size={40} />
          </ThemeIcon>
          <Space h="lg" />
          <Box>
            <Text align="left" color="dimmed">Start for free</Text>
            <Title align="left">Create a new account<Text color="blue" inherit component="span">.</Text></Title>
            <Space h="sm" />
            <Text align="left">Already a member? <Anchor href="/login">Log in</Anchor></Text>
            <Space h="sm" />
            <form onSubmit={form.onSubmit(values => register({
              username: values.username,
              email: values.email,
              password: values.password,
            }))}
            >
              <Space h="sm" />
              <TextInput
                required
                label="Username"
                icon={<IoPerson />}
                error={form.errors.username && 'Please specify an username'}
                value={form.values.username}
                onChange={(event) => form.setFieldValue('username', event.currentTarget.value)}
              />
              <Space h="sm" />
              <TextInput
                required
                label="E-Mail"
                icon={<IoMail />}
                error={form.errors.email && 'Please specify an valid email'}
                value={form.values.email}
                onChange={(event) => form.setFieldValue('email', event.currentTarget.value)}
              />
              <Space h="sm" />
              <PasswordInput
                label="Password"
                required
                icon={<IoLockClosed />}
                error={form.errors.password && 'Please specify a password'}
                value={form.values.password}
                onChange={(event) => form.setFieldValue('password', event.currentTarget.value)}
              />
              <Space h="xl" />
              <Button color="primary" type="submit" fullWidth>Register</Button>
            </form>
          </Box>
        </Center>
      </Box>
      <Box className={classes.bg}>
        <img
          height="100%"
          width="100%"
          alt="background"
          src="/login-register-bg.jpg"
        />
      </Box>
    </Box>
  );
}
