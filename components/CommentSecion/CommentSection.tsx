import { Space, Button, Menu, Loader } from '@mantine/core';
import { useEffect, useState } from 'react';
import Comment from './Comment';
import { CreateComment, QueryComments } from '../../apis/projects';
import { useQuery } from 'react-query';
import { useRouter } from 'next/router';
import { CommentDraft } from './CommentDraft';
import { IoChevronDown } from 'react-icons/io5';

type CommentSectionProps = {
  projectId: string;
};

const SortMethods: { [key: string]: string } = {
  'best': 'Best',
  'newest': 'Newest',
  'oldest': 'Oldest',
};

export default function CommentSection(props: CommentSectionProps) {
  const [commentDraft, setCommentDraft] = useState<string>('');
  const [sortMethod, setSortMethod] = useState<string>('best');
  const router = useRouter();
  const { id } = router.query;
  
  const {
    data: commentsResp,
    refetch,
    isRefetching,
  } = useQuery(['comments', id], () => QueryComments({ projectId: (id as string), sortBy: sortMethod, limit: 10 }));

  const createComment = () => {
    CreateComment({
      projectId: props.projectId,
      text: commentDraft,
      attachedFiles: [],
      linkedProjects: [],
    }).then(result => {
      if (result.status === 200) {
        setSortMethod('newest');
        setCommentDraft('');
      }
    });
  };

  useEffect(() => {
    refetch();
  }, [sortMethod]);

  return <div>
    <CommentDraft draft={commentDraft} setDraft={setCommentDraft} onSend={createComment} />
    <Space h="md" />
    <Menu control={
      <Button color="gray"
              variant="subtle"
              compact
              rightIcon={<IoChevronDown />}>Sort by: {SortMethods[sortMethod]}</Button>
    }>
      <Menu.Item onClick={() => setSortMethod('best')}>Best</Menu.Item>
      <Menu.Item onClick={() => setSortMethod('newest')}>Newest</Menu.Item>
      <Menu.Item onClick={() => setSortMethod('oldest')}>Oldest</Menu.Item>
    </Menu>
    { isRefetching ? <Loader size="xs" /> : null }
    { commentsResp ? commentsResp.data.map(comment =>
      <div key={comment.id}>
        <Space h="md" />
        <Comment comment={comment} sortBy={sortMethod} />
      </div>
    ) : null }
  </div>;
}
