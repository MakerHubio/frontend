import { ActionIcon, Paper, Group, Checkbox, Image, Text, Tooltip, Divider } from '@mantine/core';
import { IoDownload } from 'react-icons/io5';
import DropdownButton from '../DropdownButton/DropdownButton';
import { ProjectFile } from '../../models/Project';
import { humanFileSize } from '../../utils/file';
import { useListState } from '@mantine/hooks';

type FilesSectionProps = {
    files: ProjectFile[],
    projectId: string
};

export default function FilesSection(props: FilesSectionProps) {
    const [files, handlers] = useListState<ProjectFile & { checked: boolean }>(
      props.files.map(x => ({ ...x, checked: false })));

    const allChecked = files.every((value) => value.checked);
    const indeterminate = files.some((value) => value.checked) && !allChecked;

    const renderFiles = files.map((file, index) => {
        if (file.extension !== 'stl') return;

        return <Paper radius="md" key={file.id}>
            <Divider my="sm" />
            <Group position="apart">
                <Group>
                    <Checkbox mx="sm" checked={file.checked} onChange={
                        (event) => handlers.setItemProp(index, 'checked', event.currentTarget.checked)
                    } />
                    <Image
                      width={120}
                      height={80}
                      withPlaceholder
                      radius="md"
                      src={`http://localhost:5001/files/${file.thumbnailId}?h=80&w=120`} />
                    <Group>
                        <Text weight="bold">{file.name}</Text>
                    </Group>
                </Group>
                <Group>
                    <Text size="sm" color="gray">{humanFileSize(file.size, true)}</Text>
                    <Tooltip label="Download file">
                        <ActionIcon component="a" href={`http://localhost:5002/projects/${props.projectId}/download?type=file&id=${file.fileId}`} variant="filled" color="blue">
                            <IoDownload />
                        </ActionIcon>
                    </Tooltip>
                </Group>
            </Group>
        </Paper>;
    });

    return <div>
        <Paper shadow="md" withBorder p="md" radius="md">
            <Group position="apart">
                <Checkbox mx="sm" checked={allChecked} indeterminate={indeterminate} onChange={() =>
                  handlers.setState((current) =>
                    current.map((value) => ({ ...value, checked: !allChecked }))
                  )} />
                <DropdownButton>Download Files</DropdownButton>
            </Group>
            { renderFiles }
        </Paper>
           </div>;
}
