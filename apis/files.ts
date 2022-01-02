import axios, { AxiosResponse } from 'axios';
import getCookie from '../utils/cookie';
import { IdResponse } from '../models/Api';

const base = 'http://127.0.0.1:5001/files';

async function UploadFile(name: string, file: Blob,
                          onUploadProgress?:
                            (progressEvent: any) => void): Promise<AxiosResponse<IdResponse>> {
  const formData = new FormData();

  formData.append('name', name);
  formData.append('file', file.slice(0, file.size, file.type));

  return axios({
    url: `${base}/`,
    method: 'post',
    headers: {
      Authorization: getCookie('mh_authorization'),
    },
    data: formData,
    onUploadProgress,
  });
}

export {
  UploadFile,
};
