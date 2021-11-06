import {Button, Card, Image, SimpleGrid, Text, Popover, Space} from '@mantine/core';
import {IoAdd, IoHeart, IoHeartOutline, IoLogIn} from 'react-icons/io5';
import { useState } from 'react';
import Project from '../../models/Project';
import Link from "next/link";

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

    return (
        <Card withBorder shadow="sm" padding="lg" radius="md" key={project.id}>
            <Card.Section>
                <Image src="https://picsum.photos/536/354" height={160} alt="Norway" />
            </Card.Section>
            <Text
              sx={(theme) => ({
                    marginTop: theme.spacing.sm,
                    marginBottom: theme.spacing.sm,
                })}
              weight={500}
            >{project.name}
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
                          onClick={() => likeDisabled ? setPopoverOpened(true) :
                              onLike(!project.isLiked)}
                          leftIcon={project.isLiked ? <IoHeart size="24px" /> : <IoHeartOutline size="24px" />}
                          variant="light"
                          color="red"
                        >
                            <Text sx={(theme) => ({ color: theme.colors.red[9] })}>
                                {project.likeCount}
                            </Text>
                        </Button>
                    }
                >
                    <Text>You must be logged in to like a project</Text>
                    <Space h="sm" />
                    <Link href={`/login?ref=${typeof window !== 'undefined' ? window.location : ''}`}>
                        <Button fullWidth leftIcon={<IoLogIn />} component="a">
                            Login
                        </Button>
                    </Link>
                </Popover>
                <Button variant="light" color="blue">
                    <IoAdd size="24px" />
                </Button>
            </SimpleGrid>
        </Card>
    );
}
