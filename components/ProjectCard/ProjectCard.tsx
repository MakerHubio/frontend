import {
  Button,
  Card,
  Image,
  Text,
  Popover,
  Space,
  Group,
  UnstyledButton,
  Skeleton, MantineTheme, useMantineTheme,
} from '@mantine/core';
import { IoHeart, IoHeartOutline, IoLogIn } from 'react-icons/io5';
import { SyntheticEvent, useState } from 'react';
import { useRouter } from 'next/router';
import Project from '../../models/Project';
import UserAvatar from '../UserAvatar';
import { useElementSize } from '@mantine/hooks';

type ProjectCardPropType = {
  project?: Project;
  likeDisabled?: boolean;
  onLike?: (like: boolean) => void,
  skeleton?: boolean
};

const ProjectCardSkeleton = (theme: MantineTheme) =>
  <Card
    withBorder
    shadow="sm"
    padding="lg"
    radius="md"
  >
    <Card.Section>
      <Skeleton width="100%" radius={0} height={200} />
    </Card.Section>
    <Skeleton height={8} width="50%" my="sm" radius="xl" />
    <Group position="apart">
      <Group>
        <Skeleton circle height={38} />
        <Skeleton height={8} width={80} my="sm" radius="xl" />
      </Group>
      <Group>
        <IoHeartOutline size="24px" color={theme.colorScheme === 'light' ? theme.colors.gray[3] : theme.colors.dark[3]} />
        <Skeleton height={8} width={20} my="sm" radius="xl" />
      </Group>
    </Group>
  </Card>;

export default function ProjectCard({
                                      project,
                                      likeDisabled,
                                      onLike,
                                      skeleton,
                                    }: ProjectCardPropType) {
  const [popoverOpened, setPopoverOpened] = useState(false);
  const router = useRouter();
  const theme = useMantineTheme();
  const { ref, width, height } = useElementSize();

  if (skeleton) {
    return ProjectCardSkeleton(theme);
  }
  
  if (!project || !onLike) {
    throw new Error('project and onLike needs to be defined if skeleton is false');
  }
  
  return (
    <Card
      withBorder
      shadow="sm"
      padding="lg"
      radius="md"
      key={project.id}
      onClick={() => {
        router.push(`/project/${project.id}`);
      }}
      sx={() => ({
        cursor: 'pointer',
      })}
    >
      <Card.Section>
        <Image
          src={`http://127.0.0.1:5001/files/${project.thumbnailId}?w=${width}&h=${Math.round(height)}`}
          imageProps={{
            loading: 'lazy',
          }}
          imageRef={ref}
          styles={() => ({
            image: {
              aspectRatio: '16 / 9',
            },
          })}
          alt="Norway"
          withPlaceholder
        />
      </Card.Section>
      <Text
        my="sm"
        weight="bold"
        lineClamp={1}
      >
        {project.name}
      </Text>
      <Group position="apart" noWrap>
        <UnstyledButton onClick={e => {
          e.stopPropagation();
          router.push(`/user/${project.creator?.id}/profile`);
        }}>
          <Group noWrap>
            <UserAvatar avatarId={project.creator?.avatarId} userId={project.creator?.id} />
            <Text>{project.creator?.username}</Text>
          </Group>
        </UnstyledButton>
        <Popover
          opened={popoverOpened}
          onClose={() => setPopoverOpened(false)}
          position="bottom"
          placement="center"
          withArrow
          noFocusTrap
          noEscape
          transition="rotate-right"
          styles={{ body: { width: 260 } }}
          target={
            <Button
              onClick={(e: SyntheticEvent) => {
                e.stopPropagation();
                likeDisabled ? setPopoverOpened(true) :
                  onLike(!project.isLiked);
              }}
              styles={() => ({
                root: {
                  '&:hover': {
                    backgroundColor: 'transparent',
                  },
                },
              })}
              leftIcon={project.isLiked ? <IoHeart size="24px" /> : <IoHeartOutline size="24px" />}
              variant="subtle"
              color="red"
            >
              <Text sx={(t) => (
                {
                  color: t.colorScheme === 'light' ? t.colors.red[6] : t.colors.red[2],
                })}
              >
                {project.likeCount || 0}
              </Text>
            </Button>
          }
        >
          <Text>You must be logged in to like a project</Text>
          <Space h="sm" />
          <Button
            onClick={(e: SyntheticEvent) => {
              e.stopPropagation();
              router.push(`/login?ref=${typeof window !== 'undefined' ? window.location : ''}`);
            }}
            fullWidth
            leftIcon={<IoLogIn />}
            component="a"
          >
            Login
          </Button>
        </Popover>
      </Group>
    </Card>
  );
}
