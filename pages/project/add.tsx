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
import { useMutation } from 'react-query';
import Shell from '../../components/Shell/Shell';
import GeneralSection, { GeneralSectionElement } from '../../components/AddProject/GeneralSection';
import DescriptionSection from '../../components/AddProject/DescriptionSection';
import FileSection, { FileSectionElement } from '../../components/AddProject/FileSection/FileSection';
import AddModal from '../../components/AddProject/AddModal';
import { CreateProject } from '../../apis/projects';
import Project from '../../models/Project';
import {monitorEventLoopDelay} from "perf_hooks";

export default function AddProject() {
    const [descriptionValue, onDescriptionChange] = useState('<b>This is my new project!</b>');

    const generalSectionRef = useRef<GeneralSectionElement>()!;
    const fileSectionRef = useRef<FileSectionElement>()!;

    const [addModalOpened, setAddModalOpen] = useState(false);

    /*    useEffect(() => {
            if (editorRef.current === undefined) return;

            Quill.register('modules/custom', (quill : Editor, options : QuillOptions) => {
                console.log(quill, options);
            });

            editorRef.current.getEditor();
        }, []);*/

    const createProject = useMutation((project: Project) => CreateProject(project));

    const addProject = () => {
        const general = generalSectionRef.current?.getData();
        const files = fileSectionRef.current?.getFiles();

        if (general === null || files === null) return;

        setAddModalOpen(true);

        console.log(files);

        const models = files?.find(model => model.type === 'model/stl');

        /*
        createProject.mutate({
            name: general.name,
            price: general.price || 0,
            description: descriptionValue,
            tags: general.tags,
        });
         */
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
          process={undefined}
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
