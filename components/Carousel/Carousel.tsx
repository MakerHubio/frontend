import { Card, Group, Image, Box } from '@mantine/core';
import dynamic from 'next/dynamic';
import React from 'react';
import PreviewImage from './PreviewImage';

function Carousel() {
    const Model = dynamic(
        () => import('../ModelViewer/ModelViewer'),
        { ssr: false }
    );

    return <Group position="center" direction="column">
        <Box sx={theme => ({
            paddingRight: theme.spacing.md,
            width: '100%',
        })}
        >
            <Card shadow="md" radius="md" withBorder>
                <Card.Section>
                    {/* <Image src="https://picsum.photos/id/1000/850/450" height={450} */}
                    <Model url="/3DBenchy.stl" />
                </Card.Section>
            </Card>
        </Box>
        <Group m={0}>
            <PreviewImage mediaType="video" src="https://picsum.photos/id/1000/64/48" active />
            <PreviewImage src="https://picsum.photos/64/48" />
            <PreviewImage src="https://picsum.photos/64/48" />
            <PreviewImage mediaType="model" src="https://picsum.photos/64/48" />
        </Group>
           </Group>;
}

export default React.memo(Carousel);
