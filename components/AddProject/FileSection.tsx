import {
  ActionIcon,
  Alert,
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
  IoCloudUpload,
  IoCreateOutline, IoCube, IoDocument,
  IoEllipsisVertical,
  IoImage,
  IoInformationCircle,
  IoMenu, IoTrash,
} from 'react-icons/io5';
import { Dropzone, IMAGE_MIME_TYPE } from '@mantine/dropzone';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { AddProjectFile } from '../../models/Project';
import { humanFileSize } from '../../utils/file';

type FileSectionSectionProps = {
  files: AddProjectFile[],
  onFilesChanged: (file: AddProjectFile[]) => void,
};

type DropzoneStatus = 'idle' | 'rejected' | 'accepted';

type ImageUploadIconProps = {
  status: DropzoneStatus;
  [key: string]: any;
};

function ImageUploadIcon({
                           status,
                           ...props
                         }: ImageUploadIconProps) {
  if (status === 'accepted') {
    return <IoCloudUpload {...props} />;
  }

  if (status === 'rejected') {
    return <IoAlert {...props} />;
  }

  return <IoDocument {...props} />;
}

function getIconColor(status: DropzoneStatus, theme: MantineTheme) {
  return status === 'accepted'
    ? theme.colors[theme.primaryColor][6]
    : status === 'rejected'
      ? theme.colors.red[6]
      : theme.colorScheme === 'dark'
        ? theme.colors.dark[0]
        : theme.black;
}

/*
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
 */

const fileImagePlaceholder = (type: string) => {
  switch (type) {
    case 'model/stl':
      return <IoCube size={30}/>;
    case 'application/pdf':
      return <IoDocument size={30}/>;
    default:
      return <IoImage size={30}/>;
  }
};

export default function FileSection({
                                      files,
                                      onFilesChanged,
                                    }: FileSectionSectionProps) {
  const theme = useMantineTheme();

  const addFile = (...file: AddProjectFile[]) => {
    const tmp_files = file;

    file.forEach((f, index) => {
      if ((IMAGE_MIME_TYPE as string[]).includes(f.type)) {
        tmp_files[index].thumbnail = URL.createObjectURL(f.slice(0, f.size, f.type));
      }
    });

    onFilesChanged([...files, ...tmp_files]);
  };

  const removeFile = (file: AddProjectFile) => {
    const new_files = new Array(...files);

    const removeIndex = files.indexOf(file);

    new_files.splice(removeIndex, 1);

    onFilesChanged(new_files);
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

    onFilesChanged(items);
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
            p="sm"
            sx={t => ({
              width: '100%',
              borderColor: snapshot.isDragging ? t.colors.blue[5] : t.colorScheme === 'light' ? t.colors.gray[2] : t.colors.gray[8],
              transition: 'border-color .2s ease-out',
            })}
          >
            <Group position="apart">
              <Group>
                <ActionIcon {...provided.dragHandleProps}>
                  <IoMenu/>
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
                  <ActionIcon color="blue" variant="transparent"><IoCreateOutline/></ActionIcon>
                </Group>
                <Text color="dimmed" size="sm">{humanFileSize(file.size, true)}</Text>
              </Group>
              <Group>
                <Menu>
                  <Menu.Target>
                    <ActionIcon>
                      <IoEllipsisVertical/>
                    </ActionIcon>
                  </Menu.Target>
                  <Menu.Dropdown>
                    {(IMAGE_MIME_TYPE as string[]).includes(file.type) ?
                      <Menu.Item icon={<IoImage/>}>
                        Set as thumbnail
                      </Menu.Item> : null}
                    <Menu.Item color="red" icon={<IoTrash/>} onClick={() => removeFile(file)}>
                      Remove
                    </Menu.Item>
                  </Menu.Dropdown>
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
      icon={<IoInformationCircle/>}
    >
      Projects larger than 50 MB need to be verified by our mods.
      This should not take longer than a few hours.
    </Alert>
    <Space h="sm"/>
    <Dropzone
      onDrop={(droppedFiles: AddProjectFile[]) => addFile(...droppedFiles)}
      accept={{
        'image/*': [],
        'model/stl': ['.stl'],
      }}
    >
      <Dropzone.Accept>
        <Group
          position="center"
          spacing="xl"
          style={{
            minHeight: 220,
            pointerEvents: 'none',
          }}
        >
          <ImageUploadIcon
            status="accepted"
            style={
              {
                width: 80,
                height: 80,
                color: getIconColor('accepted', theme),
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
      </Dropzone.Accept>
      <Dropzone.Reject>
        <Group
          position="center"
          spacing="xl"
          style={{
            minHeight: 220,
            pointerEvents: 'none',
          }}
        >
          <ImageUploadIcon
            status="rejected"
            style={
              {
                width: 80,
                height: 80,
                color: getIconColor('rejected', theme),
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
      </Dropzone.Reject>
      <Dropzone.Idle>
        <Group
          position="center"
          spacing="xl"
          style={{
            minHeight: 220,
            pointerEvents: 'none',
          }}
        >
          <ImageUploadIcon
            status="idle"
            style={
              {
                width: 80,
                height: 80,
                color: getIconColor('idle', theme),
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
      </Dropzone.Idle>
    </Dropzone>
    <Space h="sm"/>
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
