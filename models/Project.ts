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
    thumbnailId: string;
    fileType: string;
    size: number;
    order: number;
    gltf_file_id: string;
}
