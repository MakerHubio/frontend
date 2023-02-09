import Model from './Model';
import { User } from './User';
import { Hotspot } from '../components/ModelViewer/ModelViewer';

export default interface Project extends Model {
    name: string;
    isLiked?: boolean;
    likeCount?: number;
    thumbnailId?: string;
    creator?: User;
    description?: string;
    is_free?: boolean;
    price?: number;
    tags?: ProjectTag[];
    files?: ProjectFile[];
}

export interface ProjectTag extends Model {
    name: string;
}

export interface ProjectFile extends Model {
    name: string;
    fileId: string;
    thumbnailId: string;
    fileType: string;
    size: number;
    order: number;
    extension: string;
    hotspots: Hotspot[];
    gltf?: Gltf;
}

export interface Gltf {
    fileId: string;
    color: string;
    cameraSettings: {
        theta: number;
        phi: number;
        radius: number;
        fov: number;
    }
}

export interface CreateProjectRequestFile {
    fieldName: string,
    thumbnailFieldName?: string,
    meta: AddProjectFileRequest,
    contentType: string
}

export interface CreateProjectRequest {
    files: CreateProjectRequestFile[],
    project: Project,
}

export interface AddProjectFileRequest {
    projectId?: string,
    name: string,
    isProjectThumbnail: boolean,
    order?: number
}

export interface GetProjectsResponse {
    projects: Project[]
}

export type AddProjectFile = File & {
    thumbnail: string;
};

export interface ProjectFilter {
    CreatorId?: string;
}

export interface UpdateProjectFilesRequest {
    projectId: string,
    thumbnails: { [key: string]: string },
    projectFiles: ProjectFile[],
    filesToUpload: {
        fieldName: string,
        meta: AddProjectFileRequest,
    }[]
}
