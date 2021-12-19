import { Tooltip, Space, Paper, Textarea, Group, Button, ActionIcon, Text, Select } from '@mantine/core';
import { IoAttach, IoLink, IoSend } from 'react-icons/io5';
import { useState } from 'react';
import Comment from './Comment';

export default function CommentSection() {
    const [commentDraft, setCommentDraft] = useState<string>('');

    return <div>
        <Paper shadow="md" withBorder padding="sm" radius="md">
            <Textarea
              placeholder="Your comment"
              value={commentDraft}
              autosize
              minRows={4}
              onChange={(event) => setCommentDraft(event.currentTarget.value)}
              variant="unstyled"
              required
            />
            <Group position="apart">
                <Group>
                    <Tooltip label="Attach file" withArrow transition="slide-left" transitionDuration={300} transitionTimingFunction="ease">
                        <ActionIcon color="gray">
                            <IoAttach size={18} />
                        </ActionIcon>
                    </Tooltip>
                    <Tooltip label="Link project" withArrow transition="slide-right" transitionDuration={300} transitionTimingFunction="ease">
                        <ActionIcon color="gray">
                            <IoLink size={18} />
                        </ActionIcon>
                    </Tooltip>
                    <Text size="sm" color="gray">Drop files to attach.</Text>
                </Group>
                <Group>
                    <Text size="sm" color="gray">{commentDraft?.length} / 2000</Text>
                    <Button leftIcon={<IoSend />}>Send</Button>
                </Group>
            </Group>
        </Paper>
        <Space h="sm" />
        <Comment />
        <Space h="sm" />
        <Comment isReply />
           </div>;
}
