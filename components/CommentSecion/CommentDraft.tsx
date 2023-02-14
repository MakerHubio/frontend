import { ActionIcon, Button, Group, Paper, Text, Textarea, Tooltip } from '@mantine/core';
import { IoAttach, IoLink, IoSend } from 'react-icons/io5';

type CommentDraftProps = {
  draft: string;
  setDraft: (value: string) => void;
  onSend: () => void; 
};

export function CommentDraft(props: CommentDraftProps) {
  return <Paper shadow="md" withBorder p="sm" radius="md">
    <Textarea
      placeholder="Your comment"
      value={props.draft}
      autosize
      minRows={4}
      onChange={(event) => props.setDraft(event.currentTarget.value)}
      variant="unstyled"
      required
    />
    <Group position="apart">
      <Group>
        <Tooltip label="Attach file" withArrow transition="slide-left" transitionDuration={300}>
          <ActionIcon color="gray">
            <IoAttach size={18}/>
          </ActionIcon>
        </Tooltip>
        <Tooltip label="Link project" withArrow transition="slide-right" transitionDuration={300}>
          <ActionIcon color="gray">
            <IoLink size={18}/>
          </ActionIcon>
        </Tooltip>
        <Text size="sm" color="gray">Drop files to attach.</Text>
      </Group>
      <Group>
        <Text size="sm" color="gray">{props.draft?.length} / 2000</Text>
        <Button leftIcon={<IoSend/>} onClick={() => props.onSend()}>Send</Button>
      </Group>
    </Group>
  </Paper>;
}