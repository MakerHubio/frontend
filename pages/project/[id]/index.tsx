import {
    Container,
    Card,
    Col,
    Text,
    Grid,
    Button,
    Space,
    Group,
    Tabs,
    LoadingOverlay,
    Tab,
    Avatar,
    Box,
    Badge, SimpleGrid, useMantineTheme, Skeleton,
} from '@mantine/core';
import {
    IoAdd,
    IoCash, IoChatbox, IoDocument,
    IoDownload, IoEye, IoEyeOff,
    IoHeart,
    IoHeartOutline,
    IoInformationCircle,
    IoShuffle, IoWarning,
} from 'react-icons/io5';
import { SyntheticEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { GetServerSideProps } from 'next';
import { dehydrate, QueryClient, useQuery } from 'react-query';
import Shell from '../../../components/Shell/Shell';
import Carousel, { CarouselItem } from '../../../components/Carousel/Carousel';
import { GetProject } from '../../../apis/projects';
import ProjectModel from '../../../models/Project';
import ApiError from '../../../models/ApiError';
import CommentSection from '../../../components/CommentSecion/CommentSection';
import FilesSection from '../../../components/FilesSection/FilesSection';

export const getServerSideProps: GetServerSideProps = async (context) => {
    const queryClient = new QueryClient();
    let data: ProjectModel | ApiError | undefined;

    if (context.params !== undefined && context.params.id !== undefined) {
        const { id } = context.params;

        await queryClient.prefetchQuery('project', () => GetProject((id as string)));

        data = await queryClient.getQueryData('project');

        if (data === undefined || data.statusCode === 404) {
            return {
                redirect: {
                    destination: '/404',
                    permanent: false,
                },
            };
        }
    } else {
        return {
            redirect: {
                destination: '/404',
                permanent: false,
            },
        };
    }

    return {
        props: {
            dehydratedState: dehydrate(queryClient),
            project: data,
        },
    };
};

type ProjectProps = {
    project: ProjectModel;
};

export default function Project(props: ProjectProps) {
    const t = useMantineTheme();
    const router = useRouter();
    let id = '';

    if (typeof window !== 'undefined') {
        id = router.query.id as string;
    }

    const {
        data,
        isLoading,
    } = useQuery<ProjectModel>(['project', id], () => GetProject(id), {
        onSuccess: (result: ApiError | ProjectModel) => {
            if ((result as ApiError).statusCode === 404) {
                router.push('/');
            }
        },
        initialData: props.project,
    });

    const [tabIndex, setTabIndex] = useState(0);
    const [carouselItems, setCarouselItems] = useState<CarouselItem[]>([]);

    useEffect(() => {
       if (router.asPath.includes('#comments')) {
           setTabIndex(2);
       }

       const cItems = props.project.files?.map<CarouselItem>(file => ({
           src: `http://localhost:5001/files/${file.thumbnailId === '' ? file.fileId : file.thumbnailId}`,
           mediaType: file.fileType,
       }));

       if (cItems !== undefined) setCarouselItems(cItems);
    }, []);

    useEffect(() => {
        if (tabIndex === 2) {
            router.push(router.route, {
                hash: 'comments',
            });
        }
    }, [tabIndex]);

    const getTabContent = () => {
        switch (tabIndex) {
            case 0:
                return <Card radius="md" shadow="md" withBorder padding="sm">
                    <Text mx="sm" color={data === undefined || data.description === '' ? 'gray' : 'black'}>
                        {data === undefined || data.description === '' ? 'No description' :
                          <div dangerouslySetInnerHTML={{ __html: data.description as string }} />}
                    </Text>
                       </Card>;
            case 1:
                return <FilesSection />;
            case 2:
                return <CommentSection />;
            default:
                return null;
        }
    };

    return <Shell>
        <Container size="xl">
            <Space h="md" />
            <Card
              radius="md"
              shadow="md"
              padding="sm"
              withBorder
              sx={(theme) => ({
                    borderColor: theme.colors.yellow[5],
                    borderWidth: 2,
                })}
            >
                <Group>
                    <IoWarning color={t.colors.yellow[6]} />
                    <Text>This project is <Text component="span" weight="bold">Work in Progress</Text>! Content might
                        change.
                    </Text>
                </Group>
            </Card>
            <Space h="md" />
            <Grid>
                <Col span={8}>
                    <Carousel items={carouselItems} />
                </Col>
                <Col span={4}>
                    <Card shadow="md" radius="md" withBorder>
                        {isLoading || data === undefined ?
                            <Skeleton height={12} radius="xl" /> :
                            <Text size="xl" weight="bold">
                                {data.name}
                            </Text>}
                        <Group spacing={0} position="right">
                            <Text size="lg" align="right" color="gray">
                                Free
                            </Text>
                            <IoAdd size={10} />
                        </Group>
                        <Space h="sm" />
                        <Button fullWidth leftIcon={<IoDownload />}>Download all files</Button>
                        <Space h="sm" />
                        <SimpleGrid cols={3}>
                            <Button
                              onClick={(e: SyntheticEvent) => {
                                    e.stopPropagation();
                                }}
                              leftIcon={data !== undefined && data.isLiked ? <IoHeart size="24px" /> : <IoHeartOutline size="24px" />}
                              variant="light"
                              color="red"
                            >
                                <Text sx={(theme) => ({ color: theme.colors.red[9] })}>
                                    {data?.likeCount || 0}
                                </Text>
                            </Button>
                            <Button
                              onClick={(e: SyntheticEvent) => {
                                    e.stopPropagation();
                                }}
                              variant="light"
                              color="gray"
                            >
                                {false ? <IoEye size="24px" /> : <IoEyeOff size="24px" />}
                            </Button>
                            <Button
                              onClick={(e: SyntheticEvent) => {
                                    e.stopPropagation();
                                }}
                              variant="light"
                              color="yellow"
                            >
                                <IoCash size="24px" />
                            </Button>
                        </SimpleGrid>
                    </Card>
                    <Space h="md" />
                    <Card shadow="md" radius="md" withBorder>
                        <Text size="sm" weight="bold" color="gray">
                            Created by
                        </Text>
                        <Space h="sm" />
                        <Box
                          sx={() => ({
                                display: 'flex',
                                flexDirection: 'row',
                                alignItems: 'stretch',
                            })}
                        >
                            <Avatar src="https://i.pravatar.cc/68" size={68} />
                            <Space w="md" />
                            <Box sx={() => ({
                                display: 'flex',
                                flexDirection: 'column',
                                flexGrow: 1,
                            })}
                            >
                                {isLoading || data === undefined ?
                                    <Skeleton height={12} radius="xl" /> :
                                    <Text my={0} weight="bold">{data.creator?.username || 'Creator not found'}</Text>}
                                <Text mt={0}>Joined 08.11.2021</Text>
                                <Group spacing="xs">
                                    <Badge color="teal">Dev</Badge>
                                </Group>
                            </Box>
                        </Box>
                    </Card>
                </Col>
            </Grid>
            <Space h="lg" />
            <div style={{ position: 'relative' }}>
                <LoadingOverlay visible={isLoading} />
                <Card radius="md" shadow="md" withBorder padding="sm">
                    <Tabs color="blue" variant="pills" active={tabIndex} onTabChange={setTabIndex}>
                        <Tab label="Description" icon={<IoInformationCircle />} />
                        <Tab label="Files" icon={<IoDocument />} />
                        <Tab label="Comments" icon={<IoChatbox />} />
                        <Tab label="Remixes" icon={<IoShuffle />} />
                    </Tabs>
                </Card>
                <Space h="md" />
                {getTabContent()}
            </div>
        </Container>
           </Shell>;
}
