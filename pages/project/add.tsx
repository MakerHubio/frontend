import {
    Container,
    Title,
    Paper,
    Space,
    Group,
    Accordion,
    ThemeIcon,
    Button,
} from '@mantine/core';
import Head from 'next/head';
import {
    IoDocument,
    IoInformation,
    IoList,
    IoSave,
} from 'react-icons/io5';
import { useRef, useState } from 'react';
import { useRouter } from 'next/router';
import Shell from '../../components/Shell/Shell';
import GeneralSection, { GeneralSectionElement } from '../../components/AddProject/GeneralSection';
import DescriptionSection from '../../components/AddProject/DescriptionSection';
import FileSection, { FileSectionElement } from '../../components/AddProject/FileSection/FileSection';
import AddModal from '../../components/AddProject/AddModal';
import { AddProjectFile as AddProjectFileModel, CreateProjectRequest } from '../../models/Project';
import { CreateProject } from '../../apis/projects';
import {dataUrlToBlob} from "../../utils/file";

async function gatherFiles(createProjectRequest: CreateProjectRequest,
                           files: AddProjectFileModel[]): Promise<{
    files: Map<string, File>,
    createProjectRequest: CreateProjectRequest
}> {
    const projectFiles :Map<string, File> = new Map<string, File>();
    let id = 0;

    for (let i = 0; i < files.length; i += 1) {
        const file = files[i];
        projectFiles.set(id.toString(), file);
        if (file.name.endsWith('.stl')) {
            // eslint-disable-next-line no-await-in-loop
            const blob = await dataUrlToBlob(file.thumbnail);
            const fileName = `${file.name.replace('.', '_')}_preview.png`;
            projectFiles.set((id + 1).toString(), new File([blob],
              fileName,
              { type: 'image/png' }));
            createProjectRequest.thumbnails.push({
                fieldName: (id + 1).toString(),
                meta: {
                    name: fileName,
                    order: i,
                    isProjectThumbnail: false,
                },
            });
        }
        createProjectRequest.files.push({
            fieldName: id.toString(),
            thumbnailFieldName: file.name.endsWith('.stl') ? (id + 1).toString() : undefined,
            meta: {
                name: file.name,
                order: i,
                isProjectThumbnail: i === 0,
            },
        });
        id += file.name.endsWith('.stl') ? 2 : 1;
    }

    return {
        files: projectFiles,
        createProjectRequest,
    };
}

export default function AddProject() {
    const router = useRouter();
    const [descriptionValue, onDescriptionChange] = useState('<b>This is my new project!</b>');

    const generalSectionRef = useRef<GeneralSectionElement>()!;
    const fileSectionRef = useRef<FileSectionElement>()!;

    const [addModalOpened, setAddModalOpen] = useState(false);
    const [modalProgress, setModalProgress] = useState(0);
    const [modalTaskName, setModalTaskName] = useState('');

    const addProject = async () => {
        const general = generalSectionRef.current?.getData();
        const files = fileSectionRef.current?.getFiles();

        if (general === null || files === null) return;

        setAddModalOpen(true);

        const createProjectRequest: CreateProjectRequest = {
            files: [],
            thumbnails: [],
            project: {
                name: general.name,
                price: general.price || 0,
                description: descriptionValue,
                tags: general.tags,
            },
        };

        if (files !== undefined) {
            setModalTaskName('Upload project...');
            gatherFiles(createProjectRequest, files).then(value => {
                CreateProject(value.createProjectRequest, value.files,
                    (prog: ProgressEvent) =>
                      setModalProgress((prog.loaded / prog.total) * 100)).then(result => {
                          router.push(`/project/${result.data.id}`);
                });
            });
        }
    };

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

        <AddModal
          opened={addModalOpened}
          onClose={() => setAddModalOpen(false)}
          process={modalProgress}
          taskName={modalTaskName}
        />

        <Container size="xl">
            <Title>Add Project</Title>
            <Space h="sm" />
            <Paper radius="md" shadow="md" withBorder padding="md">
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
                        <FileSection ref={fileSectionRef} />
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
        </Container>
           </Shell>;
}
