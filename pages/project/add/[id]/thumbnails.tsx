import { GetServerSideProps } from 'next';
import { dehydrate, QueryClient } from 'react-query';
import ProjectModel, { ProjectFile, UpdateProjectFilesRequest } from '../../../../models/Project';
import { GetProject, UpdateProjectFiles } from '../../../../apis/projects';
import { ChangeEvent, ForwardedRef, forwardRef, useEffect, useRef, useState } from 'react';
import Shell from '../../../../components/Shell/Shell';
import {
  ActionIcon,
  Button,
  Col,
  Collapse,
  ColorInput, Container, Divider,
  Grid,
  Group,
  Image, Input,
  Paper,
  Space,
  Text,
  Textarea,
  ThemeIcon,
  Title,
} from '@mantine/core';
import { motion } from 'framer-motion';
import { IoAdd, IoCamera, IoChevronUp, IoClose, IoCloudUpload, IoTrash } from 'react-icons/io5';
import { dataUrlToBlob, humanFileSize } from '../../../../utils/file';
import dynamic from 'next/dynamic';
import { ModelViewerHandle, ModelViewerProps } from '../../../../components/ModelViewer/ModelViewer';
import Project from '../../../../models/Project';
import { useRouter } from 'next/router';
import { AxiosResponse } from 'axios';
import Head from 'next/head';
import jwt_decode from 'jwt-decode';
import JWTUser from '../../../../models/JWTUser';

export const getServerSideProps: GetServerSideProps = async (context) => {
  const queryClient = new QueryClient();
  let resp: AxiosResponse<ProjectModel> | undefined;

  if (context.params !== undefined && context.params.id !== undefined) {
    const { id } = context.params;

    await queryClient.prefetchQuery('project', () => GetProject((id as string)));

    resp = await queryClient.getQueryData('project');

    if (!context.req.cookies.mh_authorization) {
      return {
        redirect: {
          destination: '/',
          permanent: false,
        },
      };
    } else {
      const jwtUser: JWTUser = jwt_decode(context.req.cookies.mh_authorization);
      if (jwtUser.userId !== resp?.data.creator?.id) {
        return {
          redirect: {
            destination: '/',
            permanent: false,
          },
        };
      }
    }

    if (resp === undefined || resp.status !== 200) {
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

  if (!resp.data.files || resp.data.files.length === 0) {
    return {
      redirect: {
        destination: `/project/${resp.data.id}`,
        permanent: false,
      },
    };
  }

  queryClient.setQueryData('project', resp.data);

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
      project: resp.data,
    },
  };
};

const ModelViewer = dynamic(import('../../../../components/ModelViewer/ModelViewer'), {
  ssr: false,
});

const Model = forwardRef(
  (props: ModelViewerProps, ref: ForwardedRef<ModelViewerHandle | undefined>) =>
    <ModelViewer {...props} mvRef={ref}/>
);

type AddProjectThumbnailsProps = {
  project: ProjectModel;
};

type ThumbnailProjectFile = ProjectFile & { thumbnailDataUrl?: string };

async function GatherThumbnailsAndUpdateProjectFiles(project: Project,
                                                     files: ThumbnailProjectFile[]) {
  const req: UpdateProjectFilesRequest = {
    projectId: project?.id || '',
    filesToUpload: [],
    projectFiles: [],
    thumbnails: {},
  };

  const thumbnails = new Map<string, string>();
  const uploadFiles = new Map<string, File>();

  for (let i = 0; i < files.length; i += 1) {
    const file = files[i];
    const tmp = {
      ...file,
      thumbnailDataUrl: undefined,
    };
    req.projectFiles.push(tmp);
    if (file.thumbnailDataUrl) {
      const filesName = thumbnails.size.toString();

      thumbnails.set(filesName, file.id || '');

      const name = file.name.split('.');
      req.filesToUpload.push({
        fieldName: filesName,
        meta: {
          projectId: project?.id || '',
          name: `${name[0]}_preview.png`,
          isProjectThumbnail: false,
          order: file.order,
        },
      });

      // eslint-disable-next-line no-await-in-loop
      const blob = await dataUrlToBlob(file.thumbnailDataUrl);

      uploadFiles.set(filesName, new File([blob], `${name[0]}_preview.png`));
    }
  }

  req.thumbnails = Object.fromEntries(thumbnails);

  return UpdateProjectFiles(req, uploadFiles)
    .then(result => {
      console.log(result);
    });
}

export default function AddProjectThumbnails(props: AddProjectThumbnailsProps) {
  const [files, setFiles] = useState<ThumbnailProjectFile[]>([]);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [hotspotModeEnabled, setHotspotModeEnabled] = useState(false);
  const modelViewerRef = useRef<ModelViewerHandle>();
  const router = useRouter();

  useEffect(() => {
    const thumbFiles = props.project.files?.filter(x => x.extension === 'stl')
      .sort(x => x.order);
    if (thumbFiles !== undefined) {
      setFiles(thumbFiles);
    }
  }, []);

  const listFiles = () => files.map((file, index) => {
    if (file.extension !== 'stl' && file.extension !== '3mf') {
      return null;
    }
    if (!file.hotspots) {
      files[index].hotspots = [];
    }
    if (!file.gltf) {
      return null;
    } else if (file.gltf.color === '') {
      file.gltf.color = '#228be6';
    }

    return <motion.li
      variants={{
        hidden: { opacity: 0 },
        show: { opacity: 1 },
      }}
      exit={{ opacity: 0 }}
      key={file.id}
    >
      <Paper
        withBorder
        radius="md"
        my="sm"
        shadow="sm"
        p="sm"
        sx={theme => ({
          width: '100%',
          transition: 'box-shadow .25s ease-out',
          '&:hover': {
            boxShadow: theme.shadows.xl,
          },
        })}
      >
        <Group
          position="apart"
          onClick={() => {
            setActiveIndex(activeIndex === index ? -1 : index);
          }}
          sx={() => ({
            cursor: 'pointer',
          })}
        >
          <Group>
            <Image
              withPlaceholder
              width={160}
              height={90}
              src={files[index].thumbnailId === '' ? files[index].thumbnailDataUrl : files[index].thumbnailId}
            />
            <Group spacing={0}>
              <Text lineClamp={1} weight="bold">{file.name}</Text>
            </Group>
            <Text color="dimmed" size="sm">{humanFileSize(file.size, true)}</Text>
          </Group>
          <motion.div
            animate={activeIndex === index ? 'open' : 'close'}
            variants={{
              open: { rotate: 0 },
              close: { rotate: 180 },
            }}
          >
            <ThemeIcon variant="light">
              <IoChevronUp/>
            </ThemeIcon>
          </motion.div>
        </Group>
        <Collapse in={activeIndex === index}>
          <Space h="md"/>
          <Grid>
            <Col span={8}>
              <Paper
                radius="md"
                withBorder
                sx={() => ({
                  aspectRatio: '16/9',
                })}
              >
                {activeIndex === index ? <Model
                  onHotspotAdd={hotspot => {
                    files[index].hotspots = [...files[index].hotspots, hotspot];
                    setHotspotModeEnabled(false);
                  }}
                  color={files[index].gltf?.color}
                  hotspots={files[index].hotspots}
                  addHotspotMode={hotspotModeEnabled}
                  ref={modelViewerRef}
                  autoRotate={false}
                  camera={files[index].gltf ? {
                    theta: files[index].gltf!.cameraSettings.theta,
                    phi: files[index].gltf!.cameraSettings.phi,
                    radius: files[index].gltf!.cameraSettings.radius,
                    fov: files[index].gltf!.cameraSettings.fov,
                  } : undefined}
                  url={`http://localhost:5001/files/${files[index].gltf?.fileId}`}
                /> : null}
              </Paper>
            </Col>
            <Col span={4}>
              <Title order={2}>Settings</Title>
              <Space h="md"/>
              <Textarea label="Description" autosize minRows={2} maxRows={4}/>
              <Space h="md"/>
              <ColorInput
                label="Color"
                format="hex"
                swatches={['#25262b', '#868e96', '#fa5252', '#e64980', '#be4bdb', '#7950f2', '#4c6ef5', '#228be6', '#15aabf', '#12b886', '#40c057', '#82c91e', '#fab005', '#fd7e14']}
                value={files[index].gltf?.color}
                onChange={(color: string) => {
                  files[index].gltf!.color = color;
                  setFiles([...files]);
                }}
              />
              <Space h="md"/>
              <Group position="apart">
                <Text>Hotspots</Text>
                <Group>
                  {hotspotModeEnabled ? <Text color="dimmed">Click on the preview to add a hotspot</Text> : null}
                  {
                    !hotspotModeEnabled ?
                      <ActionIcon onClick={() => setHotspotModeEnabled(true)}>
                        <IoAdd/>
                      </ActionIcon> :
                      <ActionIcon onClick={() => setHotspotModeEnabled(false)}>
                        <IoClose/>
                      </ActionIcon>
                  }
                </Group>
              </Group>
              {
                files[index].hotspots.map((hotspot, hIndex) => <Group mb="sm" key={hotspot.name}>
                  <Input
                    sx={() => ({ flexGrow: 1 })}
                    value={files[index].hotspots[hIndex].text}
                    onChange={(event: ChangeEvent<HTMLInputElement>) => {
                      const hotspots = [...files[index].hotspots];
                      hotspots[hIndex].text = event.target.value;
                      setFiles([...files]);
                    }}
                  />
                  <ActionIcon onClick={() => {
                    const hotspots = [...files[index].hotspots];
                    hotspots.splice(hIndex, 1);
                    files[index].hotspots = hotspots;
                    setFiles([...files]);
                  }}
                  >
                    <IoTrash/>
                  </ActionIcon>
                </Group>)
              }
              <Divider my="sm"/>
              <Group position="right">
                <Button
                  fullWidth
                  leftIcon={<IoCamera/>}
                  onClick={() => {
                    const screenshot = modelViewerRef.current?.screenshot();
                    if (screenshot !== null) {
                      files[index].thumbnailDataUrl = modelViewerRef.current?.screenshot()!.data || '';
                      files[index].gltf!.cameraSettings = {
                        theta: screenshot!.theta,
                        phi: screenshot!.phi,
                        radius: screenshot!.radius,
                        fov: screenshot!.fov,
                      };
                    }
                    setFiles([...files]);
                  }}
                >Create thumbnail
                </Button>
              </Group>
            </Col>
          </Grid>
        </Collapse>
      </Paper>
    </motion.li>;
  });

  return <Shell>
    <Head>
      <title>MakerHub - Add Project</title>
      <meta name="description" content="MakerHub - Add Project"/>

      <link
        rel="icon"
        href="https://mantine.dev/favicon.svg?v=c7bf473b30e5d81722ea0acf3a11a107"
        type="image/svg+xml"
      />
    </Head>

    <Container
      size="xl"
      sx={() => ({
        position: 'relative',
      })}
    >
      <motion.div
        key="files"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{
          duration: 0.5,
          delay: 0.5,
        }}
      >
        <Title mt="sm">File Previews</Title>
        <Text>
          Your project is successfully created.
          You can now create previews for your files.
        </Text>
        <Space h="md"/>
        <motion.ul
          variants={{
            hidden: { opacity: 0 },
            show: {
              opacity: 1,
              transition: {
                delayChildren: 0.5,
              },
            },
          }}
          transition={{ delay: 0.3 }}
          initial="hidden"
          animate="show"
          style={{
            listStyle: 'none',
            padding: 0,
          }}
        >
          {listFiles()}
        </motion.ul>
        <Group position="right">
          <Button
            onClick={() => GatherThumbnailsAndUpdateProjectFiles(props.project,
              files)
              .then(() => router.push(`/project/${props.project.id}`))
            }
            leftIcon={<IoCloudUpload/>}
          >Upload previews
          </Button>
        </Group>
      </motion.div>
    </Container>
  </Shell>;
}