import axios, { AxiosResponse } from 'axios';
import Project, {
  AddProjectFileRequest,
  CreateProjectRequest,
  GetProjectsResponse,
  ProjectFilter,
} from '../models/Project';
import getCookie from '../utils/cookie';
import { IdResponse } from '../models/Api';
import ApiError from "../models/ApiError";

//const base = 'http://data.makerhub.io:8080/projects';
const base = 'http://127.0.0.1:5002/projects';

async function CreateProject(projectRequest: CreateProjectRequest, files: Map<string, File>,
                             onUploadProgress?: (progressEvent: any) => void):
  Promise<AxiosResponse<IdResponse>> {
  const formData = new FormData();

  formData.append('data', JSON.stringify(projectRequest));
  //formData.append('file', file.slice(0, file.size, file.type));

  files.forEach((value, key) => {
    formData.append(key, value.slice(0, value.size, value.type));
  });

  return axios({
    url: `${base}/`,
    method: 'post',
    data: formData,
    withCredentials: true,
    onUploadProgress,
    headers: {
      'Content-Type': 'application/json',
      Authorization: getCookie('mh_authorization'),
    },
  });
}

async function GetProjects(filter: ProjectFilter = { CreatorId: '' }): Promise<AxiosResponse<GetProjectsResponse>> {
  return axios(`${base}/query`, {
    method: 'POST',
    withCredentials: true,
    data: filter,
    headers: {
      'Content-Type': 'application/json',
      Authorization: getCookie('mh_authorization'),
    },
  });
}

async function GetProject(id: string): Promise<Project> {
  const f = await fetch(`${base}/${id}`, {
    method: 'GET',
    credentials: 'include',
  });
  return f.json();
}

async function RemoveProject(id: string) {
  const f = await fetch(`${base}/${id}`, {
    method: 'DELETE',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      Authorization: getCookie('mh_authorization'),
    },
  });
  return f.text();
}

async function SetLikeProject(projectId: number, userId: number, like: boolean) {
  const f = await fetch(`${base}/like`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: getCookie('mh_authorization'),
    },
    body: JSON.stringify({
      projectId,
      userId,
      like,
    }),
  });
  return f.json();
}

async function AddProjectFile(file: Blob,
                              projectFileRequest: AddProjectFileRequest,
                              onUploadProgress?:
                                (progressEvent: any) => void): Promise<AxiosResponse<IdResponse>> {
  const formData = new FormData();

  formData.append('data', JSON.stringify(projectFileRequest));
  formData.append('file', file.slice(0, file.size, file.type));

  return axios({
    method: 'post',
    url: `${base}/file`,
    headers: {
      Authorization: getCookie('mh_authorization'),
    },
    data: formData,
    onUploadProgress,
  });
}

export {
  CreateProject,
  GetProjects,
  SetLikeProject,
  GetProject,
  AddProjectFile,
  RemoveProject,
};
