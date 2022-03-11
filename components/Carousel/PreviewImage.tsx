import { Paper, Image, Box } from '@mantine/core';
import { IoCube, IoDocument, IoImage } from 'react-icons/io5';
import { ReactElement } from 'react';

type PreviewImageProps = {
  src: string,
  active?: boolean,
  mediaType?: string,
  onClick: () => void,
};

export default function PreviewImage(props: PreviewImageProps) {
  const getMediaTypeIcon = (mediaType: string): ReactElement => {
    if (mediaType.startsWith('model')) {
      return <IoCube fill="white" />;
    }
    //if (mediaType.startsWith('image')) {
      return <IoImage fill="white" />;
    //}
  };

  return <Paper
    shadow="md"
    radius="md"
    mr="xs"
    withBorder={props.active}
    onClick={props.onClick}
    sx={theme => ({
      borderColor: theme.colors.blue[5],
      borderWidth: 2,
      overflow: 'hidden',
      cursor: 'pointer',
    })}
  >
    <Box sx={() => ({
      position: 'relative',
    })}
    >
      <Image
        src={props.src}
        withPlaceholder
        placeholder={
          <IoDocument size={18} />
        }
        width={64}
        height={48}
      />
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
        {getMediaTypeIcon(props.mediaType || 'image')}
      </Box>
    </Box>
         </Paper>;
}
