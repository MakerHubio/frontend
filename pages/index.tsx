import Head from 'next/head';
import {
    Container,
    Title,
    SimpleGrid,
} from '@mantine/core';
import { useMutation, useQuery } from 'react-query';
import { useContext, useEffect, useState } from 'react';
import { AxiosResponse } from 'axios';
import { GetProjects, SetLikeProject } from '../apis/projects';
import { globalContext } from '../store';
import ProjectCard from '../components/ProjectCard/ProjectCard';
import Shell from '../components/Shell/Shell';
import { GetProjectsResponse } from '../models/Project';

export default function Home() {
    const { globalState } = useContext(globalContext);

    const [projects, setProjects] = useState<any[]>([]);

    const { data: projectsResponse } = useQuery<AxiosResponse<GetProjectsResponse>>(['projects'], () => GetProjects());

    const setLike = useMutation((like: any) =>
        SetLikeProject(like.project_id, like.user_id, like.like));

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
                user_id: globalState.loggedUser?.userId,
                like,
            });
            projects[index].isLiked = like;
            projects[index].likeCount += like ? 1 : -1;
        }}
        />
    );

    return (
        <Shell>
            <Head>
                <title>MakerHub - Home</title>
                <meta name="description" content="MakerHub - Home" />
                <link
                  rel="icon"
                  href="https://mantine.dev/favicon.svg?v=c7bf473b30e5d81722ea0acf3a11a107"
                  type="image/svg+xml"
                />
            </Head>
                <Container
                  size="xl"
                  style={{
                        paddingTop: 20,
                        paddingBottom: 120,
                    }}
                >
                    <Title style={{ marginBottom: 20 }}>Projects</Title>
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
