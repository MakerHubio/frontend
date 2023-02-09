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
  Tab,
  Box,
  Badge, SimpleGrid, useMantineTheme, Paper, Image, Center, Anchor, MediaQuery,
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
import Shell from '../../../components/Shell/Shell';
import Carousel, { CarouselItem } from '../../../components/Carousel/Carousel';
import { GetProject, SetLikeProject } from '../../../apis/projects';
import ProjectModel from '../../../models/Project';
import CommentSection from '../../../components/CommentSecion/CommentSection';
import FilesSection from '../../../components/FilesSection/FilesSection';
import { AxiosResponse } from 'axios';
import Head from 'next/head';
import UserAvatar from '../../../components/UserAvatar';
import { useSetState } from 'react-use';
import { GetFileUrl } from '../../../apis/files';

const TABS = ['description', 'files', 'comments', 'remixes'];

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

  const { id } = context.params;
  let resp: AxiosResponse<ProjectModel> | undefined;
  try {
    resp = await GetProject((id as string), token);
  } catch (e) {
    console.log(e);
    return {
      redirect: {
        destination: '/500',
        permanent: false,
      },
    };
  }

  if (resp === undefined || resp.status === 404) {
    return {
      redirect: {
        destination: '/404',
        permanent: false,
      },
    };
  } else if (resp.status !== 200) {
    return {
      redirect: {
        destination: '/502',
        permanent: false,
      },
    };
  }

  return {
    props: {
      project: resp.data,
    },
  };
};

type ProjectProps = {
  project: ProjectModel;
};

export default function Project(props: ProjectProps) {
  const theme = useMantineTheme();
  const router = useRouter();
  const [likeState, setLikeState] =
    useSetState({
      isLiked: props.project.isLiked,
      likes: props.project.likeCount,
      isLoading: false,
    });

  const [tabIndex, setTabIndex] = useState(TABS.indexOf(router.asPath.split('#')[1] || TABS[0]));
  const [carouselItems, setCarouselItems] = useState<CarouselItem[]>([]);

  useEffect(() => {
    const cItems = props.project.files?.map<CarouselItem>(file => ({
      src: `${GetFileUrl(file.fileType === 'image/png' ? file.fileId : file.gltf?.fileId!)}`,
      thumbnailSrc: file.thumbnailId !== '' ? `${GetFileUrl(file.thumbnailId)}` : '',
      mediaType: file.fileType,
      meta: {
        color: file.gltf?.color,
        theta: file.gltf?.cameraSettings.theta,
        phi: file.gltf?.cameraSettings.phi,
        radius: file.gltf?.cameraSettings.radius,
        fov: file.gltf?.cameraSettings.fov,
      },
    }));

    if (cItems !== undefined) setCarouselItems(cItems);
  }, []);

  useEffect(() => {
    router.replace(router.route, {
      hash: TABS[tabIndex],
    });
  }, [tabIndex]);

  const getTabContent = () => {
    switch (tabIndex) {
      case 0:
        return <Card radius="md" shadow="md" withBorder p="sm">
          <Text mx="sm"
                color={props.project.description === '' ? 'gray' : theme.colorScheme === 'light' ? theme.black : theme.white}>
            {props.project.description === '' ? 'No description' :
              <div dangerouslySetInnerHTML={{ __html: props.project.description as string }}/>}
          </Text>
        </Card>;
      case 1:
        return <FilesSection projectId={props.project.id!} files={props.project.files!}/>;
      case 2:
        return <CommentSection projectId={props.project.id!} />;
      case 3:
        return <Paper p="md" shadow="md" withBorder radius="md">
          <Center mb="md">
            <Image src="/empty.svg" height={256} width="auto"/>
          </Center>
          <Text align="center">
            There are currently no remixes for this project!
          </Text>
        </Paper>;
      default:
        return null;
    }
  };

  return <Shell>
    <Head>
      <title>MakerHub - {props.project.name}</title>
      <meta name="description" content={`MakerHub - ${props.project.name}`}/>

      <link
        rel="icon"
        href="https://mantine.dev/favicon.svg?v=c7bf473b30e5d81722ea0acf3a11a107"
        type="image/svg+xml"
      />
    </Head>

    <Container size="xl">
      <Space h="md"/>
      <Card
        radius="md"
        shadow="md"
        p="sm"
        withBorder
        sx={t => ({
          borderColor: t.colors.yellow[5],
          borderWidth: 2,
        })}
      >
        <Group>
          <MediaQuery
            smallerThan="md"
            styles={{ display: 'none' }}
          >
            <IoWarning color={theme.colors.yellow[6]}/>
          </MediaQuery>
          <Text>This project is <Text component="span" weight="bold">Work in Progress</Text>! Content might
            change.
          </Text>
        </Group>
      </Card>
      <Space h="md"/>
      <Text size="xl" weight="bold">
        {props.project.name}
      </Text>
      <Space h="md"/>
      <Grid>
        <Col md={8}>
          <Carousel items={carouselItems}/>
        </Col>
        <Col md={4}>
          <Card shadow="md" radius="md" withBorder>
            <Group spacing={0} position="right">
              <Text size="lg" align="right" color="gray">
                Free
              </Text>
              <IoAdd size={10}/>
            </Group>
            <Space h="sm"/>
            <Button component="a" href={`${process.env.NEXT_PUBLIC_FILES_PATH}/${props.project.id}/download`} fullWidth
                    leftIcon={<IoDownload/>}>Download all files</Button>
            <Space h="sm"/>
            <SimpleGrid cols={3}>
              <Button
                onClick={() => {
                  setLikeState({ isLoading: true });
                  SetLikeProject(props.project.id!, !likeState.isLiked)
                    .then(() => {
                      let count = -1;
                      if (!likeState.isLiked) {
                        count = 1;
                      }
                      setLikeState({
                        likes: likeState.likes! + count,
                        isLiked: !likeState.isLiked,
                        isLoading: false,
                      });
                    });
                }}
                leftIcon={likeState.isLiked ? <IoHeart size="24px"/> : <IoHeartOutline size="24px"/>}
                loading={likeState.isLoading}
                variant="light"
                color="red"
              >
                <Text sx={(t) => (
                  {
                    color: t.colorScheme === 'light' ? t.colors.red[6] : t.colors.red[2],
                  })}
                >
                  {likeState.likes}
                </Text>
              </Button>
              <Button
                onClick={(e: SyntheticEvent) => {
                  e.stopPropagation();
                }}
                variant="light"
                color="gray"
              >
                {false ? <IoEye size="24px"/> : <IoEyeOff size="24px"/>}
              </Button>
              <Button
                onClick={(e: SyntheticEvent) => {
                  e.stopPropagation();
                }}
                variant="light"
                color="yellow"
              >
                <IoCash size="24px"/>
              </Button>
            </SimpleGrid>
          </Card>
          <Space h="md"/>
          <Card shadow="md" radius="md" withBorder>
            <Text size="sm" weight="bold" color="gray">
              Created by
            </Text>
            <Space h="sm"/>
            <Box
              sx={() => ({
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'stretch',
              })}
            >
              <UserAvatar avatarId={props.project.creator?.avatarId}
                          userId={props.project.creator?.id} size={68}/>
              <Space w="md"/>
              <Box sx={() => ({
                display: 'flex',
                flexDirection: 'column',
                flexGrow: 1,
              })}
              >
                <Text my={0} weight="bold">{props.project.creator?.username || 'Creator not found'}</Text>
                <Text mt={0}>Joined 08.11.2021</Text>
                <Group spacing="xs">
                  <Badge color="teal">Dev</Badge>
                </Group>
              </Box>
            </Box>
          </Card>
          <Space h="xs"/>
          <Group position="center">
            <Anchor size="xs" color="gray">Report</Anchor>
            <Text color="gray">&bull;</Text>
            <Anchor size="xs" color="gray">Legal</Anchor>
          </Group>
        </Col>
      </Grid>
      <Space h="lg"/>
      <div style={{ position: 'relative' }}>
        <Card radius="md" shadow="md" withBorder p="sm">
          <Tabs color="blue" variant="pills" active={tabIndex} onTabChange={setTabIndex}>
            <Tab label="Description" icon={<IoInformationCircle/>}/>
            <Tab label="Files" icon={<IoDocument/>}/>
            <Tab label="Comments" icon={<IoChatbox/>}/>
            <Tab label="Remixes" icon={<IoShuffle/>}/>
          </Tabs>
        </Card>
        <Space h="md"/>
        {getTabContent()}
      </div>
    </Container>
  </Shell>;
}
