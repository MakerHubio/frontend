import { forwardRef, Ref, useImperativeHandle, useRef, useState } from 'react';
import {
  ActionIcon,
  Alert,
  Button,
  ColorInput, createStyles,
  Group,
  Image, MantineTheme,
  Menu,
  Paper,
  Space,
  Text,
  useMantineTheme,
  Box,
} from '@mantine/core';
import {
  IoAlert,
  IoCamera, IoCloudUpload,
  IoCog,
  IoCreateOutline, IoCube, IoDocument,
  IoEllipsisVertical,
  IoImage,
  IoInformationCircle,
  IoMenu, IoTrash,
} from 'react-icons/io5';
import { Dropzone, DropzoneStatus, IMAGE_MIME_TYPE } from '@mantine/dropzone';
import dynamic from 'next/dynamic';
import { motion, useAnimation } from 'framer-motion';
import { useModals } from '@mantine/modals';
import { ModelViewerElement, RGBA } from '@google/model-viewer/lib/model-viewer';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import humanFileSize from '../../../utils/fileSize';
import useAudio from '../../../utils/audio';
import { hexToRgbA } from '../../../utils/color';

type FileSectionSectionProps = {};
export type FileSectionElement = {
  getFiles: () => AddProjectFile[];
};

type ImageUploadIconProps = {
  status: DropzoneStatus;
  [key: string]: any;
};

type AddProjectFile = File & {
  thumbnail: string;
};

function ImageUploadIcon({
                           status,
                           ...props
                         }: ImageUploadIconProps) {
  if (status.accepted) {
    return <IoCloudUpload {...props} />;
  }

  if (status.rejected) {
    return <IoAlert {...props} />;
  }

  return <IoDocument {...props} />;
}

function getIconColor(status: DropzoneStatus, theme: MantineTheme) {
  return status.accepted
    ? theme.colors[theme.primaryColor][6]
    : status.rejected
      ? theme.colors.red[6]
      : theme.colorScheme === 'dark'
        ? theme.colors.dark[0]
        : theme.black;
}

const useStyles = createStyles(theme => ({
  modelWrapper: {
    position: 'relative',
  },
  shutter: {
    position: 'absolute',
    height: '100%',
    width: '100%',
    zIndex: 1,
    backgroundColor: 'white',
    opacity: 0,
    pointerEvents: 'none',
  },
  hotspot: {
    backgroundColor: theme.colors.white,
    height: 24,
    width: 24,
    borderRadius: 32,
    border: 'none',
    boxShadow: theme.shadows.md,
    padding: 8,
    position: 'relative',
    transition: 'opacity 0.3s ease 0s',
  },
  hotspotAnnotation: {
    background: 'rgb(255, 255, 255)',
    borderRadius: '4px',
    boxShadow: 'rgb(0 0 0 / 25%) 0px 2px 4px',
    color: 'rgba(0, 0, 0, 0.8)',
    display: 'block',
    fontSize: '18px',
    fontWeight: 700,
    left: 'calc(100% + 1em)',
    maxWidth: '128px',
    overflowWrap: 'break-word',
    padding: '0.5em 1em',
    position: 'absolute',
    top: '50%',
    width: 'max-content',
  },
}));

const fileImagePlaceholder = (type: string) => {
  switch (type) {
    case 'model/stl':
      return <IoCube size={30} />;
    case 'application/pdf':
      return <IoDocument size={30} />;
    default:
      return <IoImage size={30} />;
  }
};

function FileSection(props: FileSectionSectionProps, ref: Ref<FileSectionElement | undefined>) {
  const theme = useMantineTheme();

  const [files, setFiles] = useState<AddProjectFile[]>([]);

  const modals = useModals();
  const modelRef = useRef<ModelViewerElement>();
  const [, toggle] = useAudio('/shutter.mp3');
  const { classes } = useStyles();
  const controls = useAnimation();

  useImperativeHandle(ref, () => ({
    getFiles: () => files,
  }));

  const addFile = (...file: AddProjectFile[]) => {
    const tmp_files = file;

    file.forEach((f, index) => {
      console.log(f);
      if ((IMAGE_MIME_TYPE as string[]).includes(f.type)) {
        tmp_files[index].thumbnail = URL.createObjectURL(f.slice(0, f.size, f.type));
      }
    });

    console.log(tmp_files);

    setFiles([...files, ...tmp_files]);
  };

  const openPreviewModal = (index: number) => {
    const Model = dynamic(
      () => import('../../ModelViewer/ModelViewer'),
      { ssr: false }
    );

    const dataUrl = URL.createObjectURL(
      files[index].slice(0, files[index].size, files[index].type));

    modals.openModal({
      title: 'Create Thumbnail of Model',
      children: (
        <>
          <div className={classes.modelWrapper}>
            <motion.div animate={controls} className={classes.shutter} />
            <Model
              url={dataUrl}
              autoRotate={false}
              viewerRef={modelRef}
              onClick={event => {
                // @ts-ignore
                const rect = modelRef.current?.getBoundingClientRect();
                console.log(rect);
                const positionAndNormal = modelRef
                  .current?.positionAndNormalFromPoint(event.clientX,
                    event.clientY);
                console.log(positionAndNormal);
                if (positionAndNormal) {
                  const hotspot = {
                    normal: positionAndNormal.normal,
                    position: positionAndNormal.position,
                    text: 'test',
                    name: `test${positionAndNormal.position.toString()}`,
                  };
                  const hotspotElement = document.createElement('button');
                  hotspotElement.classList.add(classes.hotspot);
                  hotspotElement.slot = `hotspot-${hotspot.name}`;
                  hotspotElement.dataset.position = hotspot.position.toString();
                  if (hotspot.normal) {
                    hotspotElement.dataset.normal = hotspot.normal.toString();
                  }
                  hotspotElement.dataset.visibilityAttribute = 'visible';

                  const annotationElement = document.createElement('div');
                  annotationElement.classList.add(classes.hotspotAnnotation);
                  annotationElement.contentEditable = 'true';
                  annotationElement.textContent = 'hotspot';
                  hotspotElement.appendChild(annotationElement);

                  //@ts-ignore
                  modelRef.current?.append(hotspotElement);
                }
              }}
            />
          </div>
          <Group position="center" mt="sm">
            <ColorInput
              onChange={colorString => {
                const material = modelRef.current?.model?.materials;
                if (material === undefined) return;

                // @ts-ignore
                const color: RGBA = hexToRgbA(colorString);

                material[0].pbrMetallicRoughness.setBaseColorFactor(color);
              }}
              format="hex"
              swatches={['#25262b', '#868e96', '#fa5252', '#e64980', '#be4bdb', '#7950f2', '#4c6ef5', '#228be6', '#15aabf', '#12b886', '#40c057', '#82c91e', '#fab005', '#fd7e14']}
            />
            <Button
              onClick={() => {
                files[index].thumbnail = modelRef.current!.toDataURL();
                toggle();
                controls.start({
                  opacity: [1, 0],
                  transition: {
                    duration: 0.5,
                  },
                });
              }}
              leftIcon={<IoCamera />}
            >
              Take screenshot
            </Button>
          </Group>
        </>
      ),
      size: 835,
    });
  };

  const reorder = (list: ArrayLike<any>, startIndex: number, endIndex: number) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
  };

  const onDragEnd = (result: DropResult) => {
    // dropped outside the list
    if (!result.destination) {
      return;
    }

    const items = reorder(
      files,
      result.source.index,
      result.destination.index
    );

    setFiles(items);
  };

  const getFileList = () => files.map((file, index) => (
      <Draggable key={file.name + file.size} draggableId={file.name + file.size} index={index}>
        {(provided, snapshot) => (
          <Box
            ref={provided.innerRef}
            {...provided.draggableProps}
            style={provided.draggableProps.style}
            sx={t => ({
              marginBottom: t.spacing.sm,
            })}
          >
            <Paper
              withBorder
              radius="md"
              padding="sm"
              sx={t => ({
                width: '100%',
                borderColor: snapshot.isDragging ? t.colors.blue[5] : t.colorScheme === 'light' ? t.colors.gray[2] : t.colors.gray[8],
                transition: 'border-color .2s ease-out',
              })}
            >
              <Group position="apart">
                <Group>
                  <ActionIcon {...provided.dragHandleProps}>
                    <IoMenu />
                  </ActionIcon>
                  <Image
                    withPlaceholder
                    placeholder={fileImagePlaceholder(file.type)}
                    width={160}
                    height={90}
                    src={file.thumbnail}
                  />
                  <Group spacing={0}>
                    <Text lineClamp={1} weight="bold">{file.name}</Text>
                    <ActionIcon color="blue" variant="transparent"><IoCreateOutline /></ActionIcon>
                  </Group>
                  <Text color="dimmed" size="sm">{humanFileSize(file.size, true)}</Text>
                </Group>
                <Group>
                  {file.type === 'model/stl' ?
                    <ActionIcon onClick={() => openPreviewModal(index)}>
                      <IoCog />
                    </ActionIcon> : null}
                  <Menu
                    control={
                      <ActionIcon>
                        <IoEllipsisVertical />
                      </ActionIcon>
                    }
                    placement="end"
                  >
                    {(IMAGE_MIME_TYPE as string[]).includes(file.type) ?
                      <Menu.Item icon={<IoImage />}>
                        Set as thumbnail
                      </Menu.Item> : null}
                    <Menu.Item color="red" icon={<IoTrash />}>
                      Delete
                    </Menu.Item>
                  </Menu>

                </Group>
              </Group>
            </Paper>
          </Box>
        )}
      </Draggable>
    ));

  return <>
    <Alert
      title="Attention"
      icon={<IoInformationCircle />}
    >
      Projects larger than 50 MB need to be verified by our mods.
      This should not take longer than a few hours.
    </Alert>
    <Space h="sm" />
    <Dropzone
      onDrop={(droppedFiles: AddProjectFile[]) => addFile(...droppedFiles)}
      accept={[...IMAGE_MIME_TYPE, 'model/stl', 'application/pdf']}
    >
      {(status) => (
        <Group
          position="center"
          spacing="xl"
          style={{
            minHeight: 220,
            pointerEvents: 'none',
          }}
        >
          <ImageUploadIcon
            status={status}
            style={
              {
                width: 80,
                height: 80,
                color: getIconColor(status, theme),
              }}
          />

          <div>
            <Text size="xl" inline>
              Drag files here or click to select files
            </Text>
            <Text size="sm" color="dimmed" inline mt={7}>
              Attach as many files as you like,
              allowed file types are: stl, png, jpg, pdf
            </Text>
          </div>
        </Group>
      )}
    </Dropzone>
    <Space h="sm" />
    <>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="filesDroppable">
          {provided => (
            <Box
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {getFileList()}
              {provided.placeholder}
            </Box>
          )}
        </Droppable>
      </DragDropContext>
    </>
         </>;
}

export default forwardRef(FileSection);
