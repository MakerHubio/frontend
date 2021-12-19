import { ActionIcon, Paper, Group, Checkbox, Space, Image, Text, Tooltip } from '@mantine/core';
import { IoDownload } from 'react-icons/io5';
import DropdownButton from '../DropdownButton/DropdownButton';

export default function FilesSection() {
    return <div>
        <Paper shadow="md" withBorder padding="sm" radius="md">
            <Group position="apart">
                <Checkbox mx="sm" />
                <DropdownButton>Download Files</DropdownButton>
            </Group>
        </Paper>
        <Space h="sm" />
        <Paper shadow="md" withBorder padding="sm" radius="md">
            <Group position="apart">
                <Group>
                    <Checkbox mx="sm" />
                    <Image width={120} height={80} withPlaceholder radius="md" />
                    <Group>
                        <Text weight="bold">Benchy</Text>
                    </Group>
                </Group>
                <Group>
                    <Text size="sm" color="gray">34.6 kB</Text>
                    <Tooltip label="Download file">
                        <ActionIcon variant="filled" color="blue">
                            <IoDownload />
                        </ActionIcon>
                    </Tooltip>
                </Group>
            </Group>
        </Paper>
           </div>;
}
