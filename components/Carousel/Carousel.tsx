import { Image, Paper, Group, Box, ActionIcon, createStyles, Center, ScrollArea } from '@mantine/core';
import dynamic from 'next/dynamic';
import React, { useRef, useState } from 'react';
import { useElementSize } from '@mantine/hooks';
import PreviewImage from './PreviewImage';
import { IoArrowBackCircle, IoArrowForwardCircle } from 'react-icons/io5';

export type CarouselItem = {
  mediaType: string,
  src: string,
  thumbnailSrc: string,
  meta: { [key: string]: any }
};

type CarouselProps = {
  items: CarouselItem[],
};

const Model = dynamic(
  () => import('../ModelViewer/ModelViewer'),
  { ssr: false }
);

const useStyles = createStyles(theme => ({
  contentWrapper: {
    position: 'relative',
    height: '100%',
    width: '100%',
  },
  item: {
    position: 'absolute',
    height: '100%',
    width: '100%',
    zIndex: 1,
  },
  arrowLeft: {
    position: 'absolute',
    left: 0,
    height: '100%',
    zIndex: 2,
    'button': {
      height: '100% !important',
    },
    'button:hover': {
      backgroundColor: 'transparent',
    },
    'button > svg': {
      fill: theme.colorScheme === 'light' ? theme.colors.dark[5] : 'white',
    },
  },
  arrowRight: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    height: '100%',
    zIndex: 2,
    'button': {
      height: '100% !important',
    },
    'button:hover': {
      backgroundColor: 'transparent',
    },
    'button > svg': {
      fill: theme.colorScheme === 'light' ? theme.colors.dark[5] : 'white',
    },
  },
}));

function Carousel(props: CarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const {
    ref,
    width,
    height,
  } = useElementSize();
  const { classes } = useStyles();
  const viewport = useRef<HTMLDivElement>(null);

  const getPreviewItems = () => props.items?.map((item, index) => {
    const src = item.mediaType.startsWith('image') ? item.src : item.thumbnailSrc;

    return <PreviewImage
      key={index}
      src={`${src}?w=64&h=48`}
      mediaType={item.mediaType}
      active={index === activeIndex}
      onClick={() => setActiveIndex(index)}
    />;
  });

  const getCarouselItem = () => props.items?.map((item, index) => {
    if (item === undefined) return <></>;

    if (item.mediaType.startsWith('image')) {
      return <Image
        key={index}
        sx={() => ({
          display: index === activeIndex ? 'block' : 'none',
        })}
        src={`${item.src}?h=${Math.round(height)}&w=${Math.round(width)}`}
        height={Math.round(height)}
        width={Math.round(width)}
      />;
    }
    if (item.mediaType.startsWith('application/')) {
      return <Box
        key={index}
        sx={() => ({
          display: index === activeIndex ? 'block' : 'none',
          height: '100%',
          width: '100%',
        })}
      >
        {index === activeIndex ? <Model
          url={item.src}
          color={item.meta.color}
          camera={{
            theta: item.meta.theta,
            phi: item.meta.phi,
            radius: item.meta.radius,
            fov: item.meta.fov,
          }}
          poster={item.thumbnailSrc}
        /> : null}
      </Box>;
    }

    return <></>;
  });

  const changeActiveIndex = (index: number) => {
    if (index > 4) {
      viewport.current!.scrollTo({ left: (90 * (index - 4)), behavior: 'smooth' });
    } else {
      viewport.current!.scrollTo({ left: 0, behavior: 'smooth' });
    }
    setActiveIndex(index);
  };

  // @ts-ignore
  return <Group position="center" direction="row">
    <Box sx={() => ({
      width: '100%',
    })}
    >
      <Paper
        shadow="md"
        radius="md"
        withBorder
        ref={ref}
        sx={() => ({
          overflow: 'hidden',
          aspectRatio: '16 / 9',
        })}
      >
        <div className={classes.contentWrapper}>
          { activeIndex !== 0 ?
            <Center className={classes.arrowLeft}>
              <ActionIcon size="lg" onClick={() => changeActiveIndex(activeIndex - 1)}>
                <IoArrowBackCircle size={23} />
              </ActionIcon>
            </Center> : null
          }
          <div className={classes.item}>
            {getCarouselItem()}
          </div>
          {activeIndex < props.items.length - 1 ?
            <Center className={classes.arrowRight}>
              <ActionIcon size="lg" onClick={() => changeActiveIndex(activeIndex + 1)}>
                <IoArrowForwardCircle size={23}/>
              </ActionIcon>
            </Center> : null
          }
        </div>
      </Paper>
    </Box>
    <ScrollArea type="scroll" scrollbarSize={6} viewportRef={viewport} onWheel={(event) => {
      event.preventDefault();
      event.stopPropagation();
      viewport.current!.scrollTo({ left: viewport.current!.scrollLeft + event.deltaY, behavior: 'auto' });
      return false;
    }}>
      <Group m={0} mb={6} sx={() => ({
        display: 'flex',
        flexWrap: 'nowrap',
      })}>
        {getPreviewItems()}
      </Group>
    </ScrollArea>
  </Group>;
}

export default React.memo(Carousel);
