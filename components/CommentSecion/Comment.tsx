import { Button, Avatar, Card, Badge, createStyles, Group, Text } from '@mantine/core';
import { IoArrowUndo, IoDocument, IoFileTray, IoThumbsUp, IoCube } from 'react-icons/io5';

const useStyles = createStyles((theme, { isReply }: CommentProps) => ({
    container: {
        display: 'grid',
        gridTemplateColumns: 'auto 1fr',
        gridTemplateRows: '1fr auto auto',
        gap: `0 ${theme.spacing.sm}px`,
        gridTemplateAreas:
            '"avatar username" ". comment" ". actions"',
    },
    avatar: {
        gridArea: 'avatar',

    },
    username: {
        gridArea: 'username',
        alignItems: 'center',
        display: 'flex',
    },
    avatarWrapper: {
        alignItems: 'center',
        display: 'flex',
    },
    comment: {
        gridArea: 'comment',
    },
    card: {
        marginLeft: isReply ? theme.spacing.xl * 3 : 0,
    },
    actions: {
        gridArea: 'actions',
    },
}));

type CommentProps = {
    isReply?: boolean;
};

export default function Comment({ isReply }: CommentProps) {
    const { classes } = useStyles({ isReply });

    return <Card
      radius="md"
      shadow="md"
      padding="sm"
      className={classes.card}
      withBorder
    >
        <div className={classes.container}>
            <div className={classes.avatarWrapper}>
                <Avatar className={classes.avatar} src="https://i.pravatar.cc/64" />
            </div>
            <Text className={classes.username} weight="bold">Username</Text>
            <Text className={classes.comment}>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Esse quaerat
                soluta sunt.
                Blanditiis deleniti esse exercitationem illum modi nesciunt nulla odio officiis
                quia quidem, quos reiciendis, repellat similique unde veritatis.
            </Text>
            <Group className={classes.actions} mt="xs" position="apart" spacing="xs">
                <div>
                    <Badge style={{ paddingLeft: 0 }} size="lg" color="teal" leftSection={<IoCube />}>
                        fix.stl
                    </Badge>
                </div>
                <Group spacing="xs">
                    {!isReply ? <Button compact variant="light" leftIcon={<IoArrowUndo />}>Reply</Button> : null}
                    <Button compact variant="outline" leftIcon={<IoThumbsUp />}>Like</Button>
                </Group>
            </Group>
        </div>
           </Card>;
}
