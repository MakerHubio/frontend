import {
  Container,
  Title,
  Paper,
  Space,
  Group,
  Accordion,
  ThemeIcon,
  Button,
  Progress,
  Loader,
  Text,
} from '@mantine/core';
import Head from 'next/head';
import {
  IoDocument,
  IoInformation,
  IoList,
  IoSave,
} from 'react-icons/io5';
import { useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useRouter } from 'next/router';
import Shell from '../../../components/Shell/Shell';
import GeneralSection, { GeneralSectionElement } from '../../../components/AddProject/GeneralSection';
import DescriptionSection from '../../../components/AddProject/DescriptionSection';
import FileSection from '../../../components/AddProject/FileSection';
import {
  AddProjectFile,
  AddProjectFile as AddProjectFileModel,
  CreateProjectRequest,
} from '../../../models/Project';
import { CreateProject } from '../../../apis/projects';

//region gatherFiles
function gatherFiles(createProjectRequest: CreateProjectRequest,
                           files: AddProjectFileModel[]): {
  files: Map<string, File>,
  createProjectRequest: CreateProjectRequest
} {
  const projectFiles: Map<string, File> = new Map<string, File>();
  let id = 0;

  for (let i = 0; i < files.length; i += 1) {
    const file = files[i];
    projectFiles.set(id.toString(), file);
    createProjectRequest.files.push({
      fieldName: id.toString(),
      meta: {
        name: file.name,
        order: i,
        isProjectThumbnail: i === 0,
      },
    });
    id += 1;
  }

  return {
    files: projectFiles,
    createProjectRequest,
  };
}
//endregion

export default function AddProject() {
  const router = useRouter();
  const [descriptionValue, onDescriptionChange] = useState('<b>This is my new project!</b>');
  const [files, setFiles] = useState<AddProjectFile[]>([]);
  const [page, setPage] = useState(0);
  const generalSectionRef = useRef<GeneralSectionElement>()!;

  const [modalProgress, setModalProgress] = useState(0);

  //region add project
  const addProject = async () => {
    const general = generalSectionRef.current?.getData();

    if (general === null || files === null) return;

    setPage(1);

    const createProjectRequest: CreateProjectRequest = {
      files: [],
      project: {
        name: general.name,
        price: general.price || 0,
        description: descriptionValue,
        tags: general.tags,
      },
    };

    if (files !== undefined) {
      const gatheredFiles = gatherFiles(createProjectRequest, files);
      createProjectRequest.project.tags = undefined;
      CreateProject(gatheredFiles.createProjectRequest, gatheredFiles.files,
        (prog: ProgressEvent) => {
          setModalProgress(Math.round((prog.loaded / prog.total) * 100));
        })
        .then(result => {
          router.push(`/project/add/${result.data.id}/thumbnails`);
        });
    }
  };
  //endregion

  return <Shell>
    <Head>
      <title>MakerHub - Add Project</title>
      <meta name="description" content="MakerHub - Add Project" />

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
      <AnimatePresence initial={false}>
        {page === 0 && (
          <motion.div
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Title>Add Project</Title>
            <Space h="sm" />
            <Paper radius="md" shadow="md" withBorder p="sm">
              <Accordion disableIconRotation initialItem={0} offsetIcon={false} multiple>
                <Accordion.Item
                  label="General information"
                  icon={<ThemeIcon variant="light"><IoList size={20} /></ThemeIcon>}
                >
                  <GeneralSection ref={generalSectionRef} />
                </Accordion.Item>
                <Accordion.Item
                  label="Description"
                  icon={<ThemeIcon variant="light"><IoInformation size={20} /></ThemeIcon>}
                >
                  <DescriptionSection
                    value={descriptionValue}
                    onChange={onDescriptionChange}
                  />
                </Accordion.Item>
                <Accordion.Item label="Files" icon={<ThemeIcon variant="light"><IoDocument size={20} /></ThemeIcon>}>
                  <FileSection files={files} onFilesChanged={setFiles} />
                </Accordion.Item>
              </Accordion>
              <Space h="md" />
              <Group position="right">
                <Button
                  onClick={() => addProject()}
                  leftIcon={<IoSave />}
                >Add project
                </Button>
              </Group>
            </Paper>
          </motion.div>
        )}
        {page === 1 && (
          <motion.div
            key="progress"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 0.5,
              delay: 0.5,
            }}
          >
            <Space h="xl" />
            <Group>
              <Loader size="md" />
              <Text size="xl" weight="bold">Upload Project</Text>
            </Group>
            <Space h="md" />
            <Progress value={modalProgress} size="lg" striped animate />
            <Space h="xs" />
            <Group position="apart">
              <Text color="dimmed">{modalProgress}%</Text>
            </Group>
            <Space h="xs" />
            <Text align="center" color="dimmed">
              Project upload in progress. Please don&apos;t close your browser!
            </Text>
          </motion.div>
        )}
      </AnimatePresence>
    </Container>
         </Shell>;
}
