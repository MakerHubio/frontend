import { Card, Image, Box } from '@mantine/core';
import { IoCube, IoImage, IoPlay } from 'react-icons/io5';
import { ReactElement } from 'react';

type MediaType = 'video' | 'image' | 'model';

type PreviewImageProps = {
    src: string,
    active?: boolean,
    mediaType?: MediaType,
};

export default function PreviewImage(props: PreviewImageProps) {
    const getMediaTypeIcon = (mediaType: MediaType): ReactElement => {
        switch (mediaType) {
            case 'image':
                return <IoImage fill="white" />;
            case 'video':
                return <IoPlay fill="white" />;
            case 'model':
                return <IoCube fill="white" />;
            default:
                return <IoImage fill="white" />;
        }
    };

    return <Card
      shadow="md"
      radius="md"
      mr="xs"
      withBorder={props.active}
      sx={theme => ({
                     borderColor: theme.colors.blue[5],
                     borderWidth: 2,
                 })}
    >
        <Card.Section>
            <Box sx={() => ({
                position: 'relative',
            })}
            >
                <Image src={props.src} height={48} />
                <Box sx={theme => ({
                    position: 'absolute',
                    bottom: 0,
                    right: 0,
                    padding: 2,
                    height: 22,
                    //background: 'rgba(10, 10, 10, 0.2)',
                    background: 'rgba(10, 10, 10, 0.2)',
                    backdropFilter: 'blur(2px)',
                    borderRadius: `${theme.radius.sm}px 0 0 0`,
                })}
                >
                    { getMediaTypeIcon(props.mediaType || 'image') }
                </Box>
            </Box>
        </Card.Section>
           </Card>;
}
