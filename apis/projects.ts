import axios, { AxiosResponse } from 'axios';
import Project, {
  CreateProjectRequest,
  GetProjectsResponse,
  ProjectFilter, UpdateProjectFilesRequest,
} from '../models/Project';
import getCookie from '../utils/cookie';
import { IdResponse } from '../models/Api';
import { LikeCommentRequest, ProjectComment, QueryCommentsRequest } from '../models/ProjectComment';

const getUrl = () => typeof window === 'undefined' ?
  process.env.PROJECTS_PATH : process.env.NEXT_PUBLIC_PROJECTS_PATH;

//region Projects
async function CreateProject(projectRequest: CreateProjectRequest, files: Map<string, File>,
                             onUploadProgress?: (progressEvent: any) => void):
  Promise<AxiosResponse<IdResponse>> {
  const formData = new FormData();

  formData.append('data', JSON.stringify(projectRequest));

  files.forEach((value, key) => {
    formData.append(key, value.slice(0, value.size, value.type));
  });

  return axios({
    url: getUrl(),
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
  return axios(`${getUrl()}/query`, {
    method: 'POST',
    withCredentials: true,
    data: filter,
    headers: {
      'Content-Type': 'application/json',
      Authorization: getCookie('mh_authorization'),
    },
  });
}

async function GetProject(id: string, token?: string): Promise<AxiosResponse<Project>> {
  return axios(`${getUrl()}/${id}`, {
    method: 'GET',
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json',
      Authorization: typeof (document) !== 'undefined' ? getCookie('mh_authorization') : token ?? '',
    },
  });
}

async function RemoveProject(id: string) {
  const f = await fetch(`${getUrl()}/${id}`, {
    method: 'DELETE',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      Authorization: getCookie('mh_authorization'),
    },
  });
  return f.text();
}

async function SetLikeProject(projectId: string, like: boolean) {
  const f = await fetch(`${getUrl()}/like`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: getCookie('mh_authorization'),
    },
    body: JSON.stringify({
      projectId,
      like,
    }),
  });
  return f.json();
}

async function UpdateProjectFiles(updateProjectFilesRequest: UpdateProjectFilesRequest,
                                  files: Map<string, File>,
                                  onUploadProgress?: (progressEvent: any) => void):
  Promise<AxiosResponse<IdResponse>> {
  const formData = new FormData();

  formData.append('data', JSON.stringify(updateProjectFilesRequest));
  //formData.append('file', file.slice(0, file.size, file.type));

  files.forEach((value, key) => {
    formData.append(key, value.slice(0, value.size, value.type));
  });

  return axios({
    url: `${getUrl()}/files`,
    method: 'put',
    data: formData,
    withCredentials: true,
    onUploadProgress,
    headers: {
      'Content-Type': 'application/json',
      Authorization: getCookie('mh_authorization'),
    },
  });
}
//endregion

//region Comments
async function CreateComment(comment: ProjectComment): Promise<AxiosResponse<IdResponse>> {
  return axios({
    url: `${getUrl()}/${comment.projectId}/comments`,
    method: 'POST',
    data: comment,
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json',
      Authorization: getCookie('mh_authorization'),
    },
  });
}

async function QueryComments(request: QueryCommentsRequest):
  Promise<AxiosResponse<ProjectComment[]>> {
  return axios({
    url: `${getUrl()}/${request.projectId}/comments/query`,
    method: 'POST',
    data: request,
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json',
      Authorization: getCookie('mh_authorization'),
    },
  });
}

async function LikeComment(request: LikeCommentRequest): Promise<AxiosResponse> {
  return axios({
    url: `${getUrl()}/comments/like`,
    method: 'POST',
    data: request,
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json',
      Authorization: getCookie('mh_authorization'),
    },
  });
}
//endregion

export {
  CreateProject,
  GetProjects,
  SetLikeProject,
  GetProject,
  UpdateProjectFiles,
  RemoveProject,
  CreateComment,
  QueryComments,
  LikeComment,
};
