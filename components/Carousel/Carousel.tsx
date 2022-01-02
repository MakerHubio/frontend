import { Card, Group, Box } from '@mantine/core';
import dynamic from 'next/dynamic';
import React, { ReactElement, useState } from 'react';
import PreviewImage from './PreviewImage';

export type CarouselItem = {
    mediaType: string,
    src: string
};

type CarouselProps = {
    items: CarouselItem[],
};

function Carousel(props: CarouselProps) {
    const Model = dynamic(
        () => import('../ModelViewer/ModelViewer'),
        { ssr: false }
    );

    const [activeIndex, setActiveIndex] = useState(0);

    const getPreviewItems = () => props.items?.map((item, index) =>
      <PreviewImage
        src={`${item.src}?w=64&h=48`}
        mediaType={item.mediaType}
        active={index === activeIndex}
        onClick={() => setActiveIndex(index)}
      />
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
            { getPreviewItems() }
        </Group>
           </Group>;
}

export default React.memo(Carousel);
