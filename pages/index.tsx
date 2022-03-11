import Head from 'next/head';
import {
  Container,
  Title,
  SimpleGrid,
  Paper,
  Text, Kbd, Autocomplete, useMantineTheme, Box, MantineProvider, Space, Group, Button, Menu,
} from '@mantine/core';
import { useMutation, useQuery } from 'react-query';
import { useContext, useEffect, useRef, useState } from 'react';
import { AxiosResponse } from 'axios';
import { GetProjects, SetLikeProject } from '../apis/projects';
import { globalContext } from '../store';
import ProjectCard from '../components/ProjectCard/ProjectCard';
import Shell from '../components/Shell/Shell';
import { GetProjectsResponse } from '../models/Project';
import { IoChevronDown, IoSearch } from 'react-icons/io5';
import { useHotkeys } from '@mantine/hooks';

export default function Home() {
  const { globalState } = useContext(globalContext);
  const theme = useMantineTheme();
  const searchRef = useRef<HTMLInputElement>(null);

  const [projects, setProjects] = useState<any[]>([]);

  const { data: projectsResponse } = useQuery<AxiosResponse<GetProjectsResponse>>(['projects'], () => GetProjects());

  useHotkeys([
    ['ctrl+K', () => {
      searchRef.current?.focus();
    }],
  ]);

  const setLike = useMutation((like: any) =>
    SetLikeProject(like.project_id, like.like));

  useEffect(() => {
    if (projectsResponse !== undefined) {
      setProjects(projectsResponse.data.projects);
    }
  }, [projectsResponse]);

  const projectCards: any = projects?.map((project: any, index: number) =>
    <ProjectCard
      project={project}
      key={index}
      likeDisabled={globalState.loggedUser === null}
      onLike={like => {
        setLike.mutate({
          project_id: project.id,
          like,
        });
        projects[index].isLiked = like;
        projects[index].likeCount += like ? 1 : -1;
      }}
    />
  );

  return (
    <Shell noPadding background={theme.colors.dark[4]} colorScheme="dark">
      <Head>
        <title>MakerHub - Home</title>
        <meta name="description" content="MakerHub - Home"/>
        <link
          rel="icon"
          href="https://mantine.dev/favicon.svg?v=c7bf473b30e5d81722ea0acf3a11a107"
          type="image/svg+xml"
        />
      </Head>
      <MantineProvider theme={{ colorScheme: 'dark' }}>
        <Paper sx={t => ({
          backgroundColor: t.colors.dark[4],
        })} radius={0} p="xl">
          <Container>
            <Title>What will be you next <span>3D print</span>?</Title>
            <Text>Explore the newest projects or share your own creations.</Text>
            <Space h="md" />
            <Autocomplete
              icon={<IoSearch/>}
              placeholder="Search projects..."
              rightSectionWidth={72}
              ref={searchRef}
              rightSection={
                <Box sx={() => ({
                  display: 'flex',
                  alignContent: 'center',
                })}>
                  <Kbd mr={2}>Ctrl</Kbd>
                  <Kbd>K</Kbd>
                </Box>}
              data={[
                { value: 'Test' },
                { value: '#3DBenchy - The jolly 3D printing torture-test by CreativeTools.se' },
              ]}
            />
          </Container>
        </Paper>
      </MantineProvider>
      <Container
        size="xl"
        style={{
          paddingTop: 20,
          paddingBottom: 120,
        }}
      >
        <Group position="apart" align="center" mb="md">
          <Title>Trending projects</Title>
          <Group spacing="xs">
            <Menu control={
              <Button leftIcon={<IoChevronDown />} color="gray" variant="outline" radius="xl">Today</Button>
            }>
              <Menu.Item>Today</Menu.Item>
              <Menu.Item>This week</Menu.Item>
              <Menu.Item>This month</Menu.Item>
            </Menu>
            <Menu control={
              <Button leftIcon={<IoChevronDown />} radius="xl">Trending</Button>
            }>
              <Menu.Item>Trending</Menu.Item>
              <Menu.Item>Popular</Menu.Item>
              <Menu.Item>Newest</Menu.Item>
            </Menu>
          </Group>

        </Group>
        {/* <Button onClick={() => createProject.mutate('#3DBenchy - The jolly 3D printing torture-test by CreativeTools.se')}>Create Project</Button> */}
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
    </Shell>
  );
}
