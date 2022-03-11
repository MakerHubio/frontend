import Model from './Model';
import { User } from './User';

export interface ProjectComment extends Model {
  parentId?: string;
  projectId: string;
  author?: User;
  text: string;
  isLiked?: boolean;
  likes?: number;
  replies?: number;
  attachedFiles: AttachedFile[];
  linkedProjects: LinkedProject[];
}

export interface AttachedFile {
  fileId: string;
  name: string;
}

export interface LinkedProject {
  projectId: string;
  name: string
}

export interface QueryCommentsRequest {
  projectId: string;
  sortBy?: string;
  limit?: number;
  skip?: number;
  parentId?: string;
}

export interface LikeCommentRequest {
  commentId: string;
  like: boolean;
}