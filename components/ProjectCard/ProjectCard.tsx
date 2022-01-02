import { Button, Card, Image, SimpleGrid, Text, Popover, Space } from '@mantine/core';
import { IoAdd, IoHeart, IoHeartOutline, IoLogIn } from 'react-icons/io5';
import { SyntheticEvent, useState } from 'react';
import { useRouter } from 'next/router';
import Project from '../../models/Project';

type ProjectCardPropType = {
    project: Project;
    likeDisabled?: boolean;
    onLike: (like: boolean) => void
};

export default function ProjectCard({
                                        project,
                                        likeDisabled,
                                        onLike,
                                    }: ProjectCardPropType) {
    const [popoverOpened, setPopoverOpened] = useState(false);
    const router = useRouter();

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
                  src={`http://127.0.0.1:5001/files/${project.thumbnailId}?w=616&h=400`}
                  imageProps={{
                    loading: 'lazy',
                }}
                  height={200}
                  alt="Norway"
                  withPlaceholder
                />
            </Card.Section>
            <Text
              sx={(theme) => ({
                    marginTop: theme.spacing.sm,
                    marginBottom: theme.spacing.sm,
                })}
              weight={500}
              lineClamp={1}
            >
                {project.name}
            </Text>
            <SimpleGrid cols={2}>
                <Popover
                  opened={popoverOpened}
                  onClose={() => setPopoverOpened(false)}
                  position="bottom"
                  placement="center"
                  withArrow
                  noFocusTrap
                  noEscape
                  transition="pop-top-left"
                  styles={{ body: { width: 260 } }}
                  target={
                        <Button
                          fullWidth
                          onClick={(e: SyntheticEvent) => {
                              e.stopPropagation();
                              likeDisabled ? setPopoverOpened(true) :
                                  onLike(!project.isLiked);
                          }}
                          leftIcon={project.isLiked ? <IoHeart size="24px" /> : <IoHeartOutline size="24px" />}
                          variant="light"
                          color="red"
                        >
                            <Text sx={(theme) => ({ color: theme.colors.red[9] })}>
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
                <Button variant="light" color="blue">
                    <IoAdd size="24px" />
                </Button>
            </SimpleGrid>
        </Card>
    );
}
