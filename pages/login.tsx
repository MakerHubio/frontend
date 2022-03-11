import {
    Center,
    Card,
    Title,
    Text,
    TextInput,
    Space,
    PasswordInput,
    Checkbox,
    Group,
    Button,
    Anchor,
    Divider, Alert,
} from '@mantine/core';
import { IoAlertCircle, IoLogoApple, IoLogoGithub, IoLogoGoogle } from 'react-icons/io5';
import { useForm } from '@mantine/hooks';
import { useMutation } from 'react-query';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { LoginUser } from '../apis/authentication';

export default function Login() {
    const router = useRouter();
    const [loginFailed, setLoginFailed] = useState(false);

    const form = useForm({
        initialValues: {
            email: '',
            password: '',
            remember: '',
        },
        validationRules: {
            // imposter validation rule is noop and will be ignored, ts will complain
            email: (value) => value !== '',
            password: (value) => value !== '',
        },
    });

    const login = useMutation((auth: any) => LoginUser(auth.username, auth.password),
        { onSuccess: (status) => {
            if (status === 200) {
                const urlParams = new URLSearchParams(window.location.search);
                const ref: string | null = urlParams.get('ref');
                if (ref !== null) {
                    router.push(ref);
                }
            } else {
                setLoginFailed(true);
            }
        },
        onError: () => {
            setLoginFailed(true);
        },
    });

    return (
        <Center sx={theme => ({
            height: '100%',
            backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0],
        })}
        >
            <Card
              radius="md"
              shadow="sm"
              p="lg"
              withBorder
              sx={() => ({
                width: 450,
            })}
            >
                <Title>Login into <Text color="blue" inherit component="span">MakerHub</Text></Title>
                <Space h="lg" />
                <form onSubmit={form.onSubmit((values) => {
                    login.mutate({
                        username: values.email,
                        password: values.password,
                    });
                })}
                >
                    {loginFailed ? <Alert
                      color="red"
                      title="Login failed"
                      icon={<IoAlertCircle size={16} />}
                      withCloseButton
                      onClose={() => setLoginFailed(false)}
                      closeButtonLabel="Dismiss"
                    >
                        The combination of username and password is not valid.
                        Please use another and try again.
                                   </Alert> : null}
                    <Space h="sm" />
                    <TextInput
                      required
                      label="Email or Username"
                      error={form.errors.email && 'Please specify valid email or username'}
                      value={form.values.email}
                      onChange={(event) => form.setFieldValue('email', event.currentTarget.value)}
                    />
                    <Space h="sm" />
                    <PasswordInput
                      label="Password"
                      required
                      error={form.errors.password && 'Please specify a password'}
                      value={form.values.password}
                      onChange={(event) => form.setFieldValue('password', event.currentTarget.value)}
                    />
                    <Space h="sm" />
                    <Group position="right">
                        <Checkbox
                          label="Remember me"
                          value={form.values.remember}
                          onChange={(event) => form.setFieldValue('remember', event.currentTarget.value)}
                        />
                    </Group>
                    <Space h="sm" />
                    <Button color="primary" loading={login.isLoading} type="submit" fullWidth>Login</Button>
                    <Space h="sm" />
                    <Group position="apart">
                        <Anchor>Forgot password?</Anchor>
                        <Anchor href="/register">Sign up</Anchor>
                    </Group>
                    <Space h="sm" />
                    <Divider label="or" labelPosition="center" />
                    <Space h="sm" />
                    <Button color="red" leftIcon={<IoLogoGoogle />} fullWidth>Login with Google</Button>
                    <Space h="sm" />
                    <Button color="dark" leftIcon={<IoLogoGithub />} fullWidth>Login with GitHub</Button>
                    <Space h="sm" />
                    <Button color="gray" leftIcon={<IoLogoApple />} fullWidth>Login with Apple</Button>
                </form>
            </Card>
        </Center>);
}
