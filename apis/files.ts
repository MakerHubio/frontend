import axios, { AxiosResponse } from 'axios';
import getCookie from '../utils/cookie';
import { IdResponse } from '../models/Api';

async function UploadFile(name: string, file: Blob,
                          onUploadProgress?:
                            (progressEvent: any) => void): Promise<AxiosResponse<IdResponse>> {
  const formData = new FormData();

  formData.append('name', name);
  formData.append('content-type', file.type);
  formData.append('file', file.slice(0, file.size, file.type));

  return axios({
    url: `${process.env.NEXT_PUBLIC_FILES_PATH}/`,
    method: 'post',
    headers: {
      Authorization: getCookie('mh_authorization'),
    },
    data: formData,
    onUploadProgress,
  });
}

function GetFileUrl(id: string): string {
  return `${process.env.NEXT_PUBLIC_FILES_PATH}/${id}`;
}

export {
  UploadFile,
  GetFileUrl,
};
