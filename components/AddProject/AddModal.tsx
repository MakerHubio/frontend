import { Modal, Loader, Text, Group, Progress, Space, Transition } from '@mantine/core';

type AddModalProps = {
  opened: boolean,
  onClose: () => void,
  process?: number,
  taskName?: string,
};

export default function AddModal(props: AddModalProps) {
  return <Modal
    opened={props.opened}
    onClose={props.onClose}
    closeOnClickOutside={false}
    title={
    <Group>
      <Loader />
      <Text size="xl" weight="bold">Upload Project</Text>
    </Group>
  }
  >
    <Space h="sm" />
    <Text>{ props.taskName }</Text>
    <Space h="sm" />
    <Transition mounted={props.process !== undefined} transition="slide-down" duration={200} timingFunction="ease">
      {(styles) => <Progress style={styles} value={props.process} />}
    </Transition>
         </Modal>;
}
