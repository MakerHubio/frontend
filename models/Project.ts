import Model from './Model';
import User from './User';

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
    gltfFileId: string;
}

export interface CreateProjectRequestFile {
    fieldName: string,
    thumbnailFieldName?: string,
    meta: AddProjectFileRequest,
}

export interface CreateProjectRequest {
    thumbnails: CreateProjectRequestFile[],
    files: CreateProjectRequestFile[],
    project: Project,
}

export interface AddProjectFileRequest {
    projectId?: string,
    name: string,
    isProjectThumbnail: boolean,
    thumbnailId?: string,
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
