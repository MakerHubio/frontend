import { Button, Badge, createStyles, Group, Text, Paper, Divider, Box, Space, useMantineTheme } from '@mantine/core';
import { IoArrowUndo, IoChevronDown, IoCube, IoHeart, IoHeartOutline } from 'react-icons/io5';
import { ProjectComment } from '../../models/ProjectComment';
import UserAvatar from '../UserAvatar';
import { useQuery } from 'react-query';
import { CreateComment, LikeComment, QueryComments } from '../../apis/projects';
import { useInputState, useSetState } from '@mantine/hooks';
import { AxiosResponse } from 'axios';
import { CommentDraft } from './CommentDraft';
import moment from 'moment';

const useStyles = createStyles((theme) => ({
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
  wrapper: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  actions: {
    gridArea: 'actions',
  },
}));

type CommentProps = {
  comment: ProjectComment;
  sortBy?: string;
};

export default function Comment({
                                  comment,
                                  sortBy,
                                }: CommentProps) {
  const { classes } = useStyles();
  const theme = useMantineTheme();
  const [data, setData] = useSetState<{
    show: boolean,
    isLiked: boolean,
    likes: number,
    draftOpen: boolean,
    comments: ProjectComment[],
  }>({
    show: false,
    isLiked: comment.isLiked!,
    likes: comment.likes!,
    draftOpen: false,
    comments: [],
  });
  
  const toggleLike = () => {
    LikeComment({ commentId: comment.id!,  like: !data.isLiked }).then(result => {
      if (result.status === 200) {
        setData({ isLiked: !data.isLiked });
      }
    });
  }; 

  const [draft, setDraft] = useInputState('');

  useQuery(['comments', comment.projectId, comment.id], () => QueryComments({
    projectId: comment.projectId,
    sortBy: sortBy,
    parentId: comment.id,
  }), {
    enabled: data.show,
    cacheTime: 5,
    staleTime: 5,
    onSuccess: (resp: AxiosResponse<ProjectComment[]>) => {
      setData({
        comments: resp.data,
      });
    },
  });

  const createComment = () => {
    CreateComment({
      projectId: comment.projectId,
      parentId: comment.id,
      text: draft,
      attachedFiles: [],
      linkedProjects: [],
    });
  };

  return <div className={classes.wrapper}>
    <Paper
      radius="md"
      shadow="md"
      p="sm"
      withBorder
    >
      <div className={classes.container}>
        <div className={classes.avatarWrapper}>
          <UserAvatar className={classes.avatar}
                      avatarId={comment.author!.avatarId}
                      userId={comment.author!.id}/>
        </div>
        <Group>
          <Text className={classes.username} weight="bold">{comment.author!.username!}</Text>
          <Text color="dimmed" size="sm">{moment(comment.createdAt).fromNow()}</Text>
        </Group>
        <Text className={classes.comment}>
          {comment.text}
        </Text>
        <Group className={classes.actions} mt="xs" position="apart" spacing="xs">
          <div>
            {
              comment.attachedFiles?.map(files =>
                <Badge style={{ paddingLeft: 0 }} size="lg" color="teal" leftSection={<IoCube/>}>
                  {files.name}
                </Badge>
              )
            }
          </div>
          <Group spacing="xs">
            {
              !comment.parentId ?
                <Button compact
                        variant="subtle"
                        leftIcon={<IoArrowUndo/>}
                        onClick={() => setData({ draftOpen: !data.draftOpen })}>
                  Reply
                </Button> : null
            }
            <Button compact
                    variant="subtle"
                    color="red"
                    onClick={() => {
                      toggleLike();
                      setData({ likes: data.likes + (data.isLiked ? -1 : 1) });
                    }}
                    leftIcon={data.isLiked ? <IoHeart size={20} /> : <IoHeartOutline size={20}/>}>
              {data.likes}
            </Button>
          </Group>
        </Group>
      </div>
    </Paper>
    {
      data.draftOpen ?
        <>
          {
            comment.parentId === '' || !comment.parentId ?
              <Divider ml={20}
                       orientation="vertical"
                       color={theme.colorScheme === 'light' ? 'gray' : 'dark'}
                       size="md"
                       sx={t => ({ height: t.spacing.md })}/> :
              <Space h="md" />
          }
          <CommentDraft draft={draft} setDraft={setDraft} onSend={createComment}/>
        </> : null
    }
    {
      comment.replies! > 0 && !data.show ?
        <Box mt={2} ml="sm">
          <Button variant="subtle"
                  color="dark"
                  leftIcon={<IoChevronDown/>}
                  onClick={() => setData({ show: true })}
                  compact>
            {comment.replies} {comment.replies === 1 ? 'reply' : 'replies'}
          </Button>
        </Box> : null
    }
    <Group sx={() => ({ alignItems: 'stretch' })} spacing={0}>
      <Box onClick={() => setData({ show: false })} sx={() => ({ padding: '0 20px', cursor: 'pointer' })}>
        <Divider orientation="vertical" color={theme.colorScheme === 'light' ? 'gray' : 'dark'} size="md" sx={() => ({ height: 'calc(100% - 20px)' })}/>
      </Box>
      <Box sx={() => ({ flexGrow: 1 })}>
        {
          data.show ? data.comments.map(c =>
            <div key={c.id}>
              <Space h="md"/>
              <Comment comment={c}/>
            </div>
          ) : null
        }
      </Box>
    </Group>
  </div>;
}
