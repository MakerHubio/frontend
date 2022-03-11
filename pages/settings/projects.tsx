import Head from 'next/head';
import {
  Container,
  Grid,
  Title,
  Col,
  Space,
  Image,
  Text,
  ActionIcon,
  Paper, Divider, Group, Button, createStyles, Skeleton,
} from '@mantine/core';
import { IoAdd, IoEllipsisVertical, IoTrash } from 'react-icons/io5';
import { useRouter } from 'next/router';
import { useQuery } from 'react-query';
import { AxiosResponse } from 'axios';
import { SyntheticEvent, useContext, useEffect, useState } from 'react';
import { useNotifications } from '@mantine/notifications';
import Shell from '../../components/Shell/Shell';
import SettingsMenu from '../../components/Settings/Menu';
import Project, { GetProjectsResponse } from '../../models/Project';
import { GetProjects, RemoveProject } from '../../apis/projects';
import { globalContext } from '../../store';

const useStyles = createStyles(theme => ({
  item: {
    '&:hover': {
      backgroundColor: theme.colorScheme === 'light' ? theme.colors.gray[2] : theme.colors.dark[5],
    },
    cursor: 'pointer',
    borderRadius: theme.radius.sm,
    width: '100%',
    paddingLeft: theme.spacing.xs,
    paddingRight: theme.spacing.xs,
    paddingTop: '.3rem',
    paddingBottom: '.3rem',
  },
}));

export default function ProjectsSettings() {
  const router = useRouter();
  const notifications = useNotifications();
  const { globalState } = useContext(globalContext);
  const { classes } = useStyles();

  const [projects, setProjects] = useState<Project[]>([]);

  const { data: projectsResponse, isLoading, refetch } = useQuery<AxiosResponse<GetProjectsResponse>>(['userProjects'],
    () => GetProjects({ CreatorId: globalState.loggedUser?.userId }),
    { enabled: globalState.loggedUser !== null });

  useEffect(() => {
    if (projectsResponse !== undefined) {
      setProjects(projectsResponse.data.projects);
    }
  }, [projectsResponse]);

  //region getProjectList
  const getProjectList = projects?.map(project => <Group
    onClick={() => router.push(`/project/${project.id}`)}
    className={classes.item}
    position="apart"
    key={project.id}
  >
    <Group>
      <Image
        radius="sm"
        src={`http://127.0.0.1:5001/files/${project.thumbnailId}?w=400&h=200`}
        width={100}
        height={50}
      />
      <Text>{project.name}</Text>
    </Group>
    <Group>
        <ActionIcon
          onClick={(e: SyntheticEvent) => {
            e.stopPropagation();
            if (project.id === undefined) return;
            RemoveProject(project.id).then(() => {
              notifications.showNotification({
                title: 'Project removed',
                message: 'Successfully removed project',
                color: 'green',
              });
              refetch();
            });
          }}
          variant="filled"
          color="red"
        >
            <IoTrash />
        </ActionIcon>
        <ActionIcon variant="transparent" onClick={(e: SyntheticEvent) => e.stopPropagation()}>
            <IoEllipsisVertical />
        </ActionIcon>
    </Group>

                                                  </Group>);
  //endregion

  const getContent = () => {
    if (projects.length === 0 && !isLoading) {
      return (<Group direction="column" position="center" my="xl">
        <Text>You don&apos;t have any project!</Text>
        <Button
          onClick={() => router.push('/project/add')}
          leftIcon={<IoAdd size={20} />}
        >Create a project now!
        </Button>
              </Group>);
    }
    if (projects.length !== 0 && !isLoading) {
      return <Group direction="column" spacing="xs">{getProjectList}</Group>;
    }
    return <Group direction="column" spacing="xs">
      <Group position="center">
        <Skeleton width={100} height={50} />
        <Skeleton width={150} height={10} />
      </Group>
      <Group position="center">
        <Skeleton width={100} height={50} />
        <Skeleton width={150} height={10} />
      </Group>
           </Group>;
  };

  return <Shell>
    <Head>
      <title>MakerHub - Projects settings</title>
      <meta name="description" content="MakerHub - Projects settings" />
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
          <SettingsMenu active={2} />
        </Col>
        <Col span={9}>
          <Paper radius="md" withBorder shadow="md" p="sm">
            <Title order={3}>Projects</Title>
            <Divider mb="sm" />
            { getContent() }
          </Paper>
        </Col>
      </Grid>
    </Container>
         </Shell>;
}
