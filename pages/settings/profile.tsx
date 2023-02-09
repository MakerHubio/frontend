import Head from 'next/head';
import {
  Container,
  Grid,
  Title,
  Col,
  Space,
  Paper,
  Divider,
  Image,
  Group,
  Button,
  Text,
  TextInput,
  Textarea, Select, LoadingOverlay, Box,
} from '@mantine/core';
import { IoGlobe, IoInformationCircle, IoLocation, IoPerson, IoSave } from 'react-icons/io5';
import { SelectItem } from '@mantine/core/lib/components/Select/types';
import { useContext, useRef, useState } from 'react';
import { useQuery } from 'react-query';
import { useFormik } from 'formik';
import { Dropzone, IMAGE_MIME_TYPE } from '@mantine/dropzone';
import { AxiosResponse } from 'axios';
import Shell from '../../components/Shell/Shell';
import SettingsMenu from '../../components/Settings/Menu';
import { CountryListAllIsoData } from '../../const';
import { globalContext } from '../../store';
import { GenerateAvatarUrl, GetUserProfile, UpdateUserProfile } from '../../apis/users';
import { GetFileUrl, UploadFile } from '../../apis/files';
import { UserProfile } from '../../models/User';
import path from 'path';

async function SaveProfile(profile: UserProfile,
                           avatar: ImageData = null,
                           banner: ImageData = null): Promise<AxiosResponse> {
  const _profile: UserProfile = { ...profile };

  if (avatar) {
    const file = await (await fetch(avatar.url)).blob();
    const ext = path.extname(avatar.name);

    const result = await UploadFile(`${profile.username}_avatar.${ext}`, new Blob([file], { type: `image/${ext}` }));
    _profile.avatarId = result.data.id;
  }

  if (banner) {
    const file = await (await fetch(banner.url)).blob();
    const ext = path.extname(banner.name);

    const result = await UploadFile(`${profile.username}_banner.${ext}`, new Blob([file], { type: `image/${ext}` }));
    _profile.bannerId = result.data.id;
  }

  return UpdateUserProfile(_profile)
    .then(result => {
      if (result.status === 200) {
        return result;
      }
      return Promise.reject(result);
    }).catch(reason => Promise.reject(reason));
}

type ImageData = { name: string, url: string } | null;

export default function ProfileSettings() {
  const [avatar, setAvatar] = useState<ImageData>(null);
  const [banner, setBanner] = useState<ImageData>(null);
  const [avatarChanged, setAvatarChanged] = useState(false);
  const [bannerChanged, setBannerChanged] = useState(false);
  const { globalState } = useContext(globalContext);
  const openRef = useRef<() => void>(null);

  const formik = useFormik({
    initialValues: {
      username: '',
      avatarId: '',
      bannerId: '',
      bio: '',
      website: '',
      locationCode: '',
    },
    onSubmit: (values, { setSubmitting }) => {
      let result: Promise<AxiosResponse>;

      result = SaveProfile(values,
        avatarChanged ? avatar : null,
        bannerChanged ? banner : null);

      result.then(() => {
        setSubmitting(false);
      }).catch(() => setSubmitting(false));
    },
  });

  const { isLoading } = useQuery('userProfile', () => {
    if (globalState.loggedUser === undefined ||
      globalState.loggedUser === null) {
      return Promise.reject();
    }
    return GetUserProfile(globalState.loggedUser?.userId);
  }, {
    onSuccess: result => {
      if (result.data.data.avatarId === '') {
        setAvatar({
          name: '',
          url: GenerateAvatarUrl(result.data.data.id || ''),
        });
      } else {
        setAvatar({
          name: '',
          url: GetFileUrl(result.data.data.avatarId),
        });
      }
      if (result.data.data.bannerId !== '') {
        setBanner({
          name: '',
          url: GetFileUrl(result.data.data.bannerId),
        });
      }
      formik.setValues(result.data.data);
    },
    refetchOnWindowFocus: false,
    enabled: globalState.loggedUser !== null,
  });

  const getSelectData = (): SelectItem[] =>
    CountryListAllIsoData.map<SelectItem>(country => ({
      value: country.code.toLowerCase(),
      label: country.name,
    }));

  return <Shell>
    <Head>
      <title>MakerHub - Profile settings</title>
      <meta name="description" content="MakerHub - Profile settings" />
      <link
        rel="icon"
        href="https://mantine.dev/favicon.svg?v=c7bf473b30e5d81722ea0acf3a11a107"
        type="image/svg+xml"
      />
    </Head>

    <Container size="xl">
      <Title>Settings</Title>
      <Space h="md" />
      <Grid>
        <Col span={3}>
          <SettingsMenu active={0} />
        </Col>
        <Col span={9}>
          <Box sx={() => ({
            position: 'relative',
          })}
          >
            <LoadingOverlay visible={isLoading} />
            <Paper radius="md" withBorder shadow="md" p="sm">
              <Title order={3}>Avatar</Title>
              <Divider mb="sm" />
              <Group align="start">
                <Dropzone
                  onDrop={(files: File[]) => {
                    const url = URL.createObjectURL(files[0]);
                    setAvatar({
                      name: files[0].name,
                      url,
                    });
                    setAvatarChanged(true);
                  }}
                  multiple={false}
                  accept={IMAGE_MIME_TYPE}
                  openRef={openRef}
                  p={0}
                  radius="lg"
                  sx={() => ({
                  border: 'none',
                })}
                >
                  {() =>
                    <Image withPlaceholder src={avatar?.url} height={200} width={200} radius={16} />
                  }
                </Dropzone>
                <div>
                  <Group>
                    <Button onClick={() => openRef.current!()}>Upload a photo</Button>
                  </Group>
                  <Space h="lg" />
                  <Text color="dimmed">You can use drag an drop to change your avatar.</Text>
                  <Text color="dimmed">Preferred resolution is 256x256.</Text>
                </div>
              </Group>
              <Space h="lg" />
              <Title order={3}>Banner</Title>
              <Divider mb="sm" />
              <Group align="start">
                <Dropzone
                  onDrop={(files: File[]) => {
                    const url = URL.createObjectURL(files[0]);
                    setBanner({
                      name: files[0].name,
                      url,
                    });
                    setBannerChanged(true);
                  }}
                  multiple={false}
                  accept={IMAGE_MIME_TYPE}
                  openRef={openRef}
                  p={0}
                  radius="lg"
                  sx={() => ({
                    border: 'none',
                    height: 'auto',
                    width: '60%',
                  })}
                >
                  {() =>
                    <Image
                      withPlaceholder
                      src={banner?.url}
                      styles={() => ({
                        image: {
                          aspectRatio: '34/10',
                        },
                    })} radius={16} />
                  }
                </Dropzone>
                <div>
                  <Group>
                    <Button onClick={() => openRef.current!()}>Upload a photo</Button>
                  </Group>
                  <Space h="lg" />
                  <Text color="dimmed">You can use drag an drop to change your banner.</Text>
                  <Text color="dimmed">Preferred resolution is 1290x300.</Text>
                </div>
              </Group>
              <Space h="lg" />
              <Title order={3}>Personal information</Title>
              <Divider mb="sm" />
              <form onSubmit={formik.handleSubmit}>
                <TextInput
                  label="Username"
                  id="username"
                  description="This username is the displayed name, visible to all users on MakerHub"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.username}
                  error={formik.errors.username}
                  icon={<IoPerson />}
                />
                <Space h="md" />
                <Textarea
                  label="Bio"
                  autosize
                  minRows={4}
                  maxRows={8}
                  id="bio"
                  description="This will be shown in the 'About' section on your profile"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.bio}
                  icon={<IoInformationCircle />}
                />
                <Space h="md" />
                <TextInput
                  label="Website"
                  icon={<IoGlobe />}
                  id="website"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.website}
                />
                <Space h="md" />
                <Select
                  label="Location"
                  id="locationCode"
                  searchable
                  onChange={value => {
                    formik.setFieldValue('locationCode', value);
                  }}
                  onBlur={formik.handleBlur}
                  value={formik.values.locationCode}
                  icon={<IoLocation />}
                  data={getSelectData()}
                />
                <Space h="md" />
                <Group position="right">
                  <Button
                    disabled={!formik.touched || formik.isSubmitting}
                    loading={formik.isSubmitting}
                    type="submit"
                    leftIcon={<IoSave />}
                  >Save
                  </Button>
                </Group>
              </form>
            </Paper>
          </Box>
        </Col>
      </Grid>
    </Container>
         </Shell>;
}
