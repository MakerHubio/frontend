import {
  Container,
  Grid,
  Col,
  Card,
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
  Image, Anchor,
} from '@mantine/core';
import {
  IoBuild, IoFolder, IoGlobe,
  IoHeart,
  IoHeartCircleOutline,
  IoPeople, IoSettings,
} from 'react-icons/io5';
import Head from 'next/head';
import Shell from '../../../components/Shell/Shell';
import ProjectCard from '../../../components/ProjectCard/ProjectCard';
import { GetServerSideProps } from 'next';
import { useQuery } from 'react-query';
import { AxiosResponse } from 'axios';
import { GetUserProfile } from '../../../apis/users';
import { UserProfile as Profile } from '../../../models/User';
import { useContext } from 'react';
import { globalContext } from '../../../store';
import moment from 'moment';
import UserAvatar from '../../../components/UserAvatar';
import { GetProjectsResponse } from '../../../models/Project';
import { GetProjects } from '../../../apis/projects';
import { GetFileUrl } from '../../../apis/files';
import { ApiResponse } from '../../../models/Api';

export const getServerSideProps: GetServerSideProps = async (context) => {
  const token = context.req.cookies.mh_authorization;

  if (context.params === undefined || context.params.id === undefined) {
    return {
      redirect: {
        destination: '/404',
        permanent: false,
      },
    };
  }
  const id = context.params.id as string;

  const resp: AxiosResponse<ApiResponse<Profile>> | undefined =
    await GetUserProfile(id as string, token);

  if (resp === undefined || resp.status === 404) {
    return {
      redirect: {
        destination: '/404',
        permanent: false,
      },
    };
  }

  return {
    props: {
      profile: resp.data.data,
    },
  };
};

type UserProfileProps = {
  profile: Profile
};

export default function UserProfile(props: UserProfileProps) {
  const { globalState } = useContext(globalContext);

  const {
    data,
    isLoading,
  } = useQuery<GetProjectsResponse>(['projects', props.profile.id], async () => {
    return (await GetProjects({ CreatorId: props.profile.id })).data;
  }, {});

  return (<Shell>

    <Head>
      <title>MakerHub - {props.profile.username} profile</title>
      <meta name="description" content={`Makerhub - ${props.profile.username} profile`}/>
      <link
        rel="icon"
        href="https://mantine.dev/favicon.svg?v=c7bf473b30e5d81722ea0acf3a11a107"
        type="image/svg+xml"
      />
    </Head>

    <Container size="xl">
      {globalState.loggedUser?.userId === props.profile.id ? <Card
        radius="md"
        shadow="md"
        p="sm"
        withBorder
        sx={(theme) => ({
          borderColor: theme.colors.blue[5],
          borderWidth: 2,
        })}
      >
        <Group position="apart">
          <Text>Welcome <Text component="span" weight="bold">{props.profile.username}</Text>, this is your
            profile.</Text>
          <Group spacing={1}>
            <Button m={0} mr="xs" color="gray" compact leftIcon={<IoSettings/>}>Settings</Button>
            {/* <Button m={0} compact leftIcon={<IoPencil />}>Edit</Button> */}
          </Group>
        </Group>
      </Card> : null}
      <Space h="md"/>
      <Paper
        radius="md"
        shadow="md"
        sx={() => ({
          overflow: 'hidden',
        })}
      >
        {
          props.profile.bannerId ?
            <Image height={300} width={1290} src={GetFileUrl(props.profile.bannerId)}/> :
            <Box sx={() => ({
              position: 'relative',
            })}>
              <Image height={300} width={1290} src={'/bg.jpg'}/>
            </Box>
        }
      </Paper>
      <Space h="md"/>
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
            p="md"
            sx={() => ({
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'stretch',
            })}
          >
            <UserAvatar
              size={68}
              avatarId={props.profile.avatarId}
              userId={props.profile.id}/>
            <Space w="md"/>
            <Box sx={() => ({
              display: 'flex',
              flexDirection: 'column',
              flexGrow: 1,
            })}
            >
              <Text my={0} weight="bold">{props.profile.username}</Text>
              <Text mt={0}>
                Joined {moment(props.profile.createdAt)
                .fromNow()}
              </Text>
              <Group spacing="xs">
                <Badge color="teal">Dev</Badge>
              </Group>
            </Box>
          </Card>
          <Space h="md"/>
          <Card radius="md" shadow="md" withBorder p="md">
            <Text weight="bold">About</Text>
            <Space h="sm"/>
            <Text>{props.profile.bio}</Text>
            <Space h="sm"/>
            {props.profile.website !== '' ?
              <Group>
                <IoGlobe/>
                <Anchor target="_blank" href={props.profile.website}>{props.profile.website}</Anchor>
              </Group> : null}
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
          <Card radius="md" shadow="md" withBorder p="sm">
            <Group position="apart">
              <Tabs variant="pills">
                <Tab label="Projects" icon={<IoBuild/>}/>
                <Tab label="Likes" icon={<IoHeart/>}/>
                <Tab label="Follower" icon={<IoPeople/>}/>
                <Tab label="Following" icon={<IoHeartCircleOutline/>}/>
              </Tabs>
              <Menu>
                <Menu.Label>More</Menu.Label>
                <Menu.Item icon={<IoFolder/>}>Collections</Menu.Item>
              </Menu>
            </Group>
          </Card>
          <Space h="md"/>
          <SimpleGrid
            cols={3}
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
            {isLoading ?
              <>
                <ProjectCard skeleton/>
                <ProjectCard skeleton/>
                <ProjectCard skeleton/>
              </> :
              data?.projects.map(project =>
                <ProjectCard key={project.id} project={project} onLike={() => false}/>
              )
            }
          </SimpleGrid>
        </Col>
      </Grid>
    </Container>
  </Shell>);
}
